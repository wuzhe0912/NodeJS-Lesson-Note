interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface ChatStore {
  messages: string[];
  users: string[];
  selectedUser: User | null;
  isUserLoading: boolean;
  isMessageLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
}
