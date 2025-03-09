import { formatCurrency } from "../../utils/formatters";

const FinancialSummary = ({ data }) => {
  if (!data) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
        Data keuangan tidak tersedia
      </div>
    );
  }

  const { totalIncome, totalExpense, netIncome } = data;

  return (
    <div className="p-4 transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
      <h3 className="mb-3 text-base font-semibold text-gray-800 transition-colors duration-200 sm:text-lg dark:text-white">
        Ringkasan Keuangan
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="p-3 transition-colors duration-200 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Total Pemasukan
          </p>
          <p className="text-lg font-semibold text-green-600 transition-colors duration-200 sm:text-xl dark:text-green-400">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="p-3 transition-colors duration-200 rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Total Pengeluaran
          </p>
          <p className="text-lg font-semibold text-red-600 transition-colors duration-200 sm:text-xl dark:text-red-400">
            {formatCurrency(totalExpense)}
          </p>
        </div>

        <div
          className={`p-3 rounded-lg ${
            parseFloat(netIncome) >= 0
              ? "bg-blue-50 dark:bg-blue-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          } transition-colors duration-200`}
        >
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Laba Bersih
          </p>
          <p
            className={`text-lg font-semibold sm:text-xl ${
              parseFloat(netIncome) >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400"
            } transition-colors duration-200`}
          >
            {formatCurrency(netIncome)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
