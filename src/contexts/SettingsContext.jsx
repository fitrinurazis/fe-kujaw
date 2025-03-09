import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Default settings
  const defaultSettings = {
    darkMode: false,
    language: "id",
    timezone: "Asia/Jakarta",
  };

  // Get settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);

      // Hapus properti notifications jika ada
      const { notifications, realtimeNotifications, ...cleanedSettings } =
        parsedSettings;

      return {
        ...defaultSettings,
        ...cleanedSettings,
      };
    }

    return defaultSettings;
  });

  // Update settings in state and localStorage
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };
  // Apply dark mode on initial load and when changed
  useEffect(() => {
    const applyDarkMode = () => {
      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyDarkMode();
  }, [settings.darkMode]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
