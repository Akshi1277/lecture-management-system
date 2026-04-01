import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import Cookies from 'js-cookie';

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users/login', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        Cookies.set('auth_token', response.data.token, { expires: 30 }); // 30-day persistence
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        Cookies.set('auth_token', response.data.token, { expires: 30 });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo: currentInfo } } = getState();
        const response = await api.put('/users/profile', userData);
        
        // Preserve token if not returned in profile update
        const updatedInfo = { ...currentInfo, ...response.data };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        return updatedInfo;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    // Brute force clear everything locally FIRST
    localStorage.removeItem('userInfo');
    // Clear cookies with common configurations to ensure it works across environments
    Cookies.remove('auth_token', { path: '/' });
    Cookies.remove('auth_token', { path: '', domain: window.location.hostname });
    
    try {
        await api.post('/users/logout');
        return null;
    } catch (error) {
        // Even if server fails, local status remains logged out
        return null;
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { getState, rejectWithValue }) => {
    try {
        const response = await api.put('/users/change-password', passwordData);
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
    isAuthenticated: typeof window !== 'undefined' ? !!Cookies.get('auth_token') : false,
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
                state.isAuthenticated = true;
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
                state.isAuthenticated = true;
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
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.rejected, (state) => {
                state.userInfo = null;
                state.isAuthenticated = false;
                state.loading = false;
                Cookies.remove('auth_token');
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
