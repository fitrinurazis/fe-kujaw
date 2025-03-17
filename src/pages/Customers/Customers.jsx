import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import SuccessPopup from "../../components/common/SuccessPopup";
import CustomerForm from "../../components/customers/CustomerForm";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerDetail from "./CustomerDetail";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../../store/slices/customerSlice";
import { FiPlus } from "react-icons/fi";
import LoadingState from "../../components/common/LoadingState";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";

const selectCustomers = createSelector(
  (state) => state.customers,
  (customers) => ({
    customers: customers?.customers,
    loading: customers?.loading || false,
  })
);

export default function Customers() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const dispatch = useDispatch();
  const { customers, loading } = useSelector(selectCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" or "detail"
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    customerId: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerNimSiakad: "",
    customerPasswordSiakad: "",
    customerClassId: "",
    customerProgdiId: "",
    customerSalesId: "",
  });

  const [successPopup, setSuccessPopup] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const handleSubmit = (formData) => {
    if (isFormOpen && selectedCustomer) {
      dispatch(
        updateCustomer({ id: selectedCustomer.id, customerData: formData })
      ).then(() => {
        dispatch(getCustomers());
        setIsFormOpen(false);
        setSelectedCustomer(null);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Pelanggan berhasil diperbarui!",
        });
      });
    } else {
      dispatch(createCustomer(formData)).then(() => {
        dispatch(getCustomers());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Pelanggan baru berhasil ditambahkan!",
        });
      });
    }
  };

  const handleDeleteClick = (customerItem) => {
    setDeleteModal({
      isOpen: true,
      customerId: customerItem.id,
      customerName: customerItem.name,
      customerEmail: customerItem.email,
      customerPhone: customerItem.phone,
      customerNimSiakad: customerItem.nimSiakad,
      customerPasswordSiakad: customerItem.passwordSiakad,
      customerClassId: customerItem.class_id,
      customerProgdiId: customerItem.progdi_id,
      customerSalesId: customerItem.sales_id,
    });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteCustomer(deleteModal.customerId))
      .unwrap()
      .then(() => {
        dispatch(getCustomers());
        setDeleteModal({ isOpen: false, customerId: null, customerName: "" });
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Pelanggan berhasil dihapus!",
        });
        // If we're in detail view and deleting the viewed customer, go back to list
        if (
          viewMode === "detail" &&
          selectedCustomer?.id === deleteModal.customerId
        ) {
          setViewMode("list");
          setSelectedCustomer(null);
        }
      })
      .catch((error) => {});
  };

  const handleViewCustomer = (customerItem) => {
    setSelectedCustomer(customerItem);
    setViewMode("detail");
  };

  const handleUpdateCustomer = (formData) => {
    dispatch(
      updateCustomer({ id: selectedCustomer.id, customerData: formData })
    ).then(() => {
      dispatch(getCustomers()).then((action) => {
        // Find the updated customer in the new list
        const updatedCustomers = action.payload || [];
        const updatedCustomer = updatedCustomers.find(
          (c) => c.id === selectedCustomer.id
        );
        if (updatedCustomer) {
          setSelectedCustomer(updatedCustomer);
        }
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Pelanggan berhasil diperbarui!",
        });
      });
    });
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCustomer(null);
  };

  const filteredCustomers =
    customers?.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.nimSiakad?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const resetPage = () => setCurrentPage(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-3 mx-auto transition-colors duration-200 sm:p-4 lg:p-6">
      {viewMode === "list" ? (
        <>
          <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-bold text-gray-900 transition-colors duration-200 sm:text-2xl dark:text-white">
              Pelanggan
            </h2>
            {isAdmin && (
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center px-3 py-2 text-white transition-colors bg-blue-500 rounded-lg sm:text-base sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-60"
              >
                <FiPlus className="mr-1 text-lg" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <LoadingState message="Memuat pelanggan..." />
            </div>
          ) : (
            <div className="transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
              {/* Search Bar Component */}
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Cari pelanggan berdasarkan nama, email, telepon, atau NIM..."
                resetPage={resetPage}
              />

              <CustomerTable
                customers={currentCustomers}
                onView={handleViewCustomer}
                onDelete={handleDeleteClick}
                loading={loading}
                isAdmin={isAdmin}
              />

              {/* Pagination Component */}
              <div className="px-6 py-3">
                <Pagination
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredCustomers.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        // Detail view
        <CustomerDetail
          customer={selectedCustomer}
          onUpdate={handleUpdateCustomer}
          onBack={handleBackToList}
          isAdmin={isAdmin}
        />
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 transition-opacity duration-200 bg-black opacity-50 dark:opacity-60"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative w-full max-w-md p-4 mx-2 transition-colors duration-200 bg-white rounded-lg shadow-lg sm:max-w-lg sm:mx-0 sm:p-6 lg:max-w-2xl dark:bg-gray-800 dark:shadow-gray-900/20">
            <div className="flex items-center justify-between pb-3 mb-4 transition-colors duration-200 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 sm:text-xl dark:text-white">
                {selectedCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-gray-500 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <CustomerForm
                isAdmin={isAdmin}
                onSubmit={handleSubmit}
                initialData={selectedCustomer}
              />
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            customerId: null,
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            customerNimSiakad: "",
            customerPasswordSiakad: "",
            customerClassId: "",
            customerProgdiId: "",
            customerSalesId: "",
          })
        }
        isAdmin={isAdmin}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.customerName}
        itemEmail={deleteModal.customerEmail}
        itemPhone={deleteModal.customerPhone}
        itemNimSiakad={deleteModal.customerNimSiakad}
        itemPasswordSiakad={deleteModal.customerPasswordSiakad}
        itemClassId={deleteModal.customerClassId}
        itemProgdiId={deleteModal.customerProgdiId}
        itemSalesId={deleteModal.customerSalesId}
      />

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
