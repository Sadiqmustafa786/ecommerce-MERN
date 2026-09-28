import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyCheckoutSession } from "../controller/payment.controller.js";

const router = express.Router();

router.get("/verify-session", protect, verifyCheckoutSession);

export default router;
