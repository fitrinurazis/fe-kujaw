import { formatCurrency } from "../../utils/formatters";

export default function IncomeExpenseReport({ dateRange, incomeExpenseData }) {
  if (!incomeExpenseData) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:text-gray-400">
        <p className="text-sm sm:text-base">
          Tidak ada data keuangan yang tersedia untuk rentang tanggal yang
          dipilih.
        </p>
      </div>
    );
  }

  let processedData;

  // Check if the data is directly in dataSource with totalIncome property
  if (incomeExpenseData.totalIncome !== undefined) {
    processedData = [incomeExpenseData];
  }
  // Check if the data is in dataSource.data as an array
  else if (incomeExpenseData.data && Array.isArray(incomeExpenseData.data)) {
    processedData = incomeExpenseData.data;
  }
  // If data is in dataSource.data as a single object
  else if (incomeExpenseData.data && !Array.isArray(incomeExpenseData.data)) {
    processedData = [incomeExpenseData.data];
  } else {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:text-gray-400">
        <p className="text-sm sm:text-base">
          Tidak dapat memproses data pemasukan-pengeluaran
        </p>
      </div>
    );
  }

  // Now check if the processed data has at least one element
  if (!processedData || !processedData[0]) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:text-gray-400">
        <p className="text-sm sm:text-base">
          Tidak ada data keuangan yang tersedia untuk rentang tanggal yang
          dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="mb-1 text-lg font-semibold transition-colors duration-200 sm:text-xl md:text-2xl dark:text-white">
          Laporan Pemasukan dan Pengeluaran
        </h3>
        <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-400">
          Periode: {dateRange.startDate} sampai {dateRange.endDate}
        </p>
      </div>

      <FinancialSummary data={processedData[0]} />
      <TransactionDetails data={processedData[0]} />
    </div>
  );
}

function FinancialSummary({ data }) {
  return (
    <div className="p-3 mb-4 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-5 sm:mb-6 dark:bg-gray-800 dark:border dark:border-gray-700">
      <h4 className="mb-2 text-sm font-medium transition-colors duration-200 sm:text-base dark:text-white">
        Ringkasan Keuangan
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div className="p-2 transition-colors duration-200 rounded-lg sm:p-3 bg-green-50 dark:bg-green-900/20">
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Total Pemasukan
          </p>
          <p className="text-base font-bold text-green-600 transition-colors duration-200 sm:text-lg dark:text-green-400">
            {formatCurrency(data.totalIncome)}
          </p>
        </div>
        <div className="p-2 transition-colors duration-200 rounded-lg sm:p-3 bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Total Pengeluaran
          </p>
          <p className="text-base font-bold text-red-600 transition-colors duration-200 sm:text-lg dark:text-red-400">
            {formatCurrency(data.totalExpense)}
          </p>
        </div>
        <div
          className={`p-2 sm:p-3 rounded-lg ${
            parseFloat(data.netIncome) >= 0
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          } transition-colors duration-200`}
        >
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Pendapatan bersih
          </p>
          <p
            className={`text-base sm:text-lg font-bold ${
              parseFloat(data.netIncome) >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            } transition-colors duration-200`}
          >
            {formatCurrency(data.netIncome)}
          </p>
        </div>
      </div>
    </div>
  );
}

function TransactionDetails({ data }) {
  return (
    <div className="p-3 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-5 dark:bg-gray-800 dark:border dark:border-gray-700">
      <h4 className="mb-3 text-sm font-medium transition-colors duration-200 sm:text-base dark:text-white">
        Detail Transaksi
      </h4>

      {/* Income Transactions */}
      <div className="mb-4">
        <h5 className="mb-2 text-sm font-medium text-green-600 transition-colors duration-200 dark:text-green-400">
          Detail Pemasukan
        </h5>
        {data.incomeTransactions && data.incomeTransactions.length > 0 ? (
          <TransactionTable
            transactions={data.incomeTransactions}
            colorClass="text-green-600 dark:text-green-400"
          />
        ) : (
          <p className="text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Tidak ada data pemasukan untuk periode ini.
          </p>
        )}
      </div>

      {/* Expense Transactions */}
      <div>
        <h5 className="mb-2 text-sm font-medium text-red-600 transition-colors duration-200 dark:text-red-400">
          Detail Pengeluaran
        </h5>
        {data.expenseTransactions && data.expenseTransactions.length > 0 ? (
          <TransactionTable
            transactions={data.expenseTransactions}
            colorClass="text-red-600 dark:text-red-400"
          />
        ) : (
          <p className="text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Tidak ada data pengeluaran untuk periode ini.
          </p>
        )}
      </div>
    </div>
  );
}

function TransactionTable({ transactions, colorClass }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Tanggal
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Deskripsi
            </th>
            <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {transactions.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-750"
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
            >
              <td className="px-3 py-2 text-sm transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {item.date}
              </td>
              <td className="px-3 py-2 text-sm transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {item.description}
              </td>

              <td
                className={`px-3 py-2 text-sm whitespace-nowrap ${colorClass} transition-colors duration-200`}
              >
                {formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
