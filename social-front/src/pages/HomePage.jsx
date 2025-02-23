import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../App.css';
import CommentList from './component/CommentList';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = Cookies.get('token');

  useEffect(() => {
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
  }, [token]);

  return (
    <div className="flex flex-col items-center">
      <div className="container mx-auto my-5">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 mt-16 text-center">Tous les Posts</h1>

        {loading ? (
          <p className="text-gray-500 text-center">Chargement des posts...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="mt-5">
            {posts.length > 0 ? (
              <ul className="space-y-8 max-w-3xl mx-auto">
                {posts.map((post) => (
                  <li key={post._id} className="p-6 border border-gray-300 rounded-2xl shadow-lg bg-white">
                    <h3 className="font-bold text-2xl text-indigo-600 mb-3">
                      <Link to={`/post/${post._id}`} className="hover:underline">{post.title}</Link>
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    {post.image && (
                      <img 
                        src={`http://localhost:5001/uploads/${post.image}`} 
                        alt={post.title} 
                        className="mt-2 max-w-full h-auto rounded-xl mx-auto block shadow-md"
                      />
                    )}
                    <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                      <p className="italic">Auteur: {post.author?.pseudo || 'Inconnu'}</p>
                      <p className="italic">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {/* Ajout du bouton des commentaires */}
                    <CommentList postId={post._id} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">Aucun post disponible.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
