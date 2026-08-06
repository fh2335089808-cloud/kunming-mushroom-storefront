import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { FlashSaleCountdown } from '@/components/flash-sale-countdown';
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

export function FlashSaleSection({ sale }: { sale: FlashSale | null }) {
  if (!sale) return null;

  const active = sale.uiState === 'active';
  const stockLabel = sale.stock === null
    ? sale.availability || '可售状态以当日活动为准'
    : `剩余可抢：${sale.stock}`;

  return (
    <section className="bg-[#eeeadd]">
      <div className="container py-4 sm:py-6">
        <article className="rounded-3xl border border-amber-200/70 bg-white p-5 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white">限时抢购</span>
              <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                <Clock3 aria-hidden="true" size={14} />
                <FlashSaleCountdown startAt={sale.startAt} endAt={sale.endAt} state={sale.uiState} />
              </span>
            </div>
            <h2 className="mt-3 font-serif text-2xl text-forest-900 sm:text-3xl">{sale.productName}</h2>
            <p className="mt-2 text-sm text-stone-500">活动价以本次飞书活动记录为准</p>
            <p className="mt-1 text-2xl font-semibold text-forest-700">{sale.price}</p>
            <p className="mt-2 text-xs text-stone-500">{stockLabel} · {formatTime(sale.startAt)}—{formatTime(sale.endAt)}</p>
          </div>
          {active ? (
            <Link
              href={sale.purchaseHref}
              className="mt-4 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-1 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white sm:mt-0 sm:w-auto"
            >
              {sale.buttonLabel} <ArrowRight aria-hidden="true" size={16} />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-6 py-3 text-sm font-semibold text-stone-500 sm:mt-0 sm:w-auto"
            >
              {sale.buttonLabel}
            </button>
          )}
        </article>
      </div>
    </section>
  );
}