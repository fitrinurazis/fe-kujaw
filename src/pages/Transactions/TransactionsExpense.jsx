import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchTransactions,
  createExpenseTransaction,
  updateExpenseTransaction,
  deleteTransaction,
  clearError,
  updateTransactionStatus,
} from "../../store/slices/transactionSlice";
import TransactionExpenseTable from "../../components/transactions/TransactionExpenseTable";
import TransactionExpenseForm from "../../components/transactions/TransactionExpenseForm";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import SuccessPopup from "../../components/common/SuccessPopup";
import { FaPlus } from "react-icons/fa";
import LoadingState from "../../components/common/LoadingState";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";

export default function TransactionsExpense() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdmin = location.pathname.includes("/admin");
  const { items, loading, error } = useSelector((state) => state.transactions);

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    transactionId: null,
    transactionName: "",
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
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch transactions on component mount
  useEffect(() => {
    dispatch(fetchTransactions());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error popup when error occurs
  useEffect(() => {
    if (error) {
      setErrorPopup({
        isVisible: true,
        message: typeof error === "string" ? error : JSON.stringify(error),
      });
    }
  }, [error]);

  const expenseTransactions = items.filter((t) => t.type === "pengeluaran");

  const filteredTransactions =
    expenseTransactions.filter(
      (transaction) =>
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.customer?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.user?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.totalAmount &&
          transaction.totalAmount.toString().includes(searchTerm))
    ) || [];

  // Add pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Add this function to reset page
  const resetPage = () => setCurrentPage(1);

  // Add this function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (formData, isFormData = false) => {
    try {
      if (editingTransaction) {
        await dispatch(
          updateExpenseTransaction({
            id: editingTransaction.id,
            data: formData,
            isFormData: isFormData,
          })
        ).unwrap();

        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Transaksi pengeluaran berhasil diperbarui!",
        });

        setIsFormOpen(false);
        setEditingTransaction(null);
      } else {
        await dispatch(
          createExpenseTransaction({
            data: formData,
            isFormData: isFormData,
          })
        ).unwrap();

        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Transaksi pengeluaran berhasil dibuat!",
        });

        setIsFormOpen(false);
      }
      dispatch(fetchTransactions());
    } catch (error) {
      setErrorPopup({
        isVisible: true,
        message: error.message || "Terjadi kesalahan selama operasi",
      });
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setStatusUpdateLoading(true);
      await dispatch(updateTransactionStatus({ id, status })).unwrap();

      setSuccessPopup({
        isVisible: true,
        title: "Berhasil",
        message: `Status transaksi diperbarui menjadi ${status}!`,
      });
    } catch (error) {
      setErrorPopup({
        isVisible: true,
        message: error.message || "Gagal memperbarui status transaksi",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    const formattedTransaction = {
      ...transaction,
      userId: transaction.userId?.toString(),
      totalAmount: transaction.totalAmount?.toString() || "0",
      details:
        transaction.details?.map((detail) => ({
          id: detail.id,
          itemName: detail.itemName || "",
          quantity: detail.quantity,
          pricePerUnit: detail.pricePerUnit?.toString() || "0",
          totalPrice: detail.totalPrice?.toString() || "0",
          status: detail.status || "menunggu",
        })) || [],
    };

    setEditingTransaction(formattedTransaction);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    if (!transaction || !transaction.id) {
      setErrorPopup({
        isVisible: true,
        message: "Data transaksi tidak valid",
      });
      return;
    }

    setDeleteModal({
      isOpen: true,
      transactionId: transaction.id,
      transactionName: transaction.description || "transaksi ini",
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!deleteModal.transactionId) {
        setErrorPopup({
          isVisible: true,
          message: "ID transaksi tidak valid",
        });
        return;
      }

      await dispatch(
        deleteTransaction({
          id: deleteModal.transactionId,
          type: "pengeluaran",
        })
      ).unwrap();

      setDeleteModal({
        isOpen: false,
        transactionId: null,
        transactionName: "",
      });

      setSuccessPopup({
        isVisible: true,
        title: "Berhasil",
        message: "Transaksi pengeluaran berhasil dihapus!",
      });

      dispatch(fetchTransactions());
    } catch (error) {
      let errorMessage = "Gagal menghapus transaksi pengeluaran";

      if (
        error.message ===
        "Route not found. Please check your URL and try again."
      ) {
        errorMessage =
          "Endpoint API tidak ditemukan. Silakan hubungi administrator.";
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrorPopup({
        isVisible: true,
        message: errorMessage,
      });
    }
  };

  return (
    <div className="container px-4 py-4 mx-auto transition-colors duration-200 sm:px-6 lg:px-8 sm:py-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold text-gray-900 transition-colors duration-200 sm:text-2xl dark:text-white">
          Transaksi Pengeluaran
        </h2>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
            className="px-3 py-2 text-white transition-colors bg-blue-500 rounded-lg sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-600 dark:focus:ring-opacity-70"
            aria-label="Tambah Transaksi"
          >
            <FaPlus className="text-sm sm:text-base" />
          </button>
        )}
      </div>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div
            className="absolute inset-0 bg-black opacity-50 dark:opacity-60"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl mx-4 overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-gray-900/20">
            <div className="flex items-center justify-between px-4 py-3 transition-colors duration-200 border-b sm:px-6 sm:py-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 sm:text-xl dark:text-white">
                {editingTransaction
                  ? "Edit Transaksi Pengeluaran"
                  : "Tambah Transaksi Pengeluaran"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-gray-500 transition-colors hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">
              <TransactionExpenseForm
                onSubmit={handleSubmit}
                initialData={editingTransaction}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-6 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-10 dark:bg-gray-800 dark:shadow-gray-900/10">
          <LoadingState message="Memuat transaksi pengeluaran..." />
        </div>
      ) : (
        <div className="overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
          {/* Search Bar Component */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Cari transaksi pengeluaran berdasarkan ID, deskripsi, atau status..."
            resetPage={resetPage}
          />

          <TransactionExpenseTable
            transactions={currentTransactions}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusUpdate}
            isAdmin={isAdmin}
            statusUpdateLoading={statusUpdateLoading}
          />

          {/* Pagination Component */}
          <div className="px-6 py-3">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredTransactions.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            transactionId: null,
            transactionName: "",
          })
        }
        isAdmin={isAdmin}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.transactionName}
        title="Hapus Transaksi Pengeluaran"
        message={`Apakah Anda yakin ingin menghapus transaksi pengeluaran ini: ${deleteModal.transactionName}?`}
      />

      {/* Success Popup */}
      <SuccessPopup
        isVisible={successPopup.isVisible}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() =>
          setSuccessPopup({ isVisible: false, title: "", message: "" })
        }
        isAdmin={isAdmin}
      />

      {/* Error Popup */}
      {errorPopup.isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black opacity-50 dark:opacity-60"
            onClick={() => {
              setErrorPopup({ isVisible: false, message: "" });
              dispatch(clearError());
            }}
          ></div>
          <div className="relative w-full max-w-md p-5 transition-colors duration-200 bg-white rounded-lg shadow-lg sm:p-6 dark:bg-gray-800 dark:shadow-gray-900/20">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 mb-3 transition-colors duration-200 bg-red-100 rounded-full sm:w-12 sm:h-12 sm:mb-4 dark:bg-red-900/20">
                <svg
                  className="w-5 h-5 text-red-600 transition-colors duration-200 sm:w-6 sm:h-6 dark:text-red-400"
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

              <h3 className="text-base font-medium text-gray-900 transition-colors duration-200 sm:text-lg dark:text-white">
                Error
              </h3>
              <div className="mt-2 overflow-y-auto text-sm text-center text-gray-500 transition-colors duration-200 sm:text-base max-h-40 dark:text-gray-400">
                {errorPopup.message}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-600"
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
        </div>
      )}
    </div>
  );
}
