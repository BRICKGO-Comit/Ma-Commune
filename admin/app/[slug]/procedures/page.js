'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunes, getProceduresByCommune, createProcedure } from '../../../lib/api';

export default function ProceduresPage() {
  const params = useParams();
  const slug = params.slug;

  const [procedures, setProcedures] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'general', price: 'Gratuit', duration: ''
  });

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  const loadCommunes = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const isSuperAdmin = userData.role === 'super_admin';
      
      const res = await getCommunes();
      const list = res.data || [];
      setCommunes(list);

      // Isolation logic:
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

  useEffect(() => {
    if (selectedCommune) {
      loadProcedures(selectedCommune);
    }
  }, [selectedCommune]);

  const loadProcedures = async (communeId) => {
    try {
      setLoading(true);
      const res = await getProceduresByCommune(communeId);
      setProcedures(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCommune || !form.title) return;
    try {
      await createProcedure(selectedCommune, form);
      setShowModal(false);
      setForm({ title: '', description: '', category: 'general', price: 'Gratuit', duration: '' });
      loadProcedures(selectedCommune);
    } catch (err) {
      console.error('Erreur création démarche:', err);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Démarches Administratives {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)}>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Nouvelle démarche
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Délai</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {procedures.map(proc => (
              <tr key={proc.id}>
                <td style={{ fontWeight: 600 }}>{proc.title}</td>
                <td>{proc.description}</td>
                <td><span className="badge badge-success">{proc.price}</span></td>
                <td>{proc.duration}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Modification bientôt disponible !')}>Modifier</button>
                </td>
              </tr>
            ))}
            {!loading && procedures.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="icon">📄</div>
                    <h3>Aucune démarche</h3>
                    <p>Les fiches pratiques pour cette commune apparaîtront ici</p>
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
              <h3>Nouvelle démarche</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Ex: Acte de naissance"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Description de la démarche"
                  />
                </div>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Prix</label>
                    <input
                      type="text"
                      value={form.price}
                      onChange={(e) => setForm({...form, price: e.target.value})}
                      placeholder="Ex: Gratuit ou 5000 FCFA"
                    />
                  </div>
                  <div className="form-group">
                    <label>Délai estimé</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({...form, duration: e.target.value})}
                      placeholder="Ex: 48h ou Immédiat"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
