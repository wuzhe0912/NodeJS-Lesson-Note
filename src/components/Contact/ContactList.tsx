import { ContactListType } from '@/types/chat.types';
import ContactItem from './ContactItem';

const ContactList = ({
  users,
  selectedUser,
  onlineUsers,
  getUnreadCountForUser,
  onSelectUser,
}: ContactListType) => {
  if (users.length === 0) {
    return <div className="text-center text-zinc-500 py-4">No users</div>;
  }

  return (
    <div className="overflow-y-auto w-full py-3">
      {users.map((user) => (
        <ContactItem
          key={user._id}
          user={user}
          isSelected={selectedUser?._id === user._id}
          isOnline={onlineUsers.some((onlineUser) => onlineUser === user._id)}
          unreadCount={getUnreadCountForUser(user._id)}
          onSelect={onSelectUser}
        />
      ))}
    </div>
  );
};

export default ContactList;
