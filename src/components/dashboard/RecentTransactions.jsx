import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const RecentTransactions = ({ transactions = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "menunggu":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "diproses":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Mobile card view for small screens
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-3 transition-colors duration-200 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 transition-colors duration-200 bg-gray-100 rounded-full dark:bg-gray-700">
                  {transaction.type === "pemasukan" ? (
                    <FiArrowUp className="text-green-500 dark:text-green-400" />
                  ) : (
                    <FiArrowDown className="text-red-500 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[180px] dark:text-white transition-colors duration-200">
                    {transaction.description || "-"}
                  </div>
                  <div className="text-xs text-gray-500 transition-colors duration-200 dark:text-gray-400">
                    {formatDate(transaction.transactionDate)}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status || "Belum Dikonfirmasi"}
              </span>
            </div>

            <div className="grid grid-cols-2 mt-2 text-xs gap-x-2 gap-y-1">
              <div>
                <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                  Pelanggan:
                </span>{" "}
                <span className="dark:text-gray-300">
                  {transaction.customer?.name || "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                  Sales:
                </span>{" "}
                <span className="dark:text-gray-300">
                  {transaction.user?.name || "-"}
                </span>
              </div>
              <div className="col-span-2 pt-1 mt-1 transition-colors duration-200 border-t border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                  Total:
                </span>{" "}
                <span
                  className={`font-medium ${
                    transaction.type === "pemasukan"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  } transition-colors duration-200`}
                >
                  {transaction.type === "pengeluaran" ? "-" : "+"}
                  Rp {parseFloat(transaction.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-sm text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
          Tidak ada transaksi
        </div>
      )}
    </div>
  );

  // Desktop table view
  const renderDesktopView = () => (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Transaksi
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Pelanggan
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Sales
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Total
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Tanggal
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-2 py-3 whitespace-nowrap sm:px-3 lg:px-6">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 transition-colors duration-200 bg-gray-100 rounded-full dark:bg-gray-700">
                      {transaction.type === "pemasukan" ? (
                        <FiArrowUp className="text-green-500 dark:text-green-400" />
                      ) : (
                        <FiArrowDown className="text-red-500 dark:text-red-400" />
                      )}
                    </div>
                    <div className="ml-2">
                      <div className="max-w-xs text-sm font-medium text-gray-900 truncate transition-colors duration-200 dark:text-white">
                        {transaction.description || "-"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap sm:px-3 lg:px-6">
                  <div className="text-sm text-gray-900 transition-colors duration-200 dark:text-white">
                    {transaction.customer?.name || "-"}
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap sm:px-3 lg:px-6">
                  <div className="text-sm text-gray-900 transition-colors duration-200 dark:text-white">
                    {transaction.user?.name || "-"}
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap sm:px-3 lg:px-6">
                  <div
                    className={`text-sm font-medium ${
                      transaction.type === "pemasukan"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    } transition-colors duration-200`}
                  >
                    {transaction.type === "pengeluaran" ? "-" : "+"}
                    Rp{" "}
                    {parseFloat(transaction.totalAmount || 0).toLocaleString()}
                  </div>
                </td>
                <td className="px-2 py-3 text-sm text-gray-500 transition-colors duration-200 whitespace-nowrap sm:px-3 lg:px-6 dark:text-gray-300">
                  {formatDate(transaction.transactionDate)}
                </td>
                <td className="px-2 py-3 whitespace-nowrap sm:px-3 lg:px-6">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status || "Belum Dikonfirmasi"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 text-sm text-center text-gray-500 transition-colors duration-200 dark:text-gray-400"
              >
                Tidak ada transaksi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {renderMobileView()}
      {renderDesktopView()}
    </div>
  );
};
export default RecentTransactions;
