import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!token) {
    console.error("Aucun token fourni.");
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

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
