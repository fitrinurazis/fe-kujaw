import { useState } from "react";
import PropTypes from "prop-types";
import { getImageUrl } from "../../../utils/helpers";
import notFoundImage from "../../../assets/image-not-found.png";
import ImagePreviewModal from "./ImagePreviewModal";

export default function TransactionProofImage({ proofImage }) {
  const [showModal, setShowModal] = useState(false);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = notFoundImage;
  };

  return (
    <div className="p-4 transition-colors duration-200 border border-gray-200 rounded-lg sm:p-5 dark:border-gray-700">
      <h3 className="mb-3 text-lg font-semibold transition-colors duration-200 dark:text-white">
        Bukti Transaksi
      </h3>

      {proofImage ? (
        <div className="flex flex-col items-center">
          <div className="w-full overflow-hidden transition-colors duration-200 bg-gray-100 rounded-lg shadow-sm cursor-pointer dark:bg-gray-700">
            <img
              src={getImageUrl(proofImage)}
              alt="Transaction proof"
              className="object-contain w-full h-auto max-h-64"
              onClick={() => setShowModal(true)}
              onError={handleImageError}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 mt-3 text-sm font-medium text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
          >
            Lihat Gambar Penuh
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 transition-colors duration-200 bg-gray-100 rounded-lg dark:bg-gray-700">
          <p className="text-gray-500 transition-colors duration-200 dark:text-gray-400">
            Tidak ada bukti transaksi
          </p>
        </div>
      )}

      {showModal && (
        <ImagePreviewModal
          imageUrl={getImageUrl(proofImage)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

TransactionProofImage.propTypes = {
  proofImage: PropTypes.string,
};
