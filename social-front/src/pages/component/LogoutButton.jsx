import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    // sinon supprimer le token localStorage.removeItem('token');
    
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