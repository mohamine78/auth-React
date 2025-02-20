import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, URI_MONGODB } from './config.js';
import userRouter from './routes/router.js'; 
import cookieParser from 'cookie-parser';
import postRouter from './routes/postRoutes.js';

const app = express(); // Déplacez cette ligne ici

// Middleware
app.use(cookieParser()); // Ajout de cookie-parser
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());   

// Connexion à MongoDB
mongoose.connect(URI_MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
