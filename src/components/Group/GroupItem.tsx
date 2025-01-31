import { Group } from '@/types/group.types';
import { Users } from 'lucide-react';

interface GroupItemProps {
  group: Group;
  isSelected: boolean;
  unreadCount: number;
  onSelect: (group: Group) => void;
}

const GroupItem = ({ group, isSelected, unreadCount, onSelect }: GroupItemProps) => {
  return (
    <button
      onClick={() => onSelect(group)}
      className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 rounded-lg transition-colors
        ${isSelected ? 'bg-base-200' : ''}`}
    >
      {/* Group Avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary 
            flex items-center justify-center">
            <span className="text-xs text-primary-content font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* Group Info */}
      <div className="flex-1 text-left hidden lg:block">
        <h3 className="font-medium truncate">{group.name}</h3>
        <p className="text-sm text-base-content/60 truncate">
          {group.members.length} members
        </p>
      </div>
    </button>
  );
};

export default GroupItem; 