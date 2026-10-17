import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.trim();

const api = axios.create({
  baseURL: apiUrl || `http://${window.location.hostname}:3001`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  if (import.meta.env.PROD && !apiUrl) {
    const error = new Error('API_URL_NOT_CONFIGURED');
    error.code = 'API_URL_NOT_CONFIGURED';
    throw error;
  }

  return config;
});

export default api;
