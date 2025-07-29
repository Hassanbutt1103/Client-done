// Authentication utility functions

export const handleAuthError = (error, response) => {
  if (response && response.status === 401) {
    // Clear invalid tokens and redirect to login
    console.error('Authentication failed - clearing tokens and redirecting to login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    return true;
  }
  return false;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // Clean the token - remove any quotes or invalid characters
  const cleanToken = token.replace(/['"]/g, '').trim();
  
  return {
    'Authorization': `Bearer ${cleanToken}`,
    'Content-Type': 'application/json'
  };
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}; 