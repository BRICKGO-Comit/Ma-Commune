'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../../lib/api';

export default function MairieLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      const user = result.data.user;

      if (user.role !== 'admin' && user.role !== 'super_admin') {
        throw new Error('Identifiants incorrects ou accès non autorisé.');
      }

      localStorage.setItem('admin_token', result.data.token);
      localStorage.setItem('admin_user', JSON.stringify(user));

      const slug = result.data.commune_slug || 'admin'; 
      router.push(`/${slug}`);
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mairie-login-container">
      <div className="mairie-login-top">
        <div className="decoration-bar"></div>
        <div className="mairie-header">
          <div className="mairie-logo">🏛️</div>
          <h1>Espace Municipal</h1>
          <p>Plateforme officielle des mairies de Côte d'Ivoire</p>
        </div>
      </div>

      <div className="mairie-login-body">
        <div className="mairie-card">
          <form onSubmit={handleSubmit}>
            <div className="m-input-group">
              <label>Compte Mairie (Email)</label>
              <input
                type="email"
                placeholder="mairie@cocody.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="m-input-group">
              <label>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="m-error">{error}</div>}

            <button type="submit" className="m-submit-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Accéder à mon espace'}
            </button>
          </form>

          <div className="m-footer">
            <p>Nouvelle municipalité ?</p>
            <button onClick={() => router.push('/mairie/register')} className="m-register-link">
              Inscrire ma mairie maintenant
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
