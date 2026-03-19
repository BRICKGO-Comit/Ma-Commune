'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCommunes, registerMairie } from '../../../lib/api';

export default function CommunesPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const [communes, setCommunes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', mayor_name: '', code: '', email: '', password: '', admin_name: ''
  });

  useEffect(() => {
    if (slug !== 'console') {
      router.push(`/${slug}`);
      return;
    }
    loadCommunes();
  }, [slug]);

  const loadCommunes = async (searchTerm = '') => {
    try {
      setLoading(true);
      const result = await getCommunes(searchTerm);
      setCommunes(result.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadCommunes(value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    
    try {
      setSaving(true);
      await registerMairie(form);
      setShowModal(false);
      setForm({ name: '', mayor_name: '', code: '', email: '', password: '', admin_name: '' });
      loadCommunes();
    } catch (err) {
      alert(err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">🏛️</div>
          <div className="stat-info">
            <h3>{communes.length}</h3>
            <p>Communes enregistrées</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des communes</h2>
          <div className="actions">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher une commune..."
              value={search}
              onChange={handleSearch}
            />
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Nouvelle commune
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Code</th>
              <th>Maire</th>
              <th>Admin Contact</th>
              <th>Date d'ajout</th>
            </tr>
          </thead>
          <tbody>
            {communes.map(commune => (
              <tr key={commune.id}>
                <td style={{ fontWeight: 600 }}>{commune.name}</td>
                <td><span className="badge badge-info">{commune.code}</span></td>
                <td>{commune.mayor_name || '—'}</td>
                <td>{commune.email || '—'}</td>
                <td>{new Date(commune.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {!loading && communes.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="icon">🏛️</div>
                    <h3>Aucune commune trouvée</h3>
                    <p>Enregistrez votre première commune partenaire.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enregistrer une nouvelle commune</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Nom de la commune *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Ex: Yamoussoukro"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Code (2-3 lettres) *</label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({...form, code: e.target.value})}
                      placeholder="Ex: YAKO"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Nom du Maire</label>
                  <input
                    type="text"
                    value={form.mayor_name}
                    onChange={(e) => setForm({...form, mayor_name: e.target.value})}
                    placeholder="Nom complet du Maire"
                  />
                </div>

                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid var(--border)' }} />
                <h4 style={{ marginBottom: '15px', color: 'var(--primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Compte Administrateur (Mairie)
                </h4>

                <div className="form-group">
                  <label>Nom de l'administrateur</label>
                  <input
                    type="text"
                    value={form.admin_name}
                    onChange={(e) => setForm({...form, admin_name: e.target.value})}
                    placeholder="Nom de la personne responsable"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Email de connexion *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="mairie@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mot de passe *</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      placeholder="Minimum 8 caractères"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Création en cours...' : 'Créer la commune'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
