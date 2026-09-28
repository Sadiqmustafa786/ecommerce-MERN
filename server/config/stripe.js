import Stripe from "stripe";

let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.error("Failed to initialize Stripe:", err.message);
    stripe = null;
  }
} else {
  console.warn("STRIPE_SECRET_KEY not set — Stripe not initialized");
}

export default stripe;
