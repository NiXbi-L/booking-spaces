import axios from 'axios';
import { User, Space, Booking, AuthResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authService = {
  register: (userData: User) => 
    api.post<AuthResponse>('/auth/register/', userData),
  login: (userData: User) => 
    api.post<AuthResponse>('/auth/login/', userData),
};

export const spaceService = {
  getAll: () => 
    api.get<Space[]>('/spaces/'),
  getBookings: (spaceId: number, date: string) => 
    api.get<Booking[]>(`/spaces/${spaceId}/bookings/?date=${date}`),
};

export const bookingService = {
  create: (bookingData: Omit<Booking, 'id' | 'user'>) => 
    api.post<Booking>('/bookings/', bookingData),
  delete: (bookingId: number) => 
    api.delete(`/bookings/${bookingId}/`),
}; 