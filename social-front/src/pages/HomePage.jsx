import React, { useEffect } from 'react';
import LogoutButton from './component/LogoutButton';
import * as jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import './component/component.css';

const HomePage = () => {
  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        console.log('Decoded Token:', decodedToken);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        window.location.href = '/login'; 
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="container">
      <h1 className='text-4xl'>Bienvenue sur la page d'accueil !</h1>
      <br />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
