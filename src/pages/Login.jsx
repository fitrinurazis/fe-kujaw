import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { login, clearError } from "../store/slices/authSlice";
import WavePattern from "../components/decoration/WavePattern";
import AnimatedGradient from "../components/decoration/AnimatedGradient";
import SuccessPopup from "../components/common/SuccessPopup";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mengambil setting dark mode
  const { settings } = useSettings();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const { login: authLogin } = useAuth();

  // Menerapkan dark mode saat komponen dimuat
  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(login({ identifier, password }));
    if (login.fulfilled.match(result)) {
      await authLogin(result.payload.user);
      setShowSuccessModal(true);
      const userRole = result.payload.user.role;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userRole === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userRole === "sales") {
        navigate("/sales/dashboard", { replace: true });
      }
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <SuccessPopup
        isVisible={showSuccessModal}
        title="Berhasil Masuk!"
        message="Anda akan segera dialihkan ke dashboard."
        onClose={() => setShowSuccessModal(false)}
      />
      <WavePattern />
      <div className="relative hidden lg:flex lg:w-1/2">
        <AnimatedGradient />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">Selamat Datang Guys!</h1>
          <p className="text-xl">Masuk untuk melanjutkan perjalanan Anda</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center w-full px-6 py-8 lg:w-1/2 md:px-16">
        <div className="w-full max-w-md p-6 transition-colors duration-200 shadow-xl backdrop-blur-lg bg-white/80 dark:bg-gray-800/90 dark:backdrop-blur-lg rounded-2xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
              Masuk
            </h2>
            <p className="text-gray-600 transition-colors duration-200 dark:text-gray-300">
              Masuk untuk melanjutkan perjalanan Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-2 text-sm text-red-500 transition-colors duration-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Email atau No. Telepon
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Masukkan email atau nomor telepon"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium text-white transition-colors duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              Masuk
            </button>

            <div className="mt-4 text-center">
              <span className="text-gray-600 transition-colors duration-200 dark:text-gray-300">
                Belum punya akun?
              </span>
              <Link
                to="/register"
                className="ml-2 text-indigo-600 transition-colors duration-200 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Daftar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
