import { useState } from "react";
import axios from "axios";

const CommentInput = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await axios.post("http://localhost:5001/api/comments", {
        content,
        post: postId,
      }, { withCredentials: true });

      setContent("");
      onCommentAdded(response.data.comment); // Met à jour la liste des commentaires
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        placeholder="Écrire un commentaire..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Commenter
      </button>
    </form>
  );
};

export default CommentInput;
