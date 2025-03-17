import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logoDark from "../../assets/logos/logo-kujaw-dark.png";
import logoLight from "../../assets/logos/logo-kujaw-light.png";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const basePath = isAdmin ? "/admin" : "/sales";

  // Track open state for all dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Initialize dropdown states based on current path
  useEffect(() => {
    const newOpenState = {};

    // Check each dropdown to see if current path matches any of its subitems
    menuItems.forEach((item) => {
      if (item.isDropdown) {
        // For Transaksi dropdown, keep it open if we're anywhere in the transactions section
        if (
          item.title === "Transaksi" &&
          location.pathname.includes(`${basePath}/transactions`)
        ) {
          newOpenState[item.title] = true;
        }
        // For other dropdowns, check if current path matches any subitem
        else if (
          item.items?.some((subItem) =>
            location.pathname.includes(subItem.path)
          )
        ) {
          newOpenState[item.title] = true;
        }
      }
    });

    setOpenDropdowns(newOpenState);
  }, [location.pathname]);

  const menuItems = [
    {
      title: "Dashboard",
      path: `${basePath}/dashboard`,
    },

    {
      title: "Transaksi",
      isDropdown: true,
      items: [
        {
          title: "Semua Transaksi",
          path: `${basePath}/transactions`,
        },
        {
          title: "Transaksi Pemasukan",
          path: `${basePath}/transactions/income`,
        },
        {
          title: "Transaksi Pengeluaran",
          path: `${basePath}/transactions/expense`,
        },
      ],
    },

    {
      title: "Pelanggan",
      path: `${basePath}/customers`,
    },
    {
      title: "Sales",
      path: `${basePath}/sales`,
    },

    ...(isAdmin
      ? [
          {
            title: "Data Master",
            adminOnly: true,
            isDropdown: true,
            items: [
              {
                title: "Program Studi",
                path: `${basePath}/progdis`,
              },
              {
                title: "kelas",
                path: `${basePath}/classes`,
              },
              {
                title: "Kategori",
                path: `${basePath}/categories`,
              },
              {
                title: "Produk",
                path: `${basePath}/products`,
              },
            ],
          },
        ]
      : [
          {
            title: "Produk",
            path: `${basePath}/products`,
          },
        ]),
    {
      title: "Laporan",
      path: `${basePath}/reports`,
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    isAdmin ? true : !item.adminOnly
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const isDropdownActive = (item) => {
    if (!item.isDropdown) return false;

    // Special case for Transaksi dropdown
    if (item.title === "Transaksi") {
      return location.pathname.includes(`${basePath}/transactions`);
    }

    return item.items?.some((subItem) =>
      location.pathname.includes(subItem.path)
    );
  };

  // Special case for checking if "Semua Transaksi" should be highlighted
  const isAllTransactionsActive = () => {
    // If we're on the exact transactions path or any specific transaction
    // but not on income or expense specific paths
    const path = location.pathname.toLowerCase();
    return (
      path === `${basePath}/transactions`.toLowerCase() ||
      (path.includes(`${basePath}/transactions`.toLowerCase()) &&
        !path.includes("/income") &&
        !path.includes("/expense"))
    );
  };

  // Modified toggleDropdown function to close other dropdowns
  const toggleDropdown = (title) => {
    setOpenDropdowns((prev) => {
      // If we're opening this dropdown, close all others
      if (!prev[title]) {
        // Create a new object with all dropdowns closed
        const newState = {};
        // Only open the clicked dropdown
        newState[title] = true;
        return newState;
      } else {
        // If we're closing the dropdown, just toggle it
        return {
          ...prev,
          [title]: !prev[title],
        };
      }
    });
  };

  const handleMenuClick = () => {
    setIsOpen(false);
    // Don't close dropdowns when clicking menu items
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity duration-200 bg-black opacity-50 md:hidden dark:opacity-70"
          onClick={handleOverlayClick}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] rounded-2xl bg-white shadow-lg transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
          h-full overflow-hidden flex flex-col dark:bg-gray-800 dark:shadow-gray-900/30  `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 transition-colors duration-200 bg-gray-200 dark:bg-gray-900">
            <img src={logoDark} alt="Logo" className="hidden w-40 dark:block" />
            <img src={logoLight} alt="Logo" className="w-40 dark:hidden" />
            <button
              className="p-2 text-white transition-colors duration-200 rounded-lg md:hidden hover:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto transition-colors duration-200 dark:bg-gray-800">
            {filteredMenuItems.map((item, index) =>
              item.isDropdown ? (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors duration-200 ${
                      isDropdownActive(item)
                        ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="font-medium">{item.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdowns[item.title] ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`pl-4 mt-2 transition-all duration-300 ${
                      openDropdowns[item.title]
                        ? "max-h-56 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {item.items.map((subItem) => {
                      // Special case for "Semua Transaksi"
                      const isActive =
                        subItem.title === "Semua Transaksi"
                          ? isAllTransactionsActive()
                          : location.pathname === subItem.path;

                      return (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={`
                            flex flex-col px-3 py-2 mb-2 rounded-lg transition-colors duration-200
                            ${
                              isActive
                                ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                            }
                          `}
                          onClick={handleMenuClick}
                        >
                          <span className="font-medium">{subItem.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex flex-col px-3 py-2 mb-2 rounded-lg transition-colors duration-200 group
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                    }
                  `}
                  onClick={handleMenuClick}
                >
                  <div className="items-center">
                    <span className="font-medium">{item.title}</span>
                  </div>
                </NavLink>
              )
            )}
          </nav>

          <div className="p-4 transition-colors duration-200 border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <NavLink
              to={isAdmin ? "/admin/profile" : "/sales/profile"}
              className={({ isActive }) => `
                flex items-center px-3 py-2 text-gray-600 rounded-lg transition-colors duration-200 group hover:bg-gray-100 dark:hover:bg-gray-700
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                }
              `}
              onClick={handleMenuClick}
            >
              <span className="mr-3">👤</span>
              <span className="font-medium">My Profile</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
