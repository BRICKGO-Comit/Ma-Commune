const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/procedures/:id — Liste des démarches d'une commune
router.get('/:id', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('commune_id', req.params.id);

    if (error) throw error;
    res.json({ data: results || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/procedures/:id — Créer une démarche
router.post('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const communeId = req.params.id;
  const { title, description, category, price, duration, url } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Titre de la démarche requis' });
  }

  try {
    const newProcedure = {
      id: uuidv4(),
      commune_id: communeId,
      title,
      description: description || '',
      category: category || 'general',
      price: price || 'Gratuit',
      duration: duration || '',
      url: url || '',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('procedures')
      .insert([newProcedure])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
