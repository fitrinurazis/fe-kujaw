import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  changePassword,
  updateUserData,
  refreshToken,
} from "../store/slices/authSlice";
import { getProfile, updateProfile } from "../store/slices/userSlice";
import SuccessPopup from "../components/common/SuccessPopup";

const selectUserData = createSelector(
  [(state) => state.auth, (state) => state.user],
  (auth, user) => ({
    authUser: auth.user,
    profile: user?.profile || null,
    loading: user?.loading || false,
    error: user?.error || null,
  })
);

export default function Profile() {
  const dispatch = useDispatch();
  const { authUser, profile, loading } = useSelector(selectUserData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errorMessage, setError] = useState(null);
  const [imagePreviewModal, setImagePreviewModal] = useState({
    isOpen: false,
    url: "",
  });

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    avatar: profile?.avatar || null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Update form data when profile data is available
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      }));
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
    }
  };

  // Show avatar preview in modal
  const showAvatarPreview = () => {
    const avatarUrl =
      avatarPreview ||
      (authUser?.avatar
        ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${authUser?.avatar}`
        : "/avatar.jpg");

    setImagePreviewModal({
      isOpen: true,
      url: avatarUrl,
    });
  };

  // Handle form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      const result = await dispatch(updateProfile(formDataToSend)).unwrap();
      if (result.data) {
        // Update auth state with new user data
        await dispatch(updateUserData(result.data));
        // Refresh token to ensure latest data
        await dispatch(refreshToken());
        setShowSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Gagal mengubah profil. Silakan coba lagi.");
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Kata sandi baru tidak cocok!");
      return;
    }

    try {
      await dispatch(
        changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      setShowSuccess(true);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message || "Gagal mengubah kata sandi. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-6 transition-colors duration-200 dark:text-gray-200">
      <h1 className="mb-6 text-2xl font-bold transition-colors duration-200 dark:text-white">
        Profil Saya
      </h1>
      {errorMessage && (
        <div className="mb-4 text-red-500 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold transition-colors duration-200 dark:text-white">
            Informasi Pribadi
          </h2>
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                <img
                  src={
                    avatarPreview ||
                    (authUser?.avatar
                      ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${
                          authUser?.avatar
                        }`
                      : "/avatar.jpg")
                  }
                  alt={authUser?.name || "Profile"}
                  className="object-fill w-24 h-24 rounded-full cursor-pointer"
                  onClick={showAvatarPreview}
                />
                <label className="absolute bottom-0 right-0 p-1 transition-colors duration-200 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium transition-colors duration-200 dark:text-white">
                  {profile?.name}
                </h3>
                <p className="text-sm text-gray-500 transition-colors duration-200 dark:text-gray-400">
                  {profile?.role}
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Nama
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                No. Telepon / WA
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800/50"
            >
              {loading ? "Mengupdate..." : "Update Profil"}
            </button>
          </form>
        </div>

        <div className="p-6 transition-colors duration-200 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold transition-colors duration-200 dark:text-white">
            Ubah Kata Sandi
          </h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Kata Sandi Saat Ini
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="w-full px-3 py-2 transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 transition-colors duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800/50"
            >
              {loading ? "Mengubah..." : "Ubah Kata Sandi"}
            </button>
          </form>
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {imagePreviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setImagePreviewModal({ isOpen: false, url: "" })}
          ></div>
          <div className="relative z-10 p-4 bg-white rounded-lg shadow-lg max-w-3xl max-h-[80vh] dark:bg-gray-800 dark:border dark:border-gray-700 transition-colors duration-200">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium transition-colors duration-200 dark:text-white">
                Preview Avatar
              </h3>
              <button
                onClick={() => setImagePreviewModal({ isOpen: false, url: "" })}
                className="text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                ✕
              </button>
            </div>
            <img
              src={imagePreviewModal.url}
              alt="Avatar Preview"
              className="object-contain w-full max-h-[70vh]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/avatar.jpg";
                console.error("Failed to load image:", imagePreviewModal.url);
              }}
            />
          </div>
        </div>
      )}

      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccess}
        title="Sukses!"
        message="Perubahan berhasil disimpan."
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
