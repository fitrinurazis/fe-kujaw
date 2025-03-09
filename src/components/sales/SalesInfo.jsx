import { useState } from "react";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";

const SalesInfo = ({ salesData }) => {
  const [imageError, setImageError] = useState(false);

  const shouldShowAvatar = salesData.avatar && !imageError;

  return (
    <div className="p-2 transition-colors duration-200 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* Avatar with error handling */}
        <div className="flex-shrink-0 mx-auto mb-4 sm:mx-0 sm:mb-0 sm:mr-6">
          {shouldShowAvatar ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${
                salesData.avatar
              }`}
              alt={`${salesData.name}'s avatar`}
              className="object-cover w-20 h-20 rounded-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full dark:bg-gray-700">
              <FiUser className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>

        {/* Name and Status */}

        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
            {salesData.name}
          </h1>

          <div className="flex items-center justify-center mt-2 sm:justify-start">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                salesData.role === "admin"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {salesData.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:gap-6">
        {/* Contact Information */}

        <div className="flex items-start p-3 rounded-lg sm:p-4 bg-gray-50 dark:bg-gray-700/50">
          <FiMail className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
          <div className="flex-1 ml-3 overflow-hidden">
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase truncate dark:text-gray-400">
              Email
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900 break-all dark:text-white">
              {salesData.email}
            </p>
          </div>
        </div>

        {salesData.phone && (
          <div className="flex items-start p-3 rounded-lg sm:p-4 bg-gray-50 dark:bg-gray-700/50">
            <FiPhone className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div className="flex-1 ml-3">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                Nomor Telepon
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {salesData.phone}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesInfo;
