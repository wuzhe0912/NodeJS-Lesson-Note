import { VersionInfoType } from '@/types/chat.types';

const VersionInfo = ({ version, buildTime }: VersionInfoType) => {
  return (
    <div className="mt-auto p-2 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700">
      <p>Version {version}</p>
      <p className="text-xs opacity-50">Build: {buildTime}</p>
    </div>
  );
};

export default VersionInfo;
