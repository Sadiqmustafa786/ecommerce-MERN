import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "ecommerce/products",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage: storage,
});

export const uploadProductImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.message || err.error?.message || "Image upload failed";
      return res.status(400).json({ message });
    }
    next();
  });
};

export default upload;
