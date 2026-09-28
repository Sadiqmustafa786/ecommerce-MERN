import stripe from "../config/stripe.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const removeOrderItemsFromCart = async (order) => {
  const cart = await Cart.findOne({ user: order.user });

  if (!cart) {
    return;
  }

  const orderedQuantities = new Map();

  order.items.forEach((item) => {
    const productId = item.product.toString();
    orderedQuantities.set(
      productId,
      (orderedQuantities.get(productId) || 0) + item.quantity,
    );
  });

  cart.items = cart.items.reduce((remainingItems, item) => {
    const productId = item.product.toString();
    const remainingQuantity =
      item.quantity - (orderedQuantities.get(productId) || 0);

    if (remainingQuantity > 0) {
      item.quantity = remainingQuantity;
      remainingItems.push(item);
    }

    return remainingItems;
  }, []);

  await cart.save();
};

export const verifyCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    if (!stripe) {
      return res.status(503).json({ message: "Online payment is not configured" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const orderId = session.metadata?.orderId;
    const sessionUserId = session.metadata?.userId;

    if (sessionUserId && sessionUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Payment session access denied" });
    }

    if (session.payment_status === "paid" && orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.paymentStatus = "paid";
      await order.save();
      await removeOrderItemsFromCart(order);
    }

    res.status(200).json({
      status: session.payment_status,
      session,
    });
  } catch (error) {
    console.error("Verify session error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe Webhook Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("Order ID missing from Stripe session metadata");
          break;
        }

        const order = await Order.findById(orderId);

        if (!order) {
          console.error("Order not found:", orderId);
          break;
        }

        order.paymentStatus = "paid";

        await order.save();
        await removeOrderItemsFromCart(order);

        console.log(`Order ${orderId} payment marked as paid`);

        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe Webhook Processing Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
