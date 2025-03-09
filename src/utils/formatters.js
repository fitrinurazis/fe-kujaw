/**
 * Currency formatter with IDR (Indonesian Rupiah) as default
 * @param {number|string} value - Number to format
 * @param {string} [currency='IDR'] - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = "IDR") => {
  if (value === undefined || value === null) return "-";

  // Parse the value to make sure it's a number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Format the number with the specified currency
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

/**
 * Parses a Rupiah-formatted string back to a number
 * @param {string} rupiahString - Formatted currency string
 * @returns {string} Numeric string with all non-digit characters removed
 */
export const parseRupiahToNumber = (rupiahString) => {
  if (!rupiahString) return "";
  return rupiahString.replace(/[^\d]/g, "");
};

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "-";

  const defaultOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("id-ID", defaultOptions);
};
