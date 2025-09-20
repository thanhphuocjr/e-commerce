// src/services/userService.js
import axios from 'axios';
import { getToken } from '../auth';

const API_URL = 'http://localhost:8000/v1/users';

// Tạo instance axios có sẵn baseURL + token
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Thêm token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const userService = {
  getUsers: async (params = {}) => {
    const res = await axiosInstance.get('/', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await axiosInstance.get('/stats');
    return res.data;
  },

  getUserById: async (id) => {
    const res = await axiosInstance.get(`/${id}`);
    return res.data;
  },

  createUser: async (userData) => {
    const res = await axiosInstance.post('/', userData);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await axiosInstance.patch(`/${id}`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await axiosInstance.delete(`/${id}`);
    return res.data;
  },

  restoreUser: async (id) => {
    const res = await axiosInstance.patch(`/restore/${id}`);
    return res.data;
  },

  permanentDeleteUser: async (id) => {
    const res = await axiosInstance.delete(`/permanent/${id}`);
    return res.data;
  },
};

export default userService;
