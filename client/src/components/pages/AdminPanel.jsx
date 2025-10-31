import { Link } from "react-router-dom";

const AdminPanelPage = () => {
  return (
    <div className="min-h-screen bg-[#242121] text-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="bg-[#2a2727] rounded-2xl p-6 text-center shadow-lg hover:bg-[#353131] transition-colors duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-400 text-sm">Manage all users</p>
          </Link>

          <Link
            to="/admin/books"
            className="bg-[#2a2727] rounded-2xl p-6 text-center shadow-lg hover:bg-[#353131] transition-colors duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Books</h2>
            <p className="text-gray-400 text-sm">Add, edit and delete books</p>
          </Link>

          <Link
            to="/admin/genres"
            className="bg-[#2a2727] rounded-2xl p-6 text-center shadow-lg hover:bg-[#353131] transition-colors duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Genres</h2>
            <p className="text-gray-400 text-sm">Add a book genre</p>
          </Link>

                    <Link
            to="/admin/reservations"
            className="bg-[#2a2727] rounded-2xl p-6 text-center shadow-lg hover:bg-[#353131] transition-colors duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Reservations</h2>
            <p className="text-gray-400 text-sm">Manage book reservations</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
