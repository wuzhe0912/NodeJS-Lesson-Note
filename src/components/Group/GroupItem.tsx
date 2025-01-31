import { Group } from '@/types/group.types';
import { Users } from 'lucide-react';

interface GroupItemProps {
  group: Group;
  isSelected: boolean;
  onSelect: (group: Group) => void;
}

const GroupItem = ({ group, isSelected, onSelect }: GroupItemProps) => {
  return (
    <button
      onClick={() => onSelect(group)}
      className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 rounded-lg transition-colors
        ${isSelected ? 'bg-base-200' : ''}`}
    >
      {/* Group Avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="text-primary font-medium flex items-center justify-center w-full h-full">
            {group.name.charAt(0)}
          </div>
        </div>
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
