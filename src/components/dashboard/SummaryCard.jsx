const SummaryCard = ({ title, amount, icon }) => {
  return (
    <div className="p-3 transition-all duration-300 bg-white rounded-lg shadow sm:p-4 hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/10 dark:hover:shadow-gray-900/20">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 transition-colors duration-200 sm:text-sm dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-sm font-semibold truncate transition-colors duration-200 sm:text-base md:text-lg dark:text-white">
            {amount}
          </p>
        </div>
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 transition-colors duration-200 bg-gray-100 rounded-full sm:w-10 sm:h-10 dark:bg-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
