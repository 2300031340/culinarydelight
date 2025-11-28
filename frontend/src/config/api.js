// API Configuration
// Uses environment variable VITE_API_URL if available, otherwise defaults to relative path
// In production with nginx, the /api path will be proxied to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_BASE_URL is set, use it; otherwise use relative path
  if (API_BASE_URL) {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
  
  // Use relative path (will be proxied by nginx in production)
  return `/api/${cleanEndpoint}`;
};

export default {
  baseUrl: API_BASE_URL,
  recipes: getApiUrl('recipes'),
  favorites: getApiUrl('favorites'),
  auth: getApiUrl('auth'),
};

