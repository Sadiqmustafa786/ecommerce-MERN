import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOrderStore from "../../store/orderStore";
import { showError } from "../../utils/toast";
import Loader from "../../components/common/Loader";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { cancelOrder } = useOrderStore();
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    const cancelPendingOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        await cancelOrder(orderId);
      } catch (error) {
        showError(
          error?.response?.data?.message || "Failed to cancel pending order",
        );
      } finally {
        setLoading(false);
      }
    };

    cancelPendingOrder();
  }, [orderId, cancelOrder]);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen px-6 py-10 bg-gray-50">
        <Loader />
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-5 shadow sm:p-8">
        <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>

        <p className="mt-4 text-gray-600">
          Your payment was cancelled. You can retry payment or continue
          shopping.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700 sm:w-auto"
          >
            Retry Payment
          </button>

          <button
            onClick={() => navigate("/products")}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 sm:w-auto"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentCancelled;
