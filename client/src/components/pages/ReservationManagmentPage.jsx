import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ReservationManagmentPage = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/reservations`, {
        withCredentials: true,
      });
      setReservations(res.data.tours || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleMarkReturned = async (bookId) => {
    try {
      await axios.put(
        `${API_URL}/reservations/return`,
        { bookId },
        { withCredentials: true }
      );
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark a return.");
    }
  };

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const liveSearch = async (title, email) => {
    try {
      if (!title.trim() && !email.trim()) {
        fetchReservations();
        return;
      }

      const params = new URLSearchParams();
      if (title.trim()) params.append("title", title.trim());
      if (email.trim()) params.append("email", email.trim());

      const res = await axios.get(`${API_URL}/reservations/search`, {
        params,
        withCredentials: true,
      });

      setReservations(res.data.data || []);
      if ((res.data.data || []).length === 0) {
        setError("No reservations found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Live search failed.");
    }
  };

  const handleLiveSearch = useCallback(debounce(liveSearch, 300), []);

  const formatDate = (isoString) => isoString?.split("T")[0] || "";

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20">Loading reservations...</p>
    );

  const activeReservations = reservations.filter((r) => r.status === "active");
  const returnedReservations = reservations.filter(
    (r) => r.status === "returned"
  );

  const renderReservation = (r) => (
    <div
      key={r.id}
      className="flex flex-col sm:flex-row justify-between items-center bg-[#2a2727] p-3 rounded-lg gap-2"
    >
      <div className="flex flex-col text-center sm:text-left">
        <span className="font-semibold">{r.title}</span>
        <span className="text-gray-400 text-sm">
          Author: {r.author} — User: {r.user_email || "Unknown"} — Status:{" "}
          {r.status}
        </span>
        <span className="text-gray-400 text-sm">
          Start: {formatDate(r.start_date)} — End: {formatDate(r.end_date)}
        </span>
      </div>
      {r.status === "active" && (
        <button
          onClick={() => handleMarkReturned(r.book_id)}
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg"
        >
          Mark Returned
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#242121] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Reservations</h1>

        {error && (
          <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              handleLiveSearch(e.target.value, searchEmail);
            }}
            placeholder="Search by book title..."
            className="flex-grow p-2 rounded-lg bg-[#2a2727] text-white focus:outline-none"
          />
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              handleLiveSearch(searchTitle, e.target.value);
            }}
            placeholder="Search by user email..."
            className="flex-grow p-2 rounded-lg bg-[#2a2727] text-white focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Active Reservations</h2>
          {activeReservations.length > 0 ? (
            activeReservations.map(renderReservation)
          ) : (
            <p className="text-gray-400">No active reservations.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">Returned Reservations</h2>
          {returnedReservations.length > 0 ? (
            returnedReservations.map(renderReservation)
          ) : (
            <p className="text-gray-400">No returned reservations.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationManagmentPage;
