import axios from 'axios';

// Get backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for receiving/sending cookies in cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured error message
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
