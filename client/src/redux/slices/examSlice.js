import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const getAuthOptions = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchExams = createAsyncThunk(
    'exams/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/exams`, getAuthOptions(getState));
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
            const { data } = await api.post(`/exams`, payload, getAuthOptions(getState));
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
