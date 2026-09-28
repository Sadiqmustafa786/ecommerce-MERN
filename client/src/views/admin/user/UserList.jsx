import { useEffect, useState } from "react";
import useUserStore from "../../../store/userStore";
import { showError, showSuccess } from "../../../utils/toast";
import Loader from "../../../components/common/Loader";
import Modal from "../../../components/common/Modal";

const UserList = () => {
  const { users, getUsers, updateUser, deleteUser, loading } = useUserStore();

  const [editModal, setEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user" });
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const openEditModal = (user) => {
    setUserToEdit(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setUserToEdit(null);
    setEditForm({ name: "", email: "", role: "user" });
  };

  const handleEditChange = (event) => {
    setEditForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!userToEdit) return;

    try {
      await updateUser(userToEdit._id, editForm);
      showSuccess("User updated successfully");
      closeEditModal();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to update user");
    }
  };

  // ===========================
  // Open Delete Modal
  // ===========================

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModal(true);
  };

  // ===========================
  // Close Delete Modal
  // ===========================

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setUserToDelete(null);
  };

  // ===========================
  // Delete User
  // ===========================

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id);

      showSuccess("User deleted successfully");

      closeDeleteModal();
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* ===========================
          Header
      =========================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">User Management</h1>

        <p className="mt-1 text-gray-500">Manage registered users</p>
      </div>

      {/* ===========================
          Users Table
      =========================== */}

      <div className="hidden overflow-hidden rounded-lg bg-white shadow md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>

              <th className="px-6 py-4 text-left">Name</th>

              <th className="px-6 py-4 text-left">Email</th>

              <th className="px-6 py-4 text-left">Role</th>

              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  No Users Found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  {/* Number */}

                  <td className="px-6 py-4">{index + 1}</td>

                  {/* Name */}

                  <td className="px-6 py-4 font-medium">{user.name}</td>

                  {/* Email */}

                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  {/* Role */}

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        user.role === "admin"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-secondary-100 text-primary-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      aria-label={`Edit ${user.name}`}
                      onClick={() => openEditModal(user)}
                      className="px-3 py-1 mr-2 text-slate-900 bg-secondary rounded hover:bg-primary hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(user)}
                      aria-label={`Delete ${user.name}`}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
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
        {users.length === 0 ? (
          <div className="rounded-lg bg-white px-4 py-10 text-center text-gray-500 shadow">
            No Users Found
          </div>
        ) : (
          users.map((user, index) => (
            <article
              key={user._id}
              className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="w-5 shrink-0 pt-1 text-sm text-slate-400">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold text-slate-800">{user.name}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-secondary-100 text-primary-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  aria-label={`Edit ${user.name}`}
                  onClick={() => openEditModal(user)}
                  className="flex-1 rounded bg-secondary px-3 py-2 text-sm text-slate-900 transition hover:bg-primary hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${user.name}`}
                  onClick={() => openDeleteModal(user)}
                  className="flex-1 rounded bg-red-500 px-3 py-2 text-sm text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal
        isOpen={editModal}
        onClose={closeEditModal}
        title="Edit User"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <div>
            <label htmlFor="edit-user-name" className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="edit-user-name"
              name="name"
              type="text"
              value={editForm.name}
              onChange={handleEditChange}
              required
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="edit-user-email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="edit-user-email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditChange}
              required
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="edit-user-role" className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="edit-user-role"
              name="role"
              value={editForm.role}
              onChange={handleEditChange}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeEditModal}
              className="rounded-lg bg-gray-200 px-5 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-5 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===========================
          Delete Confirmation Modal
      =========================== */}

      <Modal
        isOpen={deleteModal}
        onClose={closeDeleteModal}
        title="Delete User"
      >
        <div className="space-y-5">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">
              {userToDelete?.name}
            </span>
            ?
          </p>

          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
