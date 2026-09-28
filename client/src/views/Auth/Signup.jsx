import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import { showSuccess, showError } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import ThemeToggle from "../../components/common/ThemeToggle";

const Signup = () => {
  const navigate = useNavigate();

  const { signup, googleLogin } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // Input Change Handle

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      const result = await googleLogin(response.credential);
      showSuccess(result?.message || "Google signup successful");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      showError(error?.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSuccess,
    });

    const googleButton = document.getElementById("google-signup-button");

    if (googleButton) {
      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
      });
    }
  }, []);

  // Form Submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await signup(formData);

      showSuccess("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      showError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex items-center justify-center min-h-screen bg-gray-100">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-center sm:text-3xl">Create Account</h1>

        {error && (
          <p className="p-3 mb-4 text-red-600 bg-red-100 rounded">{error}</p>
        )}

        {success && (
          <p className="p-3 mb-4 text-green-600 bg-green-100 rounded">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-primary rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
          >
            {loading ? <Loader variant="button" /> : "Signup"}
          </button>
        </form>

        <div className="mt-5">
          <div id="google-signup-button" className="flex justify-center" />
        </div>

        <p className="mt-6 text-center">
          Already have an account?
          <Link to="/login" className="ml-2 font-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
