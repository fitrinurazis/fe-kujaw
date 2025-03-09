import PropTypes from "prop-types";
import { useState } from "react";
import {
  FiTrash2,
  FiEye,
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";

export default function SalesTable({ salesList, onDelete, loading, isAdmin }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter sales based on search term
  const filteredSales =
    salesList?.filter(
      (sales) =>
        sales.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sales.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sales.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewSales = (salesId) => {
    const basePath = isAdmin ? "/admin" : "/sales";
    navigate(`${basePath}/sales/${salesId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-10 h-10 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
        <span className="ml-3 text-gray-600">Memuat data sales...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari sales berdasarkan nama, email, atau telepon..."
            className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              <span className="text-gray-400 hover:text-gray-500">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {currentItems.length > 0 ? (
          currentItems.map((sales) => (
            <div
              key={sales.id}
              onClick={() => handleViewSales(sales.id)}
              className="p-4 border-b border-gray-200 cursor-pointer dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-blue-500 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {sales.name}
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1 ml-11">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiMail className="w-3 h-3 mr-1.5" />
                      <span className="truncate">{sales.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiPhone className="w-3 h-3 mr-1.5" />
                      <span>{sales.phone}</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(sales);
                    }}
                    className="p-2 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Delete sales"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Tidak ada sales yang sesuai dengan pencarian"
              : "Belum ada data sales"}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
              >
                No. Telepon
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((sales) => (
                <tr
                  key={sales.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sales.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {sales.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {sales.phone}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewSales(sales.id)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label="View details"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onDelete(sales)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Delete sales"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400"
                >
                  {searchTerm
                    ? "Tidak ada sales yang sesuai dengan pencarian"
                    : "Belum ada data sales"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Using Pagination component */}
      <div className="px-6 py-3">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredSales.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

SalesTable.propTypes = {
  salesList: PropTypes.array,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

SalesTable.defaultProps = {
  salesList: [],
  loading: false,
  isAdmin: false,
};
