export type AuthUser = {
  _id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
};

export interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
}
