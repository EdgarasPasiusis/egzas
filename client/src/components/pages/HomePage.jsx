import { useEffect, useState } from "react";
import BooksGrid from "../BooksGird";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const MainPage = () => {
  const [selectedGenre, setSelectedGenre] = useState("All Books");
  const [genres, setGenres] = useState(["All Books"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchGenres = async () => {
    try {
      const res = await axios.get(`${API_URL}/genres`);
      const dbGenres = res.data.tours || [];
      setGenres(["All Books", ...dbGenres.map((g) => g.genre)]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load genres.");
    } finally {
      setLoading(false);
    }
  };

  fetchGenres();
}, []);

if (loading) {
    return (
      <div className="min-h-screen bg-[#242121] flex items-center justify-center">
        <p className="text-gray-400">Loading genres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#242121] flex items-center justify-center p-4">
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-6 py-4 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-lg font-bold mb-2">Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#242121] text-white p-6">
      <div className="flex justify-center items-center -mt-4 space-x-2 md:space-x-6 mb-10 pb-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400
              ${
                selectedGenre === genre
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <BooksGrid selectedGenre={selectedGenre} />
    </div>
  );
};

export default MainPage;
