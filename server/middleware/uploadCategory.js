import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "ecommerce/categories",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
});

export const uploadCategoryImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.message || err.error?.message || "Image upload failed";

      return res.status(400).json({
        message,
      });
    }

    next();
  });
};

export default upload;
