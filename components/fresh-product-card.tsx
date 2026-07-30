import Image from 'next/image';
import { siteConfig } from '@/config/site';

type Product = { name: string; origin: string; price: string; badge: string; image: string };

export function FreshProductCard({ product }: { product: Product }) {
  return <article className="group overflow-hidden rounded-2xl bg-white shadow-soft">
    <div className="relative h-40 overflow-hidden sm:h-48"><Image fill sizes="(max-width: 639px) 50vw, (max-width: 1024px) 45vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={`${product.name} 示意图`}/><span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-forest-700">{product.badge}</span></div>
    <div className="p-3 sm:p-4"><p className="truncate text-xs text-stone-400">{product.origin}</p><div className="mt-1"><h3 className="font-serif text-lg sm:text-xl">{product.name}</h3><p className="mt-1 font-bold text-forest-700">¥{product.price}<span className="text-[11px] font-normal">/500g</span></p></div><a href={siteConfig.orderFormUrl} className="mt-3 block w-full rounded-xl border border-forest-500 py-2 text-center text-xs font-medium text-forest-700 transition hover:bg-forest-500 hover:text-white sm:py-2.5 sm:text-sm">立即选购</a></div>
  </article>;
}

