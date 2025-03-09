const TopProductsList = ({ products }) => {
  // Mobile card view
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {products.length > 0 ? (
        products.map((item, index) => (
          <div
            key={index}
            className="p-3 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="font-medium text-gray-900 truncate transition-colors duration-200 dark:text-white">
              {item.product?.name || "Produk Tidak Diketahui"}
            </div>
            <div className="grid grid-cols-2 mt-2 text-xs">
              <div>
                <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                  Terjual:
                </span>{" "}
                <span className="font-medium dark:text-gray-200">
                  {item.totalSold || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
                  Pendapatan:
                </span>{" "}
                <span className="font-medium dark:text-gray-200">
                  Rp {parseFloat(item.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-sm text-center text-gray-500 transition-colors duration-200 dark:text-gray-400">
          Tidak ada data produk terlaris
        </div>
      )}
    </div>
  );

  // Desktop table view
  const renderDesktopView = () => (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Nama
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Terjual
            </th>
            <th className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 sm:px-3 lg:px-6 dark:text-gray-300">
              Pendapatan
            </th>
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {products.length > 0 ? (
            products.map((item, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700/30"
                }
              >
                <td className="px-2 py-3 whitespace-nowrap sm:px-3 lg:px-6">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[250px] dark:text-white transition-colors duration-200">
                    {item.product?.name || "Produk Tidak Diketahui"}
                  </div>
                </td>
                <td className="px-2 py-3 text-sm text-gray-500 transition-colors duration-200 whitespace-nowrap sm:px-3 lg:px-6 dark:text-gray-300">
                  {item.totalSold || 0}
                </td>
                <td className="px-2 py-3 text-sm font-medium text-gray-900 transition-colors duration-200 whitespace-nowrap sm:px-3 lg:px-6 dark:text-white">
                  Rp {parseFloat(item.totalRevenue || 0).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-6 py-4 text-sm text-center text-gray-500 transition-colors duration-200 dark:text-gray-400"
              >
                Tidak ada data produk terlaris
              </td>
            </tr>
          )}
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
};

export default TopProductsList;
