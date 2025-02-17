import React from 'react';
import LogoutButton from './component/LogoutButton';
import './component/component.css'

const HomePage = () => {
  return (
    <div className="container">
      <h1 className='text-4xl'>Bienvenue sur la page d'accueil !</h1>
      <br></br>
      <LogoutButton />
    </div>
  );
};

export default HomePage;
