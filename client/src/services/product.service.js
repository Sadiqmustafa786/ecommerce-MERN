import http from "./http";

const getProducts = async () => {
  const response = await http.get("/products");

  return response.data;
};

const getProductById = async (id) => {
  const response = await http.get(`/products/${id}`);

  return response.data;
};

const createProduct = async (data) => {
  const response = await http.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const updateProduct = async (id, data) => {
  const response = await http.put(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const deleteProduct = async (id) => {
  const response = await http.delete(`/products/${id}`);

  return response.data;
};

const rateProduct = async (id, rating) => {
  const response = await http.post(`/products/${id}/rate`, { rating });

  return response.data;
};

const addProductComment = async (id, text) => {
  const response = await http.post(`/products/${id}/comments`, { text });

  return response.data;
};

const productService = {
  getProducts,

  getProductById,

  createProduct,

  updateProduct,

  deleteProduct,

  rateProduct,

  addProductComment,
};

export default productService;
