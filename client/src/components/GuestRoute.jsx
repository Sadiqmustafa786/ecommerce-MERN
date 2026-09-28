import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const GuestRoute = ({ children }) => {
  const { token, user } = useAuthStore();

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
