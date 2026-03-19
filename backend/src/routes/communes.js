const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

// Helper for slug generation
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const enrichCommune = (c) => ({
  ...c,
  slug: c.slug || slugify(c.name)
});

// GET /api/communes — Liste des communes (avec recherche)
router.get('/', async (req, res) => {
  const { search, region } = req.query;
  
  try {
    let query = supabase.from('communes').select('*');

    if (search) {
      const q = `%${search.toLowerCase()}%`;
      // Use raw filtering for complex search if needed, or simple ilike
      query = query.or(`name.ilike.${q},code.ilike.${q}`);
    }

    // region filter if it exists in DB (not in my initial schema but let's be safe)
    if (region) {
      query = query.ilike('region', `%${region}%`);
    }

    const { data: results, error } = await query.order('name', { ascending: true });

    if (error) throw error;

    res.json({
      data: (results || []).map(c => enrichCommune(c)),
      count: results?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/communes/register — Enregistrer une nouvelle mairie
router.post('/register', async (req, res) => {
  const { name, mayor_name, email, password, admin_name, code } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Champs obligatoires manquants (Nom, Email ou Mot de passe)' });
  }

  const slug = slugify(name);

  try {
    // Check if exists
    const { data: existing } = await supabase
      .from('communes')
      .select('id')
      .or(`name.ilike.${name},slug.eq.${slug}`)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Cette commune est déjà enregistrée' });
    }

    const communeId = uuidv4();
    const newCommune = {
      id: communeId,
      name,
      slug,
      code: code || name.substring(0, 2).toUpperCase(),
      mayor_name: mayor_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: cError } = await supabase.from('communes').insert([newCommune]);
    if (cError) throw cError;

    // Create Admin User in a hypothetical 'users' table
    // Note: In real app, we might use Supabase Auth directly
    const newAdmin = {
      id: uuidv4(),
      email,
      password, // Should be hashed in real app
      full_name: admin_name || `Admin ${name}`,
      role: 'admin',
      commune_id: communeId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: uError } = await supabase.from('users').insert([newAdmin]);
    // If table doesn't exist, we might want to ignore or handle
    // if (uError) throw uError; 

    res.status(201).json({
      message: 'Mairie enregistrée avec succès',
      data: { commune: enrichCommune(newCommune), admin_email: email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/communes/by-slug/:slug — Trouver une commune par son slug
router.get('/by-slug/:slug', async (req, res) => {
  const slug = req.params.slug;
  
  try {
    const { data: commune, error } = await supabase
      .from('communes')
      .select('*')
      .or(`slug.eq.${slug},name.ilike.${slug}`)
      .single();

    if (error || !commune) {
      return res.status(404).json({ error: 'Commune non trouvée' });
    }

    res.json({ data: enrichCommune(commune) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/communes/:id — Détail d'une commune
router.get('/:id', async (req, res) => {
  try {
    const { data: commune, error } = await supabase
      .from('communes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !commune) {
      return res.status(404).json({ error: 'Commune non trouvée' });
    }

    res.json({ data: enrichCommune(commune) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/communes/:id/settings — Mettre à jour les infos de la commune
router.put('/:id/settings', async (req, res) => {
  const { description, logo_url, banner_url, phone, email, website, address, opening_hours, mayor_name } = req.body;
  
  try {
    const updateData = {
      ...(description !== undefined && { description }),
      ...(logo_url !== undefined && { logo_url }),
      ...(banner_url !== undefined && { banner_url }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(website !== undefined && { website }),
      ...(address !== undefined && { address }),
      ...(opening_hours !== undefined && { opening_hours }),
      ...(mayor_name !== undefined && { mayor_name }),
      updated_at: new Date().toISOString()
    };

    const { data: updated, error } = await supabase
      .from('communes')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !updated) {
      return res.status(404).json({ error: 'Commune non trouvée ou erreur lors de la mise à jour' });
    }

    res.json({ message: 'Paramètres mis à jour avec succès', data: enrichCommune(updated) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

module.exports = router;
