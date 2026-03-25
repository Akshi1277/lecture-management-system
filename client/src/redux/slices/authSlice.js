import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    xsrfCookieName: 'csrfToken',
    xsrfHeaderName: 'X-CSRF-Token',
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users/login', userData);
        const { token, ...userInfo } = response.data; // Strip token for storage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', userData);
        const { token, ...userInfo } = response.data;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const response = await api.put('/users/profile', userData, config);
        const { token, ...dataToStore } = response.data;
        localStorage.setItem('userInfo', JSON.stringify(dataToStore));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.post('/users/logout');
        localStorage.removeItem('userInfo');
        return null;
    } catch (error) {
        localStorage.removeItem('userInfo'); // Still clear locally even if server fails
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const response = await api.put('/users/change-password', passwordData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const requestOTP = createAsyncThunk('auth/requestOTP', async (email, { rejectWithValue }) => {
    try {
        const response = await api.post('/users/forgot-password', { email });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
        const response = await api.post('/users/reset-password', { email, otp, newPassword });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const initialState = {
    userInfo: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.userInfo = null;
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.rejected, (state) => {
                state.userInfo = null;
                state.loading = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
