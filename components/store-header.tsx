import Link from 'next/link';
import { ShoppingBag, Sprout } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-forest-100 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-forest-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-700 text-white"><Sprout size={20} /></span>
          {siteConfig.brandName}
        </Link>
        <nav className="hidden gap-7 text-sm font-medium md:flex" aria-label="桌面端导航">
          <Link href="/products">今日现货</Link>
          <Link href="/buyers">买家秀</Link>
          <Link href="/encyclopedia">菌百科</Link>
        </nav>
        <Link href={siteConfig.orderFormUrl} aria-label="前往登记购买" className="relative rounded-xl bg-forest-50 p-2 text-forest-700">
          <ShoppingBag size={20} />
          <i className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-clay" />
        </Link>
      </div>
    </header>
  );
}
