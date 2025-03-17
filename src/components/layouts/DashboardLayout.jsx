import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSettings } from "../../contexts/SettingsContext";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useSettings();

  // Ensure dark mode is applied consistently
  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.darkMode]);

  return (
    <div className="flex h-screen transition-colors duration-200 bg-gray-200 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 w-full md:w-auto md:ml-72">
        <div className="sticky top-0 z-10 mb-5">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <main className="rounded-xl">
          <div className="mx-auto md:max-w-7xl">
            <div className="overflow-hidden transition-colors duration-200 bg-white border border-gray-100 shadow-md md:rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
