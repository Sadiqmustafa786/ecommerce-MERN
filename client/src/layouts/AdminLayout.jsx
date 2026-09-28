import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import useAuthStore from "../store/authStore";
import { showSuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";
import useNotificationStore from "../store/notificationStore";
import logo from "../assets/logo.png";

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
      <header className="admin-topbar">
        <div className="admin-brand-mark">
          <img src={logo} alt="E-Shop" className="h-12 w-12 object-contain" />
          <span>E-Shop</span>
        </div>

        <div className="admin-topbar-actions">
          <button
            type="button"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((isOpen) => !isOpen)}
            className="rounded-lg p-2 text-xl leading-none text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <ThemeToggle />

          <div className="admin-notification-wrap">
            <button
              type="button"
              className="admin-icon-button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={handleNotificationsClick}
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
            </svg>
              {unreadCount > 0 && <span className="notification-dot" />}
              {unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
            </button>
            {notificationsOpen && (
              <div className="admin-notification-panel">
                <div className="admin-notification-heading">
                  <strong>Notifications</strong>
                  <button type="button" onClick={handleMarkAllRead} disabled={!unreadCount}>
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="admin-notification-empty">No notifications yet</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`admin-notification-item ${!notification.readAt ? "is-unread" : ""}`}
                    >
                      <span className={`admin-notification-icon ${notification.type}`}>
                        {notification.type === "order_created" ? "#" : "U"}
                      </span>
                      <span>
                        <strong>{notification.title}</strong>
                        <small>{notification.message}</small>
                        <time>{formatNotificationTime(notification.createdAt)}</time>
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="admin-user-chip">
            <span className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            <span className="hidden text-left sm:block">
              <strong>{user?.name || "Admin"}</strong>
              <small>Administrator</small>
            </span>
          </div>
          <button type="button" onClick={handleLogout} className="admin-logout-button">
            Logout
          </button>
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
