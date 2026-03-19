const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/payments/:id — Suivi des paiements d'un utilisateur (ou taxes d'une commune)
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data: results, error } = await supabase
      .from('payments')
      .select('*')
      .or(`user_id.eq.${id},commune_id.eq.${id}`);

    if (error) throw error;
    res.json({ data: results || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments — Effectuer un paiement (taxes)
router.post('/', authMiddleware, async (req, res) => {
  const { commune_id, amount, type, description } = req.body;
  
  try {
    const newPayment = {
      id: uuidv4(),
      user_id: req.user.id,
      commune_id,
      amount,
      type,
      status: 'paid', // Simulation paiement direct
      description,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('payments').insert([newPayment]);
    if (error) throw error;

    res.status(201).json({ data: newPayment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
