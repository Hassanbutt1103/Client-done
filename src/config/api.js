// API Configuration
// Use environment variable if available, otherwise default to production server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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