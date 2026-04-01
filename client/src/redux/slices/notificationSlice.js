import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/announcements`);
            // Pass the userId from the state so the reducer can use it
            const { auth: { userInfo } } = getState();
            return { data, userId: userInfo?._id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
        error: null,
        lastFetched: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAllAsRead: (state) => {
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                const { data, userId } = action.payload;
                state.loading = false;
                state.items = data;
                
                // UNREAD LOGIC: Compare item timestamp with USER-SPECIFIC 'Last Seen' time
                if (typeof window !== 'undefined' && userId) {
                    const lastSeen = localStorage.getItem(`notifications_last_seen_${userId}`) || 0;
                    state.unreadCount = data.filter(n => new Date(n.createdAt).getTime() > Number(lastSeen)).length;
                }
                
                state.lastFetched = Date.now();
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addNotification, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
