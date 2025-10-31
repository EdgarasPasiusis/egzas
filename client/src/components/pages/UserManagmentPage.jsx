import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const UserManagmentPage = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) return;
    try {
      await axios.post(`${API_URL}/users`, newUser, { withCredentials: true });
      setNewUser({ email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const startEdit = (user) => {
    setEditId(user.id);
    setEditData({ email: user.email, password: "", role: user.role });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/users/${id}`, editData, {
        withCredentials: true,
      });
      setEditId(null);
      setEditData({ email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const liveSearch = async (email) => {
    try {
      if (!email.trim()) {
        fetchUsers();
        return;
      }
      const res = await axios.get(`${API_URL}/users/search?email=${email}`, {
        withCredentials: true,
      });
      setUsers(res.data.rows || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Live search failed.");
    }
  };

  const handleLiveSearch = useCallback(debounce(liveSearch, 300), []);

  if (loading)
    return <p className="text-center text-gray-400 mt-20">Loading users...</p>;

  return (
    <div className="min-h-screen bg-[#242121] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        {error && (
          <div className="bg-red-900/80 border border-red-600 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              handleLiveSearch(e.target.value);
            }}
            placeholder="Search by email..."
            className="flex-grow p-2 rounded-lg bg-[#2a2727] text-white focus:outline-none"
          />
        </div>

        <div className="bg-[#2a2727] p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Add User</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white focus:outline-none"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="p-2 rounded-lg bg-[#3a3636] text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-gray-400">No results found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row justify-between items-center bg-[#2a2727] p-3 rounded-lg gap-2"
              >
                {editId === user.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={editData.password}
                      onChange={(e) =>
                        setEditData({ ...editData, password: e.target.value })
                      }
                      className="flex-grow p-2 rounded-lg bg-[#3a3636] text-white"
                    />
                    <select
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value })
                      }
                      className="p-2 rounded-lg bg-[#3a3636] text-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleUpdate(user.id)}
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
                      <span className="font-semibold">{user.email}</span>
                      <span className="text-gray-400 text-sm">
                        Role: {user.role}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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

export default UserManagmentPage;
