import { useEffect, useRef, useState } from "react";
import { BiCog, BiUser, BiArrowBack } from "react-icons/bi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationPopup from "../common/ConfirmationPopup";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const isSettingsPage = location.pathname === "/settings";

  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      throw new Error("Gagal keluar: " + error.message);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <nav className="transition-colors duration-200 bg-white shadow-sm rounded-2xl dark:bg-gray-800 dark:text-white dark:shadow-gray-900">
        <div className="px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {isSettingsPage ? (
                <button
                  onClick={goBack}
                  className="flex items-center p-2 text-gray-600 transition-colors duration-200 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <BiArrowBack className="w-5 h-5 mr-1" />
                  <span className="text-sm">Kembali</span>
                </button>
              ) : (
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-700 transition-colors duration-200 rounded-md md:hidden dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="text-2xl">☰</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3 md:space-x-6">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setShowProfile(!showProfile);
                  }}
                  className="flex items-center p-2 space-x-2 transition-colors duration-200 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <BiUser className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                    {user?.name}
                  </span>
                </button>
                {showProfile && (
                  <div className="absolute right-0 z-50 w-48 mt-2 transition-colors duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-gray-600">
                    <div className="py-2">
                      <NavLink
                        to={isAdmin ? "/admin/profile" : "/sales/profile"}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setShowProfile(false)}
                      >
                        <BiUser className="w-5 h-5 mr-2" />
                        Profil
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setShowProfile(false)}
                      >
                        <BiCog className="w-5 h-5 mr-2" />
                        Pengaturan
                      </NavLink>

                      <button
                        onClick={() => {
                          setShowLogoutConfirmation(true);
                          setShowProfile(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors duration-200 cursor-pointer hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmationPopup
        isVisible={showLogoutConfirmation}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
}

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};
