import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreatePost = ({ refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupérer le pseudo depuis les cookies
  const pseudo = Cookies.get('pseudo');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', pseudo); // Utiliser le pseudo récupéré
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5001/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      // Reset le formulaire
      setTitle('');
      setContent('');
      setImage(null);
      
      // Rafraîchir la liste des posts
      refreshPosts();
    } catch (err) {
      console.error('Erreur lors de la création du post:', err);
      setError('Erreur lors de la création du post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-7 max-w-md mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="mb-4">
        <label className="block mb-1 font-bold text-gray-700">Titre du post</label>
        <input
          type="text"
          placeholder="Titre du post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-bold text-gray-700">Contenu du post</label>
        <textarea
          placeholder="Contenu du post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-bold text-gray-700">Ajouter une image</label>
        <input
          type="file"
          id="file-input"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden" // Cacher le champ par défaut
        />
        <label htmlFor="file-input" className="block w-full p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-center transition">
          {image ? image.name : 'Choisissez un fichier'}
        </label>
      </div>

      <button
        type="submit"
        className="w-full p-3 text-white bg-indigo-500 rounded hover:bg-indigo-600 transition duration-200"
        disabled={loading}
      >
        {loading ? 'Création en cours...' : 'Créer un Post'}
      </button>
    </form>
  );
};

export default CreatePost;
