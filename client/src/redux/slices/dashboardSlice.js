import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchAdminDashboard = createAsyncThunk(
    'dashboard/fetchAdmin',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/dashboard/admin`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchMyLectures = createAsyncThunk(
    'dashboard/fetchMyLectures',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/lectures/my`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAnnouncements = createAsyncThunk(
    'dashboard/fetchAnnouncements',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/announcements`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchMyAttendanceStats = createAsyncThunk(
    'dashboard/fetchMyAttendanceStats',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/attendance/my-stats`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAuditLogs = createAsyncThunk(
    'dashboard/fetchAuditLogs',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/audit`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchFacultyLoad = createAsyncThunk(
    'dashboard/fetchFacultyLoad',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/attendance/faculty-load`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchSystemSettings = createAsyncThunk(
    'dashboard/fetchSettings',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/settings`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'dashboard/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/users`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateSystemSettings = createAsyncThunk(
    'dashboard/updateSettings',
    async (settings, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${API_URL}/settings`, settings, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const uploadProfilePhoto = createAsyncThunk(
    'dashboard/uploadPhoto',
    async (formData, { getState, rejectWithValue }) => {
        try {
            const config = getAuthHeader(getState);
            config.headers['Content-Type'] = 'multipart/form-data';
            const { data } = await axios.post(`${API_URL}/users/profile/photo`, formData, config);
            return data.url;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const sendAttendanceWarnings = createAsyncThunk(
    'dashboard/sendWarnings',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/attendance/send-warnings`, {}, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createAnnouncement = createAsyncThunk(
    'dashboard/createAnnouncement',
    async (formData, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/announcements`, formData, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteAnnouncement = createAsyncThunk(
    'dashboard/deleteAnnouncement',
    async (id, { getState, rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/announcements/${id}`, getAuthHeader(getState));
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        adminData: null,
        myLectures: [],
        announcements: [],
        auditLogs: [],
        facultyLoad: [],
        users: [],
        systemSettings: { attendanceThreshold: 75, labWeight: 4, systemName: "EduSync" },
        myStats: { totalLectures: 0, presentLectures: 0, absentLectures: 0, percentage: 0 },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboard.pending, (state) => { state.loading = true; })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.adminData = action.payload;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyLectures.pending, (state) => { state.loading = true; })
            .addCase(fetchMyLectures.fulfilled, (state, action) => {
                state.loading = false;
                state.myLectures = action.payload;
            })
            .addCase(fetchMyLectures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.announcements = action.payload;
            })
            .addCase(fetchMyAttendanceStats.fulfilled, (state, action) => {
                state.myStats = action.payload;
            })
            .addCase(fetchAuditLogs.pending, (state) => { state.loading = true; })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.auditLogs = action.payload;
            })
            .addCase(fetchAuditLogs.rejected, (state) => { state.loading = false; })
            .addCase(fetchFacultyLoad.fulfilled, (state, action) => {
                state.facultyLoad = action.payload;
            })
            .addCase(fetchSystemSettings.fulfilled, (state, action) => {
                state.systemSettings = action.payload;
            })
            .addCase(updateSystemSettings.fulfilled, (state, action) => {
                state.systemSettings = action.payload;
            })
            .addCase(createAnnouncement.fulfilled, (state, action) => {
                state.announcements.unshift(action.payload);
            })
            .addCase(deleteAnnouncement.fulfilled, (state, action) => {
                state.announcements = state.announcements.filter(a => a._id !== action.payload);
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            });
    }
});

export default dashboardSlice.reducer;
