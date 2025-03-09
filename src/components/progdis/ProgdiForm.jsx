import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function ProgdiForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    // tambahkan field lain jika diperlukan
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        // atur field lain jika diperlukan
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          Nama Program Studi
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

      {/* Tambahkan field lain jika diperlukan */}

      <div className="flex justify-end pt-4 mt-6 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700">
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

ProgdiForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
