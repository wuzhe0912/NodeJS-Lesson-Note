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
  unreadCounts: {},

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

    if (selectedUser) {
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [selectedUser._id]: 0,
        },
      }));
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const { authUser } = useAuthStore.getState();
    const { selectedUser } = get();

    socket.on('newMessage', (newMessage: Message) => {
      // 1. if message is sent to me, update unread counts
      if (newMessage.receiverId === authUser?._id) {
        // if message is not for current chat, update unread counts
        if (newMessage.senderId !== selectedUser?._id) {
          set((state) => ({
            unreadCounts: {
              ...state.unreadCounts,
              [newMessage.senderId]:
                (state.unreadCounts[newMessage.senderId] || 0) + 1,
            },
          }));
        }
      }

      // 2. if message is for current chat, update messages list
      const isMessageForCurrentChat =
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id;

      if (isMessageForCurrentChat) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
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

    // listen to messageRead event
    socket.on(
      'messageRead',
      (payload: { messageId: string; readBy: any[] }) => {
        const { messageId, readBy } = payload;

        // update message status
        const updatedMessages = get().messages.map((msg) => {
          if (msg._id === messageId) {
            return { ...msg, readBy, status: 'read' as const };
          }
          return msg;
        });

        set({ messages: updatedMessages });
      },
    );

    // Clean function
    return () => {
      socket.off('newMessage');
      socket.off('messageRead');
    };
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off('newMessage');
    socket.off('messageRead');
    socket.off('messageEdited');
    socket.off('messageDeleted');
  },

  setEditingMessage: (message) => {
    set({ editingMessage: message });
  },

  editMessage: async (messageId, text) => {
    try {
      const response = await axiosInstance.put(`/messages/${messageId}`, {
        text,
      });

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

  // mark message as read
  markMessageAsRead: async (messageId: string) => {
    try {
      const response = await axiosInstance.put(
        `/messages/${messageId}/markAsRead`,
      );
      const updatedMessage = response.data.data as Message;

      // update state 裡的 messages
      const newMessages = get().messages.map((msg) =>
        msg._id === updatedMessage._id ? updatedMessage : msg,
      );

      // update unread counts
      const senderId = updatedMessage.senderId;
      set((state) => ({
        messages: newMessages,
        unreadCounts: {
          ...state.unreadCounts,
          [senderId]: Math.max(0, (state.unreadCounts[senderId] || 0) - 1),
        },
      }));
    } catch (error) {
      console.log('Failed to mark message as read:', error);
      throw error;
    }
  },

  getUnreadCounts: async () => {
    try {
      const response = await axiosInstance.get('/messages/unreadCounts');
      const counts = response.data.reduce(
        (acc: Record<string, number>, curr: { _id: string; count: number }) => {
          acc[curr._id] = curr.count;
          return acc;
        },
        {},
      );
      set({ unreadCounts: counts });
    } catch (error) {
      console.log('Failed to get unread counts:', error);
    }
  },

  getUnreadCountForUser: (userId: string) => {
    return get().unreadCounts[userId] || 0;
  },
}));
