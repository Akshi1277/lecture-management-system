import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
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
            });
    },
});

export default lectureSlice.reducer;
