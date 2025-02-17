import express from 'express';
import { register, login, getUserProfile, logout } from '../controllers/userController.js';
import { authMiddleware } from '../controllers/userController.js';

const router = express.Router();

// Route d'enregistrement d'un utilisateur
router.post('/register', register);

// Route de connexion d'un utilisateur
router.post('/login', login);

// Route protégée pour récupérer les informations de l'utilisateur connecté
router.get('/profile', authMiddleware, getUserProfile);

// Route de déconnexion
router.get('/logout', logout);


export default router;
