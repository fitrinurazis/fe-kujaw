import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";

const SalesCustomerList = ({ customers, basePath }) => {
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!customers || customers.length === 0) {
    return (
      <div className="p-4 mt-4 text-center border border-gray-200 rounded-lg sm:p-6 sm:mt-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Belum ada pelanggan</p>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pelanggan
        </h3>
        <button
          onClick={() => navigate(`${basePath}/customers`)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Lihat Semua
        </button>
      </div>

      {/* Mobile version - card style */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {customers.slice(0, 5).map((customer) => (
          <div
            key={customer.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => navigate(`${basePath}/customers/${customer.id}`)}
          >
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center w-8 h-8 mr-3 text-indigo-500 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                <FiUser className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {customer.name}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm ml-11">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-500 dark:text-gray-400 sm:w-20">
                  Email:
                </span>
                <span className="font-medium text-gray-900 break-all dark:text-white">
                  {customer.email || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-500 dark:text-gray-400 sm:w-20">
                  Telepon:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customer.phone || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-500 dark:text-gray-400 sm:w-20">
                  NIM Siakad:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {customer.nimSiakad || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-gray-500 dark:text-gray-400 sm:w-20">
                  Dibuat:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(customer.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop version - table style */}
      <div className="hidden overflow-hidden border border-gray-200 rounded-lg md:block dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Nama
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Telepon
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  NIM Siakad
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 dark:text-gray-400">
                  Dibuat Pada
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {customers.slice(0, 5).map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() =>
                    navigate(`${basePath}/customers/${customer.id}`)
                  }
                >
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-indigo-500 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 sm:px-6 dark:text-gray-400">
                    <span className="max-w-xs truncate">
                      {customer.email || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 dark:text-gray-400">
                    {customer.phone || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 dark:text-gray-400">
                    {customer.nimSiakad || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 dark:text-gray-400">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesCustomerList;
