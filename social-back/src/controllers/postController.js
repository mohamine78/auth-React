import Post from '../models/Post.js';
import { z } from 'zod';

const postValidationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  image: z.string().optional(),
});

export const createPost = async (req, res) => {
  const { title, content, image } = req.body;

  try {
    postValidationSchema.parse({ title, content, image });

    const post = new Post({
      title,
      content,
      image,
      author: req.user.userId,
    });

    await post.save();
    res.status(201).json({ message: 'Post créé avec succès', post });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
