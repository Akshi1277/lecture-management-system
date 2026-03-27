import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isSidebarOpen: true,
        activeModal: null,
        activeModalData: null,
        toasts: [],
    },
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setActiveModal: (state, action) => {
            if (typeof action.payload === 'object' && action.payload !== null) {
                state.activeModal = action.payload.type;
                state.activeModalData = action.payload.data;
            } else {
                state.activeModal = action.payload;
                state.activeModalData = null;
            }
        },
        addToast: (state, action) => {
            state.toasts.push({
                id: Date.now(),
                type: action.payload.type || 'info', // 'success', 'error', 'info'
                message: action.payload.message,
            });
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(t => t.id !== action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        },
    },
});

export const { toggleSidebar, setActiveModal, addToast, removeToast, clearToasts } = uiSlice.actions;
export default uiSlice.reducer;
