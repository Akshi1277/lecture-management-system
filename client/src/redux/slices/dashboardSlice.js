import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const getAuthOptions = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchAdminDashboard = createAsyncThunk(
    'dashboard/fetchAdmin',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/dashboard/admin`, getAuthOptions(getState));
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
            const { data } = await api.get(`/lectures/my`, getAuthOptions(getState));
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
            const { data } = await api.get(`/announcements`, getAuthOptions(getState));
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
            const { data } = await api.get(`/attendance/my-stats`, getAuthOptions(getState));
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
            const { data } = await api.get(`/audit`, getAuthOptions(getState));
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
            const { data } = await api.get(`/attendance/faculty-load`, getAuthOptions(getState));
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
            const { data } = await api.get(`/settings`, getAuthOptions(getState));
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
            const { data } = await api.get(`/users`, getAuthOptions(getState));
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
            const { data } = await api.put(`/settings`, settings, getAuthOptions(getState));
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
            const config = getAuthOptions(getState);
            config.headers['Content-Type'] = 'multipart/form-data';
            const { data } = await api.post(`/users/profile/photo`, formData, config);
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
            const { data } = await api.post(`/attendance/send-warnings`, {}, getAuthOptions(getState));
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
            const { data } = await api.post(`/announcements`, formData, getAuthOptions(getState));
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
            await api.delete(`/announcements/${id}`, getAuthOptions(getState));
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
