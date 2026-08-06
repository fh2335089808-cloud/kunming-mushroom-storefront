import Image from 'next/image';
import Link from 'next/link';
import type { TodayProduct } from '@/data/today-products';

const statusStyles: Record<TodayProduct['status'], string> = {
  '今日到货': 'bg-forest-700 text-white',
  '少量现货': 'bg-amber-100 text-forest-900',
  '已售罄': 'bg-stone-200 text-stone-600',
  '今日鲜货整理中': 'bg-[#eeeadd] text-stone-700',
};

export function TodayProductCard({ product, compact = false }: { product: TodayProduct; compact?: boolean }) {
  const soldOut = product.status === '已售罄';
  const preparing = product.status === '今日鲜货整理中';

  return (
    <article className={'overflow-hidden rounded-3xl bg-white shadow-soft ' + (compact ? 'sm:grid sm:grid-cols-[0.9fr_1.1fr]' : '')}>
      <Link href={'/products/' + product.id} aria-label={'查看' + product.name + '现货信息'} className="group relative block aspect-[16/10] overflow-hidden bg-stone-100 sm:aspect-auto sm:min-h-64">
        <Image fill sizes={compact ? '(max-width: 640px) 100vw, 42vw' : '(max-width: 768px) 100vw, 50vw'} src={product.image} alt={product.name + '现货图片'} className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        <span className={'absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold ' + statusStyles[product.status]}>{product.status}</span>
        {product.demo ? <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-stone-600">演示数据</span> : null}
      </Link>
      <div className="p-5 sm:p-6">
        <Link href={'/products/' + product.id} className="block">
          <h3 className="font-serif text-2xl text-forest-900">{product.name}</h3>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xl font-semibold text-forest-700">{product.price}</span>
            <span className="text-xs text-stone-500">/ {product.unit}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-600">{product.description}</p>
          <p className="mt-3 text-xs text-stone-400">更新时间：{product.updatedAt}</p>
        </Link>
        {soldOut ? (
          <button type="button" disabled className="mt-5 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-stone-200 px-5 py-3 text-sm font-semibold text-stone-500">已售罄</button>
        ) : preparing ? (
          <Link href="/#wechat" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-forest-500 px-5 py-3 text-sm font-semibold text-forest-700">先咨询微信</Link>
        ) : (
          <Link href={product.registrationUrl} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest-700 px-5 py-3 text-sm font-semibold text-white">立即登记</Link>
        )}
        <p className="mt-3 text-center text-xs text-stone-400">售完即止 · 价格以当日行情为准</p>
      </div>
    </article>
  );
}