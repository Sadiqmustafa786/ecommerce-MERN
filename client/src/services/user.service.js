import http from "./http";

// Get wishlist
const getWishlist = async () => {
  const response = await http.get("/users/wishlist");

  return response.data;
};

// Toggle wishlist
const toggleWishlist = async (productId) => {
  const response = await http.post(`/users/wishlist/${productId}`);

  return response.data;
};

// Get all users
const getUsers = async () => {
  const response = await http.get("/users");

  return response.data;
};

// Get single user
const getUserById = async (id) => {
  const response = await http.get(`/users/${id}`);

  return response.data;
};

// Update user
const updateUser = async (id, data) => {
  const response = await http.put(`/users/${id}`, data);

  return response.data;
};

// Delete user
const deleteUser = async (id) => {
  const response = await http.delete(`/users/${id}`);

  return response.data;
};

const userService = {
  getWishlist,
  toggleWishlist,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;
