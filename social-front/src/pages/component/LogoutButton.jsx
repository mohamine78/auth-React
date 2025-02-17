import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token
    localStorage.removeItem('token');
    
    // Rediriger vers la page de login
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Se déconnecter
    </button>
  );
};

export default LogoutButton;