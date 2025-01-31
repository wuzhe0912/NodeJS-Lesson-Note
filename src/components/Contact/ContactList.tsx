import { User } from '@/types/chat.types';
import ContactItem from '@/components/Contact/ContactItem';

interface ContactListProps {
  users: User[];
  selectedUser: User | null;
  onlineUsers: string[];
  showOnlineOnly: boolean;
  getUnreadCountForUser: (userId: string) => number;
  onSelectUser: (user: User) => void;
}

const ContactList = ({
  users,
  selectedUser,
  onlineUsers,
  showOnlineOnly,
  getUnreadCountForUser,
  onSelectUser,
}: ContactListProps) => {
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-base-content/60">No users found</div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {filteredUsers.map((user) => (
        <ContactItem
          key={user._id}
          user={user}
          isSelected={selectedUser?._id === user._id}
          isOnline={onlineUsers.includes(user._id)}
          unreadCount={getUnreadCountForUser(user._id)}
          onSelect={onSelectUser}
        />
      ))}
    </div>
  );
};

export default ContactList;
