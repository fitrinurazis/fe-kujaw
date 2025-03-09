import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import SuccessPopup from "../components/common/SuccessPopup";
import ProgdiForm from "../components/progdis/ProgdiForm";
import ProgdiTable from "../components/progdis/ProgdiTable";
import {
  getProgdi,
  createProgdi,
  deleteProgdi,
  updateProgdi,
} from "../store/slices/progdiSlice";
import { FiPlus } from "react-icons/fi";

const selectProgdis = createSelector(
  (state) => state.progdis,
  (progdis) => ({
    progdis: progdis?.progdis,
    loading: progdis?.loading || false,
  })
);

export default function Progdis() {
  const dispatch = useDispatch();
  const { progdis, loading } = useSelector(selectProgdis);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgdi, setEditingProgdi] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    progdiId: null,
    progdiName: "",
  });
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(getProgdi());
  }, [dispatch]);

  const handleSubmit = (formData) => {
    if (editingProgdi) {
      dispatch(
        updateProgdi({ id: editingProgdi.id, progdiData: formData })
      ).then(() => {
        dispatch(getProgdi());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Program Studi berhasil diperbarui!",
        });
      });
    } else {
      dispatch(createProgdi(formData)).then(() => {
        dispatch(getProgdi());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Program Studi baru berhasil ditambahkan!",
        });
      });
    }
  };

  const handleDeleteClick = (progdiItem) => {
    setDeleteModal({
      isOpen: true,
      progdiId: progdiItem.id,
      progdiName: progdiItem.name,
    });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteProgdi(deleteModal.progdiId))
      .unwrap()
      .then(() => {
        dispatch(getProgdi());
        setDeleteModal({ isOpen: false, progdiId: null, progdiName: "" });
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Program Studi berhasil dihapus!",
        });
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  const handleEdit = (progdiItem) => {
    setEditingProgdi(progdiItem);
    setIsFormOpen(true);
  };

  return (
    <div className="p-3 mx-auto transition-colors duration-200 sm:p-4 lg:p-6 dark:text-gray-200">
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold transition-colors duration-200 sm:text-2xl dark:text-white">
          Program Studi
        </h2>
        <button
          onClick={() => {
            setEditingProgdi(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-3 py-2 text-sm text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:text-base sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-50"
        >
          <FiPlus className="mr-1 text-lg" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 transition-colors duration-200 dark:text-gray-300">
          <div className="w-10 h-10 transition-colors duration-200 border-t-2 border-b-2 rounded-full animate-spin border-primary sm:w-12 sm:h-12 dark:border-blue-400"></div>
          <span className="mt-3 text-sm text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
            Memuat program studi...
          </span>
        </div>
      ) : (
        <div className="transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
          <ProgdiTable
            progdis={progdis}
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
                {editingProgdi
                  ? "Edit Program Studi"
                  : "Tambah Program Studi Baru"}
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
              <ProgdiForm onSubmit={handleSubmit} initialData={editingProgdi} />
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, progdiId: null, progdiName: "" })
        }
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.progdiName}
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
