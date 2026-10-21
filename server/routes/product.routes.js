import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  addProductComment,
  rateProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";

import { uploadProductImage } from "../middleware/upload.middleware.js";
import admin from "../middleware/admin.middleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, uploadProductImage, createProduct);

router.get("/", getProducts);

router.post("/:id/comments", protect, addProductComment);

router.post("/:id/rate", protect, rateProduct);

router.get("/:id", getProductById);

router.put("/:id", protect, admin, uploadProductImage, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

export default router;
