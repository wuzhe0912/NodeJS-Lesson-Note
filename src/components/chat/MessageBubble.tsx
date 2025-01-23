import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/chat.types';
import { formatMessageTime } from '@/lib/utils';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import '@/styles/animation.scss';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { authUser } = useAuthStore();
  const { setEditingMessage, deleteMessage } = useChatStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwnMessage = message.senderId === authUser?._id;
  // 只有發送訊息這一方才顯示已讀的提示
  const isRead = message.status === 'read';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div
      className={`chat-bubble relative group ${
        isDeleting ? 'animate-delete-message' : ''
      }`}
      onAnimationEnd={async () => {
        if (isDeleting) {
          await deleteMessage(message._id);
        }
      }}
    >
      {/* 訊息內容 */}
      <div className="space-y-2">
        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
        {message.image && (
          <img
            src={message.image}
            alt="Message attachment"
            className="max-w-[200px] rounded-md"
            loading="lazy"
          />
        )}
      </div>

      {/* 已讀的提示 */}
      {isOwnMessage && (
        <div className="text-xs mt-1">{isRead ? 'Read' : 'Unread'}</div>
      )}

      {/* 操作訊息 */}
      {isOwnMessage && (
        <div
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
          transition-opacity duration-200 flex items-center gap-1"
        >
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn btn-circle btn-ghost btn-xs bg-base-200"
            >
              <MoreVertical size={14} />
            </button>

            {/* 下拉選單 */}
            {showMenu && (
              <div
                className="absolute right-0 mt-1 w-32 py-2 bg-base-200 
                rounded-lg shadow-lg z-10"
              >
                <button
                  onClick={() => {
                    setEditingMessage(message);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-base-300 
                    flex items-center gap-2"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-base-300 
                    text-error flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 訊息資訊 */}
      <div className="flex items-center gap-1 mt-1 text-xs opacity-50">
        <time>{formatMessageTime(message.createdAt)}</time>
        {message.isEdited && <span>(edited)</span>}
      </div>
    </div>
  );
};

export default MessageBubble;
