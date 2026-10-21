import { create } from "zustand";
import cartService from "../services/cart.service";

const useCartStore = create((set, get) => ({
  // ===========================
  // State
  // ===========================

  cart: null,

  loading: false,

  error: null,

  // ===========================
  // Get Cart
  // ===========================

  getCart: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await cartService.getCart();

      set({
        cart: response.cart,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch cart";

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // Add To Cart
  // ===========================

  addToCart: async (productId, quantity = 1, options = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await cartService.addToCart(
        productId,
        quantity,
        options,
      );

      set({
        cart: response.cart,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add product";

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // Update Quantity
  // ===========================

  updateQuantity: async (cartItemId, quantity, options = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await cartService.updateQuantity(
        cartItemId,
        quantity,
        options,
      );

      set({
        cart: response.cart,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update quantity";

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // Remove Item
  // ===========================

  removeItem: async (cartItemId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await cartService.removeItem(cartItemId);

      set({
        cart: response.cart,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove item";

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // Clear Cart
  // ===========================

  clearCart: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      await cartService.clearCart();

      set({
        cart: null,
      });

      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to clear cart";

      set({
        error: message,
      });

      throw error;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // Clear Error
  // ===========================

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useCartStore;
