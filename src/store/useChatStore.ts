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

    socket.on('messageDeleted', (deletedMessageId: string) => {
      const messages = get().messages.filter(
        (msg) => msg._id !== deletedMessageId,
      );
      set({ messages });
    });

    // 監聽 messageRead 事件
    socket.on(
      'messageRead',
      (payload: { messageId: string; readBy: any[] }) => {
        // 前端若需要更新某則訊息的 readBy
        const { messageId, readBy } = payload;
        const updatedMessages = get().messages.map((msg) => {
          if (msg._id === messageId) {
            return { ...msg, readBy, status: 'read' };
          }
          return msg;
        });
        set({ messages: updatedMessages });
      },
    );
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

      // 更新訊息
      const messages = get().messages.map((msg) =>
        msg._id === messageId ? response.data : msg,
      );

      set({ messages, editingMessage: null });
    } catch (error) {
      console.log('Failed to edit message:', error);
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);

      // 更新訊息列表
      const messages = get().messages.filter((msg) => msg._id !== messageId);
      set({ messages });
    } catch (error) {
      console.log('Failed to delete message:', error);
      throw error;
    }
  },

  // 標記訊息為已讀
  markMessageAsRead: async (messageId: string) => {
    try {
      const response = await axiosInstance.put(
        `/messages/${messageId}/markAsRead`,
      );

      // 後端回傳更新後的 message
      const updatedMessage = response.data.data as Message;

      // 更新本地 state 裡的 messages
      const newMessages = get().messages.map((msg) =>
        msg._id === updatedMessage._id ? updatedMessage : msg,
      );

      set({ messages: newMessages });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  },
}));
