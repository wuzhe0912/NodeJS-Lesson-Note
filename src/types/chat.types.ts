export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePicture: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  text: string;
  isEdited: boolean;
  status?: 'sent' | 'delivered' | 'read';
  readBy?: {
    userId: string;
    readAt: Date;
  }[];
}

export interface MessageData {
  text: string;
  image?: string | null;
}

export interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: MessageData) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  editMessage: (messageId: string, text: string) => Promise<void>;
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;
  deleteMessage: (messageId: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  unreadCounts: Record<string, number>;
  getUnreadCountForUser: (userId: string) => number;
  getUnreadCounts: () => Promise<void>;
}
