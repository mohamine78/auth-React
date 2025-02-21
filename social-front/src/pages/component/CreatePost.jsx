import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ refreshPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
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
      setAuthor('');
      
      // Rafraichir la liste des posts
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
      
      <input
        type="text"
        placeholder="Nom de l'auteur"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      
      <input
        type="text"
        placeholder="Titre du post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />

      <textarea
        placeholder="Contenu du post"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />

      <button
        type="submit"
        className="w-full p-3 text-white bg-indigo-500 rounded"
        disabled={loading}
      >
        {loading ? 'Création en cours...' : 'Créer le Post'}
      </button>
    </form>
  );
};

export default CreatePost;
