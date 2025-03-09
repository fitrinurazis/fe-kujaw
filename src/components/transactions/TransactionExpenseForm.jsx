import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSales } from "../../store/slices/userSlice";
import { FiPlusCircle, FiTrash } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

export default function TransactionExpenseForm({
  onSubmit,
  initialData = null,
}) {
  const dispatch = useDispatch();
  const { salesList, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState(
    initialData || {
      transactionDate: new Date().toISOString().split("T")[0],
      description: "",
      type: "pengeluaran",
      userId: "",
    }
  );

  // For transaction proof file
  const [proofImageFile, setProofImageFile] = useState(null);
  const [proofImagePreview, setProofImagePreview] = useState(null);

  // For formatted total amount display
  const [displayTotalAmount, setDisplayTotalAmount] = useState("");

  // For managing transaction details
  const [details, setDetails] = useState([
    {
      itemName: "",
      quantity: 1,
      pricePerUnit: "",
      totalPrice: "",
    },
  ]);

  // Fetch sales data on component mount
  useEffect(() => {
    dispatch(getSales());
  }, [dispatch]);

  // Initialize data when initialData changes
  useEffect(() => {
    if (initialData) {
      // Initialize details if available
      if (initialData.details && initialData.details.length > 0) {
        setDetails(initialData.details);
      }

      // Set proof image preview if available
      if (initialData.proofImage) {
        const imageUrl = `${API_URL}/uploads/${initialData.proofImage}`;
        setProofImagePreview(imageUrl);
      }
    }
  }, [initialData]);

  // Update total amount when details change
  useEffect(() => {
    let calculatedTotal = 0;
    details.forEach((item) => {
      calculatedTotal += Number(item.totalPrice || 0);
    });

    // Set display amount
    setDisplayTotalAmount(formatToRupiah(calculatedTotal));
  }, [details]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImageFile(file);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setProofImagePreview(previewURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate total
    let calculatedTotal = 0;
    details.forEach((item) => {
      calculatedTotal += Number(item.totalPrice || 0);
    });

    // Format details
    const formattedDetails = details.map((item) => ({
      itemName: item.itemName,
      quantity: parseInt(item.quantity) || 1,
      pricePerUnit: parseFloat(item.pricePerUnit) || 0,
      totalPrice: parseFloat(item.totalPrice) || 0,
      status: "menunggu",
    }));

    if (proofImageFile) {
      const formDataToSend = new FormData();

      formDataToSend.append("userId", formData.userId);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("transactionDate", formData.transactionDate);
      formDataToSend.append("type", "pengeluaran");
      formDataToSend.append("amount", calculatedTotal.toString());

      // Append all details data
      for (let i = 0; i < formattedDetails.length; i++) {
        const detail = formattedDetails[i];
        formDataToSend.append(`details[${i}][itemName]`, detail.itemName);
        formDataToSend.append(`details[${i}][quantity]`, detail.quantity);
        formDataToSend.append(
          `details[${i}][pricePerUnit]`,
          detail.pricePerUnit
        );
        formDataToSend.append(`details[${i}][totalPrice]`, detail.totalPrice);
        formDataToSend.append(`details[${i}][status]`, detail.status);
      }

      // Add proof image file
      formDataToSend.append("proofImage", proofImageFile);

      // Send FormData
      onSubmit(formDataToSend, true);
    } else {
      // Use regular JSON for requests without files
      const jsonData = {
        userId: formData.userId,
        description: formData.description,
        transactionDate: formData.transactionDate,
        type: "pengeluaran",
        amount: calculatedTotal.toString(),
        details: formattedDetails,
      };

      // Send JSON data
      onSubmit(jsonData, false);
    }
  };

  // Format number to IDR
  const formatToRupiah = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Parse rupiah string to number
  const parseRupiahToNumber = (rupiahString) => {
    if (!rupiahString) return "";
    return rupiahString.replace(/[^\d]/g, "");
  };

  // Add a new detail line item
  const addDetailItem = () => {
    setDetails([
      ...details,
      {
        itemName: "",
        quantity: 1,
        pricePerUnit: "",
        totalPrice: "",
      },
    ]);
  };

  // Remove a detail line item
  const removeDetailItem = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  // Update a detail line item
  const updateDetailItem = (index, field, value) => {
    const updatedDetails = [...details];

    if (field === "pricePerUnit") {
      updatedDetails[index][field] = parseRupiahToNumber(value);
    } else {
      updatedDetails[index][field] = value;
    }

    // Auto-calculate totalPrice if quantity or pricePerUnit changes
    if (field === "quantity" || field === "pricePerUnit") {
      const quantity = Number(updatedDetails[index].quantity);
      const pricePerUnit = Number(updatedDetails[index].pricePerUnit);
      updatedDetails[index].totalPrice = (quantity * pricePerUnit).toString();
    }

    setDetails(updatedDetails);
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
            {loading ? (
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
            className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 p-1.5 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-blue-400 dark:focus:ring-opacity-60"
          >
            <FiPlusCircle className="mr-1" /> Tambah Item
          </button>
        </div>

        <div className="space-y-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className="p-3 transition-colors duration-200 border border-gray-200 rounded-md sm:p-4 bg-gray-50 dark:bg-gray-800/40 dark:border-gray-700"
            >
              <div className="flex justify-between mb-2 sm:mb-3">
                <h4 className="font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                  Transaksi #{index + 1}
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
                {/* Item Name Input */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Nama Item
                  </label>
                  <input
                    type="text"
                    value={detail.itemName}
                    onChange={(e) =>
                      updateDetailItem(index, "itemName", e.target.value)
                    }
                    className="block w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
                    required
                  />
                </div>

                {/* Quantity Input with + and - buttons */}
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

                {/* Price per Unit Input */}
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Harga Satuan
                  </label>
                  <input
                    type="text"
                    value={
                      detail.pricePerUnit
                        ? formatToRupiah(detail.pricePerUnit)
                        : ""
                    }
                    onChange={(e) =>
                      updateDetailItem(index, "pricePerUnit", e.target.value)
                    }
                    className="block w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-colors duration-200"
                    required
                    placeholder="Rp 0"
                  />
                </div>

                {/* Total Price Display */}
                <div className="md:col-start-3">
                  <label className="block mb-1 text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-400">
                    Total Harga
                  </label>
                  <div className="px-2 py-1.5 text-xs font-medium border border-gray-200 rounded-md bg-gray-50 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors duration-200">
                    {detail.totalPrice
                      ? formatToRupiah(detail.totalPrice)
                      : "Rp 0"}
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
            {displayTotalAmount || "Rp 0"}
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

TransactionExpenseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
