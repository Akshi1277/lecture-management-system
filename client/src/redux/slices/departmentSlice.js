import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchDepartments = createAsyncThunk('departments/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/departments');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const createDepartment = createAsyncThunk('departments/create', async (deptData, { rejectWithValue }) => {
    try {
        const response = await api.post('/departments', deptData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const deleteDepartment = createAsyncThunk('departments/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/departments/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const departmentSlice = createSlice({
    name: 'departments',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => { state.loading = true; })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.list.sort((a, b) => a.name.localeCompare(b.name));
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.list = state.list.filter(d => d._id !== action.payload);
            });
    }
});

export default departmentSlice.reducer;
