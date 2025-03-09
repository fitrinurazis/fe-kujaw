export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="relative z-50 w-full max-w-md p-8 mx-4 transition-colors duration-200 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full dark:bg-red-900/30">
            <svg
              className="w-10 h-10 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
            Confirm Delete
          </h3>
          <p className="mb-6 text-gray-600 transition-colors duration-200 dark:text-gray-300">
            Are you sure you want to delete {itemName}? This action cannot be
            undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
