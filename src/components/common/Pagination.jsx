import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // If there's only 1 page, don't show pagination
  if (pageNumbers.length <= 1) return null;

  const renderPageNumbers = () => {
    const maxPagesToShow = 5;

    if (pageNumbers.length <= maxPagesToShow) {
      // If we have fewer pages than our limit, show all pages
      return pageNumbers.map((number) => (
        <li key={number}>
          <button
            onClick={() => paginate(number)}
            className={`px-3 py-1 ${
              currentPage === number
                ? "text-blue-600 bg-blue-50 border-blue-500 dark:text-blue-400 dark:bg-gray-700 dark:border-blue-400"
                : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
            } font-medium text-sm rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </button>
        </li>
      ));
    } else {
      // We need to show a subset of pages
      let pagesToRender = [];

      // Always include first page, last page, current page, and pages immediately before and after current page
      const includeFirst = 1;
      const includeLast = pageNumbers.length;
      const includeCurrent = currentPage;
      const includePrev = currentPage > 1 ? currentPage - 1 : null;
      const includeNext =
        currentPage < pageNumbers.length ? currentPage + 1 : null;

      // Add the first page
      pagesToRender.push(includeFirst);

      // Add ellipsis if there's a gap after the first page
      if (includePrev && includePrev > includeFirst + 1) {
        pagesToRender.push("ellipsis1");
      }

      // Add the page before current if it's not the first page
      if (includePrev && includePrev !== includeFirst) {
        pagesToRender.push(includePrev);
      }

      // Add current page if it's not the first or last page
      if (includeCurrent !== includeFirst && includeCurrent !== includeLast) {
        pagesToRender.push(includeCurrent);
      }

      // Add the page after current if it's not the last page
      if (includeNext && includeNext !== includeLast) {
        pagesToRender.push(includeNext);
      }

      // Add ellipsis if there's a gap before the last page
      if (includeNext && includeNext < includeLast - 1) {
        pagesToRender.push("ellipsis2");
      }

      // Add the last page
      if (includeLast !== includeFirst) {
        pagesToRender.push(includeLast);
      }

      // Remove duplicates and sort
      pagesToRender = [...new Set(pagesToRender)].sort((a, b) => {
        if (a === "ellipsis1") return -1;
        if (b === "ellipsis1") return 1;
        if (a === "ellipsis2") return 1;
        if (b === "ellipsis2") return -1;
        return a - b;
      });

      return pagesToRender.map((item, index) => {
        if (item === "ellipsis1" || item === "ellipsis2") {
          return (
            <li key={`ellipsis-${index}`}>
              <span className="px-3 py-1 text-gray-500 dark:text-gray-400">
                ...
              </span>
            </li>
          );
        }

        return (
          <li key={item}>
            <button
              onClick={() => paginate(item)}
              className={`px-3 py-1 ${
                currentPage === item
                  ? "text-blue-600 bg-blue-50 border-blue-500 dark:text-blue-400 dark:bg-gray-700 dark:border-blue-400"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
              } font-medium text-sm rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              aria-current={currentPage === item ? "page" : undefined}
            >
              {item}
            </button>
          </li>
        );
      });
    }
  };

  return (
    <nav
      className="flex items-center justify-between mt-6"
      aria-label="Pagination"
    >
      <div className="flex justify-between flex-1 sm:justify-end">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-3 py-2 mr-2 text-sm font-medium rounded-md ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
              : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FiChevronLeft size={18} />
          <span className="sr-only">Previous</span>
        </button>

        <ul className="hidden md:flex">{renderPageNumbers()}</ul>

        <button
          onClick={() =>
            currentPage < pageNumbers.length && paginate(currentPage + 1)
          }
          disabled={currentPage === pageNumbers.length}
          className={`relative inline-flex items-center px-3 py-2 ml-2 text-sm font-medium rounded-md ${
            currentPage === pageNumbers.length
              ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
              : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <span className="sr-only">Next</span>
          <FiChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}
