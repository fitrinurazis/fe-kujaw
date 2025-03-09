import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getSummary = createAsyncThunk(
  "dashboard/summary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/summary`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch summary" }
      );
    }
  }
);

export const getRecentTransactions = createAsyncThunk(
  "dashboard/recent-transactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/recent-transactions`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch recent transactions",
        }
      );
    }
  }
);

export const getTopProducts = createAsyncThunk(
  "dashboard/top-products",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/top-products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch top products" }
      );
    }
  }
);

export const getTopCustomers = createAsyncThunk(
  "dashboard/top-customers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/top-customers`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch top customers" }
      );
    }
  }
);

export const getSalesChart = createAsyncThunk(
  "dashboard/sales-chart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/sales-chart`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch sales chart",
        }
      );
    }
  }
);

export const getIncomeExpeseChart = createAsyncThunk(
  "dashboard/income-expense-chart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/dashboard/income-expense-chart`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch income expense chart",
        }
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: null,
    recentTransactions: [],
    topProducts: [],
    topCustomers: [], // Added topCustomers array
    salesChart: [],
    incomeExpenseChart: [],
    loading: false,
    error: null,
    currentDashboard: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDashboard: (state, action) => {
      state.currentDashboard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch summary";
      })

      .addCase(getRecentTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.recentTransactions = action.payload;
      })
      .addCase(getRecentTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch recent transactions";
      })

      .addCase(getTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch top products";
      })

      .addCase(getTopCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.topCustomers = action.payload;
      })
      .addCase(getTopCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch top customers";
      })

      .addCase(getSalesChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesChart.fulfilled, (state, action) => {
        state.loading = false;
        state.salesChart = action.payload;
      })
      .addCase(getSalesChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch sales chart";
      })

      .addCase(getIncomeExpeseChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeExpeseChart.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeExpenseChart = action.payload;
      })
      .addCase(getIncomeExpeseChart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch income expense chart";
      });
  },
});

export const { clearError, setCurrentDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
