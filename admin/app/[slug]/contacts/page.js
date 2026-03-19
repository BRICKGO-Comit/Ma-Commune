'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ContactsPage() {
  const params = useParams();
  const slug = params.slug;

  const [contacts, setContacts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'general',
    address: '',
    is_emergency: false,
  });

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  useEffect(() => {
    if (selectedCommune) {
      loadContacts(selectedCommune);
    }
  }, [selectedCommune]);

  const loadCommunes = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const isSuperAdmin = userData.role === 'super_admin';

      const res = await getCommunes();
      const list = res.data || [];
      setCommunes(list);

      // Logique de filtrage par contexte (Slug ou Profil Mairie)
      if (slug !== 'console') {
        const communeData = list.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
        if (communeData) {
          setCurrentCommune(communeData);
          setSelectedCommune(communeData.id);
        }
      } else if (!isSuperAdmin && userData.commune_id) {
        setSelectedCommune(userData.commune_id);
      } else if (list.length > 0) {
        setSelectedCommune(list[0].id);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const loadContacts = async (communeId) => {
    try {
      setLoading(true);
      const res = await getContactsByCommune(communeId);
      setContacts(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels = {
    urgence: '🚨 Urgence',
    sante: '🏥 Santé',
    education: '🎓 Éducation',
    administration: '🏛️ Administration',
    transport: '🚌 Transport',
    general: '📋 Général',
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    try {
      await createContact(selectedCommune, form);
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', category: 'general', address: '', is_emergency: false });
      loadContacts(selectedCommune);
    } catch (err) {
      console.error('Erreur création:', err);
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Supprimer ce contact ?')) return;

    try {
      await deleteContact(contactId);
      loadContacts(selectedCommune);
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">📞</div>
          <div className="stat-info">
            <h3>{contacts.length}</h3>
            <p>Contacts utiles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">🚨</div>
          <div className="stat-info">
            <h3>{contacts.filter(c => c.is_emergency).length}</h3>
            <p>Numéros d'urgence</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Contacts utiles {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)}>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Ajouter un contact
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Catégorie</th>
              <th>Urgence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td style={{ fontWeight: 600 }}>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{categoryLabels[contact.category] || contact.category}</td>
                <td>
                  {contact.is_emergency ? (
                    <span className="badge badge-pending">🚨 Urgence</span>
                  ) : (
                    <span style={{ color: '#999' }}>—</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {!loading && contacts.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="icon">📞</div>
                    <h3>Aucun contact</h3>
                    <p>Ajoutez des numéros utiles pour cette commune</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Création */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter un contact</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Nom du service ou organisme"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="+225 XX XX XX XX"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="email@exemple.ci"
                  />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                  >
                    <option value="urgence">Urgence</option>
                    <option value="sante">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="administration">Administration</option>
                    <option value="transport">Transport</option>
                    <option value="general">Général</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    placeholder="Adresse du service"
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={form.is_emergency}
                      onChange={(e) => setForm({...form, is_emergency: e.target.checked})}
                    />
                    Numéro d'urgence
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
