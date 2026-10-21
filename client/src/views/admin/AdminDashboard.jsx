import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import useCategoryStore from "../../store/categoryStore";
import useOrderStore from "../../store/orderStore";
import useProductStore from "../../store/productStore";
import useUserStore from "../../store/userStore";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(date),
  );

const getStatusLabel = (status) => status?.replace(/^./, (letter) => letter.toUpperCase()) || "Pending";

const AdminDashboard = () => {
  const { products, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { orders, getAdminOrders, loading: ordersLoading } = useOrderStore();
  const { users, getUsers } = useUserStore();
  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardTime] = useState(() => Date.now());

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([getProducts(), getCategories(), getAdminOrders(), getUsers()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    void Promise.allSettled([getProducts(), getCategories(), getAdminOrders(), getUsers()]);
  }, [getCategories, getAdminOrders, getProducts, getUsers]);

  const stats = useMemo(() => {
    const monthAgo = dashboardTime - 30 * 24 * 60 * 60 * 1000;
    const activeOrders = orders.filter((order) => order.status !== "cancelled");
    return {
      revenue: activeOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0),
      shipped: orders.filter((order) => order.status === "shipped").length,
      pending: orders.filter((order) => order.status === "pending").length,
      recent: orders.filter((order) => new Date(order.createdAt).getTime() >= monthAgo).length,
    };
  }, [dashboardTime, orders]);

  const recentOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...orders]
      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
      .filter((order) => {
        const searchable = `${order._id} ${order.shippingAddress?.fullName || ""} ${order.status}`.toLowerCase();
        return searchable.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [orders, query]);

  const chartPoints = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return date;
    });
    const counts = days.map((day) => orders.filter((order) => {
      const created = new Date(order.createdAt);
      return created.toDateString() === day.toDateString();
    }).length);
    const maximum = Math.max(...counts, 1);
    return counts.map((count, index) => `${index * 16.66},${116 - (count / maximum) * 82}`).join(" ");
  }, [orders]);

  const activity = useMemo(() => recentOrders.slice(0, 4).map((order, index) => ({
    title: `${getStatusLabel(order.status)} order #${order.orderNumber ?? (order._id?.slice(-6) || "------")}`,
    detail: `${order.shippingAddress?.fullName || "Customer"} · ${formatCurrency(order.totalAmount || 0)}`,
    time: order.createdAt ? formatDate(order.createdAt) : "Today",
    tone: index === 0 ? "blue" : index === 1 ? "orange" : index === 2 ? "green" : "gray",
  })), [recentOrders]);

  if (ordersLoading && !orders.length && !products.length) {
    return <Loader />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Store overview</p>
          <h1>Good morning, Admin</h1>
          <p className="admin-page-subtitle">Here&apos;s what&apos;s happening across your store today.</p>
        </div>
        <button type="button" onClick={refreshDashboard} className="admin-refresh-button" disabled={isRefreshing}>
          <span className={isRefreshing ? "refresh-spin" : ""}>↻</span>
          {isRefreshing ? "Refreshing" : "Refresh data"}
        </button>
      </div>

      <section className="admin-stat-grid">
        <article className="admin-stat-card stat-blue"><span className="stat-label">Total revenue</span><strong>{formatCurrency(stats.revenue)}</strong><small>Across all active orders</small><span className="stat-art">↗</span></article>
        <article className="admin-stat-card stat-pink"><span className="stat-label">Shipped orders</span><strong>{String(stats.shipped).padStart(2, "0")}</strong><small>Orders on their way</small><span className="stat-art">→</span></article>
        <article className="admin-stat-card stat-purple"><span className="stat-label">Pending orders</span><strong>{String(stats.pending).padStart(2, "0")}</strong><small>Need your attention</small><span className="stat-art">◷</span></article>
        <article className="admin-stat-card stat-teal"><span className="stat-label">New this month</span><strong>{String(stats.recent).padStart(2, "0")}</strong><small>{products.length} products · {users.length} customers</small><span className="stat-art">✦</span></article>
      </section>

      <section className="admin-content-grid">
        <div className="admin-primary-column">
          <div className="admin-panel admin-activity-panel">
            <div className="admin-panel-heading"><div><p className="admin-eyebrow">Live feed</p><h2>Recent activity</h2></div><Link to="/admin/orders">View all</Link></div>
            {activity.length ? activity.map((item) => <div className="activity-row" key={`${item.title}-${item.time}`}><span className={`activity-dot ${item.tone}`} /><div><strong>{item.title}</strong><small>{item.detail}</small></div><time>{item.time}</time><span className={`activity-badge ${item.tone}`}>{item.tone === "blue" ? "Latest" : getStatusLabel(item.tone)}</span></div>) : <p className="admin-empty-state">No orders have been recorded yet.</p>}
          </div>

          <div className="admin-panel admin-orders-panel">
            <div className="admin-panel-heading"><div><p className="admin-eyebrow">Order desk</p><h2>Latest orders</h2></div><Link to="/admin/orders">Manage orders</Link></div>
            <div className="admin-search-row"><label htmlFor="order-search">Search orders</label><input id="order-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order ID, customer or status" /></div>
            <div className="admin-order-list">{recentOrders.length ? recentOrders.map((order) => <Link to="/admin/orders" className="admin-order-row" key={order._id}><span className="order-avatar">{order.shippingAddress?.fullName?.charAt(0)?.toUpperCase() || "C"}</span><span><strong>#{order.orderNumber ?? order._id?.slice(-8)}</strong><small>{order.shippingAddress?.fullName || "Customer"}</small></span><strong>{formatCurrency(order.totalAmount || 0)}</strong><span className={`order-status ${order.status}`}>{getStatusLabel(order.status)}</span></Link>) : <p className="admin-empty-state">No matching orders found.</p>}</div>
          </div>
        </div>

        <aside className="admin-side-column">
          <div className="admin-panel admin-chart-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Last 7 days</p><h2>Order trends</h2></div><span className="chart-legend"><i /> Orders</span></div><div className="chart-total">{orders.length}<small>total orders</small></div><svg className="trend-chart" viewBox="0 0 100 130" preserveAspectRatio="none" role="img" aria-label="Order trend chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#24B1B1" stopOpacity=".26" /><stop offset="1" stopColor="#24B1B1" stopOpacity="0" /></linearGradient></defs><path className="chart-area" d={`M 0,130 L ${chartPoints} L 100,130 Z`} /><polyline className="chart-line" points={chartPoints} /></svg></div>
          <div className="admin-panel admin-quick-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Catalog health</p><h2>Quick overview</h2></div></div><Link to="/admin/products" className="quick-stat"><span className="quick-icon blue">□</span><span><strong>{products.length} Products</strong><small>Manage inventory</small></span><b>→</b></Link><Link to="/admin/categories" className="quick-stat"><span className="quick-icon purple">◇</span><span><strong>{categories.length} Categories</strong><small>Organize your catalog</small></span><b>→</b></Link><Link to="/admin/users" className="quick-stat"><span className="quick-icon orange">♙</span><span><strong>{users.length} Customers</strong><small>View customer base</small></span><b>→</b></Link></div>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboard;
