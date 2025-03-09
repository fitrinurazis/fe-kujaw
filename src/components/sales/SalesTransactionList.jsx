import { useNavigate } from "react-router-dom";

const SalesTransactionList = ({ transactions, basePath }) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 mt-4 text-center border border-gray-200 rounded-lg sm:p-6 sm:mt-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Belum ada transaksi</p>
      </div>
    );
  }

  // Get transaction status style
  const getStatusStyle = (status) => {
    if (status === "selesai")
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (status === "diproses")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  // Get transaction type style
  const getTypeStyle = (type) => {
    return type === "pemasukan"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transaksi Terbaru
        </h3>
        <button
          onClick={() => navigate(`${basePath}/transactions`)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Lihat Semua
        </button>
      </div>

      {/* Mobile version - card style */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() =>
              navigate(`${basePath}/transactions/${transaction.id}`)
            }
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                #{transaction.id}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Tipe:</span>
                <span
                  className={`ml-1 font-medium ${
                    transaction.type === "pemasukan"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "pemasukan"
                    ? "Pemasukan"
                    : "Pengeluaran"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Tanggal:
                </span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                  {formatDate(transaction.transactionDate)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">
                  Deskripsi:
                </span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white line-clamp-1">
                  {transaction.description || "-"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                  {formatCurrency(transaction.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop version - table style */}
      <div className="hidden overflow-hidden border border-gray-200 rounded-lg md:block dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Tipe
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Deskripsi
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {transactions.slice(0, 5).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() =>
                    navigate(`${basePath}/transactions/${transaction.id}`)
                  }
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap sm:px-6 dark:text-white">
                    #{transaction.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyle(
                        transaction.type
                      )}`}
                    >
                      {transaction.type === "pemasukan"
                        ? "Pemasukan"
                        : "Pengeluaran"}
                    </span>
                  </td>
                  <td className="px-4 py-4 max-w-[200px] sm:px-6">
                    <div className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {transaction.description || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 dark:text-gray-400">
                    {formatDate(transaction.transactionDate)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 dark:text-gray-400">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 dark:text-gray-400">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SalesTransactionList;
