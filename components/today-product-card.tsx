import Image from 'next/image';
import Link from 'next/link';
import type { TodayProduct } from '@/data/today-products';

const statusStyles: Record<TodayProduct['status'], string> = {
  今日到货: 'bg-forest-700 text-white',
  少量现货: 'bg-amber-100 text-forest-900',
  已售罄: 'bg-stone-200 text-stone-600',
  今日鲜货整理中: 'bg-[#eeeadd] text-stone-700',
};

export function TodayProductCard({ product }: { product: TodayProduct; compact?: boolean }) {
  const soldOut = product.status === '已售罄';

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <Link href={`/products/${product.id}`} className="group relative block aspect-square overflow-hidden bg-stone-100">
        <Image
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1024px) 33vw, 25vw"
          src={product.image}
          alt={`${product.name} 今日现货图片`}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[product.status]}`}>
          {product.status}
        </span>
      </Link>
      <div className="p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h2 className="truncate font-serif text-lg text-forest-900 sm:text-xl">{product.name}</h2>
          <div className="mt-2">
            <span className="font-semibold text-forest-700">{product.price}</span>
            <span className="ml-1 text-[11px] text-stone-500">/ {product.unit}</span>
          </div>
        </Link>
        {soldOut ? (
          <button type="button" disabled className="mt-3 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-3 py-2 text-xs font-semibold text-stone-500">
            已售罄
          </button>
        ) : (
          <Link href={product.registrationUrl} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest-700 px-3 py-2 text-xs font-semibold text-white">
            登记购买
          </Link>
        )}
      </div>
    </article>
  );
}