const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/communes/:communeId/news — Actualités d'une commune
router.get('/communes/:communeId/news', async (req, res) => {
  const { communeId } = req.params;
  const { category, page = 1, limit = 20 } = req.query;

  try {
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .eq('commune_id', communeId);

    if (category) {
      query = query.eq('category', category);
    }

    // Pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    const { data, count, error } = await query
      .order('published_at', { ascending: false })
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

// GET /api/news/:id — Détail d'une actualité
router.get('/news/:id', async (req, res) => {
  try {
    const { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json({ data: article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/communes/:communeId/news — Créer une actualité (admin)
router.post('/communes/:communeId/news', authMiddleware, adminMiddleware, async (req, res) => {
  const { communeId } = req.params;
  const { title, content, summary, image_url, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Titre et contenu requis' });
  }

  try {
    const newArticle = {
      id: uuidv4(),
      commune_id: communeId,
      title,
      content,
      summary: summary || '',
      image_url: image_url || null,
      category: category || 'general',
      published_at: new Date().toISOString(),
      // author_id: req.user.id, // optionnel pour l'instant
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('news')
      .insert([newArticle])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/all-news — Toutes les actualités (pour l'admin dashboard)
router.get('/all-news', async (req, res) => {
  const { commune_id, category, page = 1, limit = 20 } = req.query;
  
  try {
    let query = supabase.from('news').select('*', { count: 'exact' });

    if (commune_id) {
      query = query.eq('commune_id', commune_id);
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
