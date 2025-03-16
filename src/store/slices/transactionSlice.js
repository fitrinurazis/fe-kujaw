import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch transactions" }
      );
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch transaction" }
      );
    }
  }
);

export const createIncomeTransaction = createAsyncThunk(
  "transactions/createIncome",
  async ({ data, isFormData }, { rejectWithValue }) => {
    try {
      let config = {};

      // Set appropriate headers for FormData
      if (isFormData) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      }

      const response = await axios.post(
        `${API_URL}/api/transactions/income`,
        data,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Gagal membuat transaksi pemasukan",
        }
      );
    }
  }
);

export const createExpenseTransaction = createAsyncThunk(
  "transactions/createExpense",
  async ({ data, isFormData = false }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/transactions/expense`,
        data,
        {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data ||
          "Failed to create expense transaction"
      );
    }
  }
);

export const updateExpenseTransaction = createAsyncThunk(
  "transactions/updateExpense",
  async ({ id, data, isFormData = false }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/transactions/expense/${id}`,
        data,
        {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data ||
          "Failed to update expense transaction"
      );
    }
  }
);

export const updateIncomeTransaction = createAsyncThunk(
  "transactions/updateIncome",
  async ({ id, data, isFormData = false }, { rejectWithValue }) => {
    try {
      let config = {};

      // Set appropriate headers for FormData
      if (isFormData) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      }

      const response = await axios.put(
        `${API_URL}/api/transactions/income/${id}`,
        data,
        config
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update income transaction",
        }
      );
    }
  }
);

export const updateTransactionStatus = createAsyncThunk(
  "transactions/updateStatus",
  async ({ detailId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/transactions/detail/${detailId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update transaction status"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async ({ id, type }, { rejectWithValue }) => {
    try {
      // Gunakan endpoint yang sesuai berdasarkan tipe transaksi
      let endpoint;
      if (type === "pemasukan") {
        endpoint = `${API_URL}/api/transactions/income/${id}`;
      } else if (type === "pengeluaran") {
        endpoint = `${API_URL}/api/transactions/expense/${id}`;
      } else {
        throw new Error("Tipe transaksi tidak valid");
      }

      await axios.delete(endpoint);
      return { id, type };
    } catch (error) {
      // Tangani error dengan lebih detail
      if (error.response) {
        // Server merespons dengan status error
        return rejectWithValue(
          error.response.data || {
            message: `Failed to delete transaction: ${error.response.status} ${error.response.statusText}`,
          }
        );
      } else if (error.request) {
        // Request dibuat tapi tidak ada respons
        return rejectWithValue({
          message: "No response from server. Please check your connection.",
        });
      } else {
        // Error lainnya
        return rejectWithValue({
          message: error.message || "Failed to delete transaction",
        });
      }
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    currentTransaction: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch transactions";
      })

      // Fetch single transaction
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentTransaction = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transaction details";
      })
      // Create transactions
      .addCase(createIncomeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIncomeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createIncomeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create income transaction";
      })

      .addCase(createExpenseTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpenseTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createExpenseTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to create expense transaction";
      })

      // Update transactions
      .addCase(updateIncomeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncomeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateIncomeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update income transaction";
      })

      .addCase(updateExpenseTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpenseTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateExpenseTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to update expense transaction";
      })

      // Update detail status
      .addCase(updateTransactionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update state jika diperlukan
        if (
          state.currentTransaction &&
          state.currentTransaction.id === action.payload.id
        ) {
          state.currentTransaction = action.payload;
        }
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTransactionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update transaction status";
      })

      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete transaction";
      });
  },
});

export const { clearError, clearCurrentTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
