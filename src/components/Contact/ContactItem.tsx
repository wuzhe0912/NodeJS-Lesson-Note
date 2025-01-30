import { ContactItemType } from '@/types/chat.types';

const ContactItem = ({
  user,
  isSelected,
  isOnline,
  unreadCount,
  onSelect,
}: ContactItemType) => {
  return (
    <button
      onClick={() => onSelect(user)}
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
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full lg:hidden">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 hidden lg:block text-left min-w-0">
        <div className="font-medium truncate">{user.fullName}</div>
        <div className="text-sm flex items-center gap-1">
          {isOnline ? (
            <span className="text-green-500 flex items-center gap-1">
              Online
            </span>
          ) : (
            <span className="text-zinc-500">Offline</span>
          )}
        </div>
      </div>

      {unreadCount > 0 && (
        <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full hidden lg:inline-flex items-center ml-2">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default ContactItem;
