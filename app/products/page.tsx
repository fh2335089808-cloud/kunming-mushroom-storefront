import type { Metadata } from 'next';
import { StoreHeader } from '@/components/store-header';
import { TodayProductCard } from '@/components/today-product-card';
import { todayProducts } from '@/data/today-products';

export const metadata: Metadata = {
  title: '今日现货｜菌鲜到',
  description: '查看云南当日鲜菌、价格、规格与供应状态。',
  alternates: { canonical: '/products' },
};

const shelfProducts = todayProducts.filter(
  (product) =>
    !product.demo &&
    product.status !== '今日鲜货整理中' &&
    !product.price.includes('待确认'),
);

export default function ProductsPage() {
  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-[#f7f4ec] pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">
        <section className="container py-7 sm:py-10">
          <p className="text-xs font-semibold tracking-[.18em] text-forest-500">云南当日鲜菌</p>
          <h1 className="mt-2 font-serif text-4xl text-forest-900 sm:text-5xl">今日现货</h1>
          <p className="mt-2 text-sm text-stone-500">价格与库存根据当天确认更新</p>

          {shelfProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {shelfProducts.map((product) => (
                <TodayProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl bg-white px-6 py-16 text-center shadow-soft">
              <h2 className="font-serif text-2xl text-forest-900">今日鲜菌正在整理</h2>
            </div>
          )}
        </section>
      </main>
    </>
  );
}