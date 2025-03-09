import PropTypes from "prop-types";
import { formatCurrency, formatDate } from "../../../utils/formatters.js";

export default function TransactionBasicInfo({ transaction }) {
  const renderStatusBadge = (status) => {
    let badgeClass = "";
    switch (status) {
      case "selesai":
        badgeClass =
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        break;
      case "diproses":
        badgeClass =
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        break;
      case "menunggu":
        badgeClass =
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        break;
      default:
        badgeClass =
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }

    return (
      <span
        className={`px-2.5 py-1 text-xs font-medium rounded-full ${badgeClass} transition-colors duration-200`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 transition-colors duration-200 border border-gray-200 rounded-lg sm:p-5 dark:border-gray-700">
      <h3 className="mb-3 text-lg font-semibold transition-colors duration-200 dark:text-white">
        Informasi Transaksi
      </h3>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
            ID Transaksi
          </span>
          <span className="font-medium transition-colors duration-200 dark:text-white">
            #{transaction.id}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Tanggal
          </span>
          <span className="font-medium transition-colors duration-200 dark:text-white">
            {formatDate(transaction.transactionDate)}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Deskripsi
          </span>
          <span className="font-medium transition-colors duration-200 dark:text-white">
            {transaction.description}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Status
          </span>
          {renderStatusBadge(transaction.status)}
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Tipe
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 transition-colors duration-200">
            {transaction.type === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Total
          </span>
          <span className="text-lg font-bold text-gray-900 transition-colors duration-200 dark:text-white">
            {formatCurrency(transaction.totalAmount)}
          </span>
        </div>

        {transaction.customer && (
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
              Pelanggan
            </span>
            <span className="font-medium transition-colors duration-200 dark:text-white">
              {transaction.customer.name}
            </span>
          </div>
        )}

        {transaction.user && (
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm font-medium text-gray-500 transition-colors duration-200 dark:text-gray-400">
              Sales
            </span>
            <span className="font-medium transition-colors duration-200 dark:text-white">
              {transaction.user.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

TransactionBasicInfo.propTypes = {
  transaction: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
};
