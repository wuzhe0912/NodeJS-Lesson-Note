import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { AuthStore, AuthUser } from '@/types/auth.types';

const BASE_URL = import.meta.env.BASE_URL;

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  token: localStorage.getItem('token') || null,
  isCheckingAuth: true,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const { token } = get();
      if (!token) {
        set({ authUser: null, isCheckingAuth: false });
        return;
      }
      // Add Authorization: Bearer token
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null, token: null });
      localStorage.removeItem('token');
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (userData: AuthUser) => {
    set({ isRegistering: true });
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const { token, user } = response.data;
      set({ authUser: user, token });
      localStorage.setItem('token', token);
      toast.success('Account created successfully');
      get().connectSocket();
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (userData: AuthUser) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', userData);
      const { token, user } = response.data;
      set({ authUser: user, token });
      localStorage.setItem('token', token);
      toast.success('Login successful');
      get().connectSocket();
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
    set({ authUser: null, token: null });
    localStorage.removeItem('token');
    toast.success('Logout successful');
    get().disconnectSocket();
  },

  updateProfile: async (userData: AuthUser) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/auth/updateProfile', userData);
      set({ authUser: response.data });
      toast.success('Profile updated successfully');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));
