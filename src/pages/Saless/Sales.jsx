import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getSales,
  createSales,
  updateSales,
  deleteSales,
  clearError,
} from "../../store/slices/userSlice";
import SalesTable from "../../components/sales/SalesTable";
import SalesForm from "../../components/sales/SalesForm";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import SuccessPopup from "../../components/common/SuccessPopup";
import { FiPlus } from "react-icons/fi";

export default function Sales() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const dispatch = useDispatch();
  const { salesList, loading, error } = useSelector((state) => state.user);

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSales, setEditingSales] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    salesId: null,
    salesName: "",
  });
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const [errorPopup, setErrorPopup] = useState({
    isVisible: false,
    message: "",
  });

  // Fetch sales data
  useEffect(() => {
    dispatch(getSales());

    // Clear errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error popup when error occurs
  useEffect(() => {
    if (error) {
      setErrorPopup({
        isVisible: true,
        message:
          typeof error === "string"
            ? error
            : "Gagal melakukan operasi pada data sales",
      });
    }
  }, [error]);

  const handleSubmit = async (formData) => {
    try {
      if (editingSales) {
        await dispatch(
          updateSales({
            id: editingSales.id,
            salesData: formData,
          })
        ).unwrap();

        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Data sales berhasil diperbarui!",
        });
      } else {
        await dispatch(createSales(formData)).unwrap();

        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Sales baru berhasil ditambahkan!",
        });
      }
      setIsFormOpen(false);
      setEditingSales(null);
      dispatch(getSales());
    } catch (err) {
      console.error("Failed operation:", err);
      setErrorPopup({
        isVisible: true,
        message: err.message || "Terjadi kesalahan saat menyimpan data",
      });
    }
  };

  const handleDeleteClick = (sales) => {
    setDeleteModal({
      isOpen: true,
      salesId: sales.id,
      salesName: sales.name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteSales(deleteModal.salesId)).unwrap();

      setSuccessPopup({
        isVisible: true,
        title: "Berhasil",
        message: "Sales berhasil dihapus!",
      });

      setDeleteModal({
        isOpen: false,
        salesId: null,
        salesName: "",
      });

      dispatch(getSales());
    } catch (err) {
      console.error("Delete failed:", err);
      setErrorPopup({
        isVisible: true,
        message: err.message || "Gagal menghapus sales",
      });
    }
  };

  return (
    <div className="max-w-screen-lg p-3 mx-auto sm:p-4">
      <div className="flex items-start justify-between mb-4 sm:flex-row sm:items-center sm:mb-6">
        <h2 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white sm:mb-0">
          Sales
        </h2>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingSales(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            <FiPlus className="w-4 h-4 mr-1.5" />
          </button>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto sm:p-4">
          <div
            className="absolute inset-0 bg-black opacity-50 dark:opacity-50"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between p-3 border-b sm:p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                {editingSales ? "Edit Sales" : "Tambah Sales Baru"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <SalesForm
              onSubmit={handleSubmit}
              initialData={editingSales}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}

      {/* Sales Table */}
      <SalesTable
        salesList={salesList}
        onDelete={handleDeleteClick}
        loading={loading}
        isAdmin={isAdmin}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, salesId: null, salesName: "" })
        }
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.salesName}
        title="Hapus Sales"
        message={`Apakah Anda yakin ingin menghapus sales "${deleteModal.salesName}"? Semua data terkait sales ini juga akan dihapus.`}
      />

      {/* Success Popup */}
      <SuccessPopup
        isVisible={successPopup.isVisible}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() =>
          setSuccessPopup({ isVisible: false, title: "", message: "" })
        }
      />

      {/* Error Popup */}
      {errorPopup.isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
            onClick={() => {
              setErrorPopup({ isVisible: false, message: "" });
              dispatch(clearError());
            }}
          ></div>
          <div className="relative w-full max-w-md p-4 mx-auto bg-white rounded-lg shadow-lg sm:p-6 dark:bg-gray-800">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 mb-3 bg-red-100 rounded-full sm:w-12 sm:h-12 sm:mb-4 dark:bg-red-900/20">
                <svg
                  className="w-5 h-5 text-red-600 sm:w-6 sm:h-6 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Error
              </h3>
              <div className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                {errorPopup.message}
              </div>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={() => {
                  setErrorPopup({ isVisible: false, message: "" });
                  dispatch(clearError());
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
