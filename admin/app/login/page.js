'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login } from '../../lib/api';

export default function LoginPage() {
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
      localStorage.setItem('admin_token', result.data.token);
      localStorage.setItem('admin_user', JSON.stringify(result.data.user));
      
      const user = result.data.user;
      if (user.role === 'super_admin') {
        router.push('/admin');
      } else {
        const slug = result.data.commune_slug || 'dashboard';
        router.push(`/${slug}`);
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page premium-emerald-bg">
      <div className="login-card glass-morphism">
        <div className="logo-wrapper-admin">
          <Image 
            src="/icon.png" 
            alt="MA COMMUNE" 
            width={80} 
            height={80} 
            className="admin-main-logo"
            priority
          />
        </div>
        <h1>MA COMMUNE</h1>
        <p className="subtitle">Espace Administration Municipale</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID ADMINISTRATEUR</label>
            <input
              type="email"
              placeholder="admin@macommune.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label>MOT DE PASSE</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-input"
            />
          </div>

          {error && <p className="error-msg-admin">{error}</p>}

          <button type="submit" className="btn-admin-premium" disabled={loading}>
            {loading ? 'VÉRIFICATION...' : 'ACCÉDER AU DASHBOARD'}
          </button>
        </form>

        <div className="login-footer-info">
          <p>© 2026 Plateforme Nationale Ma Commune</p>
          <div className="dot-indicator"></div>
        </div>
      </div>
    </div>
  );
}
