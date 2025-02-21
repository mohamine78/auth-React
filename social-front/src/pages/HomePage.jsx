import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupération des posts depuis l'API
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/posts', {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des posts:', err);
      setError('Erreur lors de la récupération des posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-semibold text-gray-700 mb-4">Tous les Posts</h1>

        {loading ? (
          <p className="text-gray-500">Chargement des posts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-5">
            {posts.length > 0 ? (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post._id} className="p-4 border border-gray-300 rounded shadow bg-white">
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-gray-700">{post.content}</p>
                    {post.image && (
                      <img
                        src={`http://localhost:5001/uploads/${post.image}`}
                        alt={post.title}
                        className="mt-2 max-w-full h-auto rounded"
                      />
                    )}
                    <p className="text-sm text-gray-500">Auteur: {post.author?.pseudo || 'Inconnu'}</p>
                    <p className="text-sm text-gray-500">Créé le: {new Date(post.createdAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun post disponible.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
