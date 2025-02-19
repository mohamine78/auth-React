import dotenv from 'dotenv';
dotenv.config(); 

import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const userValidationSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  pseudo: z.string().min(3, 'Le pseudo doit comporter au moins 3 caractères'),
  description: z.string().optional(), 
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const register = async (req, res) => {
  const { email, password, pseudo, description } = req.body;

  try {
    const validatedData = userValidationSchema.parse({ email, password, pseudo, description });
    const { email: validatedEmail, password: validatedPassword, pseudo: validatedPseudo, description: validatedDescription } = validatedData;

    const existingUser = await User.findOne({ email: validatedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    const newUser = new User({
      email: validatedEmail,
      password: hashedPassword,
      pseudo: validatedPseudo,
      description: validatedDescription,
    });

    await newUser.save();

    // Générer un token pour l'utilisateur
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    console.log("Nouvel utilisateur créé avec token:", token);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { email: newUser.email, pseudo: newUser.pseudo },
      token
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
    // Valider uniquement l'email et le mot de passe (pas pseudo/description)
    z.object({
      email: z.string().email('Format d\'email invalide'),
      password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
    }).parse({ email, password });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    console.log("Utilisateur connecté avec token:", token);

    res.status(200).json({
      message: 'Connexion réussie',
      user: { email: user.email, pseudo: user.pseudo },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
};
