import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { z } from 'zod';

const userValidationSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  avatarUrl: z.string().optional(),
});

export const register = async (req, res) => {
  const { email, password, avatarUrl } = req.body;

  try {
    const validatedData = userValidationSchema.parse({ email, password, avatarUrl });
    const { email: validatedEmail, password: validatedPassword, avatarUrl: validatedAvatarUrl } = validatedData;

    const existingUser = await User.findOne({ email: validatedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    const newUser = new User({
      email: validatedEmail,
      password: hashedPassword,
      avatarUrl: validatedAvatarUrl || '',
    });

    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { email: newUser.email, avatarUrl: newUser.avatarUrl },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    userValidationSchema.parse({ email, password });
  } catch (error) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    res.status(200).json({
      message: 'Connexion réussie',
      user: { email: user.email, avatarUrl: user.avatarUrl },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
