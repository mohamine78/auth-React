import express from 'express';
import { register } from '../controllers/userController.js';
import { login, logout } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

router.get('/home', authenticateUser), (res, req) => {
    res.json({ message: 'Bienvenue sur votre compte securis2'})
};

export default router;
