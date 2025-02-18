import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5001; 
export const URI_MONGODB = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-react';
