import axios from 'axios';
import toast from 'react-hot-toast';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Custom error handling(401, 403, 404, 500, etc.)
    // if (error?.response?.status === 401) {
    //   return Promise.reject(error);
    // }

    // Global error handling
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
    return Promise.reject(error);
  },
);
