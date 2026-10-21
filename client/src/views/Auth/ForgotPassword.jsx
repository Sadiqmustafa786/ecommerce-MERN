import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/auth.service";
import { showError, showSuccess } from "../../utils/toast";
import ThemeToggle from "../../components/common/ThemeToggle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      showSuccess("If an account exists, a reset link has been sent");
    } catch (error) {
      showError(error?.response?.data?.message || "Unable to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-8">
        <h1 className="text-center text-2xl font-bold sm:text-3xl">Forgot Password</h1>
        <p className="mt-2 text-center text-gray-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-lg bg-secondary/10 p-4 text-center text-primary">
            Check your inbox for the password reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="reset-email" className="mb-2 block font-medium">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-white hover:bg-primary disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center">
          <Link to="/login" className="text-primary">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
