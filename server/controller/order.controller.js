import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Counter from "../models/Counter.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import { sendEmail } from "../services/email.service.js";
import { createNotification } from "../services/notification.service.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const releaseStock = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      ),
    ),
  );
};

const reserveStock = async (items) => {
  const reservedItems = [];

  try {
    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!product) {
        const existingProduct = await Product.findById(item.product).select(
          "name stock",
        );

        const error = new Error(
          existingProduct
            ? `${existingProduct.name} has only ${existingProduct.stock} item(s) in stock`
            : "One or more products are no longer available",
        );
        error.statusCode = 409;
        throw error;
      }

      reservedItems.push(item);
    }

    return reservedItems;
  } catch (error) {
    await releaseStock(reservedItems);
    throw error;
  }
};

export const createOrder = async (req, res) => {
  let reservedItems = [];
  let order;
  let stockCommitted = false;

  try {
    const userId = req.user._id;

    const { fullName, phone, address, city, postalCode, paymentMethod } =
      req.body;

    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // 1. Get user's cart
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    // 2. Check cart
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    // 3. Check shipping information
    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({
        message: "Please provide complete shipping information",
      });
    }

    const hasInvalidCartItem = cart.items.some(
      (item) =>
        !item.product ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1,
    );

    if (hasInvalidCartItem) {
      return res.status(400).json({
        message: "Your cart contains an invalid product or quantity",
      });
    }

    // 4. Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    reservedItems = await reserveStock(orderItems);

    // 5. Calculate total
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // 6. Allocate a short, sequential customer-facing order number.
    const orderCounter = await Counter.findOneAndUpdate(
      { _id: "order" },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    // 7. Create order
    order = await Order.create({
      orderNumber: orderCounter.sequence,
      user: userId,

      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        postalCode,
      },
    });

    void createNotification({
      type: "order_created",
      title: "New order received",
      message: `${req.user.name || "A customer"} placed an order`,
      user: userId,
      order: order._id,
    });

    let checkOutUrl = null;

    if (paymentMethod === "online") {
      if (!stripe) {
        await Order.findByIdAndDelete(order._id);
        await releaseStock(reservedItems);
        reservedItems = [];

        return res.status(500).json({
          message: "Online payment is not configured",
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: orderItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),

        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled?order_id=${order._id}`,

        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString(),
        },
      });

      order.stripeSessionId = session.id;
      await order.save();

      checkOutUrl = session.url;
    } else {
      // Clear cart only for COD orders
      cart.items = [];
      await cart.save();
    }

    stockCommitted = true;

    try {
      await sendEmail({
        to: req.user.email,
        subject: `Order Confirmation - #${order.orderNumber ?? order._id}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">Thank you for your order, ${req.user.name || "Customer"}!</h2>
            <p>Your order has been placed successfully.</p>
            <p><strong>Order Number:</strong> #${order.orderNumber ?? order._id}</p>
            <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${
              paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"
            }</p>

            <h3 style="margin-top: 20px;">Items</h3>
            <ul>
              ${orderItems
                .map(
                  (item) =>
                    `<li>${item.name} x ${item.quantity} - $${(
                      item.price * item.quantity
                    ).toFixed(2)}</li>`,
                )
                .join("")}
            </ul>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Order confirmation email error:", emailError);
    }

    // 9. Response
    res.status(201).json({
      message: "Order created successfully",

      order,
      checkOutUrl,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    if (!stockCommitted && reservedItems.length > 0) {
      await releaseStock(reservedItems);

      if (order?._id) {
        await Order.findByIdAndDelete(order._id);
      }
    }

    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    // Find user's order
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    // Order not found
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check order status
    if (
      order.status === "shipped" ||
      order.status === "delivered" ||
      order.status === "cancelled"
    ) {
      return res.status(400).json({
        message: `Order cannot be cancelled because it is already ${order.status}`,
      });
    }

    if (order.paymentMethod === "online" && order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Paid online orders cannot be cancelled",
      });
    }

    // Cancel order
    order.status = "cancelled";

    if (order.paymentMethod === "online" && order.paymentStatus === "pending") {
      order.paymentStatus = "failed";
    }

    await order.save();
    await releaseStock(order.items);

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const { status } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    // Check status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Update status
    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const { paymentStatus } = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid order id",
      });
    }

    const allowedPaymentStatuses = ["pending", "paid", "failed"];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
