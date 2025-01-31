import { create } from 'zustand';
import { GroupStore, Group, GroupMessage, CreateGroupData } from '@/types/group.types';
import { MessageData } from '@/types/chat.types';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export const useGroupStore = create<GroupStore>((set, get) => ({
  // State
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  isGroupsLoading: false,
  isMessagesLoading: false,

  // Actions
  createGroup: async (data: CreateGroupData) => {
    try {
      const response = await axiosInstance.post('/groups', data);
      set((state) => ({
        groups: [...state.groups, response.data.group],
      }));
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  },

  getGroups: async () => {
    try {
      set({ isGroupsLoading: true });
      const response = await axiosInstance.get('/groups');
      set({ groups: response.data.groups });
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      throw error;
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getGroupMessages: async (groupId: string) => {
    try {
      set({ isMessagesLoading: true });
      const response = await axiosInstance.get(`/groups/${groupId}/messages`);
      set({ groupMessages: response.data.messages });
    } catch (error) {
      console.error('Failed to fetch group messages:', error);
      throw error;
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendGroupMessage: async (groupId: string, message: MessageData) => {
    try {
      const response = await axiosInstance.post(`/groups/${groupId}/message`, message);
      set((state) => ({
        groupMessages: [...state.groupMessages, response.data.data],
      }));
    } catch (error) {
      console.error('Failed to send group message:', error);
      throw error;
    }
  },

  setSelectedGroup: (group: Group | null) => {
    set({ selectedGroup: group });
    
    // 如果選擇了新群組，加入該群組的 socket room
    if (group) {
      get().joinGroup(group._id);
    }
  },

  // Socket related
  subscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on('newGroupMessage', (message: GroupMessage) => {
      set((state) => ({
        groupMessages: [...state.groupMessages, message],
      }));
    });
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off('newGroupMessage');
  },

  // Group management
  joinGroup: (groupId: string) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.emit('joinGroup', { groupId });
  },

  leaveGroup: (groupId: string) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.emit('leaveGroup', { groupId });
  },

  // Message status
  markGroupMessageAsRead: async (messageId: string) => {
    try {
      const response = await axiosInstance.put(`/messages/${messageId}/markAsRead`);
      // Update message status in state
      set((state) => ({
        groupMessages: state.groupMessages.map((msg) =>
          msg._id === messageId ? response.data.message : msg
        ),
      }));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  },

  getGroupUnreadCounts: async () => {
    try {
      const response = await axiosInstance.get('/groups/unreadCounts');
      set((state) => ({
        groups: state.groups.map((group) => ({
          ...group,
          unreadCount: response.data.unreadCounts[group._id] || 0,
        })),
      }));
    } catch (error) {
      console.error('Failed to get unread counts:', error);
      throw error;
    }
  },
})); 