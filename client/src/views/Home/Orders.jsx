import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import Loader from "../../components/common/Loader";
import { showError } from "../../utils/toast";

const Orders = () => {
  const navigate = useNavigate();

  const { orders, getMyOrders, loading } = useOrderStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getMyOrders();
      } catch (error) {
        showError(error?.response?.data?.message || "Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [getMyOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">My Orders</h1>

          <p className="mt-1 text-gray-500">View and manage your orders</p>
        </div>

        {/* No Orders */}

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="mb-4 text-5xl">📦</div>

            <h2 className="text-xl font-bold text-gray-800">No Orders Found</h2>

            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-6 w-full max-w-xs rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Orders */

          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  {/* Order Info */}

                  <div>
                    <h2 className="font-semibold text-gray-800">
                      Order #{order.orderNumber ?? order._id.slice(-6).toUpperCase()}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-sm text-gray-500">Status:</span>

                    <span className="px-3 py-1 text-sm font-medium text-primary-700 bg-secondary-100 rounded-full">
                      {order.status}
                    </span>
                  </div>

                  {/* Payment */}

                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">Payment</span>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </span>

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.paymentStatus === "paid"
                            ? "text-green-700 bg-green-100"
                            : order.paymentStatus === "failed"
                              ? "text-red-700 bg-red-100"
                              : "text-yellow-700 bg-yellow-100"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Total */}

                  <div>
                    <p className="text-sm text-gray-500">Total</p>

                    <p className="text-lg font-bold text-gray-800">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  {/* View Details */}

                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-primary-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
