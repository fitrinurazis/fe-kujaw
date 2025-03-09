import PropTypes from "prop-types";

export default function ErrorState({
  title = "Error",
  error,
  onBack,
  backText = "Go Back",
  type = "error",
}) {
  const bgColor =
    type === "error"
      ? "bg-red-100 dark:bg-red-900/20"
      : "bg-yellow-100 dark:bg-yellow-900/20";
  const textColor =
    type === "error"
      ? "text-red-700 dark:text-red-400"
      : "text-yellow-700 dark:text-yellow-400";
  const errorTextColor =
    type === "error"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-600 dark:text-gray-400";

  return (
    <div className="container p-4 mx-auto">
      <div
        className={`p-6 rounded-lg transition-colors duration-200 ${bgColor}`}
      >
        <h2
          className={`mb-4 text-xl font-bold transition-colors duration-200 ${textColor}`}
        >
          {title}
        </h2>
        <p className={`transition-colors duration-200 ${errorTextColor}`}>
          {error}
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 mt-4 text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {backText}
          </button>
        )}
      </div>
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.string,
  error: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  backText: PropTypes.string,
  type: PropTypes.oneOf(["error", "warning"]),
};
