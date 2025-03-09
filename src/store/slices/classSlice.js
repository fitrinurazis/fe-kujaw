import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a new class
export const createClass = createAsyncThunk(
  "classes/createClass",
  async (classData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/classes`, classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create class" }
      );
    }
  }
);

// Get all classes
export const getClasses = createAsyncThunk(
  "classes/getClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/classes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch classes" }
      );
    }
  }
);

// Update a class
export const updateClass = createAsyncThunk(
  "classes/updateClass",
  async ({ id, classData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/classes/${id}`,
        classData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update class" }
      );
    }
  }
);

// Delete a class
export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/classes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete class" }
      );
    }
  }
);

const classSlice = createSlice({
  name: "classes",
  initialState: {
    classes: [],
    loading: false,
    error: null,
    currentClass: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentClass: (state, action) => {
      state.currentClass = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create class cases
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create class";
      })

      // Get classes cases
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch classes";
      })

      // Update class cases
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update class";
      })

      // Delete class cases
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete class";
      });
  },
});

export const { clearError, setCurrentClass } = classSlice.actions;
export default classSlice.reducer;
