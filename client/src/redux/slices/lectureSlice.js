import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Helper to get token for headers
const getAuthHeader = (userInfo) => ({
    headers: { Authorization: `Bearer ${userInfo?.token}` }
});

export const fetchLectures = createAsyncThunk('lectures/fetchAll', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const endpoint = userInfo?.role === 'admin' ? '/lectures' : '/lectures/my';
        const response = await api.get(endpoint, getAuthHeader(userInfo));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const createLecture = createAsyncThunk('lectures/create', async (lectureData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const response = await api.post('/lectures', lectureData, getAuthHeader(userInfo));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const updateLecture = createAsyncThunk('lectures/update', async ({ id, lectureData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const response = await api.put(`/lectures/${id}`, lectureData, getAuthHeader(userInfo));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteLecture = createAsyncThunk('lectures/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        await api.delete(`/lectures/${id}`, getAuthHeader(userInfo));
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const lectureSlice = createSlice({
    name: 'lectures',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLectures.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLectures.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchLectures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createLecture.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateLecture.fulfilled, (state, action) => {
                const index = state.list.findIndex(l => l._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteLecture.fulfilled, (state, action) => {
                state.list = state.list.filter(l => l._id !== action.payload);
            });
    },
});

export default lectureSlice.reducer;
