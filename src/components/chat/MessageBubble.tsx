import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { Message } from '@/types/chat.types';
import { formatMessageTime } from '@/lib/utils';
import { Edit2 } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { authUser } = useAuthStore();
  const { setEditingMessage } = useChatStore();
  const isOwnMessage = message.senderId === authUser?._id;

  return (
    <div className="chat-bubble relative group">
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

      {/* 編輯按鈕 - 只在自己的訊息上顯示 */}
      {isOwnMessage && (
        <div 
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
          transition-opacity duration-200"
        >
          <button
            onClick={() => setEditingMessage(message)}
            className="btn btn-circle btn-ghost btn-xs bg-base-200"
            title="Edit message"
          >
            <Edit2 size={14} />
          </button>
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
