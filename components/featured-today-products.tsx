import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { featuredTodayProducts } from '@/data/today-products';
import { TodayProductCard } from '@/components/today-product-card';

export function FeaturedTodayProducts() {
  return (
    <section aria-labelledby="featured-today-title" className="mt-6 rounded-[1.75rem] border border-white/15 bg-[#f7f4ec] p-4 text-forest-900 shadow-2xl sm:mt-8 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-forest-900">今日鲜货 · 每日更新</span>
          <h2 id="featured-today-title" className="mt-2 font-serif text-2xl sm:text-3xl">今日限量鲜货</h2>
        </div>
        <Link href="/products" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-forest-700">查看全部<ArrowRight size={16} /></Link>
      </div>
      {featuredTodayProducts.length > 0 ? (
        <TodayProductCard product={featuredTodayProducts[0]} compact />
      ) : (
        <div className="rounded-2xl bg-white px-5 py-8 text-center">
          <p className="font-serif text-xl">今日鲜货整理中</p>
          <p className="mt-2 text-sm text-stone-500">到货信息确认后更新，可先咨询微信。</p>
          <Link href="/#wechat" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-700">微信咨询</Link>
        </div>
      )}
    </section>
  );
}