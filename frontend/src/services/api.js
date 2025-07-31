import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const checkBackendConnection = async () => {
  try {
    await API.get('/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
};

API.interceptors.request.use(
  (config) => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    if (adminInfo?.token) {
      config.headers.Authorization = `Bearer ${adminInfo.token}`;
      return config;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isConnected = await checkBackendConnection();
    if (!isConnected) {
      error.message = 'Backend server is not available. Please try again later.';
      error.isConnectionError = true;
    }
    return Promise.reject(error);
  }
);

export default API;