import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiLock,
  FiUsers,
  FiArrowLeft,
  FiEdit,
  FiUserCheck,
  FiCreditCard,
} from "react-icons/fi";
import {
  getCustomerById,
  updateCustomer,
} from "../../store/slices/customerSlice";
import CustomerForm from "../../components/customers/CustomerForm";
import SuccessPopup from "../../components/common/SuccessPopup";
import TransactionTable from "../../components/transactions/TransactionTable";

export default function CustomerDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  const { selectedCustomer, loading } = useSelector((state) => state.customers);
  const [isEditing, setIsEditing] = useState(false);
  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    // Make sure we're using a clean id and properly waiting for the action to complete
    if (id) {
      dispatch(getCustomerById(id))
        .unwrap()
        .catch((error) => {
          return error;
        });
    }
  }, [dispatch, id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (formData) => {
    dispatch(
      updateCustomer({
        id: selectedCustomer.id,
        customerData: formData,
      })
    ).then(() => {
      dispatch(getCustomerById(id));
      setIsEditing(false);
      setSuccessPopup({
        isVisible: true,
        title: "Berhasil",
        message: "Perubahan berhasil diperbarui.",
      });
    });
  };

  // Loading state with improved styling
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 dark:text-gray-200 transition-colors duration-200">
        <div className="w-12 h-12 mb-4 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin dark:border-blue-400"></div>
        <p className="text-lg text-gray-600 transition-colors duration-200 dark:text-gray-300">
          Memuat informasi pelanggan...
        </p>
      </div>
    );
  }

  // Not found state with better styling
  if (!selectedCustomer) {
    return (
      <div className="max-w-4xl p-4 mx-auto sm:p-6 md:p-8">
        <div className="p-6 text-center transition-colors duration-200 bg-white rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:shadow-gray-900/10">
          <FiUserCheck className="w-16 h-16 mx-auto mb-4 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
          <h2 className="mb-3 text-xl font-bold text-gray-800 transition-colors duration-200 sm:text-2xl dark:text-white">
            Pelanggan Tidak Ditemukan
          </h2>
          <p className="mb-6 text-gray-600 transition-colors duration-200 dark:text-gray-300">
            Pelanggan yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors duration-200 bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-60"
          >
            <FiArrowLeft className="mr-2" /> Kembali ke Pelanggan
          </button>
        </div>
      </div>
    );
  }

  // Edit mode with improved layout
  if (isEditing) {
    return (
      <div className="max-w-6xl px-3 py-4 mx-auto sm:px-6 sm:py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center px-3 py-2 mr-3 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <FiArrowLeft className="mr-2" /> Batal
          </button>
          <h1 className="ml-2 text-xl font-bold text-gray-800 transition-colors duration-200 sm:text-2xl dark:text-white">
            Edit Pelanggan
          </h1>
        </div>

        <div className="overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-900/10">
          <CustomerForm
            onSubmit={handleSubmit}
            initialData={selectedCustomer}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    );
  }

  // Responsive detail view
  return (
    <div className="max-w-6xl px-3 py-4 mx-auto sm:px-6 sm:py-6">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <button
            onClick={handleGoBack}
            className="p-2 mr-3 text-gray-500 transition-colors duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            aria-label="Back to customers"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 transition-colors duration-200 sm:text-2xl dark:text-white">
            Detail Pelanggan
          </h1>
        </div>

        {isAdmin && (
          <div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
            >
              <FiEdit className="mr-2" /> Edit Pelanggan
            </button>
          </div>
        )}
      </div>

      {/* Customer information card */}
      <div className="overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-900/10">
        {/* Customer header with name */}
        <div className="px-4 py-5 transition-colors duration-200 border-b border-gray-200 sm:px-6 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 transition-colors duration-200 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <FiUser className="w-6 h-6 text-blue-600 transition-colors duration-200 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 transition-colors duration-200 dark:text-white">
                {selectedCustomer.name}
              </h3>
              <p className="max-w-2xl mt-1 text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
                Customer ID: #{selectedCustomer.id}
              </p>
            </div>
          </div>
        </div>

        {/* Customer details */}
        <div className="px-4 py-5 transition-colors duration-200 sm:p-6 dark:text-gray-200">
          {/* Information cards in responsive grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email */}
            <div className="flex items-start p-4 transition-all transition-colors duration-200 rounded-lg bg-gray-50 hover:shadow-md dark:bg-gray-700/50 dark:hover:shadow-gray-900/10">
              <FiMail className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              <div className="flex-1 ml-3">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-200 dark:text-gray-400">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 break-all transition-colors duration-200 dark:text-white">
                  {selectedCustomer.email || "-"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start p-4 transition-all transition-colors duration-200 rounded-lg bg-gray-50 hover:shadow-md dark:bg-gray-700/50 dark:hover:shadow-gray-900/10">
              <FiPhone className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              <div className="flex-1 ml-3">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-200 dark:text-gray-400">
                  No. HP / WA
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                  {selectedCustomer.phone || "-"}
                </p>
              </div>
            </div>

            {/* NIM Siakad */}
            <div className="flex items-start p-4 transition-all transition-colors duration-200 rounded-lg bg-gray-50 hover:shadow-md dark:bg-gray-700/50 dark:hover:shadow-gray-900/10">
              <FiBook className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              <div className="flex-1 ml-3">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-200 dark:text-gray-400">
                  NIM Siakad
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                  {selectedCustomer.nimSiakad || "-"}
                </p>
              </div>
            </div>

            {/* Password Siakad */}
            <div className="flex items-start p-4 transition-all transition-colors duration-200 rounded-lg bg-gray-50 hover:shadow-md dark:bg-gray-700/50 dark:hover:shadow-gray-900/10">
              <FiLock className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              <div className="flex-1 ml-3">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-200 dark:text-gray-400">
                  Password Siakad
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                  {selectedCustomer.passwordSiakad || "-"}
                </p>
              </div>
            </div>

            {/* Class & Program */}
            <div className="flex items-start p-4 transition-all transition-colors duration-200 rounded-lg bg-gray-50 hover:shadow-md dark:bg-gray-700/50 dark:hover:shadow-gray-900/10">
              <FiUsers className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
              <div className="flex-1 ml-3">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-200 dark:text-gray-400">
                  Kelas & Program Studi
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                  {selectedCustomer.class?.name || "-"} |{" "}
                  {selectedCustomer.progdi?.name || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Sales */}
          {/* Assigned Sales */}
          <div className="flex items-start p-4 mt-4 transition-all transition-colors duration-200 rounded-lg bg-gray-50 hover:shadow-md dark:bg-gray-700/50 dark:hover:shadow-gray-900/10">
            <FiUserCheck className="h-5 w-5 mt-0.5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
            <div className="flex-1 ml-3">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase transition-colors duration-200 dark:text-gray-400">
                Sales Yang Ditugaskan
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                {selectedCustomer.sales?.name || "-"}
              </p>
            </div>
          </div>

          {/* Transaction History Section */}
          {selectedCustomer.transactions &&
            selectedCustomer.transactions.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <FiCreditCard className="w-5 h-5 mr-2 text-gray-500 transition-colors duration-200 dark:text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                    Riwayat Transaksi
                  </h3>
                </div>
                <div className="overflow-hidden rounded-lg shadow">
                  <TransactionTable
                    transactions={selectedCustomer.transactions}
                    isAdmin={isAdmin}
                  />
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isVisible={successPopup.isVisible}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() =>
          setSuccessPopup({ isVisible: false, title: "", message: "" })
        }
        isAdmin={isAdmin}
      />
    </div>
  );
}
