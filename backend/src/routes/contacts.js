const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/communes/:communeId/contacts — Contacts utiles d'une commune
router.get('/communes/:communeId/contacts', async (req, res) => {
  const { communeId } = req.params;
  const { category, emergency } = req.query;

  try {
    let query = supabase
      .from('useful_contacts')
      .select('*')
      .eq('commune_id', communeId);

    if (category) {
      query = query.eq('category', category);
    }
    if (emergency !== undefined) {
      query = query.eq('is_emergency', emergency === 'true');
    }

    const { data: results, error } = await query
      .order('is_emergency', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) throw error;

    res.json({
      data: results || [],
      count: results?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/communes/:communeId/contacts — Ajouter un contact (admin)
router.post('/communes/:communeId/contacts', authMiddleware, adminMiddleware, async (req, res) => {
  const { communeId } = req.params;
  const { name, phone, email, category, address, is_emergency, sort_order } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Nom et téléphone requis' });
  }

  try {
    const newContact = {
      id: uuidv4(),
      commune_id: communeId,
      name,
      phone,
      email: email || null,
      category: category || 'general',
      address: address || null,
      is_emergency: is_emergency || false,
      sort_order: sort_order || 0,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('useful_contacts').insert([newContact]);
    if (error) throw error;

    res.status(201).json({ data: newContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contacts/:id — Supprimer un contact (admin)
router.delete('/contacts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('useful_contacts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Contact supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
