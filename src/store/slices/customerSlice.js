import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/customers`,
        customerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create customer" }
      );
    }
  }
);

export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/customers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch customer" }
      );
    }
  }
);

export const getCustomerById = createAsyncThunk(
  "customer/getCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/customers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch customer" }
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/customers/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update customer" }
      );
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/customers/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete customer" }
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    loading: false,
    error: null,
    currentCustomer: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create progdi cases
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create customer";
      })

      // Get progdi cases
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch customers";
      })

      // Get progdi cases
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedCustomer = null;
      })
      // Update progdi cases
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update customer";
      })

      // Delete progdi cases
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete customer";
      });
  },
});

export const { clearError, setCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;
