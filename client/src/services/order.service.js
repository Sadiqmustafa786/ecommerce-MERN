import http from "./http";

// Create Order
const createOrder = async (shippingData) => {
  const response = await http.post("/orders", shippingData);

  return response.data;
};

// Get My Orders
const getMyOrders = async () => {
  const response = await http.get("/orders");

  return response.data;
};

// Get Single Order
const getOrderById = async (id) => {
  const response = await http.get(`/orders/${id}`);

  return response.data;
};

// Cancel Order
const cancelOrder = async (id) => {
  const response = await http.put(`/orders/${id}/cancel`);

  return response.data;
};

// Get All Orders - Admin
const getAdminOrders = async () => {
  const response = await http.get("/orders/admin");

  return response.data;
};

// Update Order Status - Admin
const updateOrderStatus = async (id, status) => {
  const response = await http.put(`/orders/${id}/status`, {
    status,
  });

  return response.data;
};

const updatePaymentStatus = async (id, paymentStatus) => {
  const response = await http.put(`/orders/${id}/payment-status`, {
    paymentStatus,
  });

  return response.data;
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
};

export default orderService;
