import axios from 'axios';

// Get base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for handling 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication Service
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    register: async (email, password) => {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Or just reload to trigger AuthContext update
    },
    getToken: () => localStorage.getItem('token'),
};

// Sessions Service
export const sessionService = {
    createSession: async (sessionData) => {
        const response = await api.post('/sessions', sessionData);
        return response.data;
    },
    getSessionsByUser: async () => {
        // No ID needed, backend uses token
        const response = await api.get(`/sessions/user`);
        return response.data;
    },
    getSessionsByPage: async (page = 1, limit = 10) => {
        const response = await api.get(`/sessions?page=${page}&limit=${limit}`);
        return response.data;
    },
    deleteSession: async (sessionId) => {
        const response = await api.delete(`/sessions/${sessionId}`);
        return response.data;
    },
    getSessionsByProject: async (projectId) => {
        const response = await api.get(`/sessions/project/${projectId}`);
        return response.data;
    },
};

// User Service
export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/users/me', data);
        return response.data;
    },
    searchUsers: async (query) => {
        const response = await api.get(`/users/search?q=${query}`);
        return response.data;
    },
    getComparison: async (targetUserId) => {
        const response = await api.get(`/compare/${targetUserId}`);
        return response.data;
    }
};

// ML Results Service
export const mlService = {
    saveResult: async (resultData) => {
        const response = await api.post('/mlresults', resultData);
        return response.data;
    },
    getResultsByUser: async (userId) => {
        const response = await api.get(`/mlresults/user/${userId}`);
        return response.data;
    },
};

// Session Prediction Service
export const predictSession = async (sessionData) => {
    try {
        const response = await api.post('/predict', sessionData);
        return response.data;
    } catch (error) {
        console.error("Prediction API Error:", error);
        throw error;
    }
};

// Deprecated: Kept for backward compatibility if needed, but redirects to new service
export const predictCognitiveStyle = async (data) => {
    return predictSession(data);
};

export default api;
