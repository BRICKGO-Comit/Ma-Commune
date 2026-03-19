'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';

export default function AdminLoginPage() {
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

      if (user.role !== 'super_admin') {
        throw new Error('Espace réservé aux administrateurs globaux.');
      }

      localStorage.setItem('admin_token', result.data.token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      router.push('/console');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">🏛️</div>
          <h1>SUPER ADMIN</h1>
          <p>Console de supervision globale du système Ma Commune.</p>
          <div className="status-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
      
      <div className="admin-login-main">
        <div className="admin-form-card">
          <h2>Authentification Sécurisée</h2>
          <p className="admin-instruction">Entrez vos identifiants de superviseur.</p>

          <form onSubmit={handleSubmit}>
            <div className="admin-input-group">
              <label>ID ADMINISTRATEUR</label>
              <input
                type="email"
                placeholder="admin@macommune.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>CLÉ D'ACCÈS</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="admin-error">{error}</div>}

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? 'VÉRIFICATION...' : 'ACCÉDER À LA CONSOLE'}
            </button>
          </form>

          <p className="admin-note">
            Toutes les sessions sont journalisées et surveillées.
          </p>
        </div>
      </div>

    </div>
  );
}
