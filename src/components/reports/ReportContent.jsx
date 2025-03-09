import ReportTable from "./ReportTable";

export default function ReportContent({
  showReport,
  loading,
  error,
  reportType,
  reportData,
  dateRange,
}) {
  if (!showReport) {
    return (
      <div className="p-4 text-center text-gray-500 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:text-gray-400">
        <p className="text-sm sm:text-base">
          Pilih jenis laporan dan rentang tanggal, lalu klik "Buat Laporan"
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-8 dark:bg-gray-800">
        <div className="w-10 h-10 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500 animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
        <span className="ml-3 text-sm text-gray-600 transition-colors duration-200 sm:text-base dark:text-gray-300">
          Membuat laporan...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800">
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (reportData && reportData.data) {
    const reportTitle = {
      sales: "Laporan Penjualan",
      transactions: "Laporan Transaksi",
      customers: "Laporan Pelanggan",
      products: "Laporan Produk",
    }[reportType];

    return (
      <div className="mt-4 sm:mt-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="mb-1 text-lg font-semibold transition-colors duration-200 sm:text-xl md:text-2xl dark:text-white">
            {reportTitle}
          </h3>
          <p className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm dark:text-gray-400">
            Periode: {reportData.period?.start || dateRange.startDate} sampai{" "}
            {reportData.period?.end || dateRange.endDate}
          </p>
        </div>

        <ReportTable
          reportType={reportType}
          data={reportData.data}
          summary={reportData.summary}
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-gray-500 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:text-gray-400">
      <p className="text-sm sm:text-base">
        Tidak ada data yang tersedia untuk rentang tanggal yang dipilih.
      </p>
    </div>
  );
}
