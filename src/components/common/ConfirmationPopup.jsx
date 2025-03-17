const ConfirmationPopup = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="relative z-50 w-full max-w-md p-8 mx-4 transition-colors duration-200 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
            <svg
              className="w-10 h-10 text-yellow-500 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
            Konfirmasi Keluar
          </h3>
          <p className="mb-6 text-gray-600 transition-colors duration-200 dark:text-gray-300">
            Apakah Anda yakin ingin keluar dari aplikasi?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
