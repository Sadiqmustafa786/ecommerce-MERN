import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "▦",
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: "◇",
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: "□",
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: "◌",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: "♙",
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 md:hidden"
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="flex items-center justify-between md:block">
          <div className="admin-sidebar-label">Workspace</div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="mb-3 rounded-lg p-2 text-xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 md:hidden"
          >
            ✕
          </button>
        </div>
      <nav>
        <ul className="admin-nav-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "is-active" : ""}`
                }
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-support-card">
        <span className="admin-support-icon">?</span>
        <strong>Need a hand?</strong>
        <p>Review your store activity and keep orders moving.</p>
        <NavLink to="/" className="admin-support-link">View storefront</NavLink>
      </div>

      <p className="admin-sidebar-footer">ShopHub Admin<br />Store operations center</p>
      </aside>
    </>
  );
};

export default Sidebar;
