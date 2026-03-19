const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/equipments/:id — Équipements d'une commune
router.get('/:id', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('equipments')
      .select('*')
      .eq('commune_id', req.params.id);

    if (error) throw error;
    res.json({ data: results || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/equipments/:id — Créer un équipement
router.post('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const communeId = req.params.id;
  const { name, type, description, address, status } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Nom et type de l\'équipement requis' });
  }

  try {
    const newEquipment = {
      id: uuidv4(),
      commune_id: communeId,
      name,
      type,
      description: description || '',
      address: address || '',
      status: status || 'open',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('equipments')
      .insert([newEquipment])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
