import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import useAuthStore from "../store/authStore";
import { showSuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";
import useNotificationStore from "../store/notificationStore";
import logo from "../assets/logo.png";

const AdminNavbarWave = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 640 80"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-y-0 right-0 h-full w-[52%] overflow-visible sm:w-1/2 lg:w-[46%] xl:w-1/2"
  >
    <defs>
      <linearGradient id="adminNavWaveFront" x1="0" y1="0" x2="1" y2="0">
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
      fill="url(#adminNavWaveFront)"
      opacity="0.55"
    />
    <path
      className="nav-wave-c"
      d="M104 0 C 74 24, 130 54, 86 80 L 700 80 L 700 0 Z"
      fill="url(#adminNavWaveFront)"
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

const formatNotificationTime = (date) => {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 1000));

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, unreadCount, fetchNotifications, markAllRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications().catch(() => {});
    const intervalId = window.setInterval(() => {
      fetchNotifications().catch(() => {});
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleNotificationsClick = () => {
    setNotificationsOpen((isOpen) => !isOpen);
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  const handleLogout = async () => {
    await logout();
    showSuccess("Logout successful");
    navigate("/login");
  };

  return (
    <div className="admin-shell min-h-screen">
      <header className="admin-topbar site-navbar sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl transition-shadow duration-300 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="relative w-full overflow-hidden">
          <AdminNavbarWave />
          <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
            <Link
              to="/"
              aria-label="E-Shop home"
              className="admin-brand-mark flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-primary transition-opacity hover:opacity-80 sm:text-2xl"
            >
              <img src={logo} alt="" className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
              <span>E-Shop</span>
            </Link>

            <div className="admin-topbar-actions site-navbar-actions flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen((isOpen) => !isOpen)}
                className="nav-icon-btn grid h-10 w-10 place-items-center rounded-full md:hidden"
              >
                {sidebarOpen ? "✕" : "☰"}
              </button>
              <ThemeToggle />

              <div className="admin-notification-wrap">
                <button
                  type="button"
                  className="admin-icon-button nav-icon-btn grid h-10 w-10 place-items-center rounded-full"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  onClick={handleNotificationsClick}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                  </svg>
                  {unreadCount > 0 && <span className="notification-dot" />}
                  {unreadCount > 0 && (
                    <span className="notification-count">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="admin-notification-panel">
                    <div className="admin-notification-heading">
                      <strong>Notifications</strong>
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        disabled={!unreadCount}
                      >
                        Mark all read
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="admin-notification-empty">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`admin-notification-item ${!notification.readAt ? "is-unread" : ""}`}
                        >
                          <span
                            className={`admin-notification-icon ${notification.type}`}
                          >
                            {notification.type === "order_created" ? "#" : "U"}
                          </span>
                          <span>
                            <strong>{notification.title}</strong>
                            <small>{notification.message}</small>
                            <time>
                              {formatNotificationTime(notification.createdAt)}
                            </time>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="admin-user-chip">
                <span className="admin-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
                <span className="hidden text-left sm:block">
                  <strong>{user?.name || "Admin"}</strong>
                  <small>Administrator</small>
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-logout-button nav-solid-btn rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
