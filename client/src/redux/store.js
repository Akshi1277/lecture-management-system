import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import authReducer from './slices/authSlice';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrfToken';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';
import lectureReducer from './slices/lectureSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import attendanceReducer from './slices/attendanceSlice';
import hierarchyReducer from './slices/hierarchySlice';
import userReducer from './slices/userSlice';
import reportReducer from './slices/reportSlice';
import dashboardReducer from './slices/dashboardSlice';
import examReducer from './slices/examSlice';
import syllabusReducer from './slices/syllabusSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        lecture: lectureReducer,
        ui: uiReducer,
        notifications: notificationReducer,
        attendance: attendanceReducer,
        hierarchy: hierarchyReducer,
        users: userReducer,
        reports: reportReducer,
        dashboard: dashboardReducer,
        exams: examReducer,
        syllabus: syllabusReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
