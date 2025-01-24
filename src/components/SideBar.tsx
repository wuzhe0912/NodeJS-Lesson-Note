import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import SidebarSkeleton from '@/components/skeletons/SidebarSkeleton';

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
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Filter Toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const unreadCount = getUnreadCountForUser(user._id);
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.some(
            (onlineUser) => onlineUser === user._id,
          );

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full px-3 py-2 flex items-center gap-3
                hover:bg-base-300 transition-colors relative
                ${isSelected ? 'bg-base-300 ring-1 ring-base-300' : ''}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePicture || '/avatar.png'}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info (only visible on larger screens) */}
              <div className="flex-1 hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* 未讀數量 Badge（只在 unreadCount > 0 時顯示） */}
              {unreadCount > 0 && (
                <span
                  className="
                    text-xs font-bold text-white bg-red-500 
                    px-2 py-1 rounded-full
                    hidden lg:inline-block
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users</div>
        )}
      </div>

      {/* Version Info */}
      <div className="mt-auto p-4 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700">
        <p>Version {import.meta.env.VITE_APP_VERSION}</p>
        <p className="text-xs opacity-50">
          Build: {import.meta.env.VITE_APP_BUILD_TIME}
        </p>
      </div>
    </aside>
  );
};

export default SideBar;
