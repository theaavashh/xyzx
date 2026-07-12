import type React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#D4AF37]',
  iconBgColor = 'bg-amber-50',
}) => {
  return (
    <div className="group relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-gray-800 uppercase tracking-wide outer-sans">{title}</h3>
          <div className={`p-2.5 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <p className="text-2xl font-bold text-black tracking-tight outer-sans">{value}</p>
        {subtitle && <p className="text-sm text-gray-600 mt-1.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
