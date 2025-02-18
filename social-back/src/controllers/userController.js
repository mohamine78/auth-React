import dotenv from 'dotenv';
dotenv.config(); 

import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';


const userValidationSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
});


export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validatedData = userValidationSchema.parse({ email, password });
    const { email: validatedEmail, password: validatedPassword } = validatedData;

    const existingUser = await User.findOne({ email: validatedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    const newUser = new User({
      email: validatedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

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

    const token = jwt.sign({ userId: user._id }, 'JWT_SECRET', {
      expiresIn: '1h',
      });

    res.status(200).json({
      message: 'Connexion réussie',
      user: { email: user.email },
      //token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(200).json({ message: 'Déconnexion réussie' });
};
