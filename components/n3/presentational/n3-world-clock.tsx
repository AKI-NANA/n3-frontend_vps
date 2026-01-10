/**
 * N3WorldClock - Presentational Component
 * 
 * 世界時計表示（複数タイムゾーン）
 */

'use client';

import { memo } from 'react';

export interface ClockItem {
  label: string;
  time: string;
}

export interface N3WorldClockProps {
  clocks: ClockItem[];
  className?: string;
}

export const N3WorldClock = memo(function N3WorldClock({
  clocks,
  className = '',
}: N3WorldClockProps) {
  return (
    <div className={`n3-world-clock ${className}`}>
      {clocks.map((clock) => (
        <span key={clock.label} className="n3-world-clock__item">
          <span className="n3-world-clock__label">{clock.label}</span>
          <span className="n3-world-clock__time">{clock.time || '--:--'}</span>
        </span>
      ))}
    </div>
  );
});

N3WorldClock.displayName = 'N3WorldClock';
