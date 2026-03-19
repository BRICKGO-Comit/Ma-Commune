'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerMairie } from '../../../lib/api';

export default function MairieRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    mayor_name: '',
    code: '',
    email: '',
    password: '',
    admin_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await registerMairie(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/mairie/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mairie-register-container">
        <div className="mairie-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: '#009E49', marginBottom: '1rem', fontSize: '2rem' }}>Félicitations !</h2>
          <p style={{ color: '#636E72', fontSize: '1.1rem' }}>
            Votre espace municipal est en cours de création. 
            Préparez-vous à transformer votre commune.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mairie-register-container">
      <div className="register-header">
        <h1>Inscrire ma Mairie</h1>
        <p>Plus de 20 communes nous font déjà confiance</p>
      </div>

      <div className="register-body">
        <div className="mairie-card large">
          <form onSubmit={handleSubmit}>
            {error && <div className="m-error">{error}</div>}
            
            <div className="form-grid">
              <div className="m-input-group span-2">
                <label>Nom de la Commune</label>
                <input
                  type="text"
                  placeholder="ex: Plateau, Cocody, Bouaké..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="m-input-group">
                <label>Code (2 lettres)</label>
                <input
                  type="text"
                  placeholder="CO"
                  maxLength="2"
                  style={{ textAlign: 'center', textTransform: 'uppercase' }}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="m-input-group span-3">
                <label>Nom du Maire</label>
                <input
                  type="text"
                  placeholder="ex: Jean-Marc Yacé"
                  value={formData.mayor_name}
                  onChange={(e) => setFormData({ ...formData, mayor_name: e.target.value })}
                />
              </div>

              <div className="section-title span-3">COMPTE ADMINISTRATEUR MUNICIPAL</div>

              <div className="m-input-group span-3">
                <label>Nom complet du responsable</label>
                <input
                  type="text"
                  placeholder="ex: M. Kouassi Koffi"
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                  required
                />
              </div>

              <div className="m-input-group span-2">
                <label>Email Professionnel</label>
                <input
                  type="email"
                  placeholder="admin@mairie-cocody.ci"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="m-input-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="m-submit-btn" disabled={loading}>
              {loading ? 'Création de l\'espace...' : 'Initialiser mon espace Mairie'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 25, color: '#636E72' }}>
            Déjà inscrit ? <span style={{ color: '#009E49', fontWeight: 800, cursor: 'pointer' }} onClick={() => router.push('/mairie/login')}>Se connecter</span>
          </p>
        </div>
      </div>

    </div>
  );
}
