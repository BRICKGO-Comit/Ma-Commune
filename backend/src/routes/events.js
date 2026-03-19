const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/events/:id — Agenda d'une commune
router.get('/:id', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('events')
      .select('*')
      .eq('commune_id', req.params.id)
      .order('date', { ascending: true });

    if (error) throw error;
    res.json({ data: results || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id — Créer un événement
router.post('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const communeId = req.params.id;
  const { title, description, date, location, organizer, category } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Titre et date de l\'événement requis' });
  }

  try {
    const newEvent = {
      id: uuidv4(),
      commune_id: communeId,
      title,
      description: description || '',
      date,
      location: location || '',
      organizer: organizer || '',
      category: category || 'general',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
