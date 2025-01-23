import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';


const userValidationSchema = z.object({
  email: z.string().email('Invalid email format').regex(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Invalid email format'
  ),
  password: z.string().min(6, 'Password minimum 6'),
  avatarUrl: z.string().optional(),
});


const registerUser = async (email, password, avatarUrl) => {

  const validatedData = userValidationSchema.parse({ email, password, avatarUrl });

  const { email: validatedEmail, password: validatedPassword, avatarUrl: validatedAvatarUrl } = validatedData;

  const existingUser = await User.findOne({ email: validatedEmail });
  if (existingUser) {
    throw new Error('Email existe deja');
  }


  const hashedPassword = await bcrypt.hash(validatedPassword, 10);


  const newUser = new User({
    email: validatedEmail,
    password: hashedPassword,
    avatarUrl: validatedAvatarUrl || '',
  });

  await newUser.save();
  return newUser;
};


const verifyPassword = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Incorrect password');
  }

  return user;
};

export { registerUser, verifyPassword };
