import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSalesById,
  updateSales,
  clearSelectedSales,
  clearError,
} from "../../store/slices/userSlice";
import SalesForm from "../../components/sales/SalesForm";
import SalesInfo from "../../components/sales/SalesInfo";
import SalesTransactionList from "../../components/sales/SalesTransactionList";
import SalesCustomerList from "../../components/sales/SalesCustomerList";
import SuccessPopup from "../../components/common/SuccessPopup";
import { FiEdit, FiArrowLeft } from "react-icons/fi";

export default function SalesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAdmin = location.pathname.includes("/admin");
  const basePath = isAdmin ? "/admin" : "/sales";

  const { selectedSales, loading, error } = useSelector((state) => state.user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Fetch sales data
  useEffect(() => {
    dispatch(getSalesById(id));

    // Clear sales data when component unmounts
    return () => {
      dispatch(clearSelectedSales());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  // Modified to go back to previous page in history
  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous page in history
  };

  const handleUpdateSales = async (formData) => {
    try {
      await dispatch(updateSales({ id, salesData: formData })).unwrap();

      setSuccessPopup({
        isVisible: true,
        title: "Berhasil",
        message: "Data sales berhasil diperbarui!",
      });

      setIsFormOpen(false);
      dispatch(getSalesById(id));
    } catch (err) {
      console.error("Update failed:", err);
      // Error handling is done in the form component
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-4 border-gray-200 rounded-full sm:w-12 sm:h-12 border-t-blue-500 animate-spin"></div>
          <span className="mt-3 text-sm text-gray-600 sm:text-base dark:text-gray-400">
            Memuat data sales...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg p-3 mx-auto sm:p-6">
        <div className="p-4 text-center border border-red-200 rounded-lg sm:p-6 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <h2 className="text-base font-semibold text-red-800 sm:text-lg dark:text-red-200">
            Error
          </h2>
          <p className="mt-2 text-sm text-red-700 sm:text-base dark:text-red-300">
            {error}
          </p>
          <button
            onClick={handleGoBack}
            className="px-3 py-1.5 mt-3 text-sm text-white bg-red-600 rounded-lg sm:px-4 sm:py-2 sm:mt-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!selectedSales) {
    return (
      <div className="max-w-screen-lg p-3 mx-auto sm:p-6">
        <div className="p-4 text-center border border-yellow-200 rounded-lg sm:p-6 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <h2 className="text-base font-semibold text-yellow-800 sm:text-lg dark:text-yellow-200">
            Data Tidak Ditemukan
          </h2>
          <p className="mt-2 text-sm text-yellow-700 sm:text-base dark:text-yellow-300">
            Data sales yang Anda cari tidak ditemukan.
          </p>
          <button
            onClick={handleGoBack}
            className="px-3 py-1.5 mt-3 text-sm text-white bg-yellow-600 rounded-lg sm:px-4 sm:py-2 sm:mt-4 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-800"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg p-3 mx-auto sm:p-4">
      {/* Top navigation bar */}

      <div className="flex items-center justify-between mb-4 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
        <div className="flex items-center mb-3 sm:mb-0">
          <button
            onClick={handleGoBack}
            className="p-1.5 mr-2 text-gray-500 transition-colors duration-200 bg-white border border-gray-300 rounded-md shadow-sm sm:p-2 sm:mr-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            aria-label="Back to customers"
          >
            <FiArrowLeft size={18} className="sm:size-20" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 transition-colors duration-200 sm:text-xl lg:text-2xl dark:text-white">
            Detail Sales
          </h1>
        </div>

        {isAdmin && (
          <div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center self-start px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg sm:self-auto sm:px-4 sm:py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FiEdit className="mr-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Edit Sales
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Basic Sales Information */}
        <SalesInfo salesData={selectedSales} />

        {/* Transactions Section */}
        {selectedSales.transactions && (
          <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="p-3 sm:p-6">
              <SalesTransactionList
                transactions={selectedSales.transactions}
                basePath={basePath}
              />
            </div>
          </div>
        )}

        {/* Customers Section */}
        {selectedSales.customers && (
          <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="p-3 sm:p-6">
              <SalesCustomerList
                customers={selectedSales.customers}
                basePath={basePath}
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto sm:p-4">
          <div
            className="absolute inset-0 bg-black opacity-50 dark:opacity-50"
            onClick={() => setIsFormOpen(false)}
          ></div>

          <div className="relative w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg sm:max-w-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between p-3 border-b sm:p-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                Edit Sales
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <SalesForm
              onSubmit={handleUpdateSales}
              initialData={selectedSales}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup
        isVisible={successPopup.isVisible}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() =>
          setSuccessPopup({ isVisible: false, title: "", message: "" })
        }
      />
    </div>
  );
}
