import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import PropTypes from "prop-types";

import {
  updateTransactionStatus,
  fetchTransactionById,
} from "../../../store/slices/transactionSlice";
import { formatCurrency as formatToRupiah } from "../../../utils/formatters";

export default function TransactionItemsTable({
  details,
  totalAmount,
  transactionId,
  isAdmin,
}) {
  const dispatch = useDispatch();
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editedStatus, setEditedStatus] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Function to handle item status update
  const handleStatusUpdate = async (detailId, status) => {
    if (!status) {
      alert("Silakan pilih status");
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateTransactionStatus({
          transactionId,
          detailId,
          status,
        })
      ).unwrap();

      setEditingDetailId(null);
      // Refresh the transaction data
      dispatch(fetchTransactionById(transactionId));
    } catch (error) {
      alert(
        `Gagal mengupdate status item: ${error.message || "Terjadi kesalahan"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    const statusClasses = {
      selesai:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      diproses:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      menunggu: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };

    const badgeClass = statusClasses[status] || statusClasses.default;

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass} transition-colors duration-200`}
      >
        {status || "menunggu"}
      </span>
    );
  };

  // Mobile card view for small screens
  const renderMobileView = () => (
    <div className="space-y-4 md:hidden">
      {details.map((detail) => (
        <div
          key={detail.id}
          className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between mb-2">
            <h3 className="font-medium transition-colors duration-200 dark:text-white">
              {detail.itemName}
            </h3>
            {isAdmin && (
              <div>
                {editingDetailId === detail.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleStatusUpdate(
                          detail.id,
                          editedStatus[detail.id] || detail.status || "menunggu"
                        );
                      }}
                      disabled={isSaving}
                      className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => setEditingDetailId(null)}
                      className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingDetailId(detail.id)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Jumlah:
              </span>{" "}
              <span className="transition-colors duration-200 dark:text-gray-300">
                {detail.quantity}
              </span>
            </div>
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Harga:
              </span>{" "}
              <span className="transition-colors duration-200 dark:text-gray-300">
                {formatToRupiah(detail.pricePerUnit)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Total:
              </span>{" "}
              <span className="transition-colors duration-200 dark:text-gray-300">
                {formatToRupiah(detail.totalPrice)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Status:
              </span>{" "}
              {isAdmin && editingDetailId === detail.id ? (
                <select
                  value={editedStatus[detail.id] || detail.status || "menunggu"}
                  onChange={(e) =>
                    setEditedStatus({
                      ...editedStatus,
                      [detail.id]: e.target.value,
                    })
                  }
                  className="mt-1 w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
                  disabled={isSaving}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                </select>
              ) : (
                renderStatusBadge(detail.status)
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between p-4 font-medium transition-colors duration-200 rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="transition-colors duration-200 dark:text-gray-300">
          Total:
        </span>
        <span className="font-bold transition-colors duration-200 dark:text-white">
          {formatToRupiah(totalAmount)}
        </span>
      </div>
    </div>
  );

  // Desktop table view
  const renderDesktopView = () => (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full transition-colors duration-200 dark:text-gray-300">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Item
            </th>
            <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Jumlah
            </th>
            <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Harga
            </th>
            <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Total Harga
            </th>
            <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Status
            </th>
            {isAdmin && (
              <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {details.map((detail) => (
            <tr
              key={detail.id}
              className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-3 transition-colors duration-200 whitespace-nowrap dark:text-white">
                {detail.itemName}
              </td>
              <td className="px-4 py-3 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {detail.quantity}
              </td>
              <td className="px-4 py-3 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {formatToRupiah(detail.pricePerUnit)}
              </td>
              <td className="px-4 py-3 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {formatToRupiah(detail.totalPrice)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {isAdmin && editingDetailId === detail.id ? (
                  <div className="flex items-center">
                    <select
                      value={
                        editedStatus[detail.id] || detail.status || "menunggu"
                      }
                      onChange={(e) =>
                        setEditedStatus({
                          ...editedStatus,
                          [detail.id]: e.target.value,
                        })
                      }
                      className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
                      disabled={isSaving}
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>
                ) : (
                  renderStatusBadge(detail.status)
                )}
              </td>
              {isAdmin && (
                <td className="px-4 py-3 whitespace-nowrap">
                  {editingDetailId === detail.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          handleStatusUpdate(
                            detail.id,
                            editedStatus[detail.id] ||
                              detail.status ||
                              "menunggu"
                          );
                        }}
                        disabled={isSaving}
                        className="p-1.5 text-green-600 hover:text-green-800 transition-colors dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                        aria-label="Save"
                      >
                        <FiSave size={16} />
                      </button>

                      <button
                        onClick={() => setEditingDetailId(null)}
                        className="p-1.5 text-red-600 hover:text-red-800 transition-colors dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                        aria-label="Cancel"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingDetailId(detail.id)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      aria-label="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <td
              colSpan={isAdmin ? 5 : 4}
              className="px-4 py-3 font-medium text-right transition-colors duration-200 dark:text-gray-300"
            >
              Total:
            </td>
            <td className="px-4 py-3 font-bold transition-colors duration-200 dark:text-white">
              {formatToRupiah(totalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  return (
    <div>
      {renderMobileView()}
      {renderDesktopView()}
    </div>
  );
}

TransactionItemsTable.propTypes = {
  details: PropTypes.array.isRequired,
  totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  transactionId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
