import { useEffect, useState } from "react";
import useProductStore from "../../../store/productStore";
import Modal from "../../../components/common/Modal";
import ProductForm from "../../../components/admin/ProductForm";
import { showSuccess, showError } from "../../../utils/toast";

const ProductList = () => {
  const [openModal, setOpenModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [productToDelete, setProductToDelete] = useState(null);

  const { products, getProducts, deleteProduct } = useProductStore();

  useEffect(() => {
    getProducts();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteProduct(productToDelete._id);

      showSuccess("Product deleted successfully");

      setDeleteModal(false);

      setProductToDelete(null);
    } catch (error) {
      showError(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Product Management
          </h1>

          <p className="mt-1 text-gray-500">Manage all products</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedProduct(null);

            setOpenModal(true);
          }}
          className="w-full rounded-lg bg-primary px-5 py-2 text-white transition hover:bg-primary sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}

      <div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>

              <th className="px-6 py-4 text-left">Image</th>

              <th className="px-6 py-4 text-left">Name</th>

              <th className="px-6 py-4 text-left">Category</th>

              <th className="px-6 py-4 text-left">Price</th>

              <th className="px-6 py-4 text-left">Stock</th>

              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-500">
                  No Products Found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product._id} className="border-t">
                  <td className="px-6 py-4">{index + 1}</td>

                  <td className="px-6 py-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-14 h-14 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-14 h-14 text-gray-400 bg-gray-200 rounded-lg">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium">{product.name}</td>

                  <td className="px-6 py-4">
                    {product.category?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4">${product.price}</td>

                  <td className="px-6 py-4">{product.stock}</td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);

                        setOpenModal(true);
                      }}
                      className="px-3 py-1 mr-2 text-slate-900 bg-secondary rounded hover:bg-primary hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setDeleteModal(true);
                      }}
                      className="px-3 py-1 text-white bg-primary rounded"
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
        {products.length === 0 ? (
          <div className="rounded-lg bg-white px-4 py-10 text-center text-gray-500 shadow">
            No Products Found
          </div>
        ) : (
          products.map((product, index) => (
            <article
              key={product._id}
              className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 shrink-0 pt-1 text-sm text-slate-400">{index + 1}</span>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gray-200 text-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-800">{product.name}</h2>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {product.category?.name || "N/A"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold text-slate-700">${product.price}</span>
                    <span className="text-slate-500">Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  aria-label={`Edit ${product.name}`}
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpenModal(true);
                  }}
                  className="flex-1 rounded bg-secondary px-3 py-2 text-sm text-slate-900 transition hover:bg-primary hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${product.name}`}
                  onClick={() => {
                    setProductToDelete(product);
                    setDeleteModal(true);
                  }}
                  className="flex-1 rounded bg-primary px-3 py-2 text-sm text-white transition hover:bg-primary"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Product Modal */}

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={selectedProduct ? "Edit Product" : "Add Product"}
      >
        <ProductForm
          selectedProduct={selectedProduct}
          onClose={() => setOpenModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Product"
      >
        <div className="space-y-5">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{productToDelete?.name}</span>?
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setDeleteModal(false);
                setProductToDelete(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
