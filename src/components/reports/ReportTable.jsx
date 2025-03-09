import { formatCurrency } from "../../utils/formatters";

const ReportTable = ({ data, reportType }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
        Tidak ada data tersedia
      </div>
    );
  }

  // Different column configurations based on report type
  const getTableColumns = () => {
    switch (reportType) {
      case "sales":
        return [
          { key: "date", label: "Date" },
          { key: "customer", label: "Customer" },
          { key: "salesperson", label: "Salesperson" },
          { key: "type", label: "Type" },
          {
            key: "total",
            label: "Total",
            format: (value) => formatCurrency(value),
          },
        ];
      case "products":
        return [
          { key: "productName", label: "Product" },
          { key: "totalQuantity", label: "Quantity Sold" },
          {
            key: "totalRevenue",
            label: "Revenue",
            format: (value) => formatCurrency(value),
          },
        ];
      case "customers":
        return [
          { key: "customerName", label: "Customer" },
          { key: "transactionCount", label: "Transactions" },
          {
            key: "totalSpent",
            label: "Total Spent",
            format: (value) => formatCurrency(value),
          },
        ];
      case "income-expense":
        return [
          { key: "period", label: "Period" },
          {
            key: "totalIncome",
            label: "Pemasukan",
            format: (value) => formatCurrency(value),
          },
          {
            key: "totalExpense",
            label: "Pengeluaran",
            format: (value) => formatCurrency(value),
          },
          {
            key: "netIncome",
            label: "Laba Bersih",
            format: (value) => formatCurrency(value),
          },
        ];

      default:
        return Object.keys(data[0]).map((key) => ({ key, label: key }));
    }
  };

  const columns = getTableColumns();

  // Add a check for data structure mismatch
  const isDataStructureValid = () => {
    // At least one row should have some of the expected columns
    const firstRow = data[0];
    return columns.some((col) => firstRow[col.key] !== undefined);
  };

  if (!isDataStructureValid()) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
        Struktur data tidak cocok dengan jenis laporan yang dipilih. Silakan
        buat ulang laporan.
      </div>
    );
  }

  // Mobile version render - card-based for small screens
  const renderMobileCards = () => (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="p-3 transition-colors duration-200 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex justify-between py-1 transition-colors duration-200 border-b border-gray-100 last:border-0 dark:border-gray-700"
            >
              <span className="text-xs font-medium text-gray-600 transition-colors duration-200 dark:text-gray-400">
                {column.label}:
              </span>
              <span className={`text-sm ${getValueColorClass(column, row)}`}>
                {column.format && row[column.key] !== undefined
                  ? column.format(row[column.key])
                  : row[column.key] !== undefined
                  ? String(row[column.key])
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Helper to determine cell color classes
  const getValueColorClass = (column, row) => {
    if (column.key === "totalIncome")
      return "text-green-600 dark:text-green-400";
    if (column.key === "totalExpense") return "text-red-600 dark:text-red-400";
    if (column.key === "netIncome" && parseFloat(row[column.key]) >= 0)
      return "text-green-600 dark:text-green-400";
    if (column.key === "netIncome" && parseFloat(row[column.key]) < 0)
      return "text-red-600 dark:text-red-400";
    return "dark:text-gray-300";
  };

  // Desktop version - standard table
  return (
    <div className="overflow-x-auto">
      {/* Mobile card view */}
      {renderMobileCards()}

      {/* Desktop table view */}
      <table className="hidden min-w-full transition-colors duration-200 bg-white border border-gray-200 md:table dark:bg-gray-800 dark:border-gray-700">
        <thead>
          <tr className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2 text-xs font-semibold text-left text-gray-700 uppercase transition-colors duration-200 border-b border-gray-200 sm:px-4 sm:py-3 dark:text-gray-300 dark:border-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-700"
              }
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className={`px-3 py-2 text-xs sm:text-sm border-b border-gray-200 sm:px-4 sm:py-3 dark:border-gray-700 ${getValueColorClass(
                    column,
                    row
                  )} transition-colors duration-200`}
                >
                  {column.format && row[column.key] !== undefined
                    ? column.format(row[column.key])
                    : row[column.key] !== undefined
                    ? String(row[column.key])
                    : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
