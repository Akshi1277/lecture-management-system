import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
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

export const updateLecture = createAsyncThunk('lectures/update', async ({ id, lectureData }, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const response = await api.put(`/lectures/${id}`, lectureData, getAuthHeader(userInfo));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteLecture = createAsyncThunk('lectures/delete', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        await api.delete(`/lectures/${id}`, getAuthHeader(userInfo));
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const fetchSubstitutes = createAsyncThunk(
    'lectures/fetchSubstitutes',
    async (lectureId, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const { data } = await api.get(`/lectures/substitutes/${lectureId}`, getAuthHeader(userInfo));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const substituteTeacher = createAsyncThunk(
    'lectures/substitute',
    async ({ lectureId, teacherId }, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const { data } = await api.put(`/lectures/${lectureId}`, { teacher: teacherId }, getAuthHeader(userInfo));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const uploadResource = createAsyncThunk(
    'lectures/uploadResource',
    async ({ lectureId, payload, isFile }, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const config = getAuthHeader(userInfo);
            if (isFile) {
                config.headers['Content-Type'] = 'multipart/form-data';
            }
            const { data } = await api.post(`/lectures/${lectureId}/resources`, payload, config);
            return { lectureId, resource: data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const blockRoom = createAsyncThunk(
    'lectures/blockRoom',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const { data } = await api.post(`/rooms/block`, payload, getAuthHeader(userInfo));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchPendingSubstitutions = createAsyncThunk(
    'lectures/fetchPendingSubstitutions',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const { data } = await api.get(`/lectures/substitutions/pending`, getAuthHeader(userInfo));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const requestSubstitution = createAsyncThunk(
    'lectures/requestSubstitution',
    async ({ lectureId, reason }, { getState, rejectWithValue }) => {
        try {
            const { auth: { userInfo } } = getState();
            const { data } = await api.post(`/lectures/${lectureId}/request-substitution`, { reason }, getAuthHeader(userInfo));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const lectureSlice = createSlice({
    name: 'lecture',
    initialState: {
        list: [],
        substitutes: [],
        pendingSubstitutions: [],
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
            })
            .addCase(fetchSubstitutes.pending, (state) => { state.loading = true; })
            .addCase(fetchSubstitutes.fulfilled, (state, action) => {
                state.loading = false;
                state.substitutes = action.payload;
            })
            .addCase(fetchSubstitutes.rejected, (state) => { state.loading = false; })
            .addCase(substituteTeacher.fulfilled, (state, action) => {
                const index = state.list.findIndex(l => l._id === action.payload._id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(updateLecture.fulfilled, (state, action) => {
                const index = state.list.findIndex(l => l._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(uploadResource.fulfilled, (state, action) => {
                const index = state.list.findIndex(l => l._id === action.payload.lectureId);
                if (index !== -1) {
                    if (!state.list[index].resources) state.list[index].resources = [];
                    state.list[index].resources.push(action.payload.resource);
                }
            })
            .addCase(blockRoom.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchPendingSubstitutions.pending, (state) => { state.loading = true; })
            .addCase(fetchPendingSubstitutions.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingSubstitutions = action.payload;
            })
            .addCase(fetchPendingSubstitutions.rejected, (state) => { state.loading = false; })
            .addCase(requestSubstitution.fulfilled, (state, action) => {
                const index = state.list.findIndex(l => l._id === action.payload._id);
                if (index !== -1) state.list[index] = action.payload;
                
                const pIndex = state.pendingSubstitutions.findIndex(l => l._id === action.payload._id);
                if (pIndex !== -1) state.pendingSubstitutions[pIndex] = action.payload;
            })
            .addCase(deleteLecture.fulfilled, (state, action) => {
                state.list = state.list.filter(l => l._id !== action.payload);
                state.pendingSubstitutions = state.pendingSubstitutions.filter(l => l._id !== action.payload);
            });
    },
});

export default lectureSlice.reducer;
