import { formatCurrency } from "../../utils/formatters";

const CustomerTransactions = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
        Data transaksi pelanggan tidak tersedia
      </div>
    );
  }

  // Mobile view - card based
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {data.map((item, index) => (
        <div
          key={index}
          className="p-3 transition-colors duration-200 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="mb-2">
            <h4 className="font-medium text-gray-900 transition-colors duration-200 dark:text-white">
              {item.customer?.name || "Pelanggan " + (index + 1)}
            </h4>
            <p className="text-xs text-gray-500 transition-colors duration-200 dark:text-gray-400">
              {item.customer?.email}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Transaksi
              </p>
              <p className="font-medium text-gray-800 transition-colors duration-200 dark:text-gray-200">
                {item.transactionCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Total Belanja
              </p>
              <p className="font-medium text-blue-600 transition-colors duration-200 dark:text-blue-400">
                {formatCurrency(item.totalSpent)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop view - table based
  return (
    <div className="p-4 transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
      <h3 className="mb-3 text-base font-semibold text-gray-800 transition-colors duration-200 sm:text-lg dark:text-white">
        Transaksi Pelanggan
      </h3>

      {renderMobileView()}

      <div className="hidden md:block">
        <table className="min-w-full transition-colors duration-200 bg-white dark:bg-gray-800">
          <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
                Pelanggan
              </th>
              <th className="px-4 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
                Email
              </th>
              <th className="px-4 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
                Jumlah Transaksi
              </th>
              <th className="px-4 py-2 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
                Total Belanja
              </th>
            </tr>
          </thead>
          <tbody className="transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-750"
                }
              >
                <td className="px-4 py-2 transition-colors duration-200 whitespace-nowrap dark:text-white">
                  {item.customer?.name || "Pelanggan " + (index + 1)}
                </td>
                <td className="px-4 py-2 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                  {item.customer?.email || "-"}
                </td>
                <td className="px-4 py-2 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                  {item.transactionCount}
                </td>
                <td className="px-4 py-2 font-medium text-blue-600 transition-colors duration-200 whitespace-nowrap dark:text-blue-400">
                  {formatCurrency(item.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTransactions;
