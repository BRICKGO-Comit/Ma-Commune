'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunes, getEventsByCommune, createEvent } from '../../../lib/api';

export default function EventsPage() {
  const params = useParams();
  const slug = params.slug;

  const [events, setEvents] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '', location: '', organizer: '', category: 'culture'
  });

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  useEffect(() => {
    if (selectedCommune) {
      loadEvents(selectedCommune);
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

  const loadEvents = async (communeId) => {
    try {
      setLoading(true);
      const res = await getEventsByCommune(communeId);
      setEvents(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCommune || !form.title || !form.date) return;
    try {
      await createEvent(selectedCommune, form);
      setShowModal(false);
      setForm({ title: '', description: '', date: '', location: '', organizer: '', category: 'culture' });
      loadEvents(selectedCommune);
    } catch (err) {
      console.error('Erreur création événement:', err);
    }
  };

  const categoryDots = {
    culture: '#8338EC',
    sport: '#FB5607',
    environnement: '#38B000',
    reunion: '#3A86FF',
    fete: '#FF006E',
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Agenda Municipal {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)}>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Ajouter un événement
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Événement</th>
              <th>Lieu</th>
              <th>Catégorie</th>
              <th>Organisateur</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{new Date(event.date).toLocaleDateString('fr-FR')}</td>
                <td style={{ fontWeight: 600 }}>{event.title}</td>
                <td>{event.location}</td>
                <td>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      backgroundColor: categoryDots[event.category] || '#999' 
                    }} />
                    {event.category}
                  </span>
                </td>
                <td>{event.organizer}</td>
              </tr>
            ))}
            {!loading && events.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="icon">🗓️</div>
                    <h3>Agenda vide</h3>
                    <p>Aucun événement n'est programmé pour cette commune</p>
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
              <h3>Nouvel événement</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre de l'événement *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Ex: Fête de la musique"
                    required
                  />
                </div>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Date et heure *</label>
                    <input
                      type="datetime-local"
                      value={form.date}
                      onChange={(e) => setForm({...form, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                    >
                      <option value="culture">Culture</option>
                      <option value="sport">Sport</option>
                      <option value="environnement">Environnement</option>
                      <option value="reunion">Réunion publique</option>
                      <option value="fete">Fête</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                    placeholder="Ex: Place de la mairie"
                  />
                </div>
                <div className="form-group">
                  <label>Organisateur</label>
                  <input
                    type="text"
                    value={form.organizer}
                    onChange={(e) => setForm({...form, organizer: e.target.value})}
                    placeholder="Ex: Comité des fêtes"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Détails de l'événement..."
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
