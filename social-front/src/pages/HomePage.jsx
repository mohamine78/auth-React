import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../App.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
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

    fetchPosts();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center">
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-semibold text-gray-700 mb-4 mt-10">Tous les Posts</h1>

        {loading ? (
          <p className="text-gray-500">Chargement des posts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mt-5">
            {posts.length > 0 ? (
              <ul className="space-y-6 max-w-2xl mx-auto">
                {posts.map((post) => (
                  <li 
                    key={post._id} 
                    className="p-6 border border-gray-200 rounded-xl shadow-lg bg-white max-w-2xl mx-auto transition-transform duration-300 hover:scale-105"
                  >
                    <h3 className="font-extrabold text-2xl text-indigo-600 mb-2">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    {post.image && (
                      <img 
                        src={`http://localhost:5001/uploads/${post.image}`} 
                        alt={post.title} 
                        className="mt-2 max-w-full h-auto rounded-xl mx-auto block shadow-md"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    )}
                    <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                      <p className="italic">Auteur: {post.author?.pseudo || 'Inconnu'}</p>
                      <p className="italic">Créé le: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
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
