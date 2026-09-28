import cloudinary from "../config/cloudinary.js";

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Get public_id from URL
    const parts = imageUrl.split("/");

    const fileName = parts[parts.length - 1];

    const folder = parts[parts.length - 2];

    const publicId = `ecommerce/${folder}/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Cloudinary Delete Error:", error.message);
  }
};

export default deleteCloudinaryImage;
