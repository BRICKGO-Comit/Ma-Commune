// ============================================
// Auth Middleware (mock version — no Supabase)
// ============================================
// In mock mode, we accept a simple token format
// Later this will verify JWT tokens via Supabase

const { supabase } = require('../lib/supabase');

/**
 * Middleware d'authentification
 * Pour le mock/début : accepte "Bearer <user_id>"
 * Vérifie l'existence de l'utilisateur dans la table 'users' de Supabase
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Dans cette version simplifiée, le token est l'ID de l'utilisateur
    // Plus tard, on pourra utiliser supabase.auth.getUser(token)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !user) {
      // Pour faciliter le dev, on accepte un token spécial
      if (token === 'mock-token') {
        const { data: firstAdmin } = await supabase.from('users').select('*').limit(1).single();
        if (firstAdmin) {
          req.user = firstAdmin;
          return next();
        }
      }
      return res.status(401).json({ error: 'Session invalide ou utilisateur non trouvé' });
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      commune_id: user.commune_id
    };

    next();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la vérification de session' });
  }
}

/**
 * Middleware admin — vérifie que l'utilisateur est admin
 * Et optionnellement qu'il gère la bonne commune
 */
function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }

  // Si une commune_id est passée en paramètre, on vérifie les droits
  // (Sauf pour le super_admin qui voit tout)
  const targetCommuneId = req.params.id || req.params.communeId;
  if (targetCommuneId && req.user.role === 'admin' && req.user.commune_id !== targetCommuneId) {
    return res.status(403).json({ error: 'Vous n\'avez pas les droits sur cette commune' });
  }

  next();
}

module.exports = { authMiddleware, adminMiddleware };
