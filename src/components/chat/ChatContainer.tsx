import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessageInput from '@/components/chat/MessageInput';
import MessageSkeleton from '@/components/skeletons/MessageSkeleton';
import MessageBubble from '@/components/chat/MessageBubble';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior });
    }
  };

  // init
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (selectedUser) {
        await getMessages(selectedUser._id);
        // init scroll to bottom
        scrollToBottom();
      }
    };

    loadInitialMessages();
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // listen new message
  useEffect(() => {
    if (!isMessagesLoading && messages.length > 0) {
      // check if need auto scroll
      const shouldAutoScroll = () => {
        if (!messagesContainerRef.current) return true;

        const { scrollTop, scrollHeight, clientHeight } =
          messagesContainerRef.current;
        // if user scroll to bottom (difference less than 100px), auto scroll
        return scrollHeight - (scrollTop + clientHeight) < 100;
      };

      if (shouldAutoScroll()) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, isMessagesLoading]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-200/50">
        <p className="text-base-content/50">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-base-content/50">No messages yet</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
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
              {/* 滾動參考點 */}
              <div ref={messageEndRef} className="h-[1px]" />
            </>
          )}
        </div>
      )}

      <MessageInput onMessageSent={() => scrollToBottom('smooth')} />
    </div>
  );
};

export default ChatContainer;
