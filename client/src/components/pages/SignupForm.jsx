import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const { setuser } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (formdata) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formdata, {
        withCredentials: true,
      });
      setuser(response.data.data);
      navigate("/");
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((err) => {
          setError(err.field, {
            type: "server",
            message: err.message,
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: error.response?.data?.message || "Signup failed",
        });
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
            Create a new account
          </h2>
        </div>

        {errors.root && (
          <div className="bg-red-50 border-l-4 border-red-700 p-4 mb-4">
            <p className="text-sm text-red-700">{errors.root.message}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="input-field mt-1 placeholder:text-gray-600 rounded-md shadow-sm w-full text-white"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
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
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  validate: {
                    hasNumber: (v) =>
                      /\d/.test(v) ||
                      "Password must contain at least one number",
                    hasSpecial: (v) =>
                      /[^A-Za-z0-9]/.test(v) ||
                      "Password must contain at least one special character",
                  },
                })}
                className="input-field mt-1 placeholder:text-gray-600 rounded-md shadow-sm w-full text-white"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="passwordconfirm"
                className="block text-sm font-medium text-gray-400"
              >
                Confirm password
              </label>
              <input
                id="passwordconfirm"
                type="password"
                {...register("passwordconfirm", {
                  required: "Password confirmation is required",
                  validate: (value) =>
                    value === password ||
                    "Password and confirmation do not match",
                })}
                className="input-field mt-1 placeholder:text-gray-600 rounded-md shadow-sm w-full text-white"
                placeholder="Confirm password"
              />
              {errors.passwordconfirm && (
                <p className="text-red-500 text-sm">
                  {errors.passwordconfirm.message}
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
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/80 text-gray-400"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
