import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Profile actions
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch profile" }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        profileData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update profile" }
      );
    }
  }
);

// Sales actions
export const getSales = createAsyncThunk(
  "user/getSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/sales`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch sales" }
      );
    }
  }
);

export const createSales = createAsyncThunk(
  "user/createSales",
  async (salesData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/sales`,
        salesData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create sales" }
      );
    }
  }
);

export const getSalesById = createAsyncThunk(
  "user/getSalesById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/sales/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales"
      );
    }
  }
);

export const updateSales = createAsyncThunk(
  "user/updateSales",
  async ({ id, salesData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/sales/${id}`,
        salesData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update sales" }
      );
    }
  }
);

export const deleteSales = createAsyncThunk(
  "user/deleteSales",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/users/sales/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete sales" }
      );
    }
  }
);

const initialState = {
  profile: null,
  salesList: [],
  selectedSales: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSales: (state) => {
      state.selectedSales = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile reducers
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data || action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update profile";
      })

      // Sales list reducers
      .addCase(getSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.loading = false;
        state.salesList = action.payload.data || action.payload;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch sales list";
      })

      // Get single sales reducers
      .addCase(getSalesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSales = action.payload.data || action.payload;
      })
      .addCase(getSalesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sales details";
      })

      // Create sales reducers
      .addCase(createSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSales.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.salesList)) {
          state.salesList.push(action.payload.data || action.payload);
        }
      })
      .addCase(createSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create sales";
      })

      // Update sales reducers
      .addCase(updateSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSales.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSales = action.payload.data || action.payload;

        // Update in salesList if it exists
        if (Array.isArray(state.salesList)) {
          const index = state.salesList.findIndex(
            (sales) => sales.id === updatedSales.id
          );
          if (index !== -1) {
            state.salesList[index] = updatedSales;
          }
        }

        // Update selectedSales if it matches
        if (state.selectedSales && state.selectedSales.id === updatedSales.id) {
          state.selectedSales = updatedSales;
        }
      })
      .addCase(updateSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update sales";
      })

      // Delete sales reducers
      .addCase(deleteSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSales.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.salesList)) {
          state.salesList = state.salesList.filter(
            (sales) => sales.id !== action.payload
          );
        }
        // Clear selected sales if it was deleted
        if (state.selectedSales && state.selectedSales.id === action.payload) {
          state.selectedSales = null;
        }
      })
      .addCase(deleteSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete sales";
      });
  },
});

export const { clearError, clearSelectedSales } = userSlice.actions;
export default userSlice.reducer;
