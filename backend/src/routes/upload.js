const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../lib/cloudinary');
const { Readable } = require('stream');

// Multer en mémoire (pas de fichier local)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image'));
    }
  }
});

// Helper pour upload un buffer vers Cloudinary
function uploadToCloudinary(buffer, folder = 'ma-commune') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' } // Optimisation automatique
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

// POST /api/upload — Uploader une image vers Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier téléchargé' });
  }

  try {
    // Déterminer le dossier Cloudinary selon le type
    const folder = req.body.type 
      ? `ma-commune/${req.body.type}` // ex: logos, banners, reports, news
      : 'ma-commune/general';

    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.json({
      message: 'Image téléchargée avec succès sur Cloudinary',
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('Erreur Cloudinary:', err.message);
    res.status(500).json({ error: 'Erreur lors de l\'upload vers Cloudinary' });
  }
});

module.exports = router;
