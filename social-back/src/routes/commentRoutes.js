import express from 'express';
import Comment from '../models/comment.js';
import Post from '../models/Post.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/comments
 * @desc    Ajouter un commentaire
 * @access  Authentifié
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { content, post } = req.body;

    if (!content || !post) {
      return res.status(400).json({ message: "Le contenu et l'ID du post sont requis." });
    }

    // Vérifier que le post existe
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    const newComment = new Comment({
      content,
      post,
      author: req.user.userId, // L'utilisateur connecté
    });

    await newComment.save();
    res.status(201).json({ message: 'Commentaire ajouté avec succès', comment: newComment });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @route   GET /api/posts/:id/comments
 * @desc    Récupérer les commentaires d'un post avec pagination
 * @access  Public
 */
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query; // Pagination

    const comments = await Comment.find({ post: id })
      .populate('author', 'pseudo email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @route   DELETE /api/comments/:id
 * @desc    Supprimer un commentaire (seulement si l'utilisateur est l'auteur)
 * @access  Authentifié
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commentaire non trouvé' });

    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas l'auteur de ce commentaire." });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Commentaire supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
