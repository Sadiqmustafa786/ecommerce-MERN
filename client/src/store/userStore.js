import { create } from "zustand";
import userService from "../services/user.service";

const useUserStore = create((set) => ({
  // ===========================
  // State
  // ===========================

  users: [],

  user: null,

  wishlist: [],

  loading: false,

  error: null,

  // ===========================
  // Get Wishlist
  // ===========================

  getWishlist: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await userService.getWishlist();

      set({
        wishlist: response.wishlist,
      });

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch wishlist";

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
  // Toggle Wishlist
  // ===========================

  toggleWishlist: async (productId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await userService.toggleWishlist(productId);

      set({
        wishlist: response.wishlist,
      });

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update wishlist";

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
  // Get All Users
  // ===========================

  getUsers: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await userService.getUsers();

      set({
        users: response.users,
      });

      return response;
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to fetch users";

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
  // Get Single User
  // ===========================

  getUserById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await userService.getUserById(id);

      set({
        user: response.user,
      });

      return response;
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to fetch user";

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
  // Update User
  // ===========================

  updateUser: async (id, data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await userService.updateUser(id, data);

      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? response.user : user,
        ),
      }));

      return response;
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update user";

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
  // Delete User
  // ===========================

  deleteUser: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await userService.deleteUser(id);

      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
      }));

      return response;
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to delete user";

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

export default useUserStore;
