import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryTable from "../components/categories/CategoryTable";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import SuccessPopup from "../components/common/SuccessPopup";
import {
  getCategories,
  createCategories,
  deleteCategories,
  updateCategories,
} from "../store/slices/categorySlice";
import { FiPlus } from "react-icons/fi";

const selectCategories = createSelector(
  (state) => state.categories,
  (categories) => ({
    categories: categories?.categories,
    loading: categories?.loading || false,
  })
);

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(selectCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSubmit = (formData) => {
    if (editingCategory) {
      dispatch(
        updateCategories({ id: editingCategory.id, categoryData: formData })
      ).then(() => {
        dispatch(getCategories());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Kategori berhasil diperbarui!",
        });
      });
    } else {
      dispatch(createCategories(formData)).then(() => {
        dispatch(getCategories());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Kategori baru berhasil ditambahkan!",
        });
      });
    }
  };

  const handleDeleteClick = (categoryItem) => {
    setDeleteModal({
      isOpen: true,
      categoryId: categoryItem.id,
      categoryName: categoryItem.name,
    });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteCategories(deleteModal.categoryId))
      .unwrap()
      .then(() => {
        dispatch(getCategories());
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Kategori berhasil dihapus!",
        });
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  const handleEdit = (categoryItem) => {
    setEditingCategory(categoryItem);
    setIsFormOpen(true);
  };

  return (
    <div className="p-3 mx-auto transition-colors duration-200 sm:p-4 lg:p-6 dark:text-gray-200">
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold transition-colors duration-200 sm:text-2xl dark:text-white">
          Kategori
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-3 py-2 text-sm text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:text-base sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
        >
          <FiPlus className="mr-1 text-lg" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 transition-colors duration-200 border-t-2 border-b-2 rounded-full animate-spin border-primary sm:w-12 sm:h-12 dark:border-blue-400"></div>
          <span className="mt-3 text-sm text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
            Memuat data kategori...
          </span>
        </div>
      ) : (
        <div className="transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative w-full max-w-md p-4 mx-2 transition-colors duration-200 bg-white rounded-lg shadow-lg sm:max-w-lg sm:mx-0 sm:p-6 lg:max-w-2xl dark:bg-gray-800 dark:shadow-gray-900/10">
            <div className="flex items-center justify-between pb-3 mb-4 transition-colors duration-200 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold transition-colors duration-200 sm:text-xl dark:text-white">
                {editingCategory ? "Edit" : "Tambah"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-gray-500 transition-colors duration-200 rounded-full hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <CategoryForm
                onSubmit={handleSubmit}
                initialData={editingCategory}
              />
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" })
        }
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.categoryName}
      />

      <SuccessPopup
        isVisible={successPopup.isVisible}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() =>
          setSuccessPopup({ isVisible: false, title: "", message: "" })
        }
      />
    </div>
  );
}
