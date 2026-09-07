'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endDate: string;
  textColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: string): TimeLeft | null {
  const difference = new Date(endDate).getTime() - Date.now();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ endDate, textColor }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(endDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  const units = [
    { label: 'd', value: timeLeft.days },
    { label: 'hrs', value: timeLeft.hours },
    { label: 'min', value: timeLeft.minutes },
    { label: 'sec', value: timeLeft.seconds },
  ];

  return (
    <div
      className="flex items-center gap-1.5 sm:ml-0 sm:pl-3 sm:border-l border-white/30"
      style={{ borderColor: textColor ? `${textColor}30` : undefined }}
    >
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center">
          <span
            className="tabular-nums text-base sm:text-xl font-bold text-center"
            style={{ color: textColor }}
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span
            className="text-[10px] sm:text-xs uppercase tracking-wider ml-0.5"
            style={{ color: textColor }}
          >
            {unit.label}
          </span>
          {i < units.length - 1 && (
            <span
              className="mx-1 opacity-40 text-sm font-bold"
              style={{ color: textColor }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
