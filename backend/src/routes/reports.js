const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/communes/:communeId/reports — Signalements d'une commune
router.get('/communes/:communeId/reports', async (req, res) => {
  const { communeId } = req.params;
  const { status, category, page = 1, limit = 20 } = req.query;

  try {
    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('commune_id', communeId);

    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      data: data || [],
      count: count || 0,
      page: parseInt(page),
      total_pages: Math.ceil((count || 0) / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/:id — Détail d'un signalement
router.get('/reports/:id', async (req, res) => {
  try {
    const { data: report, error } = await supabase
      .from('reports')
      .select('*, users(full_name)')
      .eq('id', req.params.id)
      .single();

    if (error || !report) {
      return res.status(404).json({ error: 'Signalement non trouvé' });
    }

    // Aplatir le résultat de la jointure
    const enrichedReport = {
      ...report,
      user_name: report.users ? report.users.full_name : 'Anonyme'
    };
    delete enrichedReport.users;

    res.json({ data: enrichedReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/communes/:communeId/reports — Créer un signalement (citoyen authentifié)
router.post('/communes/:communeId/reports', authMiddleware, async (req, res) => {
  const { communeId } = req.params;
  const { title, description, category, photo_url, latitude, longitude, address } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Titre, description et catégorie requis' });
  }

  const validCategories = ['voirie', 'eclairage', 'proprete', 'eau', 'securite', 'autre'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Catégorie invalide. Valeurs acceptées: ${validCategories.join(', ')}` });
  }

  try {
    const newReport = {
      id: uuidv4(),
      commune_id: communeId,
      user_id: req.user.id,
      title,
      description,
      category,
      photo_url: photo_url || null,
      latitude: latitude || null,
      longitude: longitude || null,
      address: address || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('reports').insert([newReport]);
    if (error) throw error;

    res.status(201).json({ data: newReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reports/:id/status — Mettre à jour le statut (admin)
router.patch('/reports/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status, admin_response } = req.body;
  const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}` });
  }

  try {
    const updateData = {
      ...(status && { status }),
      ...(admin_response !== undefined && { admin_response }),
      ...(status === 'resolved' && { resolved_at: new Date().toISOString() }),
      updated_at: new Date().toISOString()
    };

    const { data: updated, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !updated) {
      return res.status(404).json({ error: 'Signalement non trouvé ou erreur lors de la mise à jour' });
    }

    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/all-reports — Tous les signalements (pour l'admin dashboard)
router.get('/all-reports', async (req, res) => {
  const { commune_id, status, category, page = 1, limit = 20 } = req.query;
  
  try {
    let query = supabase.from('reports').select('*', { count: 'exact' });

    if (commune_id) {
      query = query.eq('commune_id', commune_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      data: data || [],
      count: count || 0,
      page: parseInt(page),
      total_pages: Math.ceil((count || 0) / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
