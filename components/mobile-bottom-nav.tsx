'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  Home,
  MessageCircle,
  MessageSquareHeart,
  PackageSearch,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { WechatContactDialog } from '@/components/wechat-contact-dialog';

const navItems = [
  { id: 'home', label: '首页', href: '/', Icon: Home },
  { id: 'market', label: '今日现货', href: '/products', Icon: PackageSearch },
  { id: 'buyers', label: '买家秀', href: '/buyers', Icon: MessageSquareHeart },
  { id: 'order', label: '登记购买', href: '/order', Icon: ClipboardList },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const routeActive = pathname === '/products' || pathname.startsWith('/products/')
    ? 'market'
    : pathname === '/buyers'
      ? 'buyers'
      : pathname === '/order'
        ? 'order'
        : 'home';
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    setContactOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav
      aria-label="手机端快捷导航"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(28,43,31,0.08)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid h-[4.5rem] max-w-lg grid-cols-5">
        {navItems.map(({ id, label, href, Icon }) => {
          const selected = !contactOpen && routeActive === id;
          return (
            <Link
              key={id}
              href={href}
              aria-current={selected ? 'page' : undefined}
              onClick={(event) => {
                if (id === 'home' && pathname === '/') {
                  event.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={'flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition active:bg-forest-50 ' + (selected ? 'text-forest-700' : 'text-stone-500')}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={selected ? 2.4 : 1.9} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
        <WechatContactDialog
          onOpenChange={setContactOpen}
          className={'flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition active:bg-forest-50 ' + (contactOpen ? 'text-forest-700' : 'text-stone-500')}
        >
          <MessageCircle aria-hidden="true" size={20} strokeWidth={contactOpen ? 2.4 : 1.9} />
          <span className="truncate">联系微信</span>
        </WechatContactDialog>
      </div>
    </nav>
  );
}
