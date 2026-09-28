import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import AdminDashboard from "../views/Admin/AdminDashboard";

import Login from "../views/Auth/Login";
import Signup from "../views/Auth/Signup";
import ForgotPassword from "../views/Auth/ForgotPassword";
import ResetPassword from "../views/Auth/ResetPassword";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import AdminRoute from "../components/routes/AdminRoute";
import GuestRoute from "../components/GuestRoute";
import Home from "../views/Home/Home";
import CategoryList from "../views/admin/category/CategoryList";
import ProductList from "../views/admin/product/ProductList";
import OrderList from "../views/admin/order/OrderList";
import UserList from "../views/admin/user/UserList";
import Cart from "../views/Home/Cart";
import Checkout from "../views/Home/Checkout";
import Orders from "../views/Home/Orders";
import OrderDetails from "../views/Home/OrderDetails";
import Products from "../views/Products/Products";
import ProductDetail from "../views/Products/ProductDetail";
import Wishlist from "../views/Products/Wishlist";
import PaymentSuccess from "../views/Home/PaymentSuccess";
import PaymentCancelled from "../views/Home/PaymentCancelled";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* Admin Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/users" element={<UserList />} />
            </Route>
          </Route>
        </Route>

        {/* Guest Routes */}

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
