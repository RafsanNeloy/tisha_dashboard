// Always use the production API URL
export const API_URL = 'https://tisha-dashboard-api.onrender.com/api'

// Frontend URL configuration
export const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://tisha-dashboard.vercel.app'
    : 'http://localhost:5000'  // Your current frontend port 