import type React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  filterDropdown?: React.ReactNode;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  icon: Icon,
  iconColor = 'text-[#D4AF37]',
  subtitle,
  filterDropdown,
  children,
}) => {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-amber-50 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-black tracking-wide outer-sans uppercase">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {filterDropdown}
          {subtitle && !filterDropdown && (
            <span className="text-xs font-medium px-3 py-1 rounded-md bg-gray-100 text-gray-600">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
