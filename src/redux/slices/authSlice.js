import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users/login', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
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
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
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
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
