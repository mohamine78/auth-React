import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { register, login } from './controllers/userController.js';
import { PORT, URI_MONGODB } from './config.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json());   

mongoose.connect(URI_MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.post('/api/users/register', register);
app.post('/api/users/login', login);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
