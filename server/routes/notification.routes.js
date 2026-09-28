import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/admin.middleware.js";
import {
  getAdminNotifications,
  markNotificationsRead,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/admin", protect, admin, getAdminNotifications);
router.put("/admin/read", protect, admin, markNotificationsRead);

export default router;
