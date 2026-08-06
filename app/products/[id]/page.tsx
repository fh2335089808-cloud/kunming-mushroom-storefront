import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StoreHeader } from '@/components/store-header';
import { todayProducts } from '@/data/today-products';
import { getActiveFlashSaleForProduct } from '@/lib/feishu/flash-sales';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return todayProducts.map((product) => ({ id: product.id }));
}

export const dynamicParams = false;

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = todayProducts.find((item) => item.id === id);
  if (!product) notFound();
  const flashSale = await getActiveFlashSaleForProduct(product.id, product.name);

  const soldOut = product.status === '已售罄';
  const preparing = product.status === '今日鲜货整理中';

  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-[#f7f4ec]">
        <div className="container py-8 sm:py-14">
          <Link href="/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-700">← 返回今日现货</Link>
          <article className="mt-4 overflow-hidden rounded-3xl bg-white shadow-soft md:grid md:grid-cols-2">
            <div className="relative aspect-[4/3] min-h-72 overflow-hidden bg-stone-100 md:aspect-auto">
              <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={product.image} alt={product.name + '现货图片'} className="object-cover" priority />
            </div>
            <div className="p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-700">{product.status}</span>
                {product.demo ? <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-stone-600">演示数据</span> : null}
              </div>
              <h1 className="mt-5 font-serif text-4xl text-forest-900">{product.name}</h1>
              {flashSale ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold tracking-[.14em] text-forest-500">限时活动价</p>
                  <p className="mt-1 text-2xl font-semibold text-forest-700">{flashSale.price}</p>
                </div>
              ) : (
                <p className="mt-5 text-2xl font-semibold text-forest-700">{product.price}<span className="ml-2 text-sm font-normal text-stone-500">/ {product.unit}</span></p>
              )}
              <p className="mt-5 text-sm leading-7 text-stone-600">{product.description}</p>
              <p className="mt-4 text-xs text-stone-400">更新时间：{product.updatedAt}</p>
              {flashSale ? (
                <Link href={flashSale.purchaseHref} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white">立即抢购</Link>
              ) : soldOut ? (
                <button type="button" disabled className="mt-7 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-6 py-3 text-sm font-semibold text-stone-500">已售罄</button>
              ) : preparing ? (
                <Link href="/#wechat" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-forest-500 px-6 py-3 text-sm font-semibold text-forest-700">先咨询微信</Link>
              ) : (
                <Link href={product.registrationUrl} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white">立即登记购买</Link>
              )}
              <p className="mt-3 text-center text-xs text-stone-400">售完即止 · 价格以当日行情为准</p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}