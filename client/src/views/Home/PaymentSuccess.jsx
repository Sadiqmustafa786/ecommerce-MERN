import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import paymentService from "../../services/payment.service";
import { showError } from "../../utils/toast";
import Loader from "../../components/common/Loader";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        showError("Invalid payment session");
        navigate("/orders");
        return;
      }

      try {
        const response = await paymentService.verifySession(sessionId);

        if (response?.status === "paid") {
          setVerified(true);
        } else {
          showError("Payment verification failed");
          navigate("/checkout");
        }
      } catch (error) {
        showError(
          error?.response?.data?.message || "Payment verification failed",
        );
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-screen px-6 py-10 bg-gray-50">
        <Loader />
      </section>
    );
  }

  if (!verified) {
    return null;
  }

  return (
    <section className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-5 shadow sm:p-8">
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you — your payment was successful. Your order will be processed
          shortly.
        </p>

        <div className="mt-6">
          <button
            onClick={() => navigate("/orders")}
            className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700 sm:w-auto"
          >
            View Orders
          </button>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
