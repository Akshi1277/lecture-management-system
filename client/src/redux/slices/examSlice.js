import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchExams = createAsyncThunk(
    'exams/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/exams`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const scheduleExam = createAsyncThunk(
    'exams/schedule',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/exams`, payload, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const examSlice = createSlice({
    name: 'exams',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.pending, (state) => { state.loading = true; })
            .addCase(fetchExams.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(scheduleExam.fulfilled, (state, action) => {
                state.list.push(action.payload);
            });
    }
});

export default examSlice.reducer;
