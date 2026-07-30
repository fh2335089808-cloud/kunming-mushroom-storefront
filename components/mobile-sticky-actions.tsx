'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { OrderFormLink } from '@/components/order-form-link';

function isNearViewport(element: Element | null, margin = 0) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > -margin
    && rect.top < window.innerHeight + margin
    && rect.right > -margin
    && rect.left < window.innerWidth + margin
  );
}

export function MobileStickyActions({ baseUrl }: { baseUrl: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      const heroActions = document.getElementById('hero-actions');
      const personalWechat = document.querySelector('#wechat img');
      const groupQr = document.querySelector('img[src*="wechat-group-qr.jpg"]');
      const groupQrCard = groupQr?.closest('article') ?? groupQr;

      setVisible(
        !isNearViewport(heroActions)
        && !isNearViewport(personalWechat, 48)
        && !isNearViewport(groupQrCard, 48),
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    document.addEventListener('scroll', scheduleUpdate, true);
    window.addEventListener('resize', scheduleUpdate);

    const buyerSection = document.getElementById('buyers');
    const buyerObserver = buyerSection ? new MutationObserver(scheduleUpdate) : null;
    if (buyerSection) buyerObserver?.observe(buyerSection, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('scroll', scheduleUpdate, true);
      window.removeEventListener('resize', scheduleUpdate);
      buyerObserver?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={'mobile-sticky-cta fixed inset-x-4 z-20 flex items-center gap-2 transition-all duration-200 md:hidden ' + (
        visible ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0'
      )}
    >
      <OrderFormLink baseUrl={baseUrl} mobile />
      <a href="#wechat" aria-label="微信咨询" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
        <MessageCircle size={18} />
        微信咨询
      </a>
    </div>
  );
}
