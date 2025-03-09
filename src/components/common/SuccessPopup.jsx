const SuccessPopup = ({ title, message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="relative z-50 w-full max-w-md p-8 mx-4 transition-colors duration-200 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full dark:bg-green-900/30">
            <svg
              className="w-10 h-10 text-green-500 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
            {title}
          </h3>
          <p className="mb-6 text-gray-600 transition-colors duration-200 dark:text-gray-300">
            {message}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
