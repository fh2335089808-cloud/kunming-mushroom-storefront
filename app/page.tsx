import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FlashSaleSection } from '@/components/flash-sale-section';
import { MobileNav } from '@/components/mobile-nav';
import { getCurrentFlashSale } from '@/lib/feishu/flash-sales';

export const dynamic = 'force-dynamic';

const scenes = [
  { title: '云南山野', image: '/images/forest-hero.webp', alt: '云南野生菌生长山林' },
  { title: '当日分拣', image: '/images/mushrooms/yunnan-basket.webp', alt: '云南鲜菌分拣篮' },
  { title: '新鲜菌品', image: '/images/mushrooms/jizong.webp', alt: '新鲜野生菌' },
];

export default async function HomePage() {
  const flashSale = await getCurrentFlashSale();

  return (
    <main className="overflow-x-hidden bg-[#f7f4ec] pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <section id="home" className="relative min-h-[46svh] overflow-hidden bg-forest-900 text-white sm:min-h-[500px]">
        <Image
          priority
          fill
          sizes="100vw"
          src="/images/forest-hero.webp"
          alt="云南野生菌山林"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-forest-900/15 to-forest-950/85" />
        <MobileNav />
        <div className="container relative flex min-h-[calc(46svh-4rem)] flex-col justify-end pb-8 sm:min-h-[420px] sm:pb-12">
          <p className="text-sm font-semibold tracking-[.28em] text-amber-100">菌鲜到</p>
          <h1 className="mt-2 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">昆明野生菌鲜采配送</h1>
          <Link
            href="#daily-deals"
            className="mt-5 inline-flex min-h-12 w-fit items-center gap-1 rounded-full bg-amber-100 px-6 py-3 text-sm font-semibold text-forest-900"
          >
            查看每日特惠 <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <FlashSaleSection sale={flashSale} />

      <section className="container py-7 sm:py-10" aria-labelledby="real-scenes-title">
        <div className="flex items-end justify-between">
          <h2 id="real-scenes-title" className="font-serif text-2xl text-forest-900 sm:text-3xl">从山野到餐桌</h2>
          <span className="text-xs text-stone-500">真实鲜菌日常</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
          {scenes.map((scene) => (
            <figure key={scene.title} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100 sm:aspect-[4/3]">
              <Image fill sizes="(max-width: 640px) 33vw, 30vw" src={scene.image} alt={scene.alt} className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2.5 pt-8 sm:px-4 sm:pb-4">
                <figcaption className="text-xs font-semibold text-white sm:text-base">{scene.title}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}