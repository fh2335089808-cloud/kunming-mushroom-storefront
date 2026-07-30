'use client';

import { type ReactNode, useEffect, useState } from 'react';

const SOURCE_STORAGE_KEY = 'junxiandao_traffic_source';

type OrderFormLinkProps = {
  baseUrl: string;
  children?: ReactNode;
  className?: string;
  mobile?: boolean;
};

export function OrderFormLink({ baseUrl, children = '立即登记购买', className, mobile = false }: OrderFormLinkProps) {
  const [orderUrl, setOrderUrl] = useState(`${baseUrl}?source=official`);

  useEffect(() => {
    try {
      const target = new URL(baseUrl);
      target.searchParams.set(
        'source',
        window.location.hostname.endsWith('.vercel.app') ? 'vercel' : 'official',
      );

      const trafficSource = new URLSearchParams(window.location.search).get('src')?.trim();
      if (trafficSource) {
        window.localStorage.setItem(SOURCE_STORAGE_KEY, trafficSource);
        target.searchParams.set('src', trafficSource);
      }

      setOrderUrl(target.toString());
    } catch {
      setOrderUrl(`${baseUrl}?source=official`);
    }
  }, [baseUrl]);

  return (
    <a
      href={orderUrl}
      className={className ?? (
        mobile
          ? 'inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-amber-100 px-4 py-2.5 text-sm font-semibold text-forest-900 shadow-lg'
          : 'inline-flex min-h-12 items-center justify-center rounded-full bg-amber-100 px-6 py-3 text-sm font-semibold text-forest-900 shadow-lg shadow-black/15 transition hover:bg-amber-50'
      )}
    >
      {children}
    </a>
  );
}