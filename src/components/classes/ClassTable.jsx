import PropTypes from "prop-types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ClassTable({ classes, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 transition-colors duration-200 dark:text-gray-400">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 transition-colors duration-200 dark:text-gray-400">
        <p>Tidak ada data kelas.</p>
      </div>
    );
  }

  // Mobile card view for small screens
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          className="p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between">
            <h3 className="mb-2 text-lg font-medium transition-colors duration-200 dark:text-white">
              {classItem.name}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(classItem)}
                className="p-1.5 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                aria-label="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => onDelete(classItem)}
                className="p-1.5 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                aria-label="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
            ID: {classItem.id}
          </p>
        </div>
      ))}
    </div>
  );

  // Desktop table view
  const renderDesktopView = () => (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full transition-colors duration-200 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="transition-colors duration-200 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="w-12 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              Nama
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase transition-colors duration-200 dark:text-gray-300"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="transition-colors duration-200 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {classes.map((classItem) => (
            <tr
              key={classItem.id}
              className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-6 py-4 text-sm text-gray-900 transition-colors duration-200 whitespace-nowrap dark:text-white">
                {classItem.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 transition-colors duration-200 whitespace-nowrap dark:text-white">
                {classItem.name}
              </td>
              <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(classItem)}
                    className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    aria-label="Edit class"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(classItem)}
                    className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    aria-label="Delete class"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {renderMobileView()}
      {renderDesktopView()}
    </div>
  );
}

ClassTable.propTypes = {
  classes: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
