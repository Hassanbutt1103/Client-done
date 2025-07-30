// API Configuration
// Automatically detect environment and use appropriate backend URL
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // If running in development (localhost), use local backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // For production (deployed on Vercel), use your backend URL
  // Replace this with your actual backend URL (Render, Railway, etc.)
  return 'https://client-done-backend.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Base URL
  BASE: API_BASE_URL,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/users/login`,
    REGISTER: `${API_BASE_URL}/api/v1/users/register`,
    REQUEST_REGISTRATION: `${API_BASE_URL}/api/v1/pending-users/request`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgot-password`,
    LOGOUT: `${API_BASE_URL}/api/v1/users/logout`,
  },
  
  // User management endpoints
  USERS: {
    LIST: `${API_BASE_URL}/api/v1/users`,
    CREATE: `${API_BASE_URL}/api/v1/users/create`,
    GET: (id) => `${API_BASE_URL}/api/v1/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/v1/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/v1/users/${id}`,
  },

  // Pending user management endpoints (Admin only)
  PENDING_USERS: {
    LIST: `${API_BASE_URL}/api/v1/pending-users`,
    ALL: `${API_BASE_URL}/api/v1/pending-users/all`,
    APPROVE: (id) => `${API_BASE_URL}/api/v1/pending-users/${id}/approve`,
    REJECT: (id) => `${API_BASE_URL}/api/v1/pending-users/${id}/reject`,
    DELETE: (id) => `${API_BASE_URL}/api/v1/pending-users/${id}`,
    CLEANUP: `${API_BASE_URL}/api/v1/pending-users/cleanup`,
  },
  
  // Client data endpoints
  CLIENT_DATA: {
    UPLOAD: `${API_BASE_URL}/api/v1/client-data/upload`,
    LIST: `${API_BASE_URL}/api/v1/client-data`,
    ANALYTICS: `${API_BASE_URL}/api/v1/client-data/analytics`,
    DELETE: (id) => `${API_BASE_URL}/api/v1/client-data/${id}`,
  },
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_ENDPOINTS; 