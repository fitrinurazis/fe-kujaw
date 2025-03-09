import PropTypes from "prop-types";
import { FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function CustomerTable({
  customers,
  onDelete,
  loading,
  isAdmin,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.includes("/admin") ? "/admin" : "/sales";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin dark:border-blue-400"></div>
        <span className="ml-3 text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
          Memuat data...
        </span>
      </div>
    );
  }

  const handleViewCustomer = (customerId) => {
    navigate(`${basePath}/customers/${customerId}`);
  };

  // Mobile card view for small screens
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {customers?.length > 0 ? (
        customers.map((customerItem) => (
          <div
            key={customerItem.id}
            className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/10"
            onClick={() => handleViewCustomer(customerItem.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium text-gray-900 transition-colors duration-200 cursor-pointer hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                {customerItem.name}
              </h3>
              <div className="flex space-x-2">
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(customerItem);
                    }}
                    className="p-1.5 text-red-500 transition-colors rounded-full hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    aria-label="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-1 space-y-1 text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
              <p>{customerItem.email}</p>
              <p>{customerItem.phone}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
          Tidak ditemukan pelanggan
        </div>
      )}
    </div>
  );

  // Desktop table view
  return (
    <div className="transition-colors duration-200 bg-white rounded-lg dark:bg-gray-800">
      {/* Mobile View */}
      {renderMobileView()}

      {/* Desktop View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-6 dark:text-gray-300">
                Nama Pelanggan
              </th>
              <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-6 sm:table-cell dark:text-gray-300">
                Email
              </th>
              <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-6 sm:table-cell dark:text-gray-300">
                Telepon
              </th>
              <th className="px-3 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase transition-colors duration-200 sm:px-6 dark:text-gray-300">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {customers?.length > 0 ? (
              customers.map((customerItem, index) => (
                <tr
                  key={customerItem.id}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
                >
                  <td
                    className="px-3 py-3 text-sm transition-colors duration-200 cursor-pointer whitespace-nowrap sm:px-6 sm:py-4 hover:text-blue-600 dark:hover:text-blue-400 dark:text-white"
                    onClick={() => handleViewCustomer(customerItem.id)}
                  >
                    <div className="font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                      {customerItem.name}
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-sm whitespace-nowrap sm:px-6 sm:py-4 sm:table-cell">
                    <div className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                      {customerItem.email}
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-sm whitespace-nowrap sm:px-6 sm:py-4 sm:table-cell">
                    <div className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                      {customerItem.phone}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-right whitespace-nowrap sm:px-6 sm:py-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewCustomer(customerItem.id)}
                        className="p-1.5 text-blue-500 transition-colors rounded-full hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                        aria-label="View customer details"
                      >
                        <FiEye size={18} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(customerItem)}
                          className="p-1.5 text-red-500 transition-colors rounded-full hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                          aria-label="Delete customer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-sm text-center text-gray-500 transition-colors duration-200 dark:text-gray-400"
                >
                  Tidak ditemukan pelanggan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CustomerTable.propTypes = {
  customers: PropTypes.array,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isAdmin: PropTypes.bool,
};
