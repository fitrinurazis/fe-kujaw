import { useState } from "react";
import { useDispatch } from "react-redux";
import { exportExcel, exportPdf } from "../../store/slices/reportSlice";

function ReportExportButtons({
  reportType,
  dateRange,
  setErrorMessage,
  setShowErrorToast,
}) {
  const dispatch = useDispatch();
  const [exporting, setExporting] = useState({
    excel: false,
    pdf: false,
  });

  const handleExport = async (format) => {
    // Set the loading state for the specific format
    setExporting((prev) => ({ ...prev, [format]: true }));

    try {
      // Determine which export function to use
      const exportAction = format === "excel" ? exportExcel : exportPdf;

      // Dispatch the appropriate export action
      const result = await dispatch(
        exportAction({
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        })
      ).unwrap();

      // Process the result - download the file
      if (result && result.data) {
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", result.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      // Handle export errors
      setErrorMessage(
        error.message || `Gagal mengekspor laporan ke ${format.toUpperCase()}`
      );
      setShowErrorToast(true);
    } finally {
      // Reset loading state
      setExporting((prev) => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <button
        type="button"
        className="flex items-center px-4 py-2 font-semibold text-green-700 transition-colors duration-200 bg-green-100 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 dark:focus:ring-green-400 dark:border dark:border-green-600"
        onClick={() => handleExport("excel")}
        disabled={exporting.excel}
      >
        {exporting.excel ? (
          <>
            <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Mengekspor...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Ekspor Excel
          </>
        )}
      </button>

      <button
        type="button"
        className="flex items-center px-4 py-2 font-semibold text-red-700 transition-colors duration-200 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 dark:focus:ring-red-400 dark:border dark:border-red-600"
        onClick={() => handleExport("pdf")}
        disabled={exporting.pdf}
      >
        {exporting.pdf ? (
          <>
            <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Mengekspor...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
            Ekspor PDF
          </>
        )}
      </button>
    </div>
  );
}

export default ReportExportButtons;
