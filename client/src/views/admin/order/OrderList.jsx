import React, { useEffect } from "react";
import useOrderStore from "../../../store/orderStore";
import Loader from "../../../components/common/Loader";
import { showError, showSuccess } from "../../../utils/toast";

const OrderList = () => {
  const {
    orders,
    getAdminOrders,
    loading,
    updateOrderStatus,
    updatePaymentStatus,
  } = useOrderStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getAdminOrders();
      } catch (error) {
        showError(error?.response?.data?.message || "Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [getAdminOrders]);

  const handlePaymentStatusChange = async (id, paymentStatus) => {
    try {
      await updatePaymentStatus(id, paymentStatus);

      showSuccess("Payment status updated successfully");
    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to update payment status",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);

      showSuccess("Order status updated successfully");
    } catch (error) {
      showError(
        error?.response?.data?.message || "Failed to update order status",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Order Management</h1>

        <p className="mt-1 text-gray-500">Manage customer orders</p>
      </div>

      {/* Orders Table */}

      <div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[72rem]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>

              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Shipping Address</th>

              <th className="px-6 py-4 text-left">Items</th>

              <th className="px-6 py-4 text-left">Total</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Payment</th>

              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-gray-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  {/* # */}

                  <td className="px-6 py-4">{index + 1}</td>

                  {/* Customer */}

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {order.user?.name || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.user?.email || ""}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="min-w-[220px]">
                      <p className="font-medium text-gray-800">
                        {order.shippingAddress?.fullName || "N/A"}
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.phone || "N/A"}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {order.shippingAddress?.address || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.shippingAddress?.city || "N/A"}
                        {order.shippingAddress?.postalCode
                          ? ` - ${order.shippingAddress.postalCode}`
                          : ""}
                      </p>
                    </div>
                  </td>

                  {/* Items */}

                  <td className="px-6 py-4">{order.items?.length || 0}</td>

                  {/* Total */}

                  <td className="px-6 py-4 font-semibold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>

                      <option value="confirmed">Confirmed</option>

                      <option value="processing">Processing</option>

                      <option value="shipped">Shipped</option>

                      <option value="delivered">Delivered</option>

                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <div className="min-w-[150px]">
                      <p className="font-medium text-gray-800">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(order._id, e.target.value)
                        }
                        className="mt-2 rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </td>

                  {/* Date */}

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {orders.length === 0 ? (
          <div className="rounded-lg bg-white px-4 py-10 text-center text-gray-500 shadow">
            No Orders Found
          </div>
        ) : (
          orders.map((order, index) => (
            <article
              key={order._id}
              className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Order #{order.orderNumber ?? index + 1}
                  </p>
                  <h2 className="mt-1 truncate font-semibold text-slate-800">
                    {order.user?.name || "Unknown customer"}
                  </h2>
                  <p className="truncate text-sm text-slate-500">{order.user?.email || ""}</p>
                </div>
                <p className="shrink-0 font-semibold text-slate-800">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
              </div>

              <div className="grid gap-3 py-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-medium text-slate-700">Shipping address</p>
                  <p className="mt-1 text-slate-500">{order.shippingAddress?.fullName || "N/A"}</p>
                  <p className="text-slate-500">{order.shippingAddress?.phone || "N/A"}</p>
                  <p className="text-slate-500">{order.shippingAddress?.address || "N/A"}</p>
                  <p className="text-slate-500">
                    {order.shippingAddress?.city || "N/A"}
                    {order.shippingAddress?.postalCode
                      ? ` - ${order.shippingAddress.postalCode}`
                      : ""}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:block sm:space-y-2">
                  <div>
                    <p className="font-medium text-slate-700">Items</p>
                    <p className="text-slate-500">{order.items?.length || 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Date</p>
                    <p className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Order status
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Payment ({order.paymentMethod === "cod" ? "COD" : "Online"})
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </label>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
