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

const normalizeOption = (value) =>
  typeof value === "string" ? value.trim() : "";

const validateOptions = (product, color, size) => {
  if (product.colors.length && !product.colors.includes(color)) {
    return "Please select a valid color";
  }

  if (product.sizes.length && !product.sizes.includes(size)) {
    return "Please select a valid size";
  }

  if (color && !product.colors.includes(color)) {
    return "The selected color is not available";
  }

  if (size && !product.sizes.includes(size)) {
    return "The selected size is not available";
  }

  return null;
};

// Add Product To Cart

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const color = normalizeOption(req.body.color);
    const size = normalizeOption(req.body.size);
    const requestedQuantity = parseQuantity(quantity, 1);

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!requestedQuantity) {
      return invalidQuantityResponse(res);
    }

    const product = await Product.findById(productId).select(
      "stock name colors sizes",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const optionError = validateOptions(product, color, size);

    if (optionError) {
      return res.status(400).json({ message: optionError });
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
        items: [
          { product: productId, quantity: requestedQuantity, color, size },
        ],
      });

      return res.status(201).json({
        message: "Product added to cart",
        cart,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size,
    );
    const productQuantity = cart.items
      .filter((item) => item.product.toString() === productId)
      .reduce((total, item) => total + item.quantity, 0);
    const nextQuantity = (existingItem?.quantity || 0) + requestedQuantity;

    if (productQuantity + requestedQuantity > product.stock) {
      return res.status(409).json({
        message: `${product.name} has only ${product.stock} item(s) in stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: requestedQuantity,
        color,
        size,
      });
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
    const { cartItemId, productId, quantity, color, size } = req.body;
    const requestedQuantity = parseQuantity(quantity);

    if (!isValidObjectId(cartItemId || productId)) {
      return res.status(400).json({ message: "Invalid cart item id" });
    }

    if (!requestedQuantity) {
      return invalidQuantityResponse(res);
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cartItemId
      ? cart.items.id(cartItemId)
      : cart.items.find((cartItem) => cartItem.product.toString() === productId);

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    const product = await Product.findById(item.product).select(
      "stock name colors sizes",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      (color !== undefined && typeof color !== "string") ||
      (size !== undefined && typeof size !== "string")
    ) {
      return res.status(400).json({
        message: "Color and size must be strings",
      });
    }

    const selectedColor =
      color === undefined ? item.color : normalizeOption(color);
    const selectedSize = size === undefined ? item.size : normalizeOption(size);

    if (
      (selectedColor && !product.colors.includes(selectedColor)) ||
      (selectedSize && !product.sizes.includes(selectedSize))
    ) {
      return res.status(400).json({
        message: "The selected color or size is not available",
      });
    }

    const sameProductItems = cart.items.filter(
      (cartItem) => cartItem.product.toString() === item.product.toString(),
    );
    const totalProductQuantity = sameProductItems
      .reduce((total, cartItem) => total + cartItem.quantity, 0);

    if (
      totalProductQuantity - item.quantity + requestedQuantity >
      product.stock
    ) {
      return res.status(409).json({
        message: `${product.name} has only ${product.stock} item(s) in stock`,
      });
    }

    const matchingVariant = sameProductItems.find(
      (cartItem) =>
        cartItem._id.toString() !== item._id.toString() &&
        cartItem.color === selectedColor &&
        cartItem.size === selectedSize,
    );

    if (matchingVariant) {
      matchingVariant.quantity += requestedQuantity;
      item.deleteOne();
    } else {
      item.color = selectedColor;
      item.size = selectedSize;
      item.quantity = requestedQuantity;
    }

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
    const { cartItemId } = req.params;

    if (!isValidObjectId(cartItemId)) {
      return res.status(400).json({ message: "Invalid cart item id" });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.id(cartItemId);

    if (cartItem) {
      cartItem.deleteOne();
    } else {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== cartItemId,
      );
    }

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
