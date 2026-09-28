import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseQuantity = (quantity, fallback) => {
  const value = quantity === undefined ? fallback : Number(quantity);

  return Number.isInteger(value) && value > 0 ? value : null;
};

const invalidQuantityResponse = (res) =>
  res.status(400).json({
    message: "Quantity must be a positive whole number",
  });

// Add Product To Cart

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const requestedQuantity = parseQuantity(quantity, 1);

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!requestedQuantity) {
      return invalidQuantityResponse(res);
    }

    const product = await Product.findById(productId).select("stock name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userId = req.user._id;

    // Check user cart exists

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      if (requestedQuantity > product.stock) {
        return res.status(409).json({
          message: `${product.name} has only ${product.stock} item(s) in stock`,
        });
      }

      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: requestedQuantity }],
      });

      return res.status(201).json({
        message: "Product added to cart",
        cart,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    const nextQuantity = (existingItem?.quantity || 0) + requestedQuantity;

    if (nextQuantity > product.stock) {
      return res.status(409).json({
        message: `${product.name} has only ${product.stock} item(s) in stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({ product: productId, quantity: requestedQuantity });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
      });
    }

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const requestedQuantity = parseQuantity(quantity);

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!requestedQuantity) {
      return invalidQuantityResponse(res);
    }

    const product = await Product.findById(productId).select("stock name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (requestedQuantity > product.stock) {
      return res.status(409).json({
        message: `${product.name} has only ${product.stock} item(s) in stock`,
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    item.quantity = requestedQuantity;

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
