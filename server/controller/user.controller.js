import User from "../models/User.js";

// ===========================
// Get All Users
// ===========================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// Get Single User
// ===========================

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// Update User
// ===========================

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      wishlist: user?.wishlist || [],
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyAdded = user.wishlist.some(
      (item) => item.toString() === productId,
    );

    if (alreadyAdded) {
      user.wishlist = user.wishlist.filter(
        (item) => item.toString() !== productId,
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
      message: alreadyAdded ? "Removed from wishlist" : "Added to wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Toggle Wishlist Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update Name
    if (name) {
      user.name = name;
    }

    // Update Email
    if (email) {
      user.email = email;
    }

    // Update Role
    if (role) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      user.role = role;
    }

    await user.save();

    const updatedUser = user.toObject();

    delete updatedUser.password;

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// Delete User
// ===========================

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent admin from deleting himself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
