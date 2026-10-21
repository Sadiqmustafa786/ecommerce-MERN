import { create } from "zustand";
import productService from "../services/product.service";

const useProductStore = create((set, get) => ({
  // ===========================
  // State
  // ===========================

  products: [],
  product: null,

  loading: false,
  error: null,

  // ===========================
  // Get All Products
  // ===========================

  getProducts: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await productService.getProducts();

      set({
        products: response.products,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch products";

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
  // Get Product By Id
  // ===========================

  getProductById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await productService.getProductById(id);

      set({
        product: response.product,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch product";

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
  // Create Product
  // ===========================

  createProduct: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await productService.createProduct(data);

      set({
        products: [...get().products, response.product],
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create product";

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
  // Update Product
  // ===========================

  updateProduct: async (id, data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await productService.updateProduct(id, data);

      const updatedProducts = get().products.map((product) =>
        product._id === id ? response.product : product,
      );

      set({
        products: updatedProducts,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update product";

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
  // Delete Product
  // ===========================

  deleteProduct: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await productService.deleteProduct(id);

      const filteredProducts = get().products.filter(
        (product) => product._id !== id,
      );

      set({
        products: filteredProducts,
      });

      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete product";

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
  // Rate Product
  // ===========================

  rateProduct: async (id, rating) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await productService.rateProduct(id, rating);

      set((state) => ({
        product: response.product,
        products: state.products.map((item) =>
          item._id === id ? response.product : item,
        ),
      }));

      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to rate product";

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

  addProductComment: async (id, text) => {
    try {
      set({
        error: null,
      });

      const response = await productService.addProductComment(id, text);

      set((state) => ({
        product:
          state.product?._id === id ? response.product : state.product,
        products: state.products.map((item) =>
          item._id === id ? response.product : item,
        ),
      }));

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add comment";

      set({
        error: message,
      });

      throw error;
    }
  },

  // ===========================
  // Clear
  // ===========================

  clearProduct: () => {
    set({
      product: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useProductStore;
