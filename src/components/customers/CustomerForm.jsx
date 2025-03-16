import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getProgdi } from "../../store/slices/progdiSlice";
import { getClasses } from "../../store/slices/classSlice";
import { getSales } from "../../store/slices/userSlice";

export default function CustomerForm({ onSubmit, initialData }) {
  const dispatch = useDispatch();
  const { progdis } = useSelector((state) => state.progdis);
  const { classes } = useSelector((state) => state.classes);
  const { salesList } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nimSiakad: "",
    passwordSiakad: "",
    class_id: "",
    progdi_id: "",
    sales_id: "",
  });

  useEffect(() => {
    // Fetch necessary data for dropdowns
    dispatch(getProgdi());
    dispatch(getClasses());
    dispatch(getSales());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        nimSiakad: initialData.nimSiakad || "",
        passwordSiakad: initialData.passwordSiakad || "",
        class_id: initialData.class_id || "",
        progdi_id: initialData.progdi_id || "",
        sales_id: initialData.sales_id || "",
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

  const renderFormField = (
    label,
    name,
    type = "text",
    options = null,
    isRequired = true
  ) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 transition-colors duration-200 sm:text-sm dark:text-gray-300">
        {label}{" "}
        {isRequired && (
          <span className="text-red-500 dark:text-red-400">*</span>
        )}
      </label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
          required={isRequired}
        >
          <option
            value=""
            className="dark:bg-gray-700"
          >{`Pilih ${label}`}</option>
          {options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              className="dark:bg-gray-700"
            >
              {option.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="block w-full px-3 py-2 text-sm transition-colors duration-200 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 dark:placeholder-gray-400"
          required={isRequired}
          autoComplete={
            name === "email" ? "email" : name === "phone" ? "tel" : "off"
          }
        />
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 space-y-4 transition-colors duration-200 sm:p-6 dark:text-gray-200"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {renderFormField("Nama", "name")}
        {renderFormField("Email", "email", "email", null, false)}
        {renderFormField("No. Hp / WA", "phone", "text", null, false)}
        {renderFormField("NIM Siakad", "nimSiakad", "text", null, false)}
        {renderFormField(
          "Password Siakad",
          "passwordSiakad",
          "text",
          null,
          false
        )}
        {renderFormField("Kelas", "class_id", null, classes)}
        {renderFormField("Program Studi", "progdi_id", null, progdis)}
        {renderFormField("Sales", "sales_id", null, salesList)}
      </div>

      <div className="flex justify-end pt-4 mt-4 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium text-white transition-colors bg-blue-500 border border-transparent rounded-md shadow-sm sm:px-4 sm:py-2 sm:text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800 transition-colors duration-200"
        >
          {initialData ? "Perbarui" : "Tambah"}
        </button>
      </div>
    </form>
  );
}

CustomerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isAdmin: PropTypes.bool,
};
