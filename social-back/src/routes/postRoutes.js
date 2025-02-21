import express from 'express';
import multer from 'multer';
import Post from '../models/Post.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

//multer: stocker les images dans "uploads/"
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

//recuperer les posts de l'utilisateur connecté (GET /api/posts/myposts)
router.get('/myposts', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({ author: userId });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//creer un post (POST /api/posts)
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.userId;
  const image = req.file ? req.file.filename : null;
  try {
    const newPost = new Post({ title, content, image, author });
    await newPost.save();
    res.status(201).json({ message: 'Post créé avec succès', post: newPost });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//recuperer tous les posts (GET /api/posts)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email pseudo');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//recuperer un post par son ID (GET /api/posts/:id)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email pseudo');
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });
    res.status(200).json(post);
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un post (DELETE /api/posts/:id)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas l\'auteur de ce post.' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// recuperer post user connecté (GET /api/posts/myposts)
router.get('/myposts', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; // Vérifie si c'est bien userId ou id
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(200).json({ message: "Aucun post trouvé" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// recuperer un seul post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


export default router;
