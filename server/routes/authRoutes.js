import express from "express";
import {
  forgotPassword,
  googleAuth,
  login,
  logout,
  resetPassword,
  signup,
} from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/google", googleAuth);

router.post("/logout", logout);

export default router;
