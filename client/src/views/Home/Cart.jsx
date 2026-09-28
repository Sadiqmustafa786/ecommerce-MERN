import React, { useEffect, useState } from "react";
import useCartStore from "../../store/cartStore";
import Loader from "../../components/common/Loader";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast";
import Modal from "../../components/common/Modal";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, getCart, loading, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [clearCartModal, setClearCartModal] = useState(false);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const subtotal =
    cart?.items?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ) || 0;

  const handleRemove = async () => {
    try {
      await removeItem(itemToRemove.product._id);

      showSuccess("Product removed from cart");

      setDeleteModal(false);
      setItemToRemove(null);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to remove product");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();

      showSuccess("Cart cleared successfully");

      setClearCartModal(false);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="mb-4 text-6xl">🛒</div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-gray-600">
          Looks like you haven't added anything to your cart yet.
        </p>

        <Link
          to="/products"
          className="mt-6 w-full max-w-xs rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Shopping Cart</h1>

          <p className="mt-1 text-gray-500">Review your selected products</p>
        </div>

        {/* Cart Items */}

        <div className="grid items-start gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              >
              {/* Product Image */}

              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-full rounded-lg object-cover sm:w-24"
              />

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-gray-800">
                  {item.product.name}
                </h2>

                <p className="mt-1 text-gray-500">${item.product.price}</p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="flex items-center justify-center w-8 h-8 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    −
                  </button>

                  <span className="w-8 font-semibold text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="flex items-center justify-center w-8 h-8 border rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    setItemToRemove(item);
                    setDeleteModal(true);
                  }}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

                <div className="text-lg font-semibold text-gray-800 sm:self-start">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-6 text-lg font-bold text-gray-800 sm:text-xl">
              Cart Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Total Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-800">
                    Total
                  </span>

                  <span className="text-lg font-bold text-primary">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setClearCartModal(true)}
                className="w-full py-3 mb-3 font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-50"
              >
                Clear Cart
              </button>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full py-3 mt-4 font-semibold text-white bg-primary rounded-lg hover:bg-primary-700"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setItemToRemove(null);
        }}
        title="Remove From Cart"
      >
        <div className="space-y-5">
          <p className="text-gray-600">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-800">
              {itemToRemove?.product?.name}
            </span>{" "}
            from your cart?
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setDeleteModal(false);
                setItemToRemove(null);
              }}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={clearCartModal}
        onClose={() => setClearCartModal(false)}
        title="Clear Cart"
      >
        <div className="space-y-5">
          <p className="text-gray-600">
            Are you sure you want to remove all products from your cart?
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setClearCartModal(false)}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleClearCart}
              className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Cart;
