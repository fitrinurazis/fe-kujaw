import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const TransactionForm = () => {
  const { sendTransactionNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [transactionData, setTransactionData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const saveTransaction = async (data) => {
    // Implementasi fungsi saveTransaction
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Proses pengiriman data ke backend
      const result = await saveTransaction(transactionData);

      // Kirim notifikasi ke sales jika pengguna adalah admin
      if (user && user.role === "admin") {
        await sendTransactionNotification(
          result, // Data transaksi
          isEditing ? "update" : "create" // Tindakan
        );
      }

      // Tampilkan pesan sukses
      setMessage("Transaksi berhasil disimpan");

      // Redirect atau lakukan tindakan lain
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError("Gagal menyimpan transaksi. Silakan coba lagi.");
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form content */}</form>;
};
