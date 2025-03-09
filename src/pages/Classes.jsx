import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import ClassTable from "../components/classes/ClassTable";
import ClassForm from "../components/classes/ClassForm";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import SuccessPopup from "../components/common/SuccessPopup";
import {
  getClasses,
  createClass,
  deleteClass,
  updateClass,
} from "../store/slices/classSlice";
import { FiPlus } from "react-icons/fi";

const selectClasses = createSelector(
  (state) => state.classes,
  (classes) => ({
    classes: classes?.classes || [],
    loading: classes?.loading || false,
  })
);

export default function Classes() {
  const dispatch = useDispatch();
  const { classes, loading } = useSelector(selectClasses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    classId: null,
    className: "",
  });
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  const handleSubmit = (formData) => {
    if (editingClass) {
      dispatch(updateClass({ id: editingClass.id, classData: formData })).then(
        () => {
          dispatch(getClasses());
          setIsFormOpen(false);
          setSuccessPopup({
            isVisible: true,
            title: "Berhasil",
            message: "Kelas berhasil diperbarui!",
          });
        }
      );
    } else {
      dispatch(createClass(formData)).then(() => {
        dispatch(getClasses());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Kelas baru berhasil ditambahkan!",
        });
      });
    }
  };

  const handleDeleteClick = (classItem) => {
    setDeleteModal({
      isOpen: true,
      classId: classItem.id,
      className: classItem.name,
    });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteClass(deleteModal.classId))
      .unwrap()
      .then(() => {
        dispatch(getClasses());
        setDeleteModal({ isOpen: false, classId: null, className: "" });
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Kelas berhasil dihapus!",
        });
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  return (
    <div className="p-3 mx-auto transition-colors duration-200 sm:p-4 lg:p-6 dark:text-gray-200">
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold transition-colors duration-200 sm:text-2xl dark:text-white">
          Kelas
        </h2>
        <button
          onClick={() => {
            setEditingClass(null);
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
            Memuat kelas...
          </span>
        </div>
      ) : (
        <div className="transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
          <ClassTable
            classes={classes}
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
                {editingClass ? "Edit Kelas" : "Tambah Kelas Baru"}
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
              <ClassForm onSubmit={handleSubmit} initialData={editingClass} />
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, classId: null, className: "" })
        }
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.className}
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
