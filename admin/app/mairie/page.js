'use client';
import { useRouter } from 'next/navigation';

export default function MairieLandingPage() {
  const router = useRouter();

  return (
    <div className="mairie-landing">
      {/* Barre Drapeau */}
      <div className="flag-bar">
        <div className="orange"></div>
        <div className="white"></div>
        <div className="green"></div>
      </div>

      <nav className="mairie-nav">
        <div className="nav-logo">🏛️ Ma Commune</div>
        <div className="nav-links">
          <button onClick={() => router.push('/mairie/login')} className="nav-btn-login">Se Connecter</button>
        </div>
      </nav>

      <main className="mairie-hero">
        <div className="hero-content">
          <span className="badge">Plateforme Officielle</span>
          <h1>Numérisez votre <span>Commune</span> dès aujourd'hui</h1>
          <p>
            Gérez vos citoyens, validez les entreprises locales et restez en contact direct 
            avec votre population via une interface moderne et sécurisée.
          </p>
          
          <div className="hero-actions">
            <button onClick={() => router.push('/mairie/login')} className="btn-primary-m">
              Accéder à mon Espace
            </button>
            <button onClick={() => router.push('/mairie/register')} className="btn-secondary-m">
              Inscrire ma Mairie
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-card">
            <div className="card-header">📊 Statistiques en temps réel</div>
            <div className="card-body">
              <div className="stat-row"><span>Signalements</span><strong>12</strong></div>
              <div className="stat-row"><span>Entreprises</span><strong>45</strong></div>
              <div className="stat-row"><span>Actualités</span><strong>3</strong></div>
            </div>
          </div>
        </div>
      </main>

      <section className="mairie-features">
        <div className="feature">
          <div className="f-icon">📢</div>
          <h3>Signalements</h3>
          <p>Recevez et gérez les rapports des citoyens en temps réel sur la carte.</p>
        </div>
        <div className="feature">
          <div className="f-icon">🏢</div>
          <h3>Entreprises</h3>
          <p>Validez et suivez les commerces et pharmacies de votre commune.</p>
        </div>
        <div className="feature">
          <div className="f-icon">📰</div>
          <h3>Communication</h3>
          <p>Publiez des actualités et des documents officiels pour vos administrés.</p>
        </div>
      </section>

      <footer className="mairie-footer">
        <p>© 2026 Républiqu de Côte d'Ivoire • Ministère de la Transformation Numérique</p>
      </footer>

    </div>
  );
}
