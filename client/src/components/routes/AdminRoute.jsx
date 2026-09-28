import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AdminRoute = () => {
  const { user } = useAuthStore();

  // Extra Safety Check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check Admin Role
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
