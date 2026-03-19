'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        router.push('/admin'); // Special route for super-admin
      } else {
        const slug = result.data.commune_slug || 'dashboard'; // We need commune_slug in response
        router.push(`/${slug}`);
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-icon">🏛️</div>
        <h1>MA COMMUNE</h1>
        <p className="subtitle">Espace Administration</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@macommune.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#999' }}>
          Identifiants test : admin@macommune.ci / admin123
        </p>
      </div>
    </div>
  );
}
