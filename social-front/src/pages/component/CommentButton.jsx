import React, { useState } from 'react';
import axios from 'axios';

const CommentButton = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/posts/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(response.data);
      console.log("Commentaires récupérés pour le post:", postId, response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        'http://localhost:5001/api/comments',
        { content: newComment, post: postId },
        { withCredentials: true }
      );
      setNewComment('');
      fetchComments(); // Refresh comments after adding a new one
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleToggleComments}
        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-200 font-semibold"
      >
        {showComments ? 'Masquer les commentaires' : 'Voir les commentaires'}
      </button>

      {showComments && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
          {comments.length > 0 ? (
            <ul className="space-y-3">
              {comments.map((comment) => (
                <li key={comment._id} className="border-b border-gray-300 py-2 flex items-center">
                  <span className="font-semibold text-indigo-600 mr-2">{comment.author.pseudo}:</span>
                  <span className="text-gray-800">{comment.content}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Aucun commentaire.</p>
          )}

          {/* Champ d'ajout de commentaire */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleCommentSubmit}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-200"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentButton;
