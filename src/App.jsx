import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import Settings from "./pages/Settings"; // Import tanpa lazy load
import ProtectedRoute from "./route/ProtectedRoute";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/Dashboard/AdminDashboard"));
const SalesDashboard = lazy(() => import("./pages/Dashboard/SalesDashboard"));
const Transactions = lazy(() => import("./pages/Transactions/Transactions"));
const TransactionsIncome = lazy(() =>
  import("./pages/Transactions/TransactionsIncome")
);
const TransactionsExpense = lazy(() =>
  import("./pages/Transactions/TransactionsExpense")
);
const TransactionDetail = lazy(() =>
  import("./pages/Transactions/TransactionDetail")
);
const Customers = lazy(() => import("./pages/Customers/Customers"));
const CustomerDetail = lazy(() => import("./pages/Customers/CustomerDetail"));
const Classes = lazy(() => import("./pages/Classes"));
const Categories = lazy(() => import("./pages/Categories"));
const Progdis = lazy(() => import("./pages/Progdis"));
const Products = lazy(() => import("./pages/Products"));
const Reports = lazy(() => import("./pages/Reports"));
const Profile = lazy(() => import("./pages/Profile"));
const Sales = lazy(() => import("./pages/Saless/Sales"));
const SalesDetail = lazy(() => import("./pages/Saless/SalesDetail"));

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Settings route - sebagai standalone route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route
                path="transactions/income"
                element={<TransactionsIncome />}
              />
              <Route
                path="transactions/expense"
                element={<TransactionsExpense />}
              />
              <Route path="transactions/:id" element={<TransactionDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="classes" element={<Classes />} />
              <Route path="categories" element={<Categories />} />
              <Route path="progdis" element={<Progdis />} />
              <Route path="products" element={<Products />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route path="sales" element={<Sales />} />
              <Route path="sales/:id" element={<SalesDetail />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Sales Routes */}
            <Route
              path="/sales/*"
              element={
                <ProtectedRoute role="sales">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SalesDashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route
                path="transactions/income"
                element={<TransactionsIncome />}
              />
              <Route
                path="transactions/expense"
                element={<TransactionsExpense />}
              />
              <Route path="transactions/:id" element={<TransactionDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="classes" element={<Classes />} />
              <Route path="products" element={<Products />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route path="sales" element={<Sales />} />
              <Route path="sales/:id" element={<SalesDetail />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Default and Catch-all Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </SettingsProvider>
    </AuthProvider>
  );
}
export default App;
