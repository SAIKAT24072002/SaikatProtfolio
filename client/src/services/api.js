import axios from 'axios';

// Get backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 8000);
const GET_RETRY_COUNT = Number(import.meta.env.VITE_API_GET_RETRY_COUNT || 2);
const RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 1200);

const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true, // Crucial for receiving/sending cookies in cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryGetRequest = (error, attempt, maxRetries) => {
  if (attempt >= maxRetries) {
    return false;
  }

  const status = error.response?.status;
  const code = error.code;

  return (
    code === 'ECONNABORTED' ||
    code === 'ERR_NETWORK' ||
    status === 429 ||
    (typeof status === 'number' && status >= 500) ||
    !error.response
  );
};

export const apiGet = async (url, config = {}, options = {}) => {
  const maxRetries = options.retries ?? GET_RETRY_COUNT;
  const retryDelay = options.retryDelayMs ?? RETRY_DELAY_MS;
  let attempt = 0;

  while (true) {
    try {
      return await api.get(url, config);
    } catch (error) {
      if (!shouldRetryGetRequest(error, attempt, maxRetries)) {
        throw error;
      }

      await sleep(retryDelay * (attempt + 1));
      attempt += 1;
    }
  }
};

// Response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured error message and metadata for UI fallback decisions.
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const enhancedError = new Error(message);

    enhancedError.status = error.response?.status;
    enhancedError.code = error.code;
    enhancedError.isTimeout = error.code === 'ECONNABORTED';
    enhancedError.isNetworkError = !error.response;

    return Promise.reject(enhancedError);
  }
);

export default api;
