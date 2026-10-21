import { useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import CategoryForm from "../../../components/admin/CategoryForm";
import useCategoryStore from "../../../store/categoryStore";
import { showError, showSuccess } from "../../../utils/toast";

const CategoryList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteCategory, setSelectedDeleteCategory] = useState(null);

  const { categories, getCategories, deleteCategory } = useCategoryStore();

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedDeleteCategory._id);

      showSuccess("Category deleted successfully");

      setDeleteModal(false);
      setSelectedDeleteCategory(null);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to delete category");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Category Management
          </h1>

          <p className="mt-1 text-gray-500">Manage all product categories</p>
        </div>

        <button
          className="w-full rounded-lg bg-primary px-5 py-2 text-white transition hover:bg-primary sm:w-auto"
          type="button"
          onClick={() => {
            setSelectedCategory(null);
            setOpenModal(true);
          }}
        >
          + Add Category
        </button>
      </div>

      {/* Table Container */}
      <div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>

              <th className="px-6 py-4 text-left">Image</th>

              <th className="px-6 py-4 text-left">Category Name</th>

              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-500">
                  No Categories Found
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category._id} className="border-t">
                  <td className="px-6 py-4">{index + 1}</td>

                  <td className="px-6 py-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="object-cover w-12 h-12 rounded-lg"
                      />
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {category.name.charAt(0)}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">{category.name}</td>

                  <td className="px-6 py-4 text-center">
                    <button
                      className="px-3 py-1 mr-2 text-slate-900 bg-secondary rounded hover:bg-primary hover:text-white"
                      onClick={() => {
                        setSelectedCategory(category);
                        setOpenModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 text-white bg-primary rounded"
                      onClick={() => {
                        setSelectedDeleteCategory(category);
                        setDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {categories.length === 0 ? (
          <div className="rounded-lg bg-white px-4 py-10 text-center text-gray-500 shadow">
            No Categories Found
          </div>
        ) : (
          categories.map((category, index) => (
            <article
              key={category._id}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
            >
              <span className="w-5 shrink-0 text-sm text-slate-400">{index + 1}</span>
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary">
                    {category.name.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="min-w-0 flex-1 truncate font-semibold text-slate-700">
                {category.name}
              </h2>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label={`Edit ${category.name}`}
                  className="rounded bg-secondary px-3 py-1 text-sm text-slate-900 transition hover:bg-primary hover:text-white"
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${category.name}`}
                  className="rounded bg-primary px-3 py-1 text-sm text-white transition hover:bg-primary"
                  onClick={() => {
                    setSelectedDeleteCategory(category);
                    setDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={selectedCategory ? "Edit Category" : "Add Category"}
      >
        <CategoryForm
          selectedCategory={selectedCategory} // selectedCategory prop is passed to the CategoryForm component for editing purposes
          onClose={() => setOpenModal(false)}
        />
      </Modal>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Category"
      >
        <div className="space-y-5">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedDeleteCategory?.name}</span>?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 text-white bg-primary rounded-lg"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
