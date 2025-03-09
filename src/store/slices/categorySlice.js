import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a new class
export const createCategories = createAsyncThunk(
  "categories/createCategories",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/categories`,
        categoryData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create category" }
      );
    }
  }
);

// Get all classes
export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch categories" }
      );
    }
  }
);

// Update a class
export const updateCategories = createAsyncThunk(
  "categories/updateCategories",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update category" }
      );
    }
  }
);

// Delete a class
export const deleteCategories = createAsyncThunk(
  "categories/deleteCategories",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete category" }
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    currentCategory: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create category cases
      .addCase(createCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create category";
      })

      // Get categories cases
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch category";
      })

      // Update category cases
      .addCase(updateCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategories.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update category";
      })

      // Delete category cases
      .addCase(deleteCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
      })
      .addCase(deleteCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete category";
      });
  },
});

export const { clearError, setCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
