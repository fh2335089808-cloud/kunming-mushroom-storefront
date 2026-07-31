'use client';

import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NetworkStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-center text-xs text-white shadow-lg md:bottom-5"
    >
      <WifiOff size={15} />
      当前网络不可用，可继续浏览已缓存内容；恢复网络后再提交订单。
    </div>
  );
}
