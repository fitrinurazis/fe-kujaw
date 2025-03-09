import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchTransactionById,
  clearCurrentTransaction,
  updateTransactionStatus,
} from "../../store/slices/transactionSlice";

// Import sub-components
import TransactionHeader from "../../components/transactions/detail/TransactionHeader";
import TransactionBasicInfo from "../../components/transactions/detail/TransactionBasicInfo";
import TransactionProofImage from "../../components/transactions/detail/TransactionProofImage";
import TransactionItemsTable from "../../components/transactions/detail/TransactionItemsTable";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import SuccessPopup from "../../components/common/SuccessPopup"; // Tambahkan SuccessPopup

export default function TransactionExpenseDetail() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Gunakan hook notifikasi

  const isAdmin = location.pathname.includes("/admin");
  const { currentTransaction, loading, error } = useSelector(
    (state) => state.transactions
  );

  // Tambahkan state untuk success popup
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchTransactionById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentTransaction());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    const basePath = isAdmin ? "/admin" : "/sales";
    try {
      navigate(-1);
    } catch (error) {
      navigate(`${basePath}/transactions`);
    }
  };

  // Fungsi untuk mengupdate status item
  const handleUpdateItemStatus = async (itemId, newStatus) => {
    try {
      // Cari item yang akan diupdate untuk mendapatkan status sebelumnya
      const item = currentTransaction.details.find(
        (detail) => detail.id === itemId
      );
      if (!item) return;

      const oldStatus = getStatusLabel(item.status);
      const newStatusLabel = getStatusLabel(newStatus);

      // Dispatch aksi update status
      await dispatch(
        updateTransactionStatus({
          transactionId: id,
          itemId,
          status: newStatus,
        })
      ).unwrap();

      // Refresh data transaksi
      dispatch(fetchTransactionById(id));

      // Tambahkan notifikasi tentang perubahan status
      addStatusUpdateNotification(
        item.itemName || item.productName || `Item #${itemId}`,
        oldStatus,
        newStatusLabel,
        id
      );

      // Tampilkan popup sukses
      setSuccessPopup({
        isVisible: true,
        title: "Status Diperbarui",
        message: `Status item berhasil diubah menjadi "${newStatusLabel}"!`,
      });
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  // Fungsi untuk mendapatkan label status yang sesuai
  const getStatusLabel = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu";
      case "diproses":
        return "Diproses";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-4 transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
        <LoadingState message="Memuat detail transaksi..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="transition-colors duration-200">
        <ErrorState
          error={error}
          onBack={handleBack}
          backText="Kembali ke Transaksi"
        />
      </div>
    );
  }

  if (!currentTransaction) {
    return (
      <div className="transition-colors duration-200">
        <ErrorState
          title="Transaksi Tidak Ditemukan"
          error="Transaksi yang Anda cari tidak ada atau telah dihapus."
          onBack={handleBack}
          backText="Kembali ke Transaksi"
          type="warning"
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-4 mx-auto transition-colors duration-200 sm:px-6 lg:px-8 sm:py-6 dark:text-gray-200">
      <TransactionHeader onBack={handleBack} />

      <div className="overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
        <div className="p-4 sm:p-6">
          {/* Basic Info and Proof Image Section */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <TransactionBasicInfo
              transaction={currentTransaction}
              isAdmin={isAdmin}
            />

            <TransactionProofImage proofImage={currentTransaction.proofImage} />
          </div>

          {/* Transaction Details/Items Section */}
          {currentTransaction.details &&
            currentTransaction.details.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3 className="mb-3 text-lg font-semibold transition-colors duration-200 sm:mb-4 dark:text-white">
                  Detail Transaksi
                </h3>
                <div className="overflow-x-auto">
                  <TransactionItemsTable
                    details={currentTransaction.details}
                    totalAmount={currentTransaction.totalAmount}
                    transactionId={id}
                    isAdmin={isAdmin}
                    onStatusChange={handleUpdateItemStatus} // Tambahkan handler untuk update status
                  />
                </div>
              </div>
            )}

          {/* Notes Section if applicable */}
          {currentTransaction.notes && (
            <div className="mt-6 sm:mt-8">
              <h3 className="mb-2 text-lg font-semibold transition-colors duration-200 sm:mb-4 dark:text-white">
                Keterangan
              </h3>

              <div className="p-3 transition-colors duration-200 rounded-lg sm:p-4 bg-gray-50 dark:bg-gray-700/50">
                <p className="text-sm transition-colors duration-200 sm:text-base dark:text-gray-300">
                  {currentTransaction.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}
