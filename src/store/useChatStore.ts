import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { ChatStore, Message, User, MessageData } from '@/types/chat.types';

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  editingMessage: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/users');
      set({ users: response.data });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: MessageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    const response = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData,
    );
    set({ messages: [...messages, response.data] });
  },

  setSelectedUser: (selectedUser: User | null) => {
    set({ selectedUser });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('newMessage', (newMessage: Message) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    socket.on('messageEdited', (editedMessage: Message) => {
      const messages = get().messages.map((msg) =>
        msg._id === editedMessage._id ? editedMessage : msg,
      );
      set({ messages });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off('newMessage');
  },

  setEditingMessage: (message) => {
    set({ editingMessage: message });
  },

  editMessage: async (messageId, text) => {
    try {
      const response = await axiosInstance.put(`/messages/${messageId}`, {
        text,
      });

      // 更新本地訊息
      const messages = get().messages.map((msg) =>
        msg._id === messageId ? response.data : msg,
      );

      set({ messages, editingMessage: null });
    } catch (error) {
      console.error('Failed to edit message:', error);
      throw error;
    }
  },
}));
