import { create } from "zustand";
import orderService from "../services/order.service";

const useOrderStore = create((set) => ({
  orders: [],
  order: null,

  loading: false,
  error: null,

  // Create Order
  createOrder: async (shippingData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.createOrder(shippingData);

      set({
        order: response.order,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create order";

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

  // Get My Orders
  getMyOrders: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.getMyOrders();

      set({
        orders: response.orders,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch orders";

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

  // Get Single Order
  getOrderById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.getOrderById(id);

      set({
        order: response.order,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch order";

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

  // Cancel Order
  cancelOrder: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.cancelOrder(id);

      set({
        order: response.order,
      });

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cancel order";

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

  // Get All Orders - Admin
  getAdminOrders: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.getAdminOrders();

      set({
        orders: response.orders,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch admin orders";

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

  // Update Order Status - Admin
  updateOrderStatus: async (id, status) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.updateOrderStatus(id, status);

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? response.order : order,
        ),
      }));

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update order status";

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

  // Update Payment Status - Admin
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await orderService.updatePaymentStatus(
        id,
        paymentStatus,
      );

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? response.order : order,
        ),
      }));

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update payment status";

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

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useOrderStore;
