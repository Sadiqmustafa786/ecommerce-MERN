import express from "express";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controller/cart.controller.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add product to cart
router.post("/", protect, addToCart);

// Get user cart
router.get("/", protect, getCart);

// Update quantity
router.put("/update", protect, updateCartQuantity);

// Remove product
router.delete("/remove/:productId", protect, removeFromCart);

// Clear cart
router.delete("/clear", protect, clearCart);

export default router;
