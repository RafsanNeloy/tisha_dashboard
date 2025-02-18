export const API_BASE_URL = 'https://tisha-dashboard-api.onrender.com/api'
// Frontend URL configuration
export const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://tisha-dashboard.vercel.app'
    : 'http://localhost:5000'

// Additional URLs if needed
export const getApiUrl = (path) => `${API_BASE_URL}${path}` 