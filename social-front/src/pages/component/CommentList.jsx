import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/posts/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
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
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 font-semibold"
      >
        {showComments ? 'Masquer les commentaires' : 'Voir les commentaires'}
      </button>
      
      {showComments && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment._id} className="border-b border-gray-300 py-2 text-gray-800 flex items-center gap-2">
                  <strong className="text-indigo-600">{comment.author.pseudo}:</strong> 
                  <span className="text-gray-700">{comment.content}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Aucun commentaire.</p>
          )}

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
              className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
