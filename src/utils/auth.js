// Authentication utility functions

// Simple request cache to avoid duplicate API calls
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedRequest = (key) => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  requestCache.delete(key);
  return null;
};

const setCachedRequest = (key, data) => {
  requestCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const handleAuthError = (error, response) => {
  if (response && response.status === 401) {
    // Clear invalid tokens and redirect to login
    console.error('Authentication failed - clearing tokens and redirecting to login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cache on auth error
    requestCache.clear();
    
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
  requestCache.clear(); // Clear cache on logout
  window.location.href = '/';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Optimized fetch function with caching
export const cachedFetch = async (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = getCachedRequest(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Cache successful responses
    if (response.ok) {
      setCachedRequest(cacheKey, { response, data });
    }
    
    return { response, data };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Clear cache when needed
export const clearCache = () => {
  requestCache.clear();
}; 