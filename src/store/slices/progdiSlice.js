import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a new class
export const createProgdi = createAsyncThunk(
  "progdi/createProgdi",
  async (progdiData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/progdis`, progdiData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create progdi" }
      );
    }
  }
);

// Get all classes
export const getProgdi = createAsyncThunk(
  "progdis/getProgdi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/progdis`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch progdi" }
      );
    }
  }
);

// Update a class
export const updateProgdi = createAsyncThunk(
  "progdis/updateProgdi",
  async ({ id, progdiData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/progdis/${id}`,
        progdiData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update progdi" }
      );
    }
  }
);

// Delete a class
export const deleteProgdi = createAsyncThunk(
  "progdis/deleteProgdi",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/progdis/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete progdi" }
      );
    }
  }
);

const progdiSlice = createSlice({
  name: "progdis",
  initialState: {
    progdis: [],
    loading: false,
    error: null,
    currentProgdi: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProgdi: (state, action) => {
      state.currentProgdi = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create progdi cases
      .addCase(createProgdi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgdi.fulfilled, (state, action) => {
        state.loading = false;
        state.progdis.push(action.payload);
      })
      .addCase(createProgdi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create progdi";
      })

      // Get progdi cases
      .addCase(getProgdi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProgdi.fulfilled, (state, action) => {
        state.loading = false;
        state.progdis = action.payload;
      })
      .addCase(getProgdi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch progdi";
      })

      // Update progdi cases
      .addCase(updateProgdi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgdi.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.progdis.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.progdis[index] = action.payload;
        }
      })
      .addCase(updateProgdi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update progdi";
      })

      // Delete progdi cases
      .addCase(deleteProgdi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgdi.fulfilled, (state, action) => {
        state.loading = false;
        state.progdis = state.progdis.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteProgdi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete progdi";
      });
  },
});

export const { clearError, setCurrentProgdi } = progdiSlice.actions;
export default progdiSlice.reducer;
