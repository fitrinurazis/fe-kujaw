import { FiArrowLeft } from "react-icons/fi";
import PropTypes from "prop-types";

export default function TransactionHeader({ onBack }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div className="flex items-center mb-4 sm:mb-6">
      <button
        onClick={handleClick}
        className="p-2 mr-3 text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
        aria-label="Back to transactions"
      >
        <FiArrowLeft size={18} />
      </button>
      <h1 className="text-xl font-bold transition-colors duration-200 sm:text-2xl dark:text-white">
        Detail Transaksi
      </h1>
    </div>
  );
}

TransactionHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
};
