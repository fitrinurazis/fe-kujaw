import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const USER_KEY = import.meta.env.VITE_USER_KEY;

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("phone", formData.phone);
      if (formData.avatar) {
        form.append("avatar", formData.avatar);
      }

      const response = await axios.post(`${API_URL}/api/auth/register`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        identifier,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response data");
      }

      // Set axios default header for subsequent requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Cookies.set(TOKEN_KEY, token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set(USER_KEY, JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log("Logout error:", error);
    }
  }

  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
});

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Password change failed" }
      );
    }
  }
);

// Add refreshToken thunk
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get(TOKEN_KEY);
      const response = await axios.post(
        `${API_URL}/api/auth/refresh-token`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { token: newToken, user } = response.data;

      // Update cookies with new token
      Cookies.set(TOKEN_KEY, newToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set(USER_KEY, JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      // Update axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { token: newToken, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Token refresh failed" }
      );
    }
  }
);

// Update user data in auth slice
export const updateUserData = createAsyncThunk(
  "auth/updateUserData",
  async (userData, { rejectWithValue }) => {
    try {
      Cookies.set(USER_KEY, JSON.stringify(userData), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return userData;
    } catch (error) {
      return rejectWithValue({ message: "Failed to update user data" });
    }
  }
);

axios.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(Cookies.get(USER_KEY) || "null"),
    token: Cookies.get(TOKEN_KEY),
    isAuthenticated: !!Cookies.get(TOKEN_KEY),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null; // Reset error state
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password change failed";
      })
      // Add refresh token reducers
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Add update user data reducers
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
