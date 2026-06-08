import axios from 'axios';
import { getToken } from './auth';
import { API_BASE_URL, API_TIMEOUT } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const checkoutBooking = async (payload) => {
  const response = await api.post('/bookings/checkout', payload);
  return response.data?.data;
};

export const getBookings = async () => {
  const response = await api.get('/bookings');
  return response.data?.data || [];
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data?.data || null;
};

