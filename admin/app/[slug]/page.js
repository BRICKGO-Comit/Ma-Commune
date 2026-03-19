'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCommunes, getAllNews, getAllReports } from '../../lib/api';

export default function DashboardPage() {
  const params = useParams();
  const slug = params.slug;

  const [stats, setStats] = useState({
    communes: 0,
    news: 0,
    reports: 0,
    reportsPending: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [currentCommune, setCurrentCommune] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [slug]);

  const loadDashboard = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const isSuperAdmin = userData.role === 'super_admin';

      const [communesRes, newsRes, reportsRes] = await Promise.all([
        getCommunes(),
        getAllNews(),
        getAllReports(),
      ]);

      let newsList = newsRes.data || [];
      let reportsList = reportsRes.data || [];
      
      // Logique de filtrage par contexte (Slug ou Profil Mairie)
      if (slug !== 'console') {
        const communesList = communesRes.data || [];
        const communeData = communesList.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
        
        if (communeData) {
          setCurrentCommune(communeData);
          newsList = newsList.filter(n => n.commune_id === communeData.id);
          reportsList = reportsList.filter(r => r.commune_id === communeData.id);
        }
      } else if (!isSuperAdmin && userData.commune_id) {
        newsList = newsList.filter(n => n.commune_id === userData.commune_id);
        reportsList = reportsList.filter(r => r.commune_id === userData.commune_id);
      }

      setStats({
        communes: communesRes.count || communesRes.data?.length || 0,
        news: newsList.length,
        reports: reportsList.length,
        reportsPending: reportsList.filter(r => r.status === 'pending').length,
      });

      setRecentReports(reportsList.slice(0, 5));
      setRecentNews(newsList.slice(0, 5));
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    }
  };

  const statusLabels = {
    pending: 'En attente',
    in_progress: 'En cours',
    resolved: 'Résolu',
    rejected: 'Rejeté',
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {slug === 'console' && JSON.parse(localStorage.getItem('admin_user') || '{}').role === 'super_admin' && (
          <div className="stat-card">
            <div className="stat-icon green">🏛️</div>
            <div className="stat-info">
              <h3>{stats.communes}</h3>
              <p>Communes</p>
            </div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-icon gold">📰</div>
          <div className="stat-info">
            <h3>{stats.news}</h3>
            <p>Actualités publiées</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🚨</div>
          <div className="stat-info">
            <h3>{stats.reports}</h3>
            <p>Signalements total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">⏳</div>
          <div className="stat-info">
            <h3>{stats.reportsPending}</h3>
            <p>En attente de traitement</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Reports */}
        <div className="card">
          <div className="card-header">
            <h2>🚨 Derniers signalements</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map(report => (
                <tr key={report.id}>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.title}
                  </td>
                  <td>{report.category}</td>
                  <td>
                    <span className={`badge badge-${report.status}`}>
                      {statusLabels[report.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {recentReports.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: '#999', padding: 30 }}>Aucun signalement</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent News */}
        <div className="card">
          <div className="card-header">
            <h2>📰 Dernières actualités</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentNews.map(article => (
                <tr key={article.id}>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </td>
                  <td>{article.category}</td>
                  <td>
                    <span className={`badge ${article.is_published ? 'badge-published' : 'badge-draft'}`}>
                      {article.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentNews.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: '#999', padding: 30 }}>Aucune actualité</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
