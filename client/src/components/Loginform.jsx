import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const LoginForm = () => {
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setuser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formdata) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formdata, {
        withCredentials: true,
      });
      setuser(response.data.data);
      setGeneralError("");
      navigate("/");
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      if (apiErrors && Array.isArray(apiErrors)) {
        apiErrors.forEach((err) => {
          setError(err.field, { message: err.message });
        });
        setGeneralError("");
      } else {
        setGeneralError(error.response?.data?.message || "Login failed");
      }

      setuser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#242121] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#2a2727] p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-400">
            Login to your account
          </h2>
        </div>

        {generalError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{generalError}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400"
              >
                Email address
              </label>
              <input
                id="email"
                {...register("email", { required: "Email is required" })}
                type="email"
                autoComplete="email"
                className="input-field mt-1 placeholder:text-gray-600 rounded-md shadow-sm w-full text-white"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-800 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password", { required: "Password is required" })}
                type="password"
                autoComplete="current-password"
                className="input-field mt-1 placeholder:text-gray-600 rounded-md shadow-sm w-full text-white"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-800 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full flex justify-center py-2 px-4 text-gray-400"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/80 text-gray-400"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
