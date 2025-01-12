import { Socket } from 'socket.io-client';

export type AuthUser = {
  _id?: string;
  fullName?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface AuthStore {
  authUser: AuthUser | null;
  token: string | null;
  isCheckingAuth: boolean;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: AuthUser[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  register: (userData: AuthUser) => Promise<void>;
  login: (userData: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: AuthUser) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}
