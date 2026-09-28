import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/auth.service";
import { showError, showSuccess } from "../../utils/toast";
import ThemeToggle from "../../components/common/ThemeToggle";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      showError("Reset link is invalid or expired");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      showSuccess("Password reset successful");
      navigate("/login");
    } catch (error) {
      showError(error?.response?.data?.message || "Unable to reset password");
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
        <h1 className="text-center text-2xl font-bold sm:text-3xl">Reset Password</h1>
        <p className="mt-2 text-center text-gray-500">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="new-password" className="mb-2 block font-medium">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block font-medium">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-lg bg-primary py-3 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/login" className="text-primary">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
