import http from "./http";

const getCategories = async () => {
  const response = await http.get("/categories");
  return response.data;
};

const getCategoryById = async (id) => {
  const response = await http.get(`/categories/${id}`);
  return response.data;
};

const createCategory = async (data) => {
  const response = await http.post("/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const updateCategory = async (id, data) => {
  const response = await http.put(`/categories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await http.delete(`/categories/${id}`, {
    header: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
