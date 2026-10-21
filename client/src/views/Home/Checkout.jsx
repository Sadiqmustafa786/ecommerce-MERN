import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import useOrderStore from "../../store/orderStore";
import { showError, showSuccess } from "../../utils/toast";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart } = useCartStore();
  const { createOrder, loading } = useOrderStore();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createOrder(formData);

      // If server returned a Stripe checkout URL, redirect user
      if (response?.checkOutUrl) {
        window.location.href = response.checkOutUrl;
        return;
      }

      showSuccess("Order placed successfully");

      navigate("/orders");
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to place order");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>

        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 mt-5 text-white bg-primary rounded-lg hover:bg-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Checkout</h1>

        <p className="mt-1 text-gray-500">Enter your shipping information</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Shipping Form */}

        <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6 md:col-span-2">
          <h2 className="mb-6 text-lg font-bold text-gray-800 sm:text-xl">
            Shipping Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                required
                rows="3"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block mb-2 font-medium">City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Postal Code</label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 font-medium text-gray-800">
                Payment Method
              </label>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order is delivered
                    </p>
                  </div>
                </label>

                {/* Online Payment */}
                <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />

                  <div>
                    <p className="font-medium text-gray-800">Online Payment</p>

                    <p className="text-sm text-gray-500">Pay securely online</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}

        <div className="h-fit rounded-xl border bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-6 text-lg font-bold text-gray-800 sm:text-xl">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="object-cover rounded-lg w-14 h-14"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {item.product.name}
                  </p>

                  {(item.color || item.size) && (
                    <p className="text-xs text-gray-500">
                      {[
                        item.color && `Color: ${item.color}`,
                        item.size && `Size: ${item.size}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.product.price}
                  </p>
                </div>

                <span className="font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>

                <span className="text-lg font-bold text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
