import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import AddReview from "./AddReview";

const API_URL = import.meta.env.VITE_API_URL;

const StarRating = ({ rating }) => {
    const totalStars = 5;
    return (
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starClass =
            index < rating ? "text-yellow-500" : "text-gray-600";
          return (
            <span key={index} className={`text-xl ${starClass}`}>
              ★
            </span>
          );
        })}
      </div>
    );
  };

const ReviewsSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const fetchReviews = useCallback(async () => {
    if (!bookId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/reviews/book/${bookId}`);
      setReviews(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        withCredentials: true
      });
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-gray-700 pb-2">
        Reviews
      </h2>

      {error && (
          <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

      {user && <AddReview bookId={bookId} onReviewAdded={fetchReviews} />}

      {loading ? (
        <p className="text-center text-gray-400 mt-8">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-[#2a2727] p-6 rounded-lg text-center text-gray-400">
          No reviews yet. Be First to leave a review.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#2a2727] p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-cyan-400 text-lg">{review.email}</p>
                <div className="flex items-center gap-4">
                  <StarRating rating={review.rating} />
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              <p className="text-right text-xs text-gray-500 mt-4">
                {new Date(review.created_at).toLocaleDateString("lt-LT")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;