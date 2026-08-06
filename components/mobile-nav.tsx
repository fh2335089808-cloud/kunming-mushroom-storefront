import Link from 'next/link';
import { siteConfig } from '@/config/site';

const links = [
  { href: '/', label: '首页' },
  { href: '/products', label: '今日现货' },
  { href: '/buyers', label: '买家秀' },
  { href: '/order', label: '登记购买' },
];

export function MobileNav() {
  return (
    <nav className="container relative z-40 flex items-center justify-between py-4 sm:py-6">
      <Link href="/" className="shrink-0 font-serif text-xl tracking-[.18em] sm:text-2xl">{siteConfig.brandName}</Link>
      <div className="hidden items-center gap-6 text-sm text-white/80 md:flex">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </div>
      <Link href="/order" className="hidden shrink-0 rounded-full border border-white/50 px-3.5 py-2 text-sm md:block">登记购买</Link>
    </nav>
  );
}
