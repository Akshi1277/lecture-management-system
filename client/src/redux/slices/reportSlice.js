import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchAttendanceReport = createAsyncThunk(
    'reports/fetchAttendance',
    async (batchId, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/reports/attendance/${batchId}`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchFacultyWorkloadReport = createAsyncThunk(
    'reports/fetchWorkload',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/reports/faculty-workload`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        currentReportData: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearReportData: (state) => {
            state.currentReportData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttendanceReport.pending, (state) => { state.loading = true; })
            .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReportData = action.payload;
            })
            .addCase(fetchAttendanceReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchFacultyWorkloadReport.pending, (state) => { state.loading = true; })
            .addCase(fetchFacultyWorkloadReport.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReportData = action.payload;
            })
            .addCase(fetchFacultyWorkloadReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearReportData } = reportSlice.actions;
export default reportSlice.reducer;
