import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import Loader from "../../components/common/Loader";
import { showError, showSuccess } from "../../utils/toast";
import Modal from "../../components/common/Modal";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { order, getOrderById, cancelOrder, loading } = useOrderStore();

  const [cancelModal, setCancelModal] = useState(false);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(order._id);

      showSuccess("Order cancelled successfully");

      setCancelModal(false);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to cancel order");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await getOrderById(id);
      } catch (error) {
        showError(error?.response?.data?.message || "Failed to fetch order");
      }
    };

    fetchOrder();
  }, [id, getOrderById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="px-6 py-3 mt-5 text-white bg-primary rounded-lg hover:bg-primary-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Order Details</h1>

            <p className="mt-1 text-gray-500">
              Order #{order.orderNumber ?? order._id.slice(-6).toUpperCase()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="w-full rounded-lg border bg-white px-5 py-2 text-center font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Side */}

          <div className="space-y-6 md:col-span-2">
            {/* Order Status */}

            <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-800 sm:text-xl">
                Order Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>

                  <p className="mt-1 font-medium text-gray-800 break-all">
                    {order.orderNumber ? `#${order.orderNumber}` : order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Order Date</p>

                  <p className="mt-1 font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Order Status</p>

                  <span className="inline-block px-3 py-1 mt-1 text-sm font-medium text-primary-700 bg-secondary-100 rounded-full">
                    {order.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>

                  <p className="mt-1 font-medium text-gray-800">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>

                  <span
                    className={`inline-block px-3 py-1 mt-1 text-sm font-medium rounded-full ${
                      order.paymentStatus === "paid"
                        ? "text-green-700 bg-green-100"
                        : order.paymentStatus === "failed"
                          ? "text-red-700 bg-red-100"
                          : "text-yellow-700 bg-yellow-100"
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ordered Products */}

            <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-6 text-xl font-bold text-gray-800">
                Ordered Products
              </h2>

              <div className="space-y-5">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:gap-4 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-full rounded-lg object-cover sm:w-20"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    <div className="font-semibold text-gray-800 sm:self-start">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="space-y-6">
            {/* Shipping Information */}

            <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-5 text-xl font-bold text-gray-800">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>

                  <p className="font-medium text-gray-800">
                    {order.shippingAddress.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>

                  <p className="font-medium text-gray-800">
                    {order.shippingAddress.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>

                  <p className="font-medium text-gray-800">
                    {order.shippingAddress.address}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">City</p>

                  <p className="font-medium text-gray-800">
                    {order.shippingAddress.city}
                  </p>
                </div>

                {order.shippingAddress.postalCode && (
                  <div>
                    <p className="text-sm text-gray-500">Postal Code</p>

                    <p className="font-medium text-gray-800">
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total */}

            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-5 text-xl font-bold text-gray-800">
                Order Summary
              </h2>

              <div className="flex justify-between pt-4 border-t">
                <span className="text-lg font-semibold text-gray-800">
                  Total
                </span>

                <span className="text-xl font-bold text-primary">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            {order.status === "pending" && (
              <button
                type="button"
                onClick={() => setCancelModal(true)}
                className="w-full py-3 mt-5 font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Cancel Order"
      >
        <div className="space-y-5">
          <p className="text-gray-600">
            Are you sure you want to cancel this order?
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCancelModal(false)}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              No, Keep Order
            </button>

            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={loading}
              className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default OrderDetails;
