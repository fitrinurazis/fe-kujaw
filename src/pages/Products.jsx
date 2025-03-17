import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { createSelector } from "@reduxjs/toolkit";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import SuccessPopup from "../components/common/SuccessPopup";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../store/slices/productSlide";
import { FiPlus } from "react-icons/fi";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";

const selectProducts = createSelector(
  (state) => state.products,
  (products) => ({
    products: products?.products,
    loading: products?.loading || false,
  })
);

export default function Products() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const dispatch = useDispatch();
  const { products, loading } = useSelector(selectProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
    productsPrice: "",
    productsDescription: "",
    productsCategory: "",
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
    dispatch(getProducts());
  }, [dispatch]);

  const handleSubmit = (formData) => {
    if (editingProduct) {
      dispatch(
        updateProduct({ id: editingProduct.id, productData: formData })
      ).then(() => {
        dispatch(getProducts());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Produk berhasil diperbarui!",
        });
      });
    } else {
      dispatch(createProduct(formData)).then(() => {
        dispatch(getProducts());
        setIsFormOpen(false);
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Produk baru berhasil ditambahkan!",
        });
      });
    }
  };

  const handleDeleteClick = (productItem) => {
    setDeleteModal({
      isOpen: true,
      productId: productItem.id,
      productName: productItem.name,
    });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteProduct(deleteModal.productId))
      .unwrap()
      .then(() => {
        dispatch(getProducts());
        setDeleteModal({ isOpen: false, productId: null, productName: "" });
        setSuccessPopup({
          isVisible: true,
          title: "Berhasil",
          message: "Produk berhasil dihapus!",
        });
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  const handleEdit = (productItem) => {
    setEditingProduct(productItem);
    setIsFormOpen(true);
  };

  const filteredProducts =
    products?.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (product.price && product.price.toString().includes(searchTerm))
    ) || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const resetPage = () => setCurrentPage(1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-3 mx-auto transition-colors duration-200 sm:p-4 lg:p-6 dark:text-gray-200">
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold transition-colors duration-200 sm:text-2xl dark:text-white">
          Produk
        </h2>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center px-3 py-2 text-sm text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:text-base sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
          >
            <FiPlus className="mr-1 text-lg" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 transition-colors duration-200 border-t-2 border-b-2 rounded-full animate-spin border-primary sm:w-12 sm:h-12 dark:border-blue-400"></div>
          <span className="mt-3 text-sm text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
            Memuat produk...
          </span>
        </div>
      ) : (
        <div className="transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:shadow-gray-900/10">
          {/* Search Bar Component */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Cari produk berdasarkan nama, deskripsi, atau kategori..."
            resetPage={resetPage}
          />

          <ProductTable
            products={currentProducts}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={loading}
            isAdmin={isAdmin}
          />

          {/* Pagination Component */}
          <div className="px-6 py-3">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsFormOpen(false)}
          ></div>
          <div className="relative w-full max-w-md p-4 mx-2 transition-colors duration-200 bg-white rounded-lg shadow-lg sm:max-w-lg sm:mx-0 sm:p-6 lg:max-w-2xl dark:bg-gray-800 dark:shadow-gray-900/10">
            <div className="flex items-center justify-between pb-3 mb-4 transition-colors duration-200 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold transition-colors duration-200 sm:text-xl dark:text-white">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-gray-500 transition-colors duration-200 rounded-full hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <ProductForm
                isAdmin={isAdmin}
                onSubmit={handleSubmit}
                initialData={editingProduct}
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
            productId: null,
            productName: "",
            productsPrice: "",
            productsDescription: "",
            productsCategory: "",
          })
        }
        isAdmin={isAdmin}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.productName}
        itemPrice={deleteModal.productsPrice}
        itemDescription={deleteModal.productsDescription}
        itemCategory={deleteModal.productsCategory}
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
