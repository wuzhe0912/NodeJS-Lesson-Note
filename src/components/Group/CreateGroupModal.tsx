import { useState } from 'react';
import { useGroupStore } from '@/store/useGroupStore';
import { useChatStore } from '@/store/useChatStore';
import { User } from '@/types/chat.types';
import { Users, X } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal = ({ isOpen, onClose }: CreateGroupModalProps) => {
  const { users } = useChatStore();
  const { createGroup } = useGroupStore();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length === 0) return;

    setIsLoading(true);
    try {
      await createGroup({
        name: groupName.trim(),
        members: selectedMembers,
      });
      onClose();
      setGroupName('');
      setSelectedMembers([]);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Group Name</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Select Members</span>
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {users.map((user: User) => (
                <label
                  key={user._id}
                  className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => toggleMember(user._id)}
                    className="checkbox checkbox-sm"
                  />
                  <img
                    src={user.profilePicture || '/avatar.png'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!groupName.trim() || selectedMembers.length === 0 || isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal; 