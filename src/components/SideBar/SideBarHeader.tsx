import { SideBarHeaderType } from '@/types/chat.types';
import { Users } from 'lucide-react';

const SideBarHeader = ({
  showOnlineOnly,
  onlineUsersCount,
  onToggleOnlineOnly,
}: SideBarHeaderType) => {
  return (
    <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center gap-2">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>
      <div className="mt-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => onToggleOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
        </label>
        <span className="text-xs text-zinc-500">
          ({onlineUsersCount - 1} online)
        </span>
      </div>
    </div>
  );
};

export default SideBarHeader;
