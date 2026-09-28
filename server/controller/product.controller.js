import Product from "../models/Product.js";

// Create Product

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const image = req.file?.path || "";
    console.log("Image:", image);

    const product = await Product.create({
      name,

      description,

      price,

      category,

      stock,

      image,
    });

    console.log("Product:", product);

    res.status(201).json({
      message: "Product created successfully",

      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Products

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Product

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Rate Product

export const rateProduct = async (req, res) => {
  try {
    const { rating } = req.body;
    const value = Number(rating);

    if (!Number.isFinite(value) || value < 1 || value > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingRating = product.ratings.find(
      (item) => item.user.toString() === req.user._id.toString(),
    );

    if (existingRating) {
      existingRating.value = value;
    } else {
      product.ratings.push({
        user: req.user._id,
        value,
      });
    }

    const totalRating = product.ratings.reduce(
      (sum, item) => sum + item.value,
      0,
    );
    product.numReviews = product.ratings.length;
    product.rating = Number((totalRating / product.numReviews).toFixed(1));

    await product.save();

    res.status(200).json({
      message: "Product rated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product

// Update Product

export const updateProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update Text Fields

    product.name = name || product.name;

    product.description = description || product.description;

    product.price = price || product.price;

    product.category = category || product.category;

    product.stock = stock || product.stock;

    // Update Image If New Image Uploaded

    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",

      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Product

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
