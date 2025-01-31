import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useGroupStore } from '@/store/useGroupStore';
import { MessageSquare, Users } from 'lucide-react';
import SideBarHeader from './SideBarHeader';
import ContactList from '@/components/Contact/ContactList';
import GroupList from '@/components/Group/GroupList';
import VersionInfo from './VersionInfo';

const SideBar = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const { users, selectedUser, setSelectedUser, getUnreadCountForUser, getUsers } = useChatStore();
  const { setSelectedGroup } = useGroupStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // init: get users list
  useEffect(() => {
    if (activeTab === 'chats') {
      getUsers();
    }
  }, [activeTab, getUsers]);

  // switch tab, clear selected chat/group
  const handleTabChange = (tab: 'chats' | 'groups') => {
    setActiveTab(tab);
    if (tab === 'chats') {
      setSelectedGroup(null);
    } else {
      setSelectedUser(null);
    }
  };

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      <SideBarHeader
        showOnlineOnly={showOnlineOnly}
        onlineUsersCount={onlineUsers.length - 1}
        onToggleOnlineOnly={setShowOnlineOnly}
        activeTab={activeTab}
      />

      {/* 重新設計的 Tabs */}
      <div className="flex border-b border-base-300">
        <button
          onClick={() => handleTabChange('chats')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-2
            transition-colors hover:bg-base-200
            ${activeTab === 'chats' 
              ? 'border-b-2 border-primary text-primary bg-base-200/50' 
              : 'text-base-content/70'}`}
        >
          <MessageSquare size={18} />
          <span className="hidden lg:inline font-medium">Chats</span>
        </button>
        <button
          onClick={() => handleTabChange('groups')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-2
            transition-colors hover:bg-base-200
            ${activeTab === 'groups' 
              ? 'border-b-2 border-primary text-primary bg-base-200/50' 
              : 'text-base-content/70'}`}
        >
          <Users size={18} />
          <span className="hidden lg:inline font-medium">Groups</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          <ContactList
            users={users}
            selectedUser={selectedUser}
            onlineUsers={onlineUsers}
            showOnlineOnly={showOnlineOnly}
            getUnreadCountForUser={getUnreadCountForUser}
            onSelectUser={setSelectedUser}
          />
        ) : (
          <GroupList />
        )}
      </div>

      <VersionInfo
        version={import.meta.env.VITE_APP_VERSION}
        buildTime={import.meta.env.VITE_APP_BUILD_TIME}
      />
    </aside>
  );
};

export default SideBar;
