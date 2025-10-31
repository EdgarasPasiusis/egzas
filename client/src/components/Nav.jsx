import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import { Search, Heart } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Nav = () => {
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length >= 2) {
        setShowDropdown(true);
        fetchBooks(query);
      } else {
        setBooks([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBooks = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/books/search`, {
        params: {
          title: searchTerm,
          author: searchTerm,
          limit: 10,
          page: 1,
        },
      });
      setBooks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-[#292828] text-white">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6 stroke-white"
              fill="none"
            >
              <path d="M1.5,3.41V16.77H9.14A2.86,2.86,0,0,1,12,19.64V6.27A2.86,2.86,0,0,0,9.14,3.41Z" />
              <path d="M22.5,3.41V16.77H14.86A2.86,2.86,0,0,0,12,19.64V6.27a2.86,2.86,0,0,1,2.86-2.86Z" />
              <polyline points="22.5 16.77 22.5 20.59 14.86 20.59 9.14 20.59 1.5 20.59 1.5 16.77" />
            </svg>
            <span className="font-medium text-lg">Library</span>
          </NavLink>
        </div>

        <div className="relative w-full md:w-auto md:flex mx-0 md:mx-6 my-2 md:my-0">
          <div className="relative w-full max-w-md md:w-120" ref={dropdownRef}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author"
              className="w-full rounded-md bg-[#373737] pl-9 pr-4 py-2 text-sm placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={query}
              onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
              onChange={(e) => setQuery(e.target.value)}
            />

            {showDropdown && query.trim().length >= 2 && (
              <div className="absolute top-full left-0 w-full bg-[#2c2c2c] mt-2 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="p-2 text-gray-400">Loading...</div>
                ) : error ? (
                  <div className="p-2 text-red-400">{error}</div>
                ) : (
                  books.map((book) => (
                    <NavLink
                      key={book.id}
                      to={`/books/${book.id}`}
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                    >
                      {book.title} –{" "}
                      <span className="text-gray-400">{book.author}</span>
                    </NavLink>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  className="h-5 w-5 cursor-pointer hover:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="16" r="1" />
                    <rect x="3" y="10" width="18" height="12" rx="2" />
                    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  </svg>
                </NavLink>
              )}
              <NavLink
                to="/reservations"
                className="h-5 w-5 cursor-pointer hover:text-gray-300"
              >
                <Heart className="h-5 w-5 cursor-pointer hover:text-gray-300" />
              </NavLink>
              <Logout />
            </>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                className="hover:text-gray-300 transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/signup"
                className="hover:text-gray-300 transition-colors"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
