export const getImageUrl = (filename) => {
  if (!filename) return null;

  const API_URL = import.meta.env.VITE_API_URL;

  // Log untuk debugging
  const url = `${API_URL}/uploads/proofs/${filename}`;
  return url;
};
