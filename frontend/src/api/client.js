import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const isLocalDevHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const fallbackBaseUrl = isLocalDevHost ? 'http://localhost:3000' : '';

const apiClient = axios.create({
  baseURL: configuredBaseUrl || fallbackBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
