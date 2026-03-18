import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchSyllabus = createAsyncThunk(
    'syllabus/fetchByCourse',
    async (courseId, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/courses/${courseId}/syllabus`, getAuthHeader(getState));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toggleUnitStatus = createAsyncThunk(
    'syllabus/toggleUnit',
    async ({ courseId, unitId, isCompleted }, { getState, rejectWithValue }) => {
        try {
            await axios.put(`${API_URL}/courses/${courseId}/syllabus/${unitId}`, { isCompleted }, getAuthHeader(getState));
            return { unitId, isCompleted };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addSyllabusUnit = createAsyncThunk(
    'syllabus/addUnit',
    async ({ courseId, unitData }, { getState, rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/courses/${courseId}/syllabus`, unitData, getAuthHeader(getState));
            return data.syllabus; // assuming API returns the updated syllabus array
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const syllabusSlice = createSlice({
    name: 'syllabus',
    initialState: {
        units: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSyllabus.pending, (state) => { state.loading = true; })
            .addCase(fetchSyllabus.fulfilled, (state, action) => {
                state.loading = false;
                state.units = action.payload;
            })
            .addCase(fetchSyllabus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleUnitStatus.fulfilled, (state, action) => {
                const index = state.units.findIndex(u => u._id === action.payload.unitId);
                if (index !== -1) state.units[index].isCompleted = action.payload.isCompleted;
            })
            .addCase(addSyllabusUnit.fulfilled, (state, action) => {
                state.units = action.payload;
            });
    }
});

export default syllabusSlice.reducer;
