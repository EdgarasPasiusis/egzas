import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AddReview = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Choose a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please leave a comment.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(
        `${API_URL}/reviews/book/${bookId}`,
        { rating, comment },
        { withCredentials: true }
      );
      setRating(0);
      setComment("");
      onReviewAdded();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to post review, try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#2a2727] p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Leave a review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Rating:</label>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={starValue}
                  className={`text-3xl cursor-pointer ${
                    starValue <= (hoverRating || rating)
                      ? "text-yellow-500"
                      : "text-gray-600"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:border-cyan-500 transition-colors"
            rows="4"
            placeholder="Leave your opinion about a book.."
          ></textarea>
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer font-bold py-2 px-6 rounded transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending.." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default AddReview;
