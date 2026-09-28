import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import useAuthStore from "../../store/authStore";
import { showSuccess } from "../../utils/toast";
import useCartStore from "../../store/cartStore";
import ThemeToggle from "../common/ThemeToggle";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, token, logout } = useAuthStore();

  const { cart, getCart } = useCartStore();

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token, getCart]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const countCart =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = async () => {
    await logout();

    showSuccess("Logout successful");

    navigate("/login");
  };

  const handleCategoriesClick = (event) => {
    setOpenMenu(false);

    if (location.pathname !== "/") return;

    event.preventDefault();
    document.getElementById("categories")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav
      className={`site-navbar sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg"
          : "bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm"
      }`}
    >
      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#525EA7] transition-opacity hover:opacity-80"
        >
          <img src={logo} alt="E-Shop" className="h-12 w-12 object-contain" />
          <span className="hidden sm:inline">E-Shop</span>
        </Link>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:text-[#525EA7]"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:text-[#525EA7]"
          >
            Products
          </Link>

          <Link
            to="/wishlist"
            className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:text-[#525EA7]"
          >
            ❤️ Wishlist
          </Link>

          <Link
            to="/#categories"
            onClick={handleCategoriesClick}
            className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:text-[#525EA7]"
          >
            Categories
          </Link>
        </div>

        {/* Right Side Actions */}

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          {/* Cart Icon */}

          <Link
            to="/cart"
            className="relative p-2 text-slate-700 hover:bg-blue-100 rounded-lg transition-all duration-200"
          >
            <span className="text-2xl">🛒</span>

            {countCart > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-[#525EA7] to-[#5FACD3] rounded-full shadow-md">
                {countCart}
              </span>
            )}
          </Link>

          {/* User Menu */}

          {token ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800">
                  {user?.name?.split(" ")[0]}
                </span>
                <span className="text-xs text-slate-500">Customer</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#525EA7] to-[#5FACD3] rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#525EA7] hover:bg-blue-100 rounded-lg transition-all duration-200"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#525EA7] to-[#5FACD3] rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
              >
                Signup
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 text-2xl text-slate-700 hover:bg-blue-100 rounded-lg transition-all"
          >
            {openMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      {openMenu && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 px-4 py-4">
            <Link
              to="/"
              onClick={() => setOpenMenu(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-100 hover:text-[#525EA7] transition-all"
            >
              🏠 Home
            </Link>

            <Link
              to="/products"
              onClick={() => setOpenMenu(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-100 hover:text-[#525EA7] transition-all"
            >
              🛍️ Products
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setOpenMenu(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-100 hover:text-[#525EA7] transition-all"
            >
              ❤️ Wishlist
            </Link>

            <Link
              to="/#categories"
              onClick={handleCategoriesClick}
              className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-100 hover:text-[#525EA7] transition-all"
            >
              📂 Categories
            </Link>

            <Link
              to="/cart"
              onClick={() => setOpenMenu(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-100 hover:text-[#525EA7] transition-all flex items-center gap-2"
            >
              🛒 Cart
              {countCart > 0 && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-[#525EA7] to-[#5FACD3] rounded-full">
                  {countCart}
                </span>
              )}
            </Link>

            <div className="border-t border-slate-200 my-2"></div>

            {token ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Welcome, {user?.name}!
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer Account
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setOpenMenu(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#525EA7] to-[#5FACD3] rounded-lg hover:shadow-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpenMenu(false)}
                  className="px-4 py-2 text-sm font-medium text-[#525EA7] text-center rounded-lg hover:bg-blue-100 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setOpenMenu(false)}
                  className="px-4 py-2 text-sm font-medium text-white text-center bg-gradient-to-r from-[#525EA7] to-[#5FACD3] rounded-lg hover:shadow-lg transition-all"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
