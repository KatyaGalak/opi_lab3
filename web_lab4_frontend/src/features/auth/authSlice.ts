import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  AuthCredentials,
} from "./authAPI";
import { RootState } from "../../app/store";

interface AuthState {
  username: string | null;
  token: string | null;
  isLogin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  token: null,
  isLogin: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    const response = await apiLogin(credentials);
    if (response.token) {
      return { username: credentials.username, token: response.token };
    }

    return rejectWithValue(response.message|| "[Error] Login error");
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    const response = await apiRegister(credentials);
    if (response.token) {
      return { username: credentials.username, token: response.token };
    }

    return rejectWithValue(response.message || "Register error");
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (token: string, { rejectWithValue }) => {
    const response = await apiLogout(token);

    if (response.success) {
      return true;
    }

    return rejectWithValue(response.result || "[Error] Logout error");
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ username: string; token: string }>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.token = action.payload.token;
          state.isLogin = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ username: string; token: string }>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.token = action.payload.token;
          state.isLogin = true;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuth } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;