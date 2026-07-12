'use client';

import { useEffect, useState } from 'react';

interface SaleCountdownBannerProps {
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

export default function SaleCountdownBanner({
  targetDate = '2026-07-15T23:59:59',
}: SaleCountdownBannerProps) {
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
      <div className="w-full bg-white border-b border-gray-100 py-3">
        <p className="text-center text-sm font-medium text-gray-500">
          Sale Ended
        </p>
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
    <div className="w-full bg-white border-b border-gray-100 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center">
              <span className="font-bold tabular-nums text-lg md:text-xl text-gray-900 min-w-[2ch] text-center">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs md:text-sm text-gray-500 ml-1">
                {unit.label}
              </span>
              {i < units.length - 1 && (
                <span className="mx-1.5 text-gray-300 text-sm md:text-base">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm md:text-base text-gray-700">
          <span className="font-bold">Up to 50% Off</span>
          <span className="font-medium">: Unbeatable Sale</span>
        </p>
      </div>
    </div>
  );
}
