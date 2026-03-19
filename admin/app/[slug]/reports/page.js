'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ReportsPage() {
  const params = useParams();
  const slug = params.slug;

  const [reports, setReports] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [filterCommune, setFilterCommune] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [currentCommune, setCurrentCommune] = useState(null);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const isSuperAdmin = userData.role === 'super_admin';

      const [reportsRes, communesRes] = await Promise.all([
        getAllReports(),
        getCommunes(),
      ]);
      
      const communesList = communesRes.data || [];
      const reportsList = reportsRes.data || [];
      setCommunes(communesList);

      let filteredReportsList = reportsList;
      let communeData = null;

      // Logique de filtrage par contexte (Slug ou Profil Mairie)
      if (slug !== 'console') {
        communeData = communesList.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
        if (communeData) {
          setCurrentCommune(communeData);
          filteredReportsList = reportsList.filter(r => r.commune_id === communeData.id);
          setFilterCommune(communeData.id);
        }
      } else if (!isSuperAdmin && userData.commune_id) {
        filteredReportsList = reportsList.filter(r => r.commune_id === userData.commune_id);
        setFilterCommune(userData.commune_id);
      }

      setReports(filteredReportsList);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => {
    if (slug === 'console' && filterCommune && r.commune_id !== filterCommune) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  const getCommuneName = (id) => {
    return communes.find(c => c.id === id)?.name || 'Inconnue';
  };

  const statusLabels = {
    pending: 'En attente',
    in_progress: 'En cours',
    resolved: 'Résolu',
    rejected: 'Rejeté',
  };

  const categoryLabels = {
    voirie: '🛣️ Voirie',
    eclairage: '💡 Éclairage',
    proprete: '🧹 Propreté',
    eau: '💧 Eau',
    securite: '🔒 Sécurité',
    autre: '📋 Autre',
  };

  const handleUpdateStatus = async () => {
    if (!selectedReport || !newStatus) return;

    try {
      await updateReportStatus(selectedReport.id, {
        status: newStatus,
        admin_response: responseText || undefined,
      });
      setSelectedReport(null);
      setResponseText('');
      setNewStatus('');
      loadData();
    } catch (err) {
      console.error('Erreur mise à jour:', err);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red">⏳</div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>En attente</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🔄</div>
          <div className="stat-info">
            <h3>{inProgressCount}</h3>
            <p>En cours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{resolvedCount}</h3>
            <p>Résolus</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Signalements {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={filterCommune} onChange={(e) => setFilterCommune(e.target.value)}>
                <option value="">Toutes les communes</option>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              {slug === 'console' && <th>Commune</th>}
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {report.title}
                </td>
                {slug === 'console' && <td>{getCommuneName(report.commune_id)}</td>}
                <td>{categoryLabels[report.category] || report.category}</td>
                <td>
                  <span className={`badge badge-${report.status}`}>
                    {statusLabels[report.status]}
                  </span>
                </td>
                <td>{new Date(report.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSelectedReport(report);
                      setNewStatus(report.status);
                      setResponseText(report.admin_response || '');
                    }}
                  >
                    Traiter
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filteredReports.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="icon">🚨</div>
                    <h3>Aucun signalement</h3>
                    <p>Aucun signalement ne correspond aux filtres</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Traitement */}
      {selectedReport && (
        <div className="modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Traiter le signalement</h3>
              <button onClick={() => setSelectedReport(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{selectedReport.title}</h4>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{selectedReport.description}</p>
                {selectedReport.address && (
                  <p style={{ color: '#999', fontSize: 13, marginTop: 8 }}>📍 {selectedReport.address}</p>
                )}
              </div>

              <div className="form-group">
                <label>Nouveau statut</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours de traitement</option>
                  <option value="resolved">Résolu</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>

              <div className="form-group">
                <label>Réponse de l'administration</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Votre réponse au citoyen..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleUpdateStatus}>
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
