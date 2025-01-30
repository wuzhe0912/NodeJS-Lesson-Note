import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import SidebarSkeleton from '@/components/Skeletons/SidebarSkeleton';
import SideBarHeader from './SideBarHeader';
import ContactList from '@/components/Contact/ContactList';
import VersionInfo from './VersionInfo';

const SideBar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getUnreadCounts,
    getUnreadCountForUser,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getUnreadCounts();
  }, [getUsers, getUnreadCounts]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) =>
        onlineUsers.some((onlineUser) => onlineUser === user._id),
      )
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <SideBarHeader
        showOnlineOnly={showOnlineOnly}
        onlineUsersCount={onlineUsers.length}
        onToggleOnlineOnly={setShowOnlineOnly}
      />

      <ContactList
        users={filteredUsers}
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
        getUnreadCountForUser={getUnreadCountForUser}
        onSelectUser={setSelectedUser}
      />

      <VersionInfo
        version={import.meta.env.VITE_APP_VERSION}
        buildTime={import.meta.env.VITE_APP_BUILD_TIME}
      />
    </aside>
  );
};

export default SideBar;
