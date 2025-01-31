import { useEffect } from 'react';
import { useGroupStore } from '@/store/useGroupStore';
import GroupItem from './GroupItem';

const GroupList = () => {
  const {
    groups,
    selectedGroup,
    isGroupsLoading,
    getGroups,
    setSelectedGroup,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupStore();

  // init: get groups list
  useEffect(() => {
    getGroups();
  }, [getGroups]);

  // subscribe to group messages
  useEffect(() => {
    subscribeToGroupMessages();
    return () => unsubscribeFromGroupMessages();
  }, [subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  if (isGroupsLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 hidden lg:block">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-4 text-center text-base-content/60">
        <p>No groups yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {groups.map((group) => (
        <GroupItem
          key={group._id}
          group={group}
          isSelected={selectedGroup?._id === group._id}
          onSelect={setSelectedGroup}
        />
      ))}
    </div>
  );
};

export default GroupList;
