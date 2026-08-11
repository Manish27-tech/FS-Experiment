import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockLoginAPI } from '../../utils/mockBackend';

export const loginUser = createAsyncThunk('auth/login', async ({ username, password }) => {
  const response = await mockLoginAPI(username, password);
  return response;
});

const initialState = { user: null, token: null, isLoading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null; localStorage.removeItem('token');
    },
    restoreLogin: (state, action) => {
      state.user = action.payload.user; state.token = action.payload.token;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false; state.error = action.error.message;
      });
  },
});

export const { logout, restoreLogin } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;