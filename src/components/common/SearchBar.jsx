import PropTypes from "prop-types";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder,
  onSearch,
  resetPage,
}) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset to first page on search if resetPage function is provided
    if (resetPage) {
      resetPage();
    }

    // Call additional onSearch callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");

    // Reset to first page when clearing search
    if (resetPage) {
      resetPage();
    }

    // Call additional onSearch callback if provided
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="py-4 border-b border-gray-200  dark:border-gray-700">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleClearSearch}
          >
            <span className="text-gray-400 hover:text-gray-500">✕</span>
          </button>
        )}
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  resetPage: PropTypes.func,
};

SearchBar.defaultProps = {
  placeholder: "Cari...",
};
