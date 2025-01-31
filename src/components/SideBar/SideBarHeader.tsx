import { useState } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import CreateGroupModal from '../Group/CreateGroupModal';

interface SideBarHeaderProps {
  showOnlineOnly: boolean;
  onlineUsersCount: number;
  onToggleOnlineOnly: (show: boolean) => void;
  activeTab: 'chats' | 'groups';
}

const SideBarHeader = ({
  showOnlineOnly,
  onlineUsersCount,
  onToggleOnlineOnly,
  activeTab,
}: SideBarHeaderProps) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <>
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold hidden lg:block">
            {activeTab === 'chats' ? 'Messages' : 'Groups'}
          </h2>
          <div className="flex items-center">
            {activeTab === 'chats' ? (
              <button
                onClick={() => onToggleOnlineOnly(!showOnlineOnly)}
                className={`btn btn-sm ${showOnlineOnly ? 'btn-primary' : 'btn-ghost'}`}
                title={showOnlineOnly ? 'Show All Users' : 'Show Online Only'}
              >
                <UserCheck size={18} />
                <span className="ml-2 hidden lg:inline">
                  {onlineUsersCount} online
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowCreateGroup(true)}
                className="btn btn-sm btn-primary"
              >
                <UserPlus className="lg:mr-2" size={18} />
                <span className="hidden lg:inline">New Group</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </>
  );
};

export default SideBarHeader;
