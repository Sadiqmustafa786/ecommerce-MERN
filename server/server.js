import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import seedAdmin from "./seeds/admin.seed.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";

import paymentRoutes from "./routes/payment.routes.js";
import testEmailRoutes from "./routes/testEmail.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

connectDB();
seedAdmin();

const app = express();

app.post(
  "/api/payment/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      const mod = await import("./controller/payment.controller.js");

      if (typeof mod.stripeWebhook !== "function") {
        throw new Error("stripeWebhook handler not available");
      }

      return mod.stripeWebhook(req, res, next);
    } catch (err) {
      next(err);
    }
  },
);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/test-email", testEmailRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
