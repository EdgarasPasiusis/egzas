import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import LoginForm from "./components/pages/Loginform";
import SignupForm from "./components/pages/SignupForm";
import HomePage from "./components/pages/HomePage";
import { UserContextProvider } from "./contexts/UserContext";
import BookDetail from "./components/pages/BookDetail";
import ReservationsPage from "./components/pages/ReservationsPage";
import AdminPanelPage from "./components/pages/AdminPanel";
import UserManagmentPage from "./components/pages/UserManagmentPage";
import BookManagmentPage from "./components/pages/bookManagmentPage";
import GenresManagmentPage from "./components/pages/GenresManagmentPage";
import ReservationManagmentPage from "./components/pages/ReservationManagmentPage";

function App() {
  return (
    <UserContextProvider>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/auth/signup" element={<SignupForm />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/admin" element={<AdminPanelPage />} />
            <Route path="/admin/users" element={<UserManagmentPage />} />
            <Route path="/admin/books" element={<BookManagmentPage />} />
            <Route path="/admin/genres" element={<GenresManagmentPage />} />
            <Route path="/admin/reservations" element={<ReservationManagmentPage />} />
          </Routes>
        </main>
      </div>
    </UserContextProvider>
  );
}

export default App;
