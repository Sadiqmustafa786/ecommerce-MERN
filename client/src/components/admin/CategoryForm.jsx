import { useEffect, useState } from "react";
import useCategoryStore from "../../store/categoryStore";
import { showError, showSuccess } from "../../utils/toast";
import Loader from "../../components/common/Loader";

const CategoryForm = ({ onClose, selectedCategory }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const { createCategory, updateCategory } = useCategoryStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name);
    } else {
      setName("");
    }
  }, [selectedCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      console.log("IMAGE STATE:", image);

      for (let data of formData.entries()) {
        console.log(data[0], data[1]);
      }

      if (selectedCategory) {
        await updateCategory(selectedCategory._id, formData);
        showSuccess("Category updated successfully");
      } else {
        await createCategory(formData);
        showSuccess("Category created successfully");
      }

      setName("");
      setImage(null);

      onClose();
    } catch (error) {
      showError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Input */}

      <div>
        <label className="block mb-2 font-medium">Category Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Category Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* Image Preview */}
        {(image || selectedCategory?.image) && (
          <div className="mt-4">
            <img
              src={image ? URL.createObjectURL(image) : selectedCategory.image}
              alt="Category Preview"
              className="object-cover w-32 h-32 border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Buttons */}

      <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary sm:w-auto"
        >
          {loading ? (
            <Loader variant="button" />
          ) : selectedCategory ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
