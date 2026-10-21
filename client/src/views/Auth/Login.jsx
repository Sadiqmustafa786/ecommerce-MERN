import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import ThemeToggle from "../../components/common/ThemeToggle";

const Login = () => {
  const { login, googleLogin } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

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
      showSuccess(result?.message || "Google login successful");

      if (result?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      showError(error?.response?.data?.message || "Google login failed");
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

    const googleButton = document.getElementById("google-login-button");

    if (googleButton) {
      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await login(formData);
      showSuccess("login successfully");

      if (response?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
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
        <h1 className="mb-6 text-2xl font-bold text-center sm:text-3xl">Welcome Back</h1>

        {error && (
          <p className="p-3 mb-4 text-primary bg-secondary/10 rounded">{error}</p>
        )}

        {success && (
          <p className="p-3 mb-4 text-primary bg-secondary/10 rounded">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <div className="mb-6 -mt-3 text-right">
            <Link to="/forgot-password" className="text-sm text-primary">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-primary rounded-lg hover:bg-primary"
          >
            {loading ? <Loader variant="button" /> : "Login"}
          </button>
        </form>

        <div className="mt-5">
          <div id="google-login-button" className="flex justify-center" />
        </div>

        <p className="mt-6 text-center">
          Don't have an account?
          <Link to="/signup" className="ml-2 text-primary">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
