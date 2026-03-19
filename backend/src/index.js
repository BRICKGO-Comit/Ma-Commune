// ============================================
// MA COMMUNE — Backend API (Node.js / Express)
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// ============================================
// ROUTES
// ============================================
const communesRoutes = require('./routes/communes');
const newsRoutes = require('./routes/news');
const reportsRoutes = require('./routes/reports');
const contactsRoutes = require('./routes/contacts');
const proceduresRoutes = require('./routes/procedures');
const eventsRoutes = require('./routes/events');
const businessesRoutes = require('./routes/businesses');
const equipmentsRoutes = require('./routes/equipments');
const paymentsRoutes = require('./routes/payments');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const path = require('path');

// Fichiers statiques (Uploads)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Auth
app.use('/api/auth', authRoutes);

// Uploads
app.use('/api/upload', uploadRoutes);

// Communes
app.use('/api/communes', communesRoutes);

// News (les routes internes gèrent /communes/:id/news ET /news/:id)
app.use('/api', newsRoutes);

// Reports (les routes internes gèrent /communes/:id/reports ET /reports/:id)
app.use('/api', reportsRoutes);

// Contacts (les routes internes gèrent /communes/:id/contacts ET /contacts/:id)
app.use('/api', contactsRoutes);

// Procedures & Events
app.use('/api/procedures', proceduresRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/businesses', businessesRoutes);
app.use('/api/equipments', equipmentsRoutes);
app.use('/api/payments', paymentsRoutes);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'MA COMMUNE API',
    version: '1.0.0',
    mode: 'supabase',
    timestamp: new Date().toISOString()
  });
});

// ... (accueil reste identique)
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API MA COMMUNE 🏛️ (Supabase Mode)',
    docs: {
      health: 'GET /api/health',
      communes: 'GET /api/communes',
      commune_detail: 'GET /api/communes/:id',
      news: 'GET /api/communes/:id/news',
      reports: 'GET /api/communes/:id/reports',
      contacts: 'GET /api/communes/:id/contacts',
      procedures: 'GET /api/procedures/:id',
      events: 'GET /api/events/:id',
      businesses: 'GET /api/businesses/:id',
      equipments: 'GET /api/equipments/:id',
      payments: 'GET /api/payments/:userId',
      auth_register: 'POST /api/auth/register',
      auth_login: 'POST /api/auth/login'
    }
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('');
  console.log('  🏛️  MA COMMUNE API');
  console.log('  ─────────────────────────');
  console.log(`  🚀 Serveur démarré sur http://localhost:${PORT}`);
  
  const supabaseUrl = process.env.SUPABASE_URL;
  if (supabaseUrl) {
    console.log('  ☁️  Mode: Supabase (Connecté)');
  } else {
    console.warn('  ⚠️  Mode: Supabase (Configuration .env manquante !)');
  }
  
  console.log('  ─────────────────────────');
  console.log('');
});
