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

const navItems = [
  { id: 'home', label: '首页', href: '/#home', Icon: Home },
  { id: 'market', label: '今日现货', href: '/#market', Icon: PackageSearch },
  { id: 'buyers', label: '买家秀', href: '/#buyers', Icon: MessageSquareHeart },
  { id: 'order', label: '订单登记', href: '/order', Icon: ClipboardList },
  { id: 'wechat', label: '联系微信', href: '/#wechat', Icon: MessageCircle },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === '/order' ? 'order' : 'home');

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    if (pathname === '/order') {
      setActive('order');
      return;
    }
    if (pathname !== '/') return;

    const sections = ['home', 'market', 'buyers', 'wechat']
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-32% 0px -56%', threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav
      aria-label="手机端快捷导航"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(28,43,31,0.08)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid h-[4.5rem] max-w-lg grid-cols-5">
        {navItems.map(({ id, label, href, Icon }) => {
          const selected = active === id;
          return (
            <Link
              key={id}
              href={href}
              aria-current={selected ? 'page' : undefined}
              onClick={() => setActive(id)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition active:bg-forest-50 ${
                selected ? 'text-forest-700' : 'text-stone-500'
              }`}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={selected ? 2.4 : 1.9} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
