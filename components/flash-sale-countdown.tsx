'use client';

import { useEffect, useState } from 'react';

function remainingLabel(target: number, prefix: string) {
  const remaining = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${prefix} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function FlashSaleCountdown({ startAt, endAt, state }: { startAt: number; endAt: number; state: 'active' | 'upcoming' | 'ended' | 'sold_out' }) {
  const target = state === 'upcoming' ? startAt : endAt;
  const prefix = state === 'upcoming' ? '距开始' : '距结束';
  const [label, setLabel] = useState(() => remainingLabel(target, prefix));

  useEffect(() => {
    const update = () => setLabel(remainingLabel(target, prefix));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [prefix, target]);

  return <span className="font-medium text-forest-700">{state === 'ended' ? '活动已结束' : label}</span>;
}