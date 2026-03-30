'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
      router.push('/admin/dashboard'); // Redirect to super admin dashboard
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper premium-emerald-bg">
      <div className="admin-login-container glass-morphism">
        <div className="admin-login-sidebar-premium">
          <div className="sidebar-content-premium">
            <div className="sidebar-logo-premium">
              <Image 
                src="/icon.png" 
                alt="Logo" 
                width={80} 
                height={80} 
                priority
              />
            </div>
            <h1>SUPER ADMIN</h1>
            <p>Console de supervision d'excellence de la Plateforme Nationale Ma Commune.</p>
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              <Text>SYSTÈME OPÉRATIONNEL</Text>
            </div>
          </div>
        </div>
        
        <div className="admin-login-main-premium">
          <div className="admin-form-card-premium">
            <h2>Authentification Privilégiée</h2>
            <p className="admin-instruction">Veuillez décliner votre identité de superviseur.</p>

            <form onSubmit={handleSubmit}>
              <div className="admin-input-group-premium">
                <label>IDENTIFIANT MAÎTRE</label>
                <input
                  type="email"
                  placeholder="superadmin@macommune.ci"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="admin-input"
                />
              </div>

              <div className="admin-input-group-premium">
                <label>CLÉ DE HAUTE SÉCURITÉ</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input"
                />
              </div>

              {error && <div className="admin-error-premium">{error}</div>}

              <button type="submit" className="btn-admin-premium" disabled={loading}>
                {loading ? 'DÉCHIFFREMENT...' : 'ACCÉDER À LA CONSOLE'}
              </button>
            </form>

            <div className="admin-footer-premium">
              <p>SÉCURITÉ NIVEAU 4 ACTIVÉE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text({ children }) {
  return <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', color: 'var(--accent)' }}>{children}</span>;
}
