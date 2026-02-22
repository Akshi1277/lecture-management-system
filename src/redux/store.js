import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lectureReducer from './slices/lectureSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        lecture: lectureReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
