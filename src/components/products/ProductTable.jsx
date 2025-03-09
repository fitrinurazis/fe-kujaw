import PropTypes from "prop-types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  loading,
  isAdmin,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 transition-colors duration-200 dark:text-gray-400">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 transition-colors duration-200 dark:text-gray-400">
        <p>Tidak ada data produk.</p>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to parse description text with URLs and line breaks
  const parseDescription = (text) => {
    if (!text) return "-";

    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace URLs with clickable links
    const withLinks = text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${url}</a>`;
    });

    // Replace line breaks with <br /> tags
    const withLineBreaks = withLinks.replace(/\n/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };

  // Mobile card view for small screens
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <h3 className="mb-2 text-lg font-medium transition-colors duration-200 dark:text-white">
              {product.name}
            </h3>
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-1.5 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                  aria-label="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="p-1.5 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                  aria-label="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            )}
          </div>
          <p className="mb-2 text-sm font-semibold text-green-600 transition-colors duration-200 dark:text-green-400">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-2 text-xs text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Kategori: {product.category?.name || "Tidak ada kategori"}
          </p>
          {product.description && (
            <div className="mt-3 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-300">
              {parseDescription(product.description)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const renderDesktopView = () => (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              Nama
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              Harga
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              Kategori
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              Deskripsi
            </th>

            {isAdmin && (
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
              >
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {products.map((product) => (
            <tr
              key={product.id}
              className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-6 py-4 text-sm text-gray-900 transition-colors duration-200 whitespace-nowrap dark:text-white">
                {product.name}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-green-600 transition-colors duration-200 whitespace-nowrap dark:text-green-400">
                {formatCurrency(product.price)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 transition-colors duration-200 whitespace-nowrap dark:text-gray-300">
                {product.category?.name || "Tidak ada kategori"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 transition-colors duration-200 dark:text-gray-300">
                {parseDescription(product.description)}
              </td>

              {isAdmin && (
                <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      aria-label="Edit product"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      aria-label="Delete product"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {renderMobileView()}
      {renderDesktopView()}
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isAdmin: PropTypes.bool,
};
