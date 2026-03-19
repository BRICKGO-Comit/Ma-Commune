const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

// POST /api/auth/register — Inscription
router.post('/register', async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'Email, mot de passe et nom complet requis' });
  }

  try {
    // Vérifier si l'email existe déjà
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const newUser = {
      id: uuidv4(),
      email,
      full_name,
      phone: phone || null,
      avatar_url: null,
      role: 'citizen',
      commune_id: null,
      password, // Note: Devrait être haché dans un vrai projet
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('users').insert([newUser]);
    if (error) throw error;

    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      data: {
        user: userWithoutPassword,
        token: newUser.id // Mock: on utilise l'ID comme token
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login — Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const { password: _, ...userWithoutPassword } = user;
    
    // Enrichir avec le nom de la commune pour le Dashboard
    if (user.commune_id) {
      const { data: commune } = await supabase
        .from('communes')
        .select('name, slug')
        .eq('id', user.commune_id)
        .single();

      if (commune) {
        userWithoutPassword.commune_name = commune.name;
        res.json({
          data: {
            user: userWithoutPassword,
            commune_slug: commune.slug,
            token: user.id
          }
        });
        return;
      }
    }

    res.json({
      data: {
        user: userWithoutPassword,
        token: user.id // Mock: on utilise l'ID comme token
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — Profil de l'utilisateur connecté
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ data: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
