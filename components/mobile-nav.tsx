'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site';

const links = [
  { href: '#home', label: '首页' },
  { href: '#market', label: '今日行情' },
  { href: '#recipes', label: '鲜菌做法' },
  { href: '#story', label: '鲜菌故事' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="container relative z-40 flex items-center justify-between py-4 sm:py-6">
      <a href="#home" className="shrink-0 font-serif text-xl tracking-[.18em] sm:text-2xl">{siteConfig.brandName}</a>
      <div className="hidden items-center gap-6 text-sm text-white/80 md:flex">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </div>
      <button type="button" aria-label={open ? '关闭导航菜单' : '打开导航菜单'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-white/50 text-xl leading-none md:hidden">
        {open ? '✕' : '☰'}
      </button>
      <a href="#wechat" className="hidden shrink-0 rounded-full border border-white/50 px-3.5 py-2 text-sm md:block">微信咨询</a>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-4 top-[64px] z-50 overflow-hidden rounded-2xl border border-white/20 bg-[#203827]/95 p-2 shadow-2xl backdrop-blur md:hidden">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/10">{link.label}</a>)}
        </div>
      )}
    </nav>
  );
}
