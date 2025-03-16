import PropTypes from "prop-types";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { useState } from "react";
import { getImageUrl } from "../../utils/helpers";
import notFoundImage from "../../assets/image-not-found.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function TransactionIncomeTable({
  transactions,
  onEdit,
  onDelete,
  isAdmin,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    url: "",
  });

  // Function to show image preview
  const showImagePreview = (imageUrl) => {
    if (!imageUrl) return;

    setImagePreview({
      isOpen: true,
      url: getImageUrl(imageUrl),
    });
  };

  // Function to handle row click and navigate to detail page
  const handleRowClick = (transactionId) => {
    // Check if we're in admin or sales route
    const basePath = location.pathname.includes("/admin") ? "/admin" : "/sales";
    navigate(`${basePath}/transactions/${transactionId}`);
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  // Render status badge with appropriate colors
  const renderStatusBadge = (status) => {
    let badgeClass = "";

    switch (status) {
      case "selesai":
        badgeClass =
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
        break;
      case "diproses":
        badgeClass =
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
        break;
      case "menunggu":
        badgeClass =
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
        break;
      default:
        badgeClass =
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        break;
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass} transition-colors duration-200`}
      >
        {status}
      </span>
    );
  };

  // Mobile card view for small screens
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {transactions?.map((transactionItem) => (
        <div
          key={transactionItem.id}
          className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/10"
          onClick={(e) => {
            if (e.target.closest("button")) return;
            handleRowClick(transactionItem.id);
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="mb-1 font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                {transactionItem.description || "No Description"}
              </h3>
              <p className="text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
                {formatDate(transactionItem.transactionDate)}
              </p>
            </div>
            {renderStatusBadge(transactionItem.status)}
          </div>

          <div className="grid grid-cols-2 mt-3 text-sm gap-x-4 gap-y-2">
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Pelanggan:
              </span>
              <span className="transition-colors duration-200 dark:text-gray-300">
                {transactionItem.customer?.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Sales:
              </span>
              <span className="transition-colors duration-200 dark:text-gray-300">
                {transactionItem.user?.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Tipe:
              </span>
              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded dark:bg-green-900/20 dark:text-green-400 transition-colors duration-200">
                {transactionItem.type}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Total:
              </span>
              <span className="font-semibold transition-colors duration-200 dark:text-white">
                {formatCurrency(transactionItem.totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between col-span-2 pt-2 mt-2 transition-colors duration-200 border-t border-gray-100 dark:border-gray-700">
              {transactionItem.proofImage ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showImagePreview(transactionItem.proofImage);
                  }}
                  className="flex items-center text-blue-500 transition-colors duration-200 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <FiEye className="mr-1" />
                  <span className="text-sm">Lihat Bukti</span>
                </button>
              ) : (
                <span className="text-sm text-gray-400 transition-colors duration-200 dark:text-gray-500">
                  Tidak ada bukti
                </span>
              )}

              {isAdmin && (
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(transactionItem);
                    }}
                    className="p-2 text-blue-500 transition-colors duration-200 rounded-full hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    aria-label="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(transactionItem);
                    }}
                    className="p-2 text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    aria-label="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const renderDesktopView = () => (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="w-20 px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Tanggal
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 w-36 dark:text-gray-300">
              Pelanggan
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Sales
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Deskripsi
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Tipe
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Bukti Transaksi
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Total Pemasukan
            </th>
            <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Status
            </th>
            {isAdmin && (
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {transactions?.map((transactionItem) => (
            <tr
              key={transactionItem.id}
              onClick={(e) => {
                // Prevent navigation if clicking on buttons or view proof
                if (e.target.closest("button") || e.target.closest("select"))
                  return;
                handleRowClick(transactionItem.id);
              }}
              className="transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <td className="w-20 px-3 py-4 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {formatDate(transactionItem.transactionDate)}
              </td>
              <td className="px-3 py-4 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {transactionItem.customer?.name || "-"}
              </td>
              <td className="px-3 py-4 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {transactionItem.user?.name || "-"}
              </td>
              <td className="px-3 py-4 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {transactionItem.description}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold text-green-800 transition-colors duration-200 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
                  {transactionItem.type}
                </span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                {transactionItem.proofImage ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      showImagePreview(transactionItem.proofImage);
                    }}
                    className="flex items-center text-blue-500 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FiEye className="mr-1" />
                    <span>Lihat</span>
                  </button>
                ) : (
                  <span className="text-gray-400 transition-colors duration-200 dark:text-gray-500">
                    Tidak ada bukti
                  </span>
                )}
              </td>
              <td className="px-3 py-4 font-medium transition-colors duration-200 whitespace-nowrap dark:text-white">
                {formatCurrency(transactionItem.totalAmount)}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                {renderStatusBadge(transactionItem.status)}
              </td>
              {isAdmin && (
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        onEdit(transactionItem);
                      }}
                      className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      aria-label="Edit transaction"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        onDelete(transactionItem);
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      aria-label="Delete transaction"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div>
      {/* Responsive view switching */}
      {renderMobileView()}
      {renderDesktopView()}

      {/* Image Preview Modal - Made responsive */}
      {imagePreview.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black opacity-50 dark:opacity-60"
            onClick={() => setImagePreview({ isOpen: false, url: "" })}
          ></div>

          <div className="relative z-10 p-3 sm:p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-gray-900/20 w-full max-w-lg max-h-[90vh] flex flex-col transition-colors duration-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-base font-medium transition-colors duration-200 sm:text-lg dark:text-white">
                Bukti Transaksi
              </h3>
              <button
                onClick={() => setImagePreview({ isOpen: false, url: "" })}
                className="text-gray-500 hover:text-gray-700 p-1.5 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <img
                src={imagePreview.url}
                alt="Transaction Proof"
                className="object-contain w-full h-auto max-h-[70vh] bg-gray-100 dark:bg-gray-900 transition-colors duration-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = notFoundImage;
                  console.error("Failed to load image:", imagePreview.url);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TransactionIncomeTable.propTypes = {
  transactions: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func,
  isAdmin: PropTypes.bool,
  statusUpdateLoading: PropTypes.bool,
};
