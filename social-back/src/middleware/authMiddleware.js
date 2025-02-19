import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("Aucun token fourni ou format incorrect.");
    return res.status(401).json({ message: 'Accès refusé. Token manquant ou mal formaté.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    console.log("Utilisateur authentifié:", decoded);
    next();
  } catch (error) {
    console.error("Erreur de vérification du token:", error.message);
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};
