import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCustomers } from "../../store/slices/customerSlice";
import { getProducts } from "../../store/slices/productSlide";
import { getSales } from "../../store/slices/userSlice";
import { FiPlusCircle, FiTrash } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

// Format currency to Rupiah
const formatToRupiah = (number) => {
  if (!number) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function TransactionIncomeForm({ onSubmit, initialData }) {
  const dispatch = useDispatch();
  const { customers, loading: customersLoading } = useSelector(
    (state) => state.customers
  );
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { salesList, loading: salesLoading } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState(
    initialData || {
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      customerId: "",
      userId: "",
    }
  );

  // Untuk file bukti transaksi
  const [proofImageFile, setProofImageFile] = useState(null);
  const [proofImagePreview, setProofImagePreview] = useState(null);

  // Initial details state
  const [details, setDetails] = useState([
    {
      productId: "",
      quantity: 1,
      pricePerUnit: 0,
      totalPrice: 0,
    },
  ]);

  // Load data on component mount
  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getProducts());
    dispatch(getSales());
  }, [dispatch]);

  // Initialize data when initialData changes
  useEffect(() => {
    if (initialData) {
      // Initialize details if available
      if (initialData.details && initialData.details.length > 0) {
        const detailsWithPrices = initialData.details.map((detail) => ({
          productId: detail.productId,
          quantity: detail.quantity,
          pricePerUnit: parseFloat(
            detail.pricePerUnit || detail.product?.price || 0
          ),
          totalPrice: parseFloat(detail.totalPrice || 0),
        }));
        setDetails(detailsWithPrices);
      }

      // Initialize proof image preview
      if (initialData.proofImage) {
        const imageUrl = `${API_URL}/uploads/${initialData.proofImage}`;
        setProofImagePreview(imageUrl);
      }

      // Make sure we're setting the form data with the correct date
      setFormData({
        ...initialData,
        transactionDate:
          initialData.transactionDate || new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  // Calculate total transaction amount
  const calculateTotalAmount = () => {
    return details.reduce(
      (total, item) => total + parseFloat(item.totalPrice || 0),
      0
    );
  };

  // Display formatted total amount
  const displayTotalAmount = formatToRupiah(calculateTotalAmount());

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImageFile(file);
      const previewURL = URL.createObjectURL(file);
      setProofImagePreview(previewURL);
    }
  };

  // Update product price and total when productId or quantity changes
  const updateDetailItem = (index, field, value) => {
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;

    // If product changed, update the price from products data
    if (field === "productId") {
      const selectedProduct = products.find(
        (p) => p.id.toString() === value.toString()
      );
      if (selectedProduct) {
        // Convert string price to number
        const price = parseFloat(selectedProduct.price);
        updatedDetails[index].pricePerUnit = price;
        updatedDetails[index].totalPrice =
          price * updatedDetails[index].quantity;
      } else {
        updatedDetails[index].pricePerUnit = 0;
        updatedDetails[index].totalPrice = 0;
      }
    }

    // If quantity changed, recalculate total price
    if (field === "quantity") {
      const qty = parseInt(value) || 0;
      updatedDetails[index].totalPrice =
        updatedDetails[index].pricePerUnit * qty;
    }

    setDetails(updatedDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.userId || !formData.customerId) {
      alert("Silakan pilih pelanggan dan sales terlebih dahulu");
      return;
    }

    // Check if products are selected
    if (details.some((detail) => !detail.productId)) {
      alert("Silakan pilih semua produk terlebih dahulu");
      return;
    }

    // Format details with only productId and quantity for API
    const formattedDetails = details.map((item) => ({
      productId: item.productId,
      quantity: parseInt(item.quantity) || 1,
    }));

    if (proofImageFile) {
      // Create FormData for the entire request
      const formDataToSend = new FormData();

      // Add basic transaction data
      formDataToSend.append("userId", formData.userId);
      formDataToSend.append("customerId", formData.customerId);
      formDataToSend.append("description", formData.description);

      // Ensure we're using the selected date, not today's date
      formDataToSend.append("transactionDate", formData.transactionDate);

      // Add the file
      formDataToSend.append("proofImage", proofImageFile);

      // Add each detail as a separate field with indexed names
      formattedDetails.forEach((detail, index) => {
        formDataToSend.append(`details[${index}][productId]`, detail.productId);
        formDataToSend.append(`details[${index}][quantity]`, detail.quantity);
      });

      // Send the FormData
      onSubmit(formDataToSend, true);
    } else {
      // No file, use regular JSON
      const jsonData = {
        userId: formData.userId,
        customerId: formData.customerId,
        description: formData.description,
        transactionDate: formData.transactionDate, // Ensure we're using the selected date
        details: formattedDetails,
      };

      // Send JSON data
      onSubmit(jsonData, false);
    }
  };

  // Add a new detail line item
  const addDetailItem = () => {
    setDetails([
      ...details,
      {
        productId: "",
        quantity: 1,
        pricePerUnit: 0,
        totalPrice: 0,
      },
    ]);
  };

  // Remove a detail line item
  const removeDetailItem = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-3 mx-auto space-y-4 transition-colors duration-200 sm:p-4 sm:space-y-6 dark:text-gray-200"
    >
      {/* Basic Info Section */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {/* Date Picker */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={
              formData.transactionDate
                ? new Date(formData.transactionDate)
                : null
            }
            onChange={(date) =>
              setFormData({
                ...formData,
                transactionDate: date ? date.toISOString().split("T")[0] : "",
              })
            }
            dateFormat="dd/MM/yyyy"
            className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm sm:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            placeholderText="Select date"
            required
            isClearable
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={10}
          />
        </div>

        {/* Customer Dropdown */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
            Pelanggan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.customerId}
            onChange={(e) =>
              setFormData({ ...formData, customerId: e.target.value })
            }
            className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm sm:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            required
          >
            <option value="">Pilih Pelanggan</option>
            {customersLoading ? (
              <option disabled>Memuat pelanggan...</option>
            ) : (
              customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Sales Dropdown */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
            Sales <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
            className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm sm:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            required
          >
            <option value="">Pilih Sales</option>
            {salesLoading ? (
              <option disabled>Memuat sales...</option>
            ) : (
              salesList?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Proof File Upload */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
            Bukti Transaksi
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm sm:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
          />

          {proofImagePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Pratinjau:
              </p>
              <div
                className="relative mt-1 overflow-hidden transition-colors duration-200 border border-gray-300 rounded-md dark:border-gray-600"
                style={{ maxHeight: "180px" }}
              >
                <img
                  src={proofImagePreview}
                  alt="Proof Preview"
                  className="object-contain w-full h-full transition-colors duration-200 bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm sm:text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            required
          />
        </div>
      </div>

      {/* Transaction Details Section */}
      <div className="mt-4 sm:mt-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-base font-medium text-gray-900 transition-colors duration-200 sm:text-lg dark:text-white">
            Detail Transaksi <span className="text-red-500">*</span>
          </h3>
          <button
            type="button"
            onClick={addDetailItem}
            className="flex items-center px-2 py-1 text-sm text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <FiPlusCircle className="mr-1" /> Tambah Item
          </button>
        </div>

        {/* Detail Items */}
        <div className="space-y-3">
          {details.map((detail, index) => (
            <div
              key={index}
              className="p-3 transition-colors duration-200 border border-gray-200 rounded-md sm:p-4 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 transition-colors duration-200 sm:text-base dark:text-gray-300">
                  Item #{index + 1}
                </h4>
                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetailItem(index)}
                    className="p-1 text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <FiTrash size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
                {/* Product Selection */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Produk
                  </label>
                  <select
                    value={detail.productId}
                    onChange={(e) =>
                      updateDetailItem(index, "productId", e.target.value)
                    }
                    className="block w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
                    required
                  >
                    <option value="">Pilih Produk</option>
                    {productsLoading ? (
                      <option disabled>Memuat produk...</option>
                    ) : (
                      products?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Jumlah
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newQuantity = Math.max(
                          1,
                          parseInt(detail.quantity) - 1
                        );
                        updateDetailItem(index, "quantity", newQuantity);
                      }}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={detail.quantity}
                      onChange={(e) =>
                        updateDetailItem(index, "quantity", e.target.value)
                      }
                      className="block w-full px-2 py-1.5 text-xs text-center border-y border-gray-300 rounded-none shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newQuantity = parseInt(detail.quantity) + 1;
                        updateDetailItem(index, "quantity", newQuantity);
                      }}
                      className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Harga satuan
                  </label>
                  <div className="px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-gray-50 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors duration-200">
                    {formatToRupiah(detail.pricePerUnit)}
                  </div>
                </div>

                {/* Total Price Display */}
                <div className="md:col-start-3">
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Total Harga
                  </label>
                  <div className="px-2 py-1.5 text-xs font-medium border border-gray-200 rounded-md bg-gray-50 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors duration-200">
                    {formatToRupiah(detail.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Amount Display */}
      <div className="pt-4 mt-4 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-end justify-end">
          <div className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400">
            Total Semua:
          </div>
          <div className="text-lg font-bold text-gray-900 transition-colors duration-200 sm:text-xl dark:text-white">
            {displayTotalAmount}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 mt-4 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
        >
          {initialData ? "Perbarui" : "Tambah"}
        </button>
      </div>
    </form>
  );
}

TransactionIncomeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
