import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controller/order.controller.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/", protect, getMyOrders);

router.get("/admin", protect, admin, getAllOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, cancelOrder);

router.put("/:id/status", protect, admin, updateOrderStatus);

router.put("/:id/payment-status", protect, admin, updatePaymentStatus);

export default router;
