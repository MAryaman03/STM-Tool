import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wave_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if redirect is already happening to prevent loops
let isRedirecting = false;

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !isRedirecting) {
      const token = localStorage.getItem("wave_token");
      // Only redirect if there WAS a token (it expired) — not on fresh page load
      if (token) {
        isRedirecting = true;
        localStorage.removeItem("wave_token");
        localStorage.removeItem("wave_user");
        localStorage.removeItem("isLoggedIn");
        const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3001";
        window.location.href = `${FRONTEND_URL}/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
