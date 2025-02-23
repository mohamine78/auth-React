import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentButton from './component/CommentButton'; 

const SinglePost = () => {
  const { id } = useParams(); // Récupération de l'ID du post
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du post:", err);
        setError("Impossible de charger ce post.");
      }
    };

    fetchPost();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p className="text-gray-500 text-center mt-10">Chargement...</p>;

  return (
    <div className="container mx-auto my-10 p-6 max-w-3xl">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-4">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>

        {post.image && (
          <img 
            src={`http://localhost:5001/uploads/${post.image}`} 
            alt={post.title} 
            className="mt-6 max-w-full h-auto rounded-xl shadow-md mx-auto"
          />
        )}

        <div className="mt-6 text-sm text-gray-500 flex justify-between items-center">
          <p className="italic">Crée le: {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Bouton pour afficher/masquer les commentaires et champ d'ajout */}
        <div className="mt-6">
          <CommentButton postId={post._id} />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
