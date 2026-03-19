'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function NewsPage() {
  const params = useParams();
  const slug = params.slug;

  const [news, setNews] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [filterCommune, setFilterCommune] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'general',
    commune_id: '',
  });

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const isSuperAdmin = userData.role === 'super_admin';

      const [newsRes, communesRes] = await Promise.all([
        getAllNews(),
        getCommunes(),
      ]);
      
      const newsList = newsRes.data || [];
      const communesList = communesRes.data || [];
      setCommunes(communesList);

      let filteredNewsList = newsList;
      let communeData = null;

      // Logique de filtrage par contexte (Slug ou Profil Mairie)
      if (slug !== 'console') {
        communeData = communesList.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());
        if (communeData) {
          setCurrentCommune(communeData);
          filteredNewsList = newsList.filter(n => n.commune_id === communeData.id);
          setFilterCommune(communeData.id);
          setForm(f => ({ ...f, commune_id: communeData.id }));
        }
      } else if (!isSuperAdmin && userData.commune_id) {
        filteredNewsList = newsList.filter(n => n.commune_id === userData.commune_id);
        setFilterCommune(userData.commune_id);
        setForm(f => ({ ...f, commune_id: userData.commune_id }));
      }

      setNews(filteredNewsList);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = slug === 'console' && filterCommune
    ? news.filter(n => n.commune_id === filterCommune)
    : news;

  const getCommuneName = (id) => {
    return communes.find(c => c.id === id)?.name || 'Inconnue';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.commune_id || !form.title || !form.content) return;

    try {
      await createNews(form.commune_id, {
        title: form.title,
        content: form.content,
        summary: form.summary,
        category: form.category,
      });
      setShowModal(false);
      setForm({ title: '', content: '', summary: '', category: 'general', commune_id: '' });
      loadData();
    } catch (err) {
      console.error('Erreur création:', err);
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon gold">📰</div>
          <div className="stat-info">
            <h3>{news.length}</h3>
            <p>Actualités publiées</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Actualités {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
          <div className="actions">
            {slug === 'console' && (
              <select value={filterCommune} onChange={(e) => setFilterCommune(e.target.value)}>
                <option value="">Toutes les communes</option>
                {communes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              + Nouvelle actualité
            </button>
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
            </tr>
          </thead>
          <tbody>
            {filteredNews.map(article => (
              <tr key={article.id}>
                <td style={{ fontWeight: 600, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.title}
                </td>
                {slug === 'console' && <td>{getCommuneName(article.commune_id)}</td>}
                <td>{article.category}</td>
                <td>
                  <span className={`badge ${article.is_published ? 'badge-published' : 'badge-draft'}`}>
                    {article.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td>{new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {!loading && filteredNews.length === 0 && (
              <tr>
                <td colSpan={slug === 'console' ? 5 : 4}>
                  <div className="empty-state">
                    <div className="icon">📰</div>
                    <h3>Aucune actualité</h3>
                    <p>Créez votre première actualité</p>
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
              <h3>Nouvelle actualité</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {slug === 'console' && (
                  <div className="form-group">
                    <label>Commune *</label>
                    <select
                      value={form.commune_id}
                      onChange={(e) => setForm({...form, commune_id: e.target.value})}
                      required
                    >
                      <option value="">Sélectionner une commune</option>
                      {communes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Titre de l'actualité"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Résumé</label>
                  <input
                    type="text"
                    value={form.summary}
                    onChange={(e) => setForm({...form, summary: e.target.value})}
                    placeholder="Résumé court"
                  />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                  >
                    <option value="general">Général</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="sante">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="culture">Culture</option>
                    <option value="commerce">Commerce</option>
                    <option value="securite">Sécurité</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contenu *</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({...form, content: e.target.value})}
                    placeholder="Contenu de l'actualité..."
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
