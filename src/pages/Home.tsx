import { useChatStore } from '@/store/useChatStore';
import { useGroupStore } from '@/store/useGroupStore';
import SideBar from '@/components/SideBar/Index';
import NoChatSelected from '@/components/NoChatSelected';
import ChatContainer from '@/components/Chat/ChatContainer';
import GroupChatContainer from '@/components/Group/GroupChatContainer';

const Home = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore();

  const renderContent = () => {
    if (selectedGroup) return <GroupChatContainer />;
    if (selectedUser) return <ChatContainer />;
    return <NoChatSelected />;
  };

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
