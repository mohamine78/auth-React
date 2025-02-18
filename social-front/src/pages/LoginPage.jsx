import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Connexion réussie:', result);
        localStorage.setItem('token', result.token);

        navigate('/');
      } else {
        console.error('Erreur de connexion:', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto my-10">
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700">Connexion</h1>
                <p className="text-gray-500 dark:text-gray-400">Connectez-vous pour accéder à votre compte</p>
              </div>
              <div className="m-7">
                <div className="mb-6">
                  <label htmlFor="email" className="text-left block mb-2 text-sm text-gray-600">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    name="email"
                    placeholder="vous@exemple.com"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  />
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Mot de passe</label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    name="password"
                    placeholder="Votre mot de passe"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  />
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                  >
                    Se connecter
                  </button>
                </div>
                <p className="text-sm text-center text-gray-400">
                  Pas encore inscrit ?{" "}
                  <a
                    href="/register"
                    className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800"
                  >
                    S'inscrire
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
