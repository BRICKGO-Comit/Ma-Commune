'use client';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;
  const [user, setUser] = useState(null);
  const [commune, setCommune] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token) {
      if (slug === 'console') {
        router.push('/admin');
      } else {
        router.push('/mairie/login');
      }
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Si on est sur une commune spécifique, on charge ses infos
      if (slug !== 'console') {
        import('../../lib/api').then(({ getCommuneBySlug }) => {
          getCommuneBySlug(slug).then(res => {
            setCommune(res.data);
          }).catch(err => console.error(err));
        });
      } else {
        setCommune(null);
      }
    }
  }, [router, slug]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    if (slug === 'console') {
      router.push('/admin');
    } else {
      router.push('/mairie/login');
    }
  };

  const allNavItems = [
    { href: `/${slug}`, label: 'Tableau de bord', icon: '📊' },
    { href: `/${slug}/communes`, label: 'Communes', icon: '🏛️', superOnly: true },
    { href: `/${slug}/news`, label: 'Actualités', icon: '📰' },
    { href: `/${slug}/reports`, label: 'Signalements', icon: '🚨' },
    { href: `/${slug}/contacts`, label: 'Contacts utiles', icon: '📞' },
    { href: `/${slug}/procedures`, label: 'Démarches', icon: '📄' },
    { href: `/${slug}/events`, label: 'Agenda', icon: '🗓️' },
    { href: `/${slug}/businesses`, label: 'Entreprises', icon: '🏬' },
    { href: `/${slug}/equipments`, label: 'Équipements', icon: '🏙️' },
    { href: `/${slug}/payments`, label: 'Taxes & Fisc', icon: '💳' },
    { href: `/${slug}/settings`, label: 'Paramètres', icon: '⚙️' },
  ];

  const navItems = allNavItems.filter(item => {
    // Si c'est un item réservé au super admin, on vérifie le rôle
    if (item.superOnly && user?.role !== 'super_admin') return false;
    // Si on est dans le contexte d'une mairie (slug !== 'console'), on masque l'onglet 'Communes'
    if (item.label === 'Communes' && slug !== 'console') return false;
    return true;
  });

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>
            <span className="logo-sm">🏛️</span>
            {slug === 'console' ? 'MA COMMUNE' : (commune?.name || 'MA MAIRIE')}
          </h2>
          <p>{slug === 'console' ? 'Administration Globale' : `Mairie de ${commune?.name || '...'}`}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout}>🚪 Se déconnecter</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="topbar">
          <h1>
            {navItems.find(n => n.href === pathname)?.label || 'Administration'}
          </h1>
          <div className="user-info">
            <span>{user?.full_name || 'Admin'}</span>
            <div className="user-avatar">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
