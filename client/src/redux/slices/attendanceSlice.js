import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';


export const fetchDefaulters = createAsyncThunk(
    'attendance/fetchDefaulters',
    async (threshold, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/attendance/global-defaulters?threshold=${threshold}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAttendanceStats = createAsyncThunk(
    'attendance/fetchStats',
    async ({ subject, batchId }, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/attendance/stats/${encodeURIComponent(subject)}/${batchId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchSubjectWiseAttendance = createAsyncThunk(
    'attendance/fetchSubjectWise',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/attendance/subject-wise`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchFacultyLoad = createAsyncThunk(
    'attendance/fetchFacultyLoad',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/attendance/faculty-load`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchLowAttendanceStudents = createAsyncThunk(
    'attendance/fetchLowStats',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/attendance/low-stats`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const markAttendance = createAsyncThunk(
    'attendance/mark',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/attendance`, payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        defaulters: [],
        lowAttendanceStudents: [],
        subjectStats: [],
        facultyLoad: [],
        loading: false,
        statsLoading: false,
        error: null,
    },
    reducers: {
        resetAttendanceState: (state) => {
            state.defaulters = [];
            state.lowAttendanceStudents = [];
            state.subjectStats = [];
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDefaulters.pending, (state) => { state.loading = true; })
            .addCase(fetchDefaulters.fulfilled, (state, action) => {
                state.loading = false;
                state.defaulters = action.payload;
            })
            .addCase(fetchDefaulters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLowAttendanceStudents.fulfilled, (state, action) => {
                state.lowAttendanceStudents = action.payload;
            })
            .addCase(fetchAttendanceStats.pending, (state) => { state.loading = true; })
            .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
                state.loading = false;
                state.defaulters = action.payload;
            })
            .addCase(fetchSubjectWiseAttendance.pending, (state) => { state.statsLoading = true; })
            .addCase(fetchSubjectWiseAttendance.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.subjectStats = action.payload;
            })
            .addCase(fetchFacultyLoad.fulfilled, (state, action) => {
                state.facultyLoad = action.payload;
            });
    }
});

export const { resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
