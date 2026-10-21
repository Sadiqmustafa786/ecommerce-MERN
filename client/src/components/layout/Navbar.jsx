import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../style/navbar-additions.css";

import useAuthStore from "../../store/authStore";
import { showSuccess } from "../../utils/toast";
import useCartStore from "../../store/cartStore";
import ThemeToggle from "../common/ThemeToggle";
import logo from "../../assets/logo.png";

/* Decorative right-half wave edge. Purely visual: no logic, no pointer events. */
const NavbarWave = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 640 80"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-y-0 right-0 h-full w-[52%] overflow-visible sm:w-1/2 lg:w-[46%] xl:w-1/2"
  >
    <defs>
      <linearGradient id="navWaveFront" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#24B1B1" />
        <stop offset="0.5" stopColor="#007979" />
        <stop offset="1" stopColor="#007979" />
      </linearGradient>
    </defs>
    <path
      className="nav-wave-a nav-wave-back"
      d="M40 0 C 10 24, 66 54, 22 80 L 700 80 L 700 0 Z"
      fill="#BFE9E9"
    />
    <path
      className="nav-wave-b"
      d="M72 0 C 42 24, 98 54, 54 80 L 700 80 L 700 0 Z"
      fill="url(#navWaveFront)"
      opacity="0.55"
    />
    <path
      className="nav-wave-c"
      d="M104 0 C 74 24, 130 54, 86 80 L 700 80 L 700 0 Z"
      fill="url(#navWaveFront)"
    />
    <path
      className="nav-wave-c"
      d="M114 0 C 84 24, 140 54, 96 80"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.65"
      strokeWidth="1.5"
    />
    <circle cx="132" cy="16" r="3" fill="#ffffff" fillOpacity="0.65" />
    <circle cx="124" cy="42" r="2.5" fill="#ffffff" fillOpacity="0.55" />
    <circle cx="146" cy="66" r="2" fill="#ffffff" fillOpacity="0.65" />
  </svg>
);

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

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  // Underline-style links for the white half of the navbar
  const desktopLinkBase =
    "relative px-1 py-2 text-sm font-semibold transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-secondary after:transition-transform after:duration-300 after:content-[''] hover:text-primary hover:after:scale-x-100";

  const desktopLinkClass = (path) =>
    `${desktopLinkBase} ${
      isActive(path)
        ? "text-primary after:scale-x-100"
        : "text-slate-600 dark:text-slate-300"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
      isActive(path)
        ? "bg-secondary/10 text-primary"
        : "text-slate-700 hover:bg-secondary/10 hover:text-primary dark:text-slate-200"
    }`;

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
      aria-label="Main navigation"
      className={`site-navbar sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl transition-shadow duration-300 dark:border-slate-800 dark:bg-slate-950/95 ${
        scrolled ? "shadow-md shadow-slate-900/5" : "shadow-sm"
      }`}
    >
      {/* The wave lives inside this wrapper so it never stretches over the mobile menu */}
      <div className="relative overflow-hidden">
        <NavbarWave />

        <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 xl:gap-10">
            <Link
              to="/"
              aria-label="E-Shop home"
              className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-primary transition-opacity hover:opacity-80 sm:text-2xl"
            >
              <img src={logo} alt="" className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
              <span>E-Shop</span>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              <Link
                to="/"
                aria-current={isActive("/") ? "page" : undefined}
                className={desktopLinkClass("/")}
              >
                Home
              </Link>
              <Link
                to="/products"
                aria-current={isActive("/products") ? "page" : undefined}
                className={desktopLinkClass("/products")}
              >
                Products
              </Link>
              <Link
                to="/wishlist"
                aria-current={isActive("/wishlist") ? "page" : undefined}
                className={desktopLinkClass("/wishlist")}
              >
                Wishlist
              </Link>
              <Link
                to="/#categories"
                onClick={handleCategoriesClick}
                className={`${desktopLinkBase} text-slate-600 dark:text-slate-300`}
              >
                Categories
              </Link>
            </div>
          </div>

          <div className="site-navbar-actions flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              aria-label={`Shopping cart${countCart > 0 ? `, ${countCart} items` : ""}`}
              to="/cart"
              className="nav-icon-btn relative grid h-10 w-10 place-items-center rounded-full"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {countCart > 0 && (
                <span className="nav-cart-badge absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold">
                  {countCart}
                </span>
              )}
            </Link>

            {token ? (
              <div className="hidden items-center gap-3 lg:flex">
                <div className="hidden flex-col items-end lg:flex">
                  <span className="max-w-32 truncate text-sm font-semibold text-white">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span className="text-xs text-white/80">Customer</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="nav-solid-btn rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/login"
                  className="nav-ghost-link rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="nav-solid-btn rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpenMenu((isOpen) => !isOpen)}
              aria-expanded={openMenu}
              aria-controls="mobile-navigation"
              aria-label={openMenu ? "Close navigation menu" : "Open navigation menu"}
              className="nav-icon-btn grid h-10 w-10 place-items-center rounded-full lg:hidden"
            >
              {openMenu ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {openMenu && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200/80 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 lg:hidden sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              to="/"
              aria-current={isActive("/") ? "page" : undefined}
              onClick={() => setOpenMenu(false)}
              className={mobileLinkClass("/")}
            >
              Home
            </Link>
            <Link
              to="/products"
              aria-current={isActive("/products") ? "page" : undefined}
              onClick={() => setOpenMenu(false)}
              className={mobileLinkClass("/products")}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              aria-current={isActive("/wishlist") ? "page" : undefined}
              onClick={() => setOpenMenu(false)}
              className={mobileLinkClass("/wishlist")}
            >
              Wishlist
            </Link>
            <Link
              to="/#categories"
              onClick={handleCategoriesClick}
              className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-secondary/10 hover:text-primary dark:text-slate-200"
            >
              Categories
            </Link>
            <Link
              to="/cart"
              aria-current={isActive("/cart") ? "page" : undefined}
              onClick={() => setOpenMenu(false)}
              className={mobileLinkClass("/cart")}
            >
              Cart
              {countCart > 0 && (
                <span className="ml-auto rounded-full bg-[#007979] px-2 py-0.5 text-xs font-bold text-white">
                  {countCart}
                </span>
              )}
            </Link>

            <div className="my-3 border-t border-slate-200 dark:border-slate-800" />

            {token ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Welcome, {user?.name}!
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Customer Account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpenMenu(false);
                  }}
                  className="mt-1 rounded-xl bg-[#007979] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpenMenu(false)}
                  className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:bg-secondary/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpenMenu(false)}
                  className="rounded-xl bg-[#007979] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-secondary"
                >
                  Sign up
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