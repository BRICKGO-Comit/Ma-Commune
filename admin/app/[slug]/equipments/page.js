'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunes, getEquipmentsByCommune, createEquipment } from '../../../lib/api';

export default function EquipmentsPage() {
  const params = useParams();
  const slug = params.slug;

  const [equipments, setEquipments] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'sport', description: '', address: '', status: 'open'
  });

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  useEffect(() => {
    if (selectedCommune) {
      loadEquipments(selectedCommune);
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

  const loadEquipments = async (communeId) => {
    try {
      setLoading(true);
      const res = await getEquipmentsByCommune(communeId);
      setEquipments(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCommune || !form.name || !form.type) return;
    try {
      await createEquipment(selectedCommune, form);
      setShowModal(false);
      setForm({ name: '', type: 'sport', description: '', address: '', status: 'open' });
      loadEquipments(selectedCommune);
    } catch (err) {
      console.error('Erreur création équipement:', err);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Équipements Municipaux {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)}>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Nouvel équipement
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Adresse</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map(eq => (
              <tr key={eq.id}>
                <td style={{ fontWeight: 600 }}>{eq.name}</td>
                <td>{eq.type}</td>
                <td>{eq.address}</td>
                <td>
                  <span className={`badge ${eq.status === 'open' ? 'badge-success' : 'badge-danger'}`}>
                    {eq.status === 'open' ? 'En service' : 'Fermé'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Gestion bientôt disponible !')}>Gérer</button>
                </td>
              </tr>
            ))}
            {!loading && equipments.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="icon">🏙️</div>
                    <h3>Aucun équipement</h3>
                    <p>Déclarez vos parcs, stades et centres culturels.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nouvel équipement</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom de l'équipement *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Ex: Stade municipal"
                    required
                  />
                </div>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({...form, type: e.target.value})}
                      required
                    >
                      <option value="sport">Sport</option>
                      <option value="culture">Culture</option>
                      <option value="loisir">Loisir</option>
                      <option value="sante">Santé</option>
                      <option value="admin">Administratif</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({...form, status: e.target.value})}
                    >
                      <option value="open">En service</option>
                      <option value="maintenance">En maintenance</option>
                      <option value="closed">Fermé</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Adresse postale</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    placeholder="Ex: 5 Avenue Jean Jaurès"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Détails supplémentaires..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
