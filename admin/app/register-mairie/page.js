'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerMairie } from '../../lib/api';

export default function RegisterMairiePage() {
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
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: '#2D6A4F', marginBottom: '1rem' }}>Mairie Enregistrée !</h2>
          <p style={{ color: '#666' }}>
            Félicitations ! Votre espace municipal est en cours de création.
            Vous allez être redirigé vers la page de connexion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-circle">🏛️</div>
          <h1>Inscrire ma Mairie</h1>
          <p>Rejoignez l'écosystème numérique ivoirien</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Nom de la Commune</label>
              <div className="input-with-icon">
                <span className="icon">🏙️</span>
                <input
                  type="text"
                  placeholder="ex: Cocody"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: 120 }}>
              <label>Code</label>
              <input
                type="text"
                placeholder="CO"
                maxLength="2"
                style={{ textAlign: 'center' }}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nom du Maire</label>
            <div className="input-with-icon">
              <span className="icon">👨‍💼</span>
              <input
                type="text"
                placeholder="ex: Jean-Marc Yacé"
                value={formData.mayor_name}
                onChange={(e) => setFormData({ ...formData, mayor_name: e.target.value })}
              />
            </div>
          </div>

          <div className="divider">
            <span>Compte Administrateur Municipal</span>
          </div>

          <div className="form-group">
            <label>Nom Complet de l'Admin</label>
            <div className="input-with-icon">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="ex: Kouassi Koffi"
                value={formData.admin_name}
                onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Professionnel</label>
            <div className="input-with-icon">
              <span className="icon">✉️</span>
              <input
                type="email"
                placeholder="admin@votre-mairie.ci"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe sécurisé</label>
            <div className="input-with-icon">
              <span className="icon">🔑</span>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Initialisation de l\'espace...' : 'Créer l\'espace Mairie'}
          </button>
        </form>

        <p className="auth-footer" onClick={() => router.push('/login')}>
          Déjà inscrit ? <span>Se connecter</span>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top left, #2d6a4f, #1b4332);
          padding: 40px 20px;
        }
        .auth-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          padding: 50px;
          border-radius: 24px;
          width: 100%;
          max-width: 580px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-header { text-align: center; margin-bottom: 40px; }
        .logo-circle {
          width: 70px; height: 70px;
          background: #52B788;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; font-size: 32px;
          box-shadow: 0 10px 15px rgba(82, 183, 136, 0.3);
        }
        .auth-header h1 { color: #1b4332; font-size: 2rem; margin-bottom: 8px; font-weight: 800; }
        .auth-header p { color: #6c757d; font-size: 1rem; }
        
        .form-row { display: flex; gap: 20px; }
        .form-group { margin-bottom: 24px; flex: 1; }
        .form-group label { display: block; font-weight: 600; color: #495057; margin-bottom: 8px; font-size: 0.9rem; }
        
        .input-with-icon { position: relative; }
        .input-with-icon .icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          font-size: 1.2rem; opacity: 0.5;
        }
        .input-with-icon input {
          width: 100%; padding: 14px 14px 14px 48px;
          border: 2px solid #e9ecef; border-radius: 12px;
          font-size: 1rem; transition: all 0.2s; background: white;
        }
        .input-with-icon input:focus { border-color: #52B788; outline: none; box-shadow: 0 0 0 4px rgba(82, 183, 136, 0.1); }
        
        .divider {
          margin: 30px 0; border-top: 1px solid #dee2e6;
          text-align: center; position: relative;
        }
        .divider span {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: #f8fafc; padding: 0 15px;
          font-size: 0.8rem; font-weight: 700; color: #52B788; text-transform: uppercase;
          border-radius: 20px;
        }

        .login-button {
          width: 100%; padding: 16px; 
          background: #1b4332; color: white;
          border: none; border-radius: 12px;
          font-weight: 700; font-size: 1.1rem;
          cursor: pointer; transition: all 0.3s;
          margin-top: 10px;
        }
        .login-button:hover:not(:disabled) { background: #2d6a4f; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.2); }
        .login-button:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-message {
          background: #fff5f5; color: #e53e3e;
          padding: 12px; border-radius: 10px;
          margin-bottom: 20px; font-size: 0.9rem;
          border-left: 4px solid #e53e3e;
        }

        .auth-footer {
          text-align: center; margin-top: 30px;
          color: #6c757d; font-size: 0.95rem; cursor: pointer;
        }
        .auth-footer span { color: #52B788; font-weight: 700; }
        .auth-footer span:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
