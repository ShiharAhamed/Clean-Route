import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified response handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      errors: error.response?.data?.errors || [],
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
