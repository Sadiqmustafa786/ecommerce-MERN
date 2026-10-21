import React, { useEffect, useState } from "react";
import useCategoryStore from "../../store/categoryStore";
import useProductStore from "../../store/productStore";
import { showError, showSuccess } from "../../utils/toast";

const ProductForm = ({ onClose, selectedProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    colors: "",
    sizes: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { createProduct, updateProduct } = useProductStore();

  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories();

    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        category:
          selectedProduct.category?._id || selectedProduct.category || " ",
        colors: (selectedProduct.colors || []).join(", "),
        sizes: (selectedProduct.sizes || []).join(", "),
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        colors: "",
        sizes: "",
      });

      setImage(null);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);

      data.append("description", formData.description);

      data.append("price", formData.price);

      data.append("stock", formData.stock);

      data.append("category", formData.category);

      data.append("colors", formData.colors);

      data.append("sizes", formData.sizes);

      if (image) {
        data.append("image", image);
      }

      if (selectedProduct) {
        await updateProduct(selectedProduct._id, data);

        showSuccess("Product updated successfully");
      } else {
        await createProduct(data);

        showSuccess("Product created successfully");
      }

      onClose();
    } catch (error) {
      showError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">Price</label>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Stock</label>

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Enter stock"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Category</label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">Available Colors</label>
        <input
          type="text"
          name="colors"
          value={formData.colors}
          onChange={handleChange}
          placeholder="Black, White, Navy"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate each color with a comma. Leave blank if this product has no
          color options.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">Available Sizes</label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          placeholder="S, M, L or 40, 41, 42"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="mt-1 text-sm text-gray-500">
          Add clothing sizes or shoe sizes, separated by commas.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {(image || selectedProduct?.image) && (
          <img
            src={image ? URL.createObjectURL(image) : selectedProduct.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mt-3"
          />
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-gray-200 px-5 py-2 hover:bg-gray-300 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-5 py-2 text-white hover:bg-primary disabled:opacity-50 sm:w-auto"
        >
          {loading
            ? "Saving..."
            : selectedProduct
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
