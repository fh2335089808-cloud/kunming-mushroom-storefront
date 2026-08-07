import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { FlashSaleCountdown } from '@/components/flash-sale-countdown';
import { todayProducts } from '@/data/today-products';
import type { FlashSale } from '@/lib/feishu/flash-sales';

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(timestamp);

const comparableName = (value: string) =>
  value.replace(/（.*?）/g, '').replace(/\s+/g, '').trim();

export function FlashSaleSection({ sale }: { sale: FlashSale | null }) {
  const product = sale
    ? todayProducts.find(
        (item) => item.id === sale.productId || comparableName(item.name) === comparableName(sale.productName),
      )
    : undefined;
  const active = sale?.uiState === 'active';
  const stockLabel = sale?.stock === null
    ? sale.availability || '可售状态以当日活动为准'
    : sale
      ? `剩余库存：${sale.stock}`
      : '';
  const originalPrice = product && !product.demo ? product.price : '以当日行情为准';
  const hasConfirmedOriginalPrice = Boolean(product && !product.demo && product.price);

  return (
    <section className="bg-[#eeeadd]" aria-labelledby="daily-featured-title">
      <div className="container py-4 sm:py-6">
        <article className="rounded-3xl border border-amber-200/70 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white">每日精选</span>
            <span className="text-xs font-medium tracking-[.16em] text-amber-700">鲜菌特惠</span>
          </div>

          {sale ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 sm:aspect-square">
                <Image
                  fill
                  sizes="(max-width: 639px) 100vw, 11rem"
                  src={product?.image ?? '/images/mushrooms/yunnan-basket.webp'}
                  alt={`${sale.productName} 商品图片`}
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h2 id="daily-featured-title" className="font-serif text-2xl text-forest-900 sm:text-3xl">{sale.productName}</h2>
                <p className="mt-2 text-sm text-stone-500">鲜菌特惠价格以本次活动记录为准</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-sm text-stone-500">
                    原价：<span className={hasConfirmedOriginalPrice ? 'line-through' : ''}>{originalPrice}</span>
                  </p>
                  <p className="text-2xl font-semibold text-forest-700">特惠价：{sale.price}</p>
                </div>
                <p className="mt-3 text-xs text-stone-500">{stockLabel}</p>
                <p className="mt-1 text-xs text-stone-500">活动时间：{formatTime(sale.startAt)}—{formatTime(sale.endAt)}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-stone-500">
                  <Clock3 aria-hidden="true" size={14} />
                  <FlashSaleCountdown startAt={sale.startAt} endAt={sale.endAt} state={sale.uiState} />
                </p>
              </div>
              {active ? (
                <Link
                  href={sale.purchaseHref}
                  className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-1 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white sm:w-auto"
                >
                  立即登记购买 <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-6 py-3 text-sm font-semibold text-stone-500 sm:w-auto"
                >
                  {sale.buttonLabel}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-stone-50 px-5 py-6 sm:px-6">
              <h2 id="daily-featured-title" className="font-serif text-2xl text-forest-900">今日精选鲜菌准备中</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">新鲜菌品每日更新，敬请期待</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}