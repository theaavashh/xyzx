import type React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
  icon?: LucideIcon;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  subMessage,
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      {Icon && <Icon className="w-12 h-12 mb-3 opacity-50" />}
      <p className="text-sm">{message}</p>
      {subMessage && <p className="text-xs mt-1 text-gray-300">{subMessage}</p>}
    </div>
  );
};

export default EmptyState;
