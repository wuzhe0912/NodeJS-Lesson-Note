import { AuthUser } from '@/types/auth.types';
import { Message, MessageData } from '@/types/chat.types';

// 群組基本資料
export interface Group {
  _id: string;
  name: string;
  members: AuthUser[];
  createdBy: AuthUser;
  createdAt: Date;
  updatedAt: Date;
  unreadCount?: number;
}

// 群組訊息
export interface GroupMessage extends Omit<Message, 'receiverId'> {
  groupId: string;
  chatType: 'group';
}

// 建立群組請求資料
export interface CreateGroupData {
  name: string;
  members: string[]; // member ids
}

// 群組 Store 的型別定義
export interface GroupStore {
  // State
  groups: Group[];
  selectedGroup: Group | null;
  groupMessages: GroupMessage[];
  isGroupsLoading: boolean;
  isMessagesLoading: boolean;

  // Actions
  createGroup: (data: CreateGroupData) => Promise<void>;
  getGroups: () => Promise<void>;
  getGroupMessages: (groupId: string) => Promise<void>;
  sendGroupMessage: (groupId: string, message: MessageData) => Promise<void>;
  setSelectedGroup: (group: Group | null) => void;

  // Socket related
  subscribeToGroupMessages: () => void;
  unsubscribeFromGroupMessages: () => void;

  // Group management
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;

  // Message status
  markGroupMessageAsRead: (messageId: string) => Promise<void>;
  getGroupUnreadCounts: () => Promise<void>;
}
