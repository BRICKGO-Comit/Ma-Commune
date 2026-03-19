'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunes, getBusinessesByCommune, updateBusinessStatus } from '../../../lib/api';

export default function BusinessesPage() {
  const params = useParams();
  const slug = params.slug;

  const [businesses, setBusinesses] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  useEffect(() => {
    if (selectedCommune) {
      loadBusinesses(selectedCommune);
    }
  }, [selectedCommune]);

  const loadCommunes = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const superAdminCheck = userData.role === 'super_admin';
      setIsSuperAdmin(superAdminCheck);

      const res = await getCommunes();
      const list = res.data || [];
      setCommunes(list);

      if (slug !== 'console') {
        const communeData = list.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
        if (communeData) {
          setCurrentCommune(communeData);
          setSelectedCommune(communeData.id);
        }
      } else if (!superAdminCheck && userData.commune_id) {
        setSelectedCommune(userData.commune_id);
      } else if (list.length > 0) {
        setSelectedCommune(list[0].id);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const loadBusinesses = async (communeId) => {
    try {
      setLoading(true);
      const res = await getBusinessesByCommune(communeId);
      const all = res.data || [];
      setBusinesses(all.filter(b => b.status === 'active'));
      setPendingBusinesses(all.filter(b => b.status === 'pending'));
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (businessId) => {
    try {
      await updateBusinessStatus(businessId, 'active');
      loadBusinesses(selectedCommune);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleReject = async (businessId) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette entreprise ?')) return;
    try {
      await updateBusinessStatus(businessId, 'rejected');
      loadBusinesses(selectedCommune);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const statusBadge = (status) => {
    const map = {
      active: { label: '✅ Validée', cls: 'badge-success' },
      pending: { label: '⏳ En attente', cls: 'badge-warning' },
      rejected: { label: '❌ Refusée', cls: 'badge-danger' },
    };
    const s = map[status] || { label: status, cls: 'badge-secondary' };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  const currentList = activeTab === 'active' ? businesses : pendingBusinesses;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Annuaire des Entreprises {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)}>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border)', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer',
              fontWeight: activeTab === 'active' ? 700 : 400,
              borderBottom: activeTab === 'active' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: 'transparent',
            }}
          >
            🏢 Validées ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer',
              fontWeight: activeTab === 'pending' ? 700 : 400,
              borderBottom: activeTab === 'pending' ? '3px solid var(--warning)' : '3px solid transparent',
              color: activeTab === 'pending' ? 'var(--warning)' : 'var(--text-secondary)',
              backgroundColor: 'transparent',
              position: 'relative',
            }}
          >
            ⏳ En attente ({pendingBusinesses.length})
            {pendingBusinesses.length > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4, width: 8, height: 8,
                borderRadius: '50%', backgroundColor: 'var(--danger)',
              }} />
            )}
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>
                  {b.name}
                  {b.is_on_duty && <span style={{ marginLeft: 8, color: '#E53935', fontWeight: 700, fontSize: 11 }}>💊 DE GARDE</span>}
                </td>
                <td><span className="badge badge-primary">{b.category}</span></td>
                <td>{b.address}</td>
                <td>{b.phone}</td>
                <td>{statusBadge(b.status)}</td>
                <td>
                  {b.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleValidate(b.id)}>
                        ✅ Valider
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(b.id)}>
                        ❌ Refuser
                      </button>
                    </div>
                  )}
                  {b.status === 'active' && (
                    <span style={{ color: 'var(--text-light)', fontSize: 13 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && currentList.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="icon">{activeTab === 'pending' ? '📋' : '🏬'}</div>
                    <h3>{activeTab === 'pending' ? 'Aucune demande en attente' : 'Aucune entreprise'}</h3>
                    <p>{activeTab === 'pending' ? 'Les nouvelles inscriptions apparaîtront ici.' : 'Référencez les commerces locaux pour dynamiser l\'économie.'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
