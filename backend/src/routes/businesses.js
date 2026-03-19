const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

const { authMiddleware } = require('../middleware/auth');

// GET /api/businesses/:id — Annuaire des entreprises d'une commune
router.get('/:id', async (req, res) => {
  try {
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('commune_id', req.params.id);

    // Si pas de paramètre ?all=true, on filtre sur les actives uniquement (pour le mobile public)
    if (req.query.all !== 'true') {
      query = query.eq('status', 'active');
    }

    const { data: results, error } = await query;
    if (error) throw error;
    res.json({ data: results || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/my-business — Récupérer l'entreprise de l'utilisateur connecté
router.get('/my/business', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/businesses/:id — Soumettre une entreprise (depuis le mobile)
router.post('/:id', authMiddleware, async (req, res) => {
  const { name, activity, phone, address, description } = req.body;
  
  if (!name || !activity || !phone) {
    return res.status(400).json({ message: 'Nom, activité et téléphone sont requis.' });
  }

  try {
    const newBusiness = {
      id: uuidv4(),
      commune_id: req.params.id,
      owner_id: req.user.id, // L'utilisateur connecté devient le propriétaire (en attente de validation)
      name,
      category: activity.toLowerCase(),
      description: description || '',
      phone,
      address: address || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('businesses').insert([newBusiness]);
    if (error) throw error;

    res.status(201).json({ message: 'Entreprise soumise avec succès, en attente de validation', data: newBusiness });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/businesses/:id — Mettre à jour les informations (par le propriétaire ou admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, description, phone, address, website, email, status } = req.body;
  
  try {
    // 1. Vérification de la propriété
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('owner_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !business) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    const isOwner = business.owner_id === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    // 2. Construire l'objet de mise à jour
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (website !== undefined) updateData.website = website;
    if (email !== undefined) updateData.email = email;
    // Seul un admin peut changer le statut
    if (status !== undefined && isAdmin) updateData.status = status;

    const { error: updateError } = await supabase
      .from('businesses')
      .update(updateData)
      .eq('id', req.params.id);

    if (updateError) throw updateError;
    res.json({ message: 'Informations mises à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/businesses/:id/duty — Basculer le statut de garde (Pharmacie uniquement)
router.patch('/:id/duty', authMiddleware, async (req, res) => {
  const { is_on_duty } = req.body;

  try {
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('owner_id, category')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !business) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    if (business.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Seul le propriétaire peut changer le statut de garde.' });
    }

    if (business.category !== 'pharmacie' && business.category !== 'santé' && business.category !== 'sante') {
      return res.status(400).json({ error: 'Seules les pharmacies peuvent être de garde.' });
    }

    const { error: updateError } = await supabase
      .from('businesses')
      .update({ is_on_duty })
      .eq('id', req.params.id);

    if (updateError) throw updateError;
    res.json({ message: `Le statut de garde est désormais : ${is_on_duty ? 'ACTIF' : 'INACTIF'}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
