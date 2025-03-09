import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

import {
  clearError,
  clearReportData,
  getReportData,
  setCurrentReportType,
  setReportPeriod,
} from "../store/slices/reportSlice";

import ErrorToast from "../components/common/ErrorToast";
import ReportContent from "../components/reports/ReportContent";
import ReportFilters from "../components/reports/ReportFilters";
import ReportExportButtons from "../components/reports/ReportExportButtons";

export default function Reports() {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.auth.user.role === "admin");
  const reportsState = useSelector((state) => state.reports) || {};
  const { reportData, loading, error } = reportsState;
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setDate(1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [reportType, setReportType] = useState("sales");
  const [showReport, setShowReport] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Clear report data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearReportData());
    };
  }, [dispatch]);

  // Display error toast when error occurs
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorToast(true);
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Update redux state when local state changes
  useEffect(() => {
    dispatch(setCurrentReportType(reportType));
    dispatch(setReportPeriod(dateRange));
  }, [reportType, dateRange, dispatch]);

  const handleFilterChange = (filters) => {
    // Clear report data when filters change
    dispatch(clearReportData());
    setDateRange({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    setReportType(filters.reportType);
    // Update Redux state
    dispatch(setCurrentReportType(filters.reportType));
    dispatch(
      setReportPeriod({
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
    );

    setShowReport(false);
  };

  const handleGenerateReport = async () => {
    dispatch(clearReportData());
    setShowReport(false);

    try {
      // Use Redux for all report types
      const result = await dispatch(
        getReportData({
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          cacheBuster: new Date().getTime(),
        })
      ).unwrap();

      if (
        result?.data &&
        (Array.isArray(result.data) ? result.data.length > 0 : true)
      ) {
        setShowReport(true);

        if (result.period?.isFutureDate) {
          setErrorMessage(
            "Peringatan: Laporan mencakup tanggal di masa depan. Data mungkin tidak lengkap."
          );
          setShowErrorToast(true);
        }
      } else {
        throw new Error(
          "Tidak ada data yang tersedia untuk rentang tanggal yang dipilih."
        );
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Gagal membuat laporan. Silakan coba rentang tanggal atau jenis laporan yang berbeda."
      );
      setShowErrorToast(true);
    }
  };

  return (
    <div className="max-w-full p-4 mx-auto transition-colors duration-200 dark:text-gray-300">
      <h2 className="mb-4 text-xl font-bold transition-colors duration-200 sm:text-2xl md:text-3xl dark:text-white">
        Laporan
      </h2>

      <div className="p-4 mb-6 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
        <ReportFilters
          onFilterChange={handleFilterChange}
          onGenerateReport={handleGenerateReport}
          initialValues={{
            reportType,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }}
          disableOptions={!isAdmin}
        />
      </div>

      {isAdmin && showReport && !loading && !error && (
        <ReportExportButtons
          reportType={reportType}
          dateRange={dateRange}
          setErrorMessage={setErrorMessage}
          setShowErrorToast={setShowErrorToast}
        />
      )}

      <ReportContent
        showReport={showReport}
        loading={loading}
        error={error}
        reportType={reportType}
        reportData={reportData}
        dateRange={dateRange}
      />
      <ErrorToast
        show={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}
