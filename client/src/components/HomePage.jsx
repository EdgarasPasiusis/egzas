import BooksGrid from "./BooksGird";

const API_URL = import.meta.env.VITE_API_URL;

const MainPage = () => {
  return (
    <div className="min-h-screen bg-[#242121] text-white p-6">
      <div className="text-center mb-10 pb-4">
        <h1 className="text-3xl font-bold text-cyan-400">All Books</h1>
      </div>
      <BooksGrid />
    </div>
  );
};

export default MainPage;
