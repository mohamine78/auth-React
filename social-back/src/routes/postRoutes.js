import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Dossier pour stocker les images

// Créer un post (POST /api/posts)
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.userId; // Récupérer l'ID de l'utilisateur depuis le token
  const image = req.file ? req.file.path : null; // Chemin de l'image si uploadée

  try {
    const newPost = new Post({
      title,
      content,
      image,
      author,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post créé avec succès', post: newPost });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer tous les posts (GET /api/posts)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email pseudo'); // Récupérer les infos de l'auteur
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer un post par son ID (GET /api/posts/:id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const post = await Post.findById(id).populate('author', 'email pseudo');
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un post par son ID (DELETE /api/posts/:id)
router.delete('/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérifier si l'utilisateur est l'auteur du post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas l\'auteur de ce post.' });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
