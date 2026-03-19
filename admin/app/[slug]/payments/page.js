'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PaymentsPage() {
  const params = useParams();
  const slug = params.slug;

  const [payments, setPayments] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentCommune, setCurrentCommune] = useState(null);

  useEffect(() => {
    loadCommunes();
  }, [slug]);

  useEffect(() => {
    if (selectedCommune) {
      loadPayments(selectedCommune);
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

  const loadPayments = async (communeId) => {
    try {
      setLoading(true);
      const res = await getPaymentsByCommune(communeId);
      setPayments(res.data || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <h3>Total Encaissé</h3>
          <p className="stat-number">{totalCollected.toLocaleString()} FCFA</p>
        </div>
        <div className="stat-card">
          <h3>Transactions</h3>
          <p className="stat-number">{payments.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Suivi des Taxes & Paiements {currentCommune ? `— ${currentCommune.name}` : ''}</h2>
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
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Client</th>
              <th>Type de Taxe</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td><code>{p.user_id.split('-')[0]}...</code></td>
                <td style={{ fontWeight: 600 }}>{p.description}</td>
                <td style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{p.amount.toLocaleString()} F</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {p.status === 'paid' ? 'Encaissé' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && payments.length === 0 && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="icon">💳</div>
                    <h3>Aucune transaction</h3>
                    <p>Les versements des citoyens apparaîtront ici.</p>
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
