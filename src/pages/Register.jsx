import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SuccessPopup from "../components/common/SuccessPopup";
import AnimatedBlobs from "../components/decoration/AnimatedBlobs";
import AnimatedGradient from "../components/decoration/AnimatedGradient";
import { clearError, register } from "../store/slices/authSlice";
import { useSettings } from "../contexts/SettingsContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Mengambil setting dark mode
  const { settings } = useSettings();

  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  // Menerapkan dark mode saat komponen dimuat
  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    const result = await dispatch(register(registrationData));
    if (register.fulfilled.match(result)) {
      setShowSuccess(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      <AnimatedBlobs />
      <div className="relative hidden lg:flex lg:w-1/2">
        <AnimatedGradient />

        <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-white">
          <div>
            <h1 className="mb-4 text-5xl font-bold">
              Bergabunglah Bersama Kami!
            </h1>
            <p className="text-xl">
              Buat akun Anda dan mulailah perjalanan Anda
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center w-full px-8 py-8 lg:w-1/2 md:px-16">
        <div className="w-full max-w-md p-8 transition-colors duration-200 shadow-xl backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 dark:backdrop-blur-lg rounded-2xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
              Buat Akun
            </h2>
            <p className="text-gray-600 transition-colors duration-200 dark:text-gray-300">
              Isi detail Anda untuk memulai
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-2 text-sm text-center text-red-500 transition-colors duration-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {passwordError && (
              <div className="px-4 py-2 text-sm text-center text-red-500 transition-colors duration-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {passwordError}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Nama Lengkap
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Nomor Telepon
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200">
                Konfirmasi Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-400"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 font-medium transform hover:scale-[1.02]"
            >
              Buat Akun
            </button>

            <div className="mt-4 text-center">
              <span className="text-gray-600 transition-colors duration-200 dark:text-gray-300">
                Sudah punya akun?
              </span>
              <Link
                to="/login"
                className="ml-2 text-indigo-600 transition-colors duration-300 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Masuk
              </Link>
            </div>
          </form>
        </div>
      </div>

      <SuccessPopup
        isVisible={showSuccess}
        title="Registration Successful!"
        message="Your account has been created successfully. Please login to continue."
        onClose={handleSuccessClose}
      />
    </div>
  );
}
