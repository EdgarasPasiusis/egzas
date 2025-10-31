import { Routes, Route } from "react-router";
import Nav from "./components/Nav";
import LoginForm from "./components/pages/Loginform";
import SignupForm from "./components/pages/SignupForm";
import HomePage from "./components/pages/HomePage";
import { UserContextProvider } from "./contexts/UserContext";
import BookDetail from "./components/pages/BookDetail";
import ReservationsPage from "./components/pages/ReservationsPage";

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
          </Routes>
        </main>
      </div>
    </UserContextProvider>
  );
}

export default App;
