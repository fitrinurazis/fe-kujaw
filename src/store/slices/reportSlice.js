import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Add a new thunk for getting report data before exporting
export const getReportData = createAsyncThunk(
  "reports/getData",
  async ({ reportType, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/data?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to fetch report data";
      return rejectWithValue({ message: errorMessage });
    }
  }
);
export const getMonthlyReport = createAsyncThunk(
  "reports/monthly",
  async ({ month, year, format = "json" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/monthly?month=${month}&year=${year}&format=${format}`,
        { responseType: format === "json" ? "json" : "blob" }
      );

      if (format === "json") {
        return response.data;
      } else {
        // For non-JSON formats (pdf, excel), return blob and filename
        const filename = `monthly-report-${month}-${year}.${format}`;
        return { data: response.data, filename };
      }
    } catch (error) {
      // Enhanced error handling
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.details ||
        "Failed to fetch monthly report";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Apply the same improved error handling to all other thunks
export const getDailyReport = createAsyncThunk(
  "reports/daily",
  async ({ date, format = "json" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/daily?date=${date}&format=${format}`,
        { responseType: format === "json" ? "json" : "blob" }
      );

      if (format === "json") {
        return response.data;
      } else {
        const filename = `daily-report-${date}.${format}`;
        return { data: response.data, filename };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.details ||
        "Failed to fetch daily report";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Updated version for each thunk with improved error handling
export const getSalesPerformance = createAsyncThunk(
  "reports/sales-performance",
  async ({ startDate, endDate, format = "json" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/sales-performance?startDate=${startDate}&endDate=${endDate}&format=${format}`,
        { responseType: format === "json" ? "json" : "blob" }
      );

      if (format === "json") {
        return response.data;
      } else {
        const filename = `sales-performance-${startDate}-to-${endDate}.${format}`;
        return { data: response.data, filename };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.details ||
        "Failed to fetch sales performance report";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getProductSales = createAsyncThunk(
  "reports/product-sales",
  async ({ startDate, endDate, format = "json" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/product-sales?startDate=${startDate}&endDate=${endDate}&format=${format}`,
        { responseType: format === "json" ? "json" : "blob" }
      );

      if (format === "json") {
        return response.data;
      } else {
        const filename = `product-sales-${startDate}-to-${endDate}.${format}`;
        return { data: response.data, filename };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.details ||
        "Failed to fetch product sales report";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getCustomerTransactions = createAsyncThunk(
  "reports/customer-transactions",
  async ({ startDate, endDate, format = "json" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/customer-transactions?startDate=${startDate}&endDate=${endDate}&format=${format}`,
        { responseType: format === "json" ? "json" : "blob" }
      );

      if (format === "json") {
        return response.data;
      } else {
        const filename = `customer-transactions-${startDate}-to-${endDate}.${format}`;
        return { data: response.data, filename };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.details ||
        "Failed to fetch customer transactions report";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getIncomeExpense = createAsyncThunk(
  "reports/income-expense",
  async ({ startDate, endDate, format = "json" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reports/income-expense?startDate=${startDate}&endDate=${endDate}&format=${format}`,
        { responseType: format === "json" ? "json" : "blob" }
      );

      if (format === "json") {
        return response.data;
      } else {
        const filename = `income-expense-${startDate}-to-${endDate}.${format}`;
        return { data: response.data, filename };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.details ||
        "Failed to fetch income expense report";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const exportExcel = createAsyncThunk(
  "reports/exportExcel",
  async ({ reportType, startDate, endDate }, { rejectWithValue }) => {
    try {
      // Langsung akses endpoint export Excel di backend
      const response = await axios.get(`${API_URL}/api/reports/export/excel`, {
        params: {
          reportType,
          startDate,
          endDate,
        },
        responseType: "blob", // Penting! Set responseType ke 'blob'
      });

      // Nama file yang deskriptif
      const reportNames = {
        sales: "penjualan",
        transactions: "transaksi",
        customers: "pelanggan",
        products: "produk",
        "income-expense": "keuangan",
      };

      return {
        data: response.data,
        filename: `laporan_${
          reportNames[reportType] || reportType
        }_${startDate}_${endDate}.xlsx`,
      };
    } catch (error) {
      console.error("Excel export error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengekspor laporan ke Excel"
      );
    }
  }
);
export const exportPdf = createAsyncThunk(
  "reports/exportPdf",
  async ({ reportType, startDate, endDate }, { rejectWithValue }) => {
    try {
      // Langsung akses endpoint export PDF di backend
      const response = await axios.get(`${API_URL}/api/reports/export/pdf`, {
        params: {
          reportType,
          startDate,
          endDate,
        },
        responseType: "blob", // Penting! Set responseType ke 'blob'
      });

      // Nama file yang deskriptif
      const reportNames = {
        sales: "penjualan",
        transactions: "transaksi",
        customers: "pelanggan",
        products: "produk",
        "income-expense": "keuangan",
      };

      return {
        data: response.data, // Langsung gunakan blob dari response
        filename: `laporan_${
          reportNames[reportType] || reportType
        }_${startDate}_${endDate}.pdf`,
      };
    } catch (error) {
      console.error("PDF export error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengekspor laporan ke PDF"
      );
    }
  }
);
const reportSlice = createSlice({
  name: "reports",
  initialState: {
    monthlyReport: null,
    dailyReport: null,
    salesPerformance: null,
    productSales: null,
    customerTransactions: null,
    incomeExpense: null,
    exportData: null,
    reportData: null,
    loading: false,
    error: null,
    currentReportType: null,
    period: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReportData: (state) => {
      state.monthlyReport = null;
      state.dailyReport = null;
      state.salesPerformance = null;
      state.productSales = null;
      state.customerTransactions = null;
      state.incomeExpense = null;
      state.exportData = null;
      state.reportData = null;
      state.error = null; // Also clear any errors
    },
    setCurrentReportType: (state, action) => {
      state.currentReportType = action.payload;
    },
    setReportPeriod: (state, action) => {
      state.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Report data
      .addCase(getReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
        // Update period from the response if available
        if (action.payload.period) {
          state.period = action.payload.period;
        }
      })
      .addCase(getReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch report data";
      })

      // Adding more robust error handling in the rejected cases
      .addCase(getMonthlyReport.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message || "Failed to fetch monthly report";
      })

      .addCase(getDailyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch daily report";
      })

      .addCase(getSalesPerformance.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message || "Failed to fetch sales performance report";
      })

      .addCase(getProductSales.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message || "Failed to fetch product sales report";
      })

      .addCase(getCustomerTransactions.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          "Failed to fetch customer transactions report";
      })

      .addCase(getIncomeExpense.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message || "Failed to fetch income expense report";
      })

      // Update the export functions to properly handle responses
      .addCase(exportExcel.fulfilled, (state, action) => {
        state.loading = false;
        state.exportData = action.payload;
      })
      .addCase(exportPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.exportData = action.payload;
      });
  },
});

export const {
  clearError,
  clearReportData,
  setCurrentReportType,
  setReportPeriod,
} = reportSlice.actions;
export default reportSlice.reducer;
