import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import ReviewsSection from "../ReviewsSection";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";

const API_URL = import.meta.env.VITE_API_URL;

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [reservation, setReservation] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API_URL}/books/${id}`);
        setBook(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkReservation = async () => {
      if (!user || !id) return;
      try {
        const res = await axios.get(`${API_URL}/reservations/book/${id}`, {
          withCredentials: true,
        });
        setReservation(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to check reservations."
        );
        setReservation(null);
      }
    };

    checkReservation();
  }, [id, user]);

  const handleReserve = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/reservations`,
        {
          bookId: id,
          startDate: new Date().toISOString(),
          endDate: endDate.toISOString(),
        },
        { withCredentials: true }
      );
      setReservation(res.data.data);
      setShowDatePicker(false);
    } catch (err) {
      setError(err.response?.data?.message || "Reservation failed.");
    }
  };
  const handleExtend = async () => {
    if (!reservation) return;

    const currentEndDate = new Date(reservation.end_date);
    const newEndDate = new Date(
      currentEndDate.setDate(currentEndDate.getDate() + 14)
    );

    try {
      const res = await axios.put(
        `${API_URL}/reservations/extend`,
        {
          bookId: id,
          newEndDate: newEndDate.toISOString(),
        },
        { withCredentials: true }
      );
      setReservation(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to extend reservation.");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-400 mt-20">Loading book details...</p>
    );
  }

  if (!book) {
    return <p className="text-center text-gray-400 mt-20">Book not found.</p>;
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
          >
            &larr; Back to Library
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="bg-[#2a2727] rounded-lg shadow-lg overflow-hidden md:flex">
          <div className="md:w-1/3">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3 flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-400 text-lg mb-4">{book.author}</p>

            <div className="flex items-center gap-4 mb-4">
              <span className="inline-block bg-cyan-900/50 text-cyan-300 text-sm px-3 py-1 rounded">
                {book.genre}
              </span>
              <div className="bg-yellow-500 text-black text-sm px-3 py-1 rounded-full font-semibold">
                {book.rating} ★
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mt-4 flex-grow">
              {book.description}
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-2">
              {user && (
                <>
                  {!reservation && !showDatePicker && (
                    <>
                      {book.is_available ? (
                        <button
                          onClick={() => setShowDatePicker(true)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto cursor-pointer"
                        >
                          Reserve
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-red-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto cursor-not-allowed"
                        >
                          Already Taken
                        </button>
                      )}
                    </>
                  )}

                  {showDatePicker && (
                    <div className="bg-gray-800 p-4 rounded-lg w-full">
                      <h3 className="text-lg mb-2">Select return date:</h3>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        minDate={new Date()}
                        inline
                      />
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={handleReserve}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                          Confirm Reservation
                        </button>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {reservation && (
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-400 text-sm">
                        Reserved until:{" "}
                        {new Date(reservation.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Extensions used: {reservation.extend_count} / 2
                      </p>
                      <button
                        onClick={handleExtend}
                        disabled={reservation.extend_count >= 2}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
                      >
                        {reservation.extend_count >= 2
                          ? "Maximum extensions reached"
                          : "Extend Reservation"}
                      </button>
                    </div>
                  )}

                  {!showDatePicker}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <ReviewsSection bookId={id} />
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
