import Category from "../models/Category.js";

// Create Category

export const createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { name } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const image = req.file?.path;

    const category = await Category.create({
      name,
      image,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Categories

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Category

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Category

export const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    category.name = name;

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Category

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
