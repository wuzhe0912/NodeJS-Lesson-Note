export type AuthUser = {
  _id?: string;
  fullName?: string;
  email: string;
  password?: string;
  profilePicture?: string;
};

export interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  register: (userData: AuthUser) => Promise<void>;
  login: (userData: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}
