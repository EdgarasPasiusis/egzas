import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${API_URL}/reservations/my`, {
          withCredentials: true,
        });
        setReservations(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reservations.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user]);

  const handleExtend = async (bookId, currentEndDate, extendCount) => {
    if (extendCount >= 2) return;

    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + 14);

    try {
      const res = await axios.put(
        `${API_URL}/reservations/extend`,
        {
          bookId,
          newEndDate: newEndDate.toISOString(),
        },
        { withCredentials: true }
      );
      setReservations((prev) =>
        prev.map((r) =>
          r.book_id === bookId
            ? {
                ...r,
                end_date: res.data.data.end_date,
                extend_count: res.data.data.extend_count,
              }
            : r
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to extend reservation.");
    }
  };

  if (!user) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">Please log in to see your reservations.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-gray-400 mt-20">Loading reservations...</p>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400">You don’t have any reservations yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#242121] min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            &larr; Back to Library
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>

        {error && (
          <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {reservations.map((resv) => (
            <div
              key={resv.book_id}
              className="bg-[#2a2727] rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <Link to={`/books/${resv.book_id}`} className="block">
                <img
                  src={resv.image}
                  alt={resv.title}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-1">{resv.title}</h2>
                <p className="text-gray-400 text-sm mb-2">{resv.author}</p>
                <span className="inline-block bg-cyan-900/50 text-cyan-300 text-xs px-2 py-1 rounded w-fit">
                  {resv.genre}
                </span>
                <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold w-fit mt-2">
                  {resv.rating} ★
                </div>

                <p className="text-gray-400 text-sm mt-2">
                  Reserved until: {new Date(resv.end_date).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Extensions left: {2 - resv.extend_count}
                </p>

                <div className="mt-auto pt-4">
                  <button
                    onClick={() =>
                      handleExtend(
                        resv.book_id,
                        resv.end_date,
                        resv.extend_count
                      )
                    }
                    disabled={resv.extend_count >= 2}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded block w-full text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {resv.extend_count >= 2
                      ? "Maximum extensions reached"
                      : "Extend Reservation"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
