import Image from 'next/image';
import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import { FlashSaleCountdown } from '@/components/flash-sale-countdown';
import { products } from '@/lib/data';
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
  value.replace(/新鲜|野生|（.*?）|\s+/g, '').trim();

const matchesSaleProduct = (saleName: string, productName: string) => {
  const normalizedSale = comparableName(saleName);
  const normalizedProduct = comparableName(productName);
  return normalizedSale.includes(normalizedProduct) || normalizedProduct.includes(normalizedSale);
};

const catalogOrderHref = (id: string, name: string) =>
  `/order?${new URLSearchParams({ src: 'daily-deal', productId: id, productName: name }).toString()}`;

export function FlashSaleSection({ sale }: { sale: FlashSale | null }) {
  const matchedProduct = sale
    ? products.find((product) => matchesSaleProduct(sale.productName, product.name))
    : undefined;
  const catalogProducts = products
    .filter((product) => product.id !== matchedProduct?.id)
    .slice(0, sale ? 3 : 4);
  const active = sale?.uiState === 'active';

  return (
    <section id="daily-deals" className="scroll-mt-16 bg-[#eeeadd]" aria-labelledby="daily-deals-title">
      <div className="container py-7 sm:py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[.18em] text-amber-700">鲜菌特惠</p>
            <h2 id="daily-deals-title" className="mt-1 font-serif text-3xl text-forest-900 sm:text-4xl">每日特惠</h2>
          </div>
          <Link href="/products" className="shrink-0 text-sm font-semibold text-forest-700">全部现货</Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {sale ? (
            <article className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  fill
                  sizes="(max-width: 639px) 50vw, 25vw"
                  src={matchedProduct?.image ?? '/images/mushrooms/yunnan-basket.webp'}
                  alt={`${sale.productName} 商品图片`}
                  className="object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-forest-700 px-2.5 py-1 text-[10px] font-semibold text-white">今日特惠</span>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="truncate font-serif text-lg text-forest-900 sm:text-xl">{sale.productName}</h3>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  {matchedProduct ? <span className="text-xs text-stone-400 line-through">原价 ¥{matchedProduct.price}</span> : null}
                  <span className="font-semibold text-forest-700">{sale.price}</span>
                </div>
                <p className="mt-2 text-[11px] text-stone-500">
                  {sale.stock === null ? '库存以当日确认为准' : `剩余 ${sale.stock}`}
                </p>
                <p className="mt-1 truncate text-[10px] text-stone-400">{formatTime(sale.startAt)}—{formatTime(sale.endAt)}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-forest-700">
                  <Clock3 aria-hidden="true" size={12} />
                  <FlashSaleCountdown startAt={sale.startAt} endAt={sale.endAt} state={sale.uiState} />
                </p>
                {active ? (
                  <Link href={sale.purchaseHref} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest-700 px-3 py-2 text-xs font-semibold text-white">
                    登记购买
                  </Link>
                ) : (
                  <button type="button" disabled className="mt-3 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-3 py-2 text-xs font-semibold text-stone-500">
                    {sale.buttonLabel}
                  </button>
                )}
              </div>
            </article>
          ) : null}

          {catalogProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image fill sizes="(max-width: 639px) 50vw, 25vw" src={product.image} alt={`${product.name} 商品图片`} className="object-cover" />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="truncate font-serif text-lg text-forest-900 sm:text-xl">{product.name}</h3>
                <p className="mt-2 font-semibold text-forest-700">¥{product.price}</p>
                <p className="mt-1 truncate text-[11px] text-stone-500">{product.spec}</p>
                <Link href={catalogOrderHref(product.id, product.name)} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-forest-500 px-3 py-2 text-xs font-semibold text-forest-700">
                  登记购买
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}