import http from "./http";

// Add To Cart
const addToCart = async (productId, quantity = 1, options = {}) => {
  const response = await http.post("/cart", {
    productId,
    quantity,
    ...options,
  });

  return response.data;
};

// Get Cart
const getCart = async () => {
  const response = await http.get("/cart");

  return response.data;
};

// Update Quantity
const updateQuantity = async (cartItemId, quantity, options = {}) => {
  const response = await http.put("/cart/update", {
    cartItemId,
    quantity,
    ...options,
  });

  return response.data;
};

// Remove Item
const removeItem = async (cartItemId) => {
  const response = await http.delete(`/cart/remove/${cartItemId}`);

  return response.data;
};

// Clear Cart
const clearCart = async () => {
  const response = await http.delete("/cart/clear");

  return response.data;
};

const cartService = {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
};

export default cartService;
