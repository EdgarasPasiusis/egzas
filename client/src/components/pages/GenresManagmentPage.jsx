import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const GenresManagmentPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/genres`);
      setCategories(res.data.tours);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_URL}/genres`, { genre: newCategory }, { withCredentials: true });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add genre.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/genres/${id}`, { withCredentials: true });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete genre.");
    }
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;
    try {
      await axios.put(`${API_URL}/genres/${id}`, { genre: editValue }, { withCredentials: true });
      setEditId(null);
      setEditValue("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update genre.");
    }
  };

  return (
    <div className="min-h-screen bg-[#242121] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Genres</h1>

        {error && (
          <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new genre..."
            className="flex-grow p-2 rounded-lg bg-[#2a2727] text-white focus:outline-none"
          />
          <button
            onClick={handleAddCategory}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-[#2a2727] p-3 rounded-lg"
            >
              {editId === cat.id ? (
                <div className="flex gap-2 flex-grow">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{cat.genre}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditId(cat.id);
                        setEditValue(cat.genre);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-lg cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenresManagmentPage;
