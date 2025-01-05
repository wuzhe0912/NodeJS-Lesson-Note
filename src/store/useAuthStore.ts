import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { AuthStore, AuthUser } from '@/types/auth.types';

const BASE_URL = import.meta.env.BASE_URL;

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (userData: AuthUser) => {
    set({ isRegistering: true });
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      set({ authUser: response.data });
      toast.success('Account created successfully');
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (userData: AuthUser) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', userData);
      set({ authUser: response.data });
      toast.success('Login successful');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
    set({ authUser: null });
    toast.success('Logout successful');
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
