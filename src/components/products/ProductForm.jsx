import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/slices/categorySlice";

export default function ProductForm({ onSubmit, initialData }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    // Tambahkan field lain sesuai kebutuhan
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        categoryId: initialData.category_id?.toString() || "",
        // Set field lain jika ada
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? (value ? parseFloat(value) : "") : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 transition-colors duration-200 dark:text-gray-200"
    >
      <div>
        <label
          htmlFor="name"
          className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
        >
          Nama Produk
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
          required
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
        >
          Harga
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="block w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label
          htmlFor="categoryId"
          className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
        >
          Kategori
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="block w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
          required
        >
          <option value="">Pilih Kategori</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block mb-1 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="block w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
        />
      </div>

      <div className="flex justify-end pt-4 mt-4 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
        >
          {initialData ? "Perbarui" : "Tambah"}
        </button>
      </div>
    </form>
  );
}

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isAdmin: PropTypes.bool,
};
