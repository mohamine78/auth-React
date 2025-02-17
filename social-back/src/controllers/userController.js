import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Schéma de validation Zod pour l'email et le mot de passe
const userValidationSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  avatarUrl: z.string().optional(),
});

// Clé secrète pour JWT (à stocker dans une variable d'environnement en prod)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // Utiliser .env pour la clé secrète

// Fonction d'enregistrement d'un utilisateur (sign up)
export const register = async (req, res) => {
  const { email, password, avatarUrl } = req.body;

  try {
    // Validation des données via Zod
    const validatedData = userValidationSchema.parse({ email, password, avatarUrl });
    const { email: validatedEmail, password: validatedPassword, avatarUrl: validatedAvatarUrl } = validatedData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: validatedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hasher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      email: validatedEmail,
      password: hashedPassword,
      avatarUrl: validatedAvatarUrl || '',
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Réponse de succès avec les infos de l'utilisateur
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

// Fonction de connexion d'un utilisateur (login)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation des données de connexion via Zod
    userValidationSchema.parse({ email, password });
  } catch (error) {
    return res.status(400).json({ message: error.errors[0].message });
  }

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Envoi du token dans un cookie sécurisé
    res.cookie('token', token, {
      httpOnly: true,   // Empêche l'accès via JavaScript
      secure: process.env.NODE_ENV === 'production', // En production, envoie uniquement en HTTPS
      maxAge: 3600000,  // Expiration du cookie (1h)
      sameSite: 'Strict', // Empêche l'envoi du cookie avec des requêtes cross-site
    });

    // Réponse de succès avec les informations utilisateur
    res.status(200).json({
      message: 'Connexion réussie',
      user: { email: user.email, avatarUrl: user.avatarUrl },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction de déconnexion (logout)
export const logout = (req, res) => {
  // Suppression du cookie contenant le token
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(200).json({ message: 'Déconnexion réussie' });
};
