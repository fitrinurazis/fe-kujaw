import { useState, useEffect } from "react";

const ErrorAlert = ({
  message,
  onDismiss,

  autoDismiss = true,
  dismissTimeout = 2000,
}) => {
  const [visible, setVisible] = useState(!!message);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  // Update visibility when message changes
  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  // Auto-dismiss functionality
  useEffect(() => {
    if (autoDismiss && message && visible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, dismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, message, visible, dismissTimeout]);

  if (!visible || !message) return null;

  return (
    <div
      className="relative px-4 py-3 my-4 text-red-700 bg-red-100 border border-red-400 rounded"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={handleDismiss}
        className="absolute top-0 right-0 px-4 py-3"
        type="button"
      >
        <span className="text-red-500">×</span>
      </button>
    </div>
  );
};

export default ErrorAlert;
