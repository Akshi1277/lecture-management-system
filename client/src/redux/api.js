import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    xsrfCookieName: 'csrfToken',
    xsrfHeaderName: 'X-CSRF-Token',
});

// Helper for auth headers
export const getAuthHeader = (token) => {
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;
