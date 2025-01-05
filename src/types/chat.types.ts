export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePicture: string;
}

export interface ChatStore {
  messages: string[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessageLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
}
