import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/admin.middleware.js";
import {
  deleteUser,
  getUserById,
  getUsers,
  getWishlist,
  toggleWishlist,
  updateUser,
} from "../controller/user.controller.js";

const router = express.Router();

// Get Wishlist
router.get("/wishlist", protect, getWishlist);

// Toggle Wishlist
router.post("/wishlist/:productId", protect, toggleWishlist);

// Get All Users
router.get("/", protect, admin, getUsers);

// Get Single User
router.get("/:id", protect, admin, getUserById);

// Update User
router.put("/:id", protect, admin, updateUser);

// Delete User
router.delete("/:id", protect, admin, deleteUser);

export default router;
