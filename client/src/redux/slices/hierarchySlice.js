import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const getAuthOptions = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchBatches = createAsyncThunk(
    'hierarchy/fetchBatches',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/hierarchy/batches`, getAuthOptions(getState));
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
            const { data } = await api.post(`/hierarchy/batches`, payload, getAuthOptions(getState));
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
            await api.delete(`/hierarchy/batches/${id}`, getAuthOptions(getState));
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
            const { data } = await api.get(`/hierarchy/subjects`, getAuthOptions(getState));
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
            const { data } = await api.get(`/hierarchy/courses`, getAuthOptions(getState));
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
