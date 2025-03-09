import PropTypes from "prop-types";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-12 h-12 transition-colors duration-200 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-500 animate-spin dark:border-gray-700 dark:border-t-blue-400"></div>
      <span className="ml-2 text-gray-700 transition-colors duration-200 dark:text-gray-300">
        {message}
      </span>
    </div>
  );
}

LoadingState.propTypes = {
  message: PropTypes.string,
};
