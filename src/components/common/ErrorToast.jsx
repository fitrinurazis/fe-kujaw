export default function ErrorToast({ show, message, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:bottom-4 md:left-auto md:right-4 md:w-96">
      <div className="p-4 transition-colors duration-200 bg-red-100 border border-red-200 rounded-lg shadow-lg dark:bg-red-900/30 dark:border-red-900/50 dark:text-white">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-600 transition-colors duration-200 dark:text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 transition-colors duration-200 dark:text-red-200">
              {message}
            </p>
          </div>
          <div className="pl-3 ml-auto">
            <button
              className="inline-flex text-red-500 transition-colors duration-200 hover:text-red-600 focus:outline-none dark:text-red-400 dark:hover:text-red-300"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
