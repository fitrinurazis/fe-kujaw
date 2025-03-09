import { FiInbox, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function EmptyState({
  message,
  buttonText,
  onButtonClick,
  link,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-500">
        <FiInbox size={24} />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        Tidak ada data
      </h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {message || "Belum ada data yang tersedia."}
      </p>

      {buttonText &&
        (link ? (
          <Link
            to={link}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <FiPlus className="mr-2" />
            {buttonText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onButtonClick}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <FiPlus className="mr-2" />
            {buttonText}
          </button>
        ))}
    </div>
  );
}
