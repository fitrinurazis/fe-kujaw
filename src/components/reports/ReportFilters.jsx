import { useState, useEffect } from "react";
import { format, subMonths } from "date-fns";

const ReportFilters = ({ onFilterChange, onGenerateReport, isLoading }) => {
  const [startDate, setStartDate] = useState(
    format(new Date().setDate(1), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reportType, setReportType] = useState(""); // Empty default value
  const [datePreset, setDatePreset] = useState(""); // Empty default value
  const [filtersSelected, setFiltersSelected] = useState(false);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    checkFiltersSelected(e.target.value, datePreset);
  };

  const handleDatePresetChange = (e) => {
    const preset = e.target.value;
    setDatePreset(preset);
    checkFiltersSelected(reportType, preset);

    const now = new Date();
    let start, end;

    switch (preset) {
      case "thisMonth":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "last3Months":
        start = subMonths(now, 3);
        end = now;
        break;
      case "thisYear":
        start = new Date(now.getFullYear(), 0, 1);
        end = now;
        break;
      case "custom":
        // Don't change dates for custom
        return;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
    }

    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  };

  const checkFiltersSelected = (rType, dPreset) => {
    setFiltersSelected(rType !== "" && dPreset !== "");
  };

  const handleApplyFilters = () => {
    onFilterChange({
      startDate,
      endDate,
      reportType,
    });
  };

  // Only update parent component when date preset changes and filters are selected
  useEffect(() => {
    if (datePreset !== "custom" && datePreset !== "" && reportType !== "") {
      handleApplyFilters();
    }
  }, [startDate, endDate, reportType, datePreset]);

  // Check if dates are valid (end date cannot be before start date)
  const isDateRangeValid = () => {
    return new Date(endDate) >= new Date(startDate);
  };

  return (
    <div className="p-3 md:p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Jenis Laporan
          </label>
          <select
            value={reportType}
            onChange={handleReportTypeChange}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md sm:text-base sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
          >
            <option value="">Pilih Jenis Laporan</option>
            <option value="sales">Semua Transaksi</option>
            <option value="products">Penjualan Produk</option>
            <option value="customers">Transaksi Pelanggan</option>
            <option value="income-expense">Pemasukan dan Pengeluaran</option>
          </select>
          {!reportType && (
            <p className="mt-1 text-xs text-red-500 transition-colors duration-200 dark:text-red-400">
              Silakan pilih jenis laporan
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Rentang Tanggal
          </label>
          <select
            value={datePreset}
            onChange={handleDatePresetChange}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md sm:text-base sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
          >
            <option value="">Pilih Rentang Tanggal</option>
            <option value="thisMonth">Bulan Ini</option>
            <option value="lastMonth">Bulan Lalu</option>
            <option value="last3Months">3 Bulan Terakhir</option>
            <option value="thisYear">Tahun Ini</option>
            <option value="custom">Rentang Tanggal</option>
          </select>
          {!datePreset && (
            <p className="mt-1 text-xs text-red-500 transition-colors duration-200 dark:text-red-400">
              Silakan pilih rentang tanggal
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Tanggal Awal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDatePreset("custom");
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md sm:text-base sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-300">
            Tanggal Akhir
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setDatePreset("custom");
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md sm:text-base sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
          />
          {!isDateRangeValid() && (
            <p className="mt-1 text-xs text-red-500 transition-colors duration-200 dark:text-red-400">
              Tanggal akhir tidak boleh sebelum tanggal awal
            </p>
          )}
        </div>

        <div className="flex items-end">
          {datePreset === "custom" && (
            <button
              type="button"
              onClick={handleApplyFilters}
              disabled={!isDateRangeValid() || !reportType}
              className="px-3 py-2 text-xs font-medium text-white transition-colors duration-200 bg-blue-600 rounded-md shadow-sm sm:px-4 sm:py-2 sm:text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:hover:bg-blue-500"
            >
              Terapkan Filter
            </button>
          )}

          <button
            type="button"
            onClick={onGenerateReport}
            disabled={!filtersSelected || !isDateRangeValid() || isLoading}
            className="w-full px-3 py-2 text-xs font-medium text-white transition-colors duration-200 bg-blue-600 rounded-md shadow-sm sm:px-4 sm:py-2 sm:text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:hover:bg-blue-500"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </span>
            ) : (
              "Buat Laporan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
