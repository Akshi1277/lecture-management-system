import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchBatches = createAsyncThunk(
    'hierarchy/fetchBatches',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/hierarchy/batches`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createBatch = createAsyncThunk(
    'hierarchy/createBatch',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/hierarchy/batches`, payload, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteBatch = createAsyncThunk(
    'hierarchy/deleteBatch',
    async (id, { getState, rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/hierarchy/batches/${id}`, getAuthHeader(getState));
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchSubjects = createAsyncThunk(
    'hierarchy/fetchSubjects',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/hierarchy/subjects`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCourses = createAsyncThunk(
    'hierarchy/fetchCourses',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/hierarchy/courses`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const hierarchySlice = createSlice({
    name: 'hierarchy',
    initialState: {
        batches: [],
        departments: [],
        subjects: [],
        courses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBatches.pending, (state) => { state.loading = true; })
            .addCase(fetchBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.batches = action.payload;
            })
            .addCase(fetchBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.courses = action.payload;
            })
            .addCase(createBatch.fulfilled, (state, action) => {
                state.batches.push(action.payload);
            })
            .addCase(deleteBatch.fulfilled, (state, action) => {
                state.batches = state.batches.filter(b => b._id !== action.payload);
            });
    }
});

export default hierarchySlice.reducer;
