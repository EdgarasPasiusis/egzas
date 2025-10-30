import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

const Logout = () => {
  const [error, setError] = useState(null);
  const { setuser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      const user = response.data.data;
      setuser(user);
      setError(null);
    } catch (error) {
      setError(error.message);
      setuser(null);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="h-5 w-5 cursor-pointer hover:text-gray-300"
        style={{ cursor: "pointer" }}
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
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        </svg>
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default Logout;
