import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const getAuthOptions = (getState) => ({
    headers: { Authorization: `Bearer ${getState().auth.userInfo?.token}` }
});

export const fetchSyllabus = createAsyncThunk(
    'syllabus/fetchByCourse',
    async (courseId, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/courses/${courseId}/syllabus`, getAuthOptions(getState));
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
            await api.put(`/courses/${courseId}/syllabus/${unitId}`, { isCompleted }, getAuthOptions(getState));
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
            const { data } = await api.post(`/courses/${courseId}/syllabus`, unitData, getAuthOptions(getState));
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
