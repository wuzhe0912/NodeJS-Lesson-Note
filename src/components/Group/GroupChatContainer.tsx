import { useEffect, useRef } from 'react';
import { useGroupStore } from '@/store/useGroupStore';
import { useAuthStore } from '@/store/useAuthStore';
import MessageInput from '@/components/Chat/MessageInput';
import MessageSkeleton from '@/components/Skeletons/MessageSkeleton';
import MessageBubble from '@/components/Chat/MessageBubble';

const GroupChatContainer = () => {
  const {
    groupMessages,
    selectedGroup,
    getGroupMessages,
    isMessagesLoading,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupStore();
  const { authUser } = useAuthStore();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // 滾動到底部
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior });
    }
  };

  // 初始化
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (selectedGroup) {
        await getGroupMessages(selectedGroup._id);
        scrollToBottom();
      }
    };

    loadInitialMessages();
    subscribeToGroupMessages();

    return () => unsubscribeFromGroupMessages();
  }, [
    selectedGroup?._id,
    getGroupMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  ]);

  // 監聽新訊息
  useEffect(() => {
    if (!isMessagesLoading && groupMessages.length > 0) {
      const shouldAutoScroll = () => {
        if (!messagesContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } =
          messagesContainerRef.current;
        return scrollHeight - (scrollTop + clientHeight) < 100;
      };

      if (shouldAutoScroll()) {
        scrollToBottom('smooth');
      }
    }
  }, [groupMessages, isMessagesLoading]);

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-200/50">
        <p className="text-base-content/50">
          Select a group to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* GroupHeader will be added later */}
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="text-primary font-medium flex items-center justify-center w-full h-full">
                  {selectedGroup.name.charAt(0)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">{selectedGroup.name}</h3>
              <p className="text-sm text-base-content/70">
                {selectedGroup.members.length} members
              </p>
            </div>
          </div>
        </div>
      </div>

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {groupMessages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-base-content/50">No messages yet</p>
            </div>
          ) : (
            <>
              {groupMessages.map((message) => (
                <div
                  key={message._id}
                  className={`chat ${
                    message.senderId === authUser?._id
                      ? 'chat-end'
                      : 'chat-start'
                  }`}
                >
                  <MessageBubble message={message} />
                </div>
              ))}
              <div ref={messageEndRef} className="h-[1px]" />
            </>
          )}
        </div>
      )}

      <MessageInput
        onMessageSent={() => scrollToBottom('smooth')}
        isGroupChat={true}
        groupId={selectedGroup._id}
      />
    </div>
  );
};

export default GroupChatContainer;
