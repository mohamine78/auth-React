import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CreatePost from './component/CreatePost';

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = Cookies.get('token');

  const fetchPosts = async () => {
    if (!token) {
      setError('Veuillez vous connecter pour voir vos posts.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5001/api/posts/myposts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div className="container mx-auto my-5 p-4">
      <h1 className="text-3xl font-semibold text-gray-700 mb-4">Mes Posts</h1>

      <CreatePost refreshPosts={fetchPosts} />

      {loading ? (
        <p>Chargement des posts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : Array.isArray(posts) && posts.length === 0 ? (
        <p>Aucun post trouvé.</p>
      ) : (
        <ul className="space-y-4 mt-5">
          {posts.map((post) => (
            <li key={post._id} className="p-4 border border-gray-300 rounded shadow bg-white">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p>{post.content}</p>
              
              {post.image && (
                <img 
                  src={`http://localhost:5001/uploads/${post.image}`} 
                  alt={post.title} 
                  className="mt-2 max-w-full h-auto rounded"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              
              <p className="text-sm text-gray-500">Créé le: {new Date(post.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostPage;
