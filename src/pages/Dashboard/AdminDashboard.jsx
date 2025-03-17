import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import {
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiPackage,
  FiActivity,
} from "react-icons/fi";
import {
  getSummary,
  getRecentTransactions,
  getTopProducts,
  getTopCustomers,
  getSalesChart,
  getIncomeExpeseChart,
} from "../../store/slices/dashboardSlice";
import TopProductsList from "../../components/dashboard/TopProductsList";
import TopCustomersList from "../../components/dashboard/TopCustomersList";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    summary,
    recentTransactions,
    topProducts,
    topCustomers,
    incomeExpenseChart,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch all dashboard data when component mounts
    dispatch(getSummary());
    dispatch(getRecentTransactions());
    dispatch(getTopProducts());
    dispatch(getTopCustomers());
    dispatch(getSalesChart());
    dispatch(getIncomeExpeseChart());
  }, [dispatch]);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-10 h-10 border-t-2 border-b-2 rounded-full animate-spin border-primary sm:w-12 sm:h-12 dark:border-blue-400"></div>
        <span className="ml-3 text-sm text-gray-600 transition-colors duration-200 sm:text-base dark:text-gray-300">
          Memuat data dashboard...
        </span>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="p-4 mx-auto max-w-screen">
        <div className="p-4 text-red-700 transition-colors duration-200 bg-red-100 rounded-md dark:bg-red-900/20 dark:text-red-400">
          <h3 className="text-base font-bold sm:text-lg">Error: {error}</h3>
          <p className="mt-1 text-sm sm:text-base">
            Terjadi kesalahan saat memuat dashboard. Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-3 mx-auto transition-colors duration-200 sm:p-4 lg:p-6">
      <h2 className="mb-4 text-xl font-bold transition-colors duration-200 sm:text-2xl lg:text-3xl dark:text-white">
        Dashboard
      </h2>

      {summary && (
        <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-6">
          <SummaryCard
            title="Total Penjualan"
            amount={`Rp ${summary.totalIncome?.toLocaleString() || 0}`}
            icon={<FiArrowUp className="text-green-500 dark:text-green-400" />}
          />
          <SummaryCard
            title="Total Pengeluaran"
            amount={`Rp ${summary.totalExpense?.toLocaleString() || 0}`}
            icon={<FiArrowDown className="text-red-500 dark:text-red-400" />}
          />
          <SummaryCard
            title="Laba Bersih"
            amount={`Rp ${summary.netIncome?.toLocaleString() || 0}`}
            icon={
              <FiDollarSign
                className={
                  summary.netIncome >= 0
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-red-500 dark:text-red-400"
                }
              />
            }
          />
          <SummaryCard
            title="Total Produk"
            amount={summary.totalProducts || 0}
            icon={
              <FiPackage className="text-orange-500 dark:text-orange-400" />
            }
          />
          <SummaryCard
            title="Total Pelanggan"
            amount={summary.totalCustomers || 0}
            icon={<FiUsers className="text-indigo-500 dark:text-indigo-400" />}
          />
          <SummaryCard
            title="Total Transaksi"
            amount={summary.totalTransactions || 0}
            icon={<FiActivity className="text-blue-500 dark:text-blue-400" />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2 lg:gap-6">
        <div className="p-3 transition-colors duration-200 bg-white rounded-lg shadow sm:p-4 lg:p-5 dark:bg-gray-800 dark:shadow-gray-900/10">
          <h3 className="mb-3 text-base font-semibold transition-colors duration-200 sm:text-lg lg:mb-4 dark:text-white">
            Pendapatan vs Pengeluaran
          </h3>

          <div className="w-full h-64 sm:h-72 lg:h-80">
            {incomeExpenseChart && incomeExpenseChart.length > 0 ? (
              <IncomeExpenseChart data={incomeExpenseChart} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-center text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
                  Tidak ada data pendapatan/pengeluaran
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products and Customers */}

        <div className="p-3 transition-colors duration-200 bg-white rounded-lg shadow sm:p-4 lg:p-5 dark:bg-gray-800 dark:shadow-gray-900/10">
          <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base font-semibold transition-colors duration-200 sm:text-lg dark:text-white">
              Produk Terlaris
            </h3>
            <Link
              to="/admin/products"
              className="px-3 py-1.5 mt-1 text-xs text-white transition-colors bg-blue-500 rounded-md sm:text-sm sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Lihat Semua
            </Link>
          </div>
          {topProducts && topProducts.length > 0 ? (
            <TopProductsList products={topProducts.slice(0, 5)} />
          ) : (
            <div className="flex items-center justify-center h-40 sm:h-48">
              <p className="text-sm text-center text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
                Tidak ada data produk terlaris
              </p>
            </div>
          )}
        </div>

        <div className="p-3 transition-colors duration-200 bg-white rounded-lg shadow sm:p-4 lg:p-5 dark:bg-gray-800 dark:shadow-gray-900/10">
          <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base font-semibold transition-colors duration-200 sm:text-lg dark:text-white">
              Pelanggan Terbaik
            </h3>
            <Link
              to="/admin/customers"
              className="px-3 py-1.5 mt-1 text-xs text-white transition-colors bg-blue-500 rounded-md sm:text-sm sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Lihat Semua
            </Link>
          </div>
          {topCustomers && topCustomers.length > 0 ? (
            <TopCustomersList customers={topCustomers.slice(0, 5)} />
          ) : (
            <div className="flex items-center justify-center h-40 sm:h-48">
              <p className="text-sm text-center text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
                Tidak ada data pelanggan terbaik
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 transition-colors duration-200 bg-white rounded-lg shadow sm:p-4 lg:p-5 dark:bg-gray-800 dark:shadow-gray-900/10">
        <div className="flex flex-wrap items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base font-semibold transition-colors duration-200 sm:text-lg dark:text-white">
            Transaksi Terbaru
          </h3>
          <Link
            to="/admin/transactions"
            className="px-3 py-1.5 mt-1 text-xs text-white transition-colors bg-blue-500 rounded-md sm:text-sm sm:px-4 sm:py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentTransactions && recentTransactions.length > 0 ? (
            <RecentTransactions transactions={recentTransactions.slice(0, 5)} />
          ) : (
            <div className="flex items-center justify-center h-40 sm:h-48">
              <p className="text-sm text-center text-gray-500 transition-colors duration-200 sm:text-base dark:text-gray-400">
                Tidak ada transaksi terbaru
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
