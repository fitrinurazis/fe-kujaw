/**
 * Utility function to download blob data as a file
 * @param {Blob} blob - The blob data to download
 * @param {string} filename - The name of the file to be downloaded
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
