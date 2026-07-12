'use client';

import { useEffect, useState } from 'react';

interface TopAnnouncementBarProps {
  targetDate?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const difference = new Date(targetDate).getTime() - Date.now();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function TopAnnouncementBar({
  targetDate = '2026-07-15T23:59:59',
}: TopAnnouncementBarProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(targetDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="w-full bg-white border-t border-black h-[46px] md:h-[50px] flex items-center justify-center px-6">
        <p className="text-sm font-medium text-gray-500">Sale Ended</p>
      </div>
    );
  }

  const units = [
    { label: 'd', value: timeLeft.days },
    { label: 'hrs', value: timeLeft.hours },
    { label: 'min', value: timeLeft.minutes },
    { label: 'sec', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full bg-white border-t border-black">
      {/* Desktop: three-column grid */}
      <div className="hidden md:grid grid-cols-3 h-[50px] items-center">
        {/* Left: countdown */}
        <div className="pl-6 flex items-center gap-2">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-0.5">
              <span className="font-bold tabular-nums text-sm text-black min-w-[2ch] text-center">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-500 uppercase leading-none">
                {unit.label}
              </span>
              {i < units.length - 1 && (
                <span className="text-gray-300 text-xs mx-0.5">·</span>
              )}
            </div>
          ))}
        </div>

        {/* Center: sale message */}
        <p className="text-sm font-medium text-black text-center leading-none">
          Mid-Season Selection — Up to 50% Off
        </p>

        {/* Right: shop now */}
        <div className="pr-6 flex justify-end">
          <button
            type="button"
            className="text-xs font-bold text-black tracking-widest uppercase underline underline-offset-4 hover:opacity-60 transition-opacity duration-200 cursor-pointer"
            aria-label="Shop Now"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden flex flex-col items-center justify-center h-[60px] px-4 gap-1">
        <div className="flex items-center gap-1">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-0.5">
              <span className="font-bold tabular-nums text-xs text-black min-w-[1.8ch] text-center">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-gray-500 uppercase leading-none">
                {unit.label}
              </span>
              {i < units.length - 1 && (
                <span className="text-gray-300 text-[10px] mx-0.5">·</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-[11px] font-medium text-black text-center leading-tight">
          Mid-Season Selection — Up to 50% Off
        </p>
      </div>
    </div>
  );
}
