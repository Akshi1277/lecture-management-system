import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const getAuthOptions = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users`, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const enrollUser = createAsyncThunk(
    'users/enroll',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/users`, payload, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const bulkEnroll = createAsyncThunk(
    'users/bulkEnroll',
    async (formData, { getState, rejectWithValue }) => {
        try {
            const config = getAuthOptions(getState);
            const { data } = await api.post(`/users/bulk`, formData, {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchExistingSubjects = createAsyncThunk(
    'users/fetchSubjects',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users/subjects`, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateLocalUserProfile = createAsyncThunk(
    'users/updateLocal',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.put(`/users/profile`, payload, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTeachers = createAsyncThunk(
    'users/fetchTeachers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users/teachers`, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchStudents = createAsyncThunk(
    'users/fetchStudents',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users/students`, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchStudentsByBatch = createAsyncThunk(
    'users/fetchByBatch',
    async (batchId, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/users/batch/${batchId}`, getAuthOptions(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        teachers: [],
        students: [],
        subjects: [],
        loading: false,
        enrollLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTeachers.pending, (state) => { state.loading = true; })
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload;
            })
            .addCase(fetchStudents.pending, (state) => { state.loading = true; })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudentsByBatch.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(enrollUser.pending, (state) => { state.enrollLoading = true; })
            .addCase(enrollUser.fulfilled, (state, action) => {
                state.enrollLoading = false;
                state.list.push(action.payload);
            })
            .addCase(enrollUser.rejected, (state) => { state.enrollLoading = false; })
            .addCase(bulkEnroll.pending, (state) => { state.enrollLoading = true; })
            .addCase(bulkEnroll.fulfilled, (state) => { state.enrollLoading = false; })
            .addCase(bulkEnroll.rejected, (state) => { state.enrollLoading = false; })
            .addCase(fetchExistingSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
            });
    }
});

export default userSlice.reducer;
