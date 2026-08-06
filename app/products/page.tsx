import type { Metadata } from 'next';
import Link from 'next/link';
import { StoreHeader } from '@/components/store-header';
import { TodayProductCard } from '@/components/today-product-card';
import { todayProducts } from '@/data/today-products';

export const metadata: Metadata = {
  title: '今日现货｜菌鲜到',
  description: '查看今日可登记的云南鲜菌、供应状态与更新时间。',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-[#f7f4ec]">
        <section className="container py-10 sm:py-16">
          <p className="text-xs font-semibold tracking-[.2em] text-forest-500">TODAY&apos;S FRESH STOCK</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-forest-900 sm:text-5xl">今日现货</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
                当日品种、价格和库存会随到货情况变化，请以页面更新时间及工作人员最终确认为准。
              </p>
            </div>
            <Link href="/order" className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white">登记购买</Link>
          </div>
          {todayProducts.some((product) => product.demo) ? (
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-stone-600">
              当前展示包含明确标注的演示配置，不代表正式价格或库存；请在数据配置中替换为当天已确认信息。
            </p>
          ) : null}
          {todayProducts.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {todayProducts.map((product) => <TodayProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl bg-white px-6 py-14 text-center shadow-soft">
              <h2 className="font-serif text-2xl text-forest-900">今日鲜货整理中</h2>
              <p className="mt-3 text-sm text-stone-500">到货信息确认后更新，可先咨询微信。</p>
              <Link href="/#wechat" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-700">微信咨询</Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
