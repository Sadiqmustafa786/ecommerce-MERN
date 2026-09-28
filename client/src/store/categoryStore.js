import { create } from "zustand";
import categoryService from "../services/category.service";

const useCategoryStore = create((set, get) => ({
  // ===========================
  // State
  // ===========================

  categories: [],
  category: null,

  loading: false,
  error: null,

  // ===========================
  // Get All Categories
  // ===========================

  getCategories: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await categoryService.getCategories();

      set({
        categories: response.categories,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch categories";

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
  // Get Category By Id
  // ===========================

  getCategoryById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await categoryService.getCategoryById(id);

      set({
        category: response.category,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch category";

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
  // Create Category
  // ===========================

  createCategory: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await categoryService.createCategory(data);

      set({
        categories: [...get().categories, response.category],
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create category";

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
  // Update Category
  // ===========================

  updateCategory: async (id, data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await categoryService.updateCategory(id, data);

      const updatedCategories = get().categories.map((category) =>
        category._id === id ? response.category : category,
      );

      set({
        categories: updatedCategories,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update category";

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
  // Delete Category
  // ===========================

  deleteCategory: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await categoryService.deleteCategory(id);

      const filteredCategories = get().categories.filter(
        (category) => category._id !== id,
      );

      set({
        categories: filteredCategories,
      });

      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete category";

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
  // Clear Selected Category
  // ===========================

  clearCategory: () => {
    set({
      category: null,
    });
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

export default useCategoryStore;
