import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const BookManagmentPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    genre_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    genre_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/books`, { withCredentials: true });
      setBooks(res.data.tours || res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await axios.get(`${API_URL}/genres`, { withCredentials: true });
      setGenres(res.data.tours || res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load genres.");
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.genre_id) return;
    try {
      await axios.post(`${API_URL}/books`, newBook, { withCredentials: true });
      setNewBook({ title: "", author: "", description: "", image: "", genre_id: "" });
      fetchBooks();
      setError(null);
    } catch (err) {
       setError(err.response?.data?.message || "Failed to add book.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`,{
        withCredentials: true
      });
      fetchBooks();
      setError(null);
    } catch (err) {
       setError(err.response?.data?.message || "Failed to load delete book.");
    }
  };

  const startEdit = (book) => {
    setEditId(book.id);
    setEditData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      image: book.image || "",
      genre_id: book.genre_id || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const cleaned = Object.fromEntries(
        Object.entries(editData)
          .filter(([v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, k === "genre_id" ? parseInt(v) : v])
      );
      await axios.put(`${API_URL}/books/${id}`, cleaned, { withCredentials: true });
      setEditId(null);
      setEditData({ title: "", author: "", description: "", image: "", genre_id: "" });
      fetchBooks();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update book.");
    }
  };
  
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const liveSearch = async (title, author) => {
    try {
      if (!title.trim() && !author.trim()) {
        fetchBooks();
        return;
      }

      const params = new URLSearchParams();
      if (title.trim()) params.append("title", title.trim());
      if (author.trim()) params.append("author", author.trim());

      const res = await axios.get(`${API_URL}/books/search?${params.toString()}`);
      setBooks(res.data.data || []);
      setError(null);
    } catch (err) {
       setError(err.response?.data?.message || "Live search failed.");
    }
  };

  const handleLiveSearch = useCallback(debounce(liveSearch, 300), []);

  if (loading) return <p className="text-center text-gray-400 mt-20">Loading books...</p>;

  return (
    <div className="min-h-screen bg-[#242121] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Books</h1>

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
              handleLiveSearch(e.target.value, searchAuthor);
            }}
            placeholder="Search by title..."
            className="flex-grow p-2 rounded-lg bg-[#2a2727] text-white focus:outline-none"
          />
          <input
            type="text"
            value={searchAuthor}
            onChange={(e) => {
              setSearchAuthor(e.target.value);
              handleLiveSearch(searchTitle, e.target.value);
            }}
            placeholder="Search by author..."
            className="flex-grow p-2 rounded-lg bg-[#2a2727] text-white focus:outline-none"
          />
        </div>

        <div className="bg-[#2a2727] p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Add Book</h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              className="p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none min-h-[80px]"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newBook.image}
              onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
              className="p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none"
            />
            <select
              value={newBook.genre_id}
              onChange={(e) => setNewBook({ ...newBook, genre_id: e.target.value })}
              className="p-2 rounded-lg bg-[#3a3636] text-white"
            >
              <option value="">Select genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.genre}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddBook}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {books.length === 0 ? (
            <p className="text-gray-400">No results found.</p>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col sm:flex-row justify-between items-center bg-[#2a2727] p-3 rounded-lg gap-2"
              >
                {editId === book.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white"
                    />
                    <input
                      type="text"
                      value={editData.author}
                      onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                      className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white min-h-[60px]"
                    />
                    <input
                      type="text"
                      value={editData.image}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white"
                    />
                    <select
                      value={editData.genre_id}
                      onChange={(e) => setEditData({ ...editData, genre_id: e.target.value })}
                      className="p-2 rounded-lg bg-[#3a3636] text-white"
                    >
                      <option value="">Select genre</option>
                      {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.genre}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdate(book.id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="font-semibold">{book.title}</span>
                      <span className="text-gray-400 text-sm">
                        {book.author} — {book.genre}
                      </span>
                      <span className="text-gray-400 text-sm">{book.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(book)}
                        className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookManagmentPage;
