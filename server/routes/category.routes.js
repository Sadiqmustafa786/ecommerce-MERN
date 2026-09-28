import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/admin.middleware.js";
import { uploadCategoryImage } from "../middleware/uploadCategory.js";

const router = express.Router();

router.post("/", protect, admin, uploadCategoryImage, createCategory);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.put("/:id", protect, admin, uploadCategoryImage, updateCategory);

router.delete("/:id", protect, admin, deleteCategory);

export default router;
