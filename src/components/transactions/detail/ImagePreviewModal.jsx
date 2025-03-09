import PropTypes from "prop-types";
import notFoundImage from "../../../assets/image-not-found.png";

export default function ImagePreviewModal({ imageUrl, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50 dark:opacity-70"
        onClick={onClose}
      ></div>
      <div className="relative z-10 p-4 bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] dark:bg-gray-800 transition-colors duration-200">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-white">
            Bukti Transaksi
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors duration-200 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <img
          src={imageUrl}
          alt="Transaction Proof"
          className="object-contain w-full max-h-[80vh] dark:ring-1 dark:ring-gray-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = notFoundImage;
            console.error("Failed to load image:", imageUrl);
          }}
        />
      </div>
    </div>
  );
}

ImagePreviewModal.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
