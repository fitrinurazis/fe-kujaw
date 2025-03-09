import { useEffect, useState } from "react";
import { BiCog, BiMoon } from "react-icons/bi";
import { useSettings } from "../contexts/SettingsContext";

export default function Settings() {
  const { settings: globalSettings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState({ ...globalSettings });
  const [successMessage, setSuccessMessage] = useState("");

  // Update local settings when global settings change
  useEffect(() => {
    setLocalSettings({ ...globalSettings });
  }, [globalSettings]);

  // Memastikan mode gelap diterapkan ketika komponen dimuat
  useEffect(() => {
    applyDarkMode(localSettings.darkMode);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update nilai di state lokal
    const newSettings = {
      ...localSettings,
      [name]: type === "checkbox" ? checked : value,
    };
    setLocalSettings(newSettings);

    // Terapkan mode gelap jika pengaturan yang diubah adalah darkMode
    if (name === "darkMode") {
      applyDarkMode(checked);
    }

    // Simpan perubahan ke global settings dan localStorage secara real-time
    updateSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));

    // Tampilkan pesan sukses singkat
    setSuccessMessage("Pengaturan berhasil diperbarui");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  // Fungsi untuk menerapkan mode gelap
  const applyDarkMode = (isDarkMode) => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Komponen SettingCard
  const SettingCard = ({ icon, title, description, children }) => (
    <div className="flex flex-col p-4 transition-all border border-gray-200 rounded-lg sm:p-5 hover:shadow-md dark:border-gray-700 dark:hover:shadow-none dark:hover:bg-gray-700/30">
      <div className="flex items-start mb-3">
        <div className="flex items-center justify-center w-8 h-8 mr-3 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-900/30">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800 sm:text-base dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
      {/* Floating Success message */}
      {successMessage && (
        <div className="fixed z-50 transform -translate-x-1/2 top-4 left-1/2 animate-fadeIn">
          <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg shadow-lg sm:p-4 sm:text-base dark:bg-green-800/70 dark:border-green-800 dark:text-green-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {successMessage}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <BiCog className="w-6 h-6 mr-2 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">
            Pengaturan
          </h1>
        </div>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Sesuaikan preferensi aplikasi Anda
        </p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm sm:p-6 dark:bg-gray-800">
        <div>
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700 sm:text-xl dark:text-gray-200">
              Preferensi Umum
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Dark Mode */}
              <SettingCard
                icon={<BiMoon />}
                title="Mode Gelap"
                description="Aktifkan tema gelap untuk aplikasi"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    className="sr-only peer"
                    checked={localSettings.darkMode}
                    onChange={handleChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {localSettings.darkMode ? "Aktif" : "Nonaktif"}
                  </span>
                </label>
              </SettingCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
