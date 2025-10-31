import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BooksGrid = ({ selectedGenre }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books`);

        setBooks(res.data.tours || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks =
    selectedGenre === "All Books"
      ? books
      : books.filter(
          (book) => book.genre?.toLowerCase() === selectedGenre?.toLowerCase()
        );

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <div className="px-6 pb-10">
      {error && (
        <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-400">No books found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book, idx) => (
            <div
              key={`${book.id}-${idx}`}
              className="bg-[#2a2727] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <div className="relative">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">
                  {book.rating} ★
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-white text-sm mb-1 truncate">
                  {book.title}
                </h3>
                <p className="text-gray-400 text-xs mb-2">{book.author}</p>
                <span className="inline-block bg-cyan-900/30 text-cyan-400 text-xs px-2 py-1 rounded">
                  {book.genre}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksGrid;
