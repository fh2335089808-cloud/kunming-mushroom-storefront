import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gift,
  Home,
  PackageCheck,
  ShoppingBasket,
  Sparkles,
  Truck,
} from 'lucide-react';
import { MobileNav } from '@/components/mobile-nav';
import { OrderFormLink } from '@/components/order-form-link';
import { WechatContactDialog } from '@/components/wechat-contact-dialog';
import { FlashSaleSection } from '@/components/flash-sale-section';
import { siteConfig, siteCopy } from '@/config/site';
import { buyerShowcases } from '@/data/buyer-showcases';
import { featuredTodayProducts } from '@/data/today-products';
import { getCurrentFlashSale } from '@/lib/feishu/flash-sales';

export const dynamic = 'force-dynamic';

const featuredProduct = featuredTodayProducts[0];
const buyerPreview = buyerShowcases[0];
const isFeaturedProductDemo = featuredProduct?.demo === true;

const choices = [
  {
    title: '尝鲜',
    text: '优先看看当季代表菌，从今天到货里选一款。',
    Icon: Sparkles,
  },
  {
    title: '家庭吃',
    text: '优先易处理、分量合适的品种，方便安排一餐。',
    Icon: Home,
  },
  {
    title: '送人',
    text: '优先确认品相和包装，再根据当天供应选择。',
    Icon: Gift,
  },
];

const deliverySteps = [
  { title: '当日选菌', text: '根据当天到货和品相筛选。', Icon: PackageCheck },
  { title: '分拣确认', text: '确认品种、规格与购买需求。', Icon: CheckCircle2 },
  { title: '约定送达', text: '昆明同城配送或按约定方式交付。', Icon: Truck },
];

export default async function HomePage() {
  const flashSale = await getCurrentFlashSale();
  return (
    <main className="overflow-x-hidden bg-[#f7f4ec]">
      <section id="home" className="relative min-h-[56svh] overflow-hidden bg-forest-900 text-white sm:min-h-[560px]">
        <Image
          priority
          fill
          sizes="100vw"
          src="/images/forest-hero.webp"
          alt="云南山野森林"
          className="object-cover object-[58%_center] opacity-55 sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-forest-900/20 to-forest-900" />
        <MobileNav />
        <div className="container relative flex min-h-[calc(56svh-4rem)] flex-col justify-center pb-8 pt-2 sm:min-h-[480px] sm:pb-12">
          <p className="text-xs font-semibold tracking-[.22em] text-amber-200">KUNMING · WILD MUSHROOMS</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[40px] leading-[1.12] tracking-tight sm:text-7xl sm:leading-[1.1]">
            云南野生菌
            <br />
            <span className="text-amber-100">每日鲜选 · 昆明到家</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:mt-5 sm:text-base">
            看当天到货，按真实品相和行情确认，再登记购买或微信咨询。
          </p>
          <div className="mt-3 max-w-2xl border-l border-amber-100/45 pl-3 text-xs leading-5 text-white/75 sm:text-sm">
            <p>{siteCopy.deliverySummary}</p>
            <p>{siteCopy.brandSummary}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <OrderFormLink baseUrl={siteConfig.orderFormUrl} />
            <WechatContactDialog className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-5 py-3 text-sm font-semibold">
              微信咨询
            </WechatContactDialog>
          </div>
        </div>
      </section>

      <FlashSaleSection sale={flashSale} />

      <section className="container py-8 sm:py-12">
        <p className="text-xs font-semibold tracking-[.2em] text-forest-500">QUICK CHOICES</p>
        <h2 className="mt-2 font-serif text-3xl text-forest-900 sm:text-4xl">快速入口</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-48 bg-stone-100">
                <Image
                  fill
                  sizes="(max-width: 640px) 100vw, 35vw"
                  src={featuredProduct?.image ?? '/images/mushrooms/jizong.webp'}
                  alt={featuredProduct?.name ?? '今日鲜货预览'}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-[.16em] text-forest-500">今日现货</p>
                <h3 className="mt-2 font-serif text-2xl text-forest-900">
                  {isFeaturedProductDemo ? '今日鲜货整理中' : featuredProduct?.name ?? '今日鲜货整理中'}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {isFeaturedProductDemo ? '当日到货信息正在确认，可先登记需求或咨询微信。' : featuredProduct?.description ?? '到货信息确认后更新，可先咨询微信。'}
                </p>
                <p className="mt-3 text-xs text-stone-500">
                  {isFeaturedProductDemo ? '价格与品相以当日确认结果为准' : `${featuredProduct?.status ?? '今日鲜货整理中'} · 价格以当日确认为准`}
                </p>
                <Link href="/products" className="mt-5 inline-flex min-h-11 items-center gap-1 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white">
                  进入今日现货 <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl bg-[#eef0e7] shadow-soft">
            <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-48 bg-stone-100">
                <Image fill sizes="(max-width: 640px) 100vw, 35vw" src={buyerPreview.image} alt={buyerPreview.alt} className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-[.16em] text-forest-500">买家秀</p>
                <h3 className="mt-2 font-serif text-2xl text-forest-900">真实街坊反馈</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">“{buyerPreview.comment}”</p>
                <p className="mt-3 text-xs text-stone-500">{buyerPreview.mushroomType} · 已授权买家实拍</p>
                <Link href="/buyers" className="mt-5 inline-flex min-h-11 items-center gap-1 rounded-full border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-700">
                  进入买家秀 <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-soft">
            <ShoppingBasket className="text-forest-600" size={24} />
            <h3 className="mt-4 font-serif text-2xl text-forest-900">登记购买</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">填写需求后，再确认当天品相、实际价格与配送方式。</p>
            <p className="mt-3 text-xs text-stone-500">现有登记提交链路保持不变</p>
            <Link href="/order" className="mt-5 inline-flex min-h-11 items-center gap-1 font-semibold text-forest-700">
              前往登记购买 <ArrowRight size={16} />
            </Link>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-soft">
            <BookOpen className="text-forest-600" size={24} />
            <h3 className="mt-4 font-serif text-2xl text-forest-900">菌百科</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">购买前先了解挑选、保存与充分加热等基础知识。</p>
            <p className="mt-3 text-xs text-stone-500">野生菌务必彻底加热后食用</p>
            <Link href="/encyclopedia" className="mt-5 inline-flex min-h-11 items-center gap-1 font-semibold text-forest-700">
              查看菌百科 <ArrowRight size={16} />
            </Link>
          </article>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-8 sm:py-12">
          <p className="text-xs font-semibold tracking-[.2em] text-forest-500">HOW TO CHOOSE</p>
          <h2 className="mt-2 font-serif text-3xl text-forest-900">今天怎么选</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {choices.map(({ title, text, Icon }) => (
              <Link key={title} href="/products" className="group rounded-2xl border border-forest-100 bg-[#f7f4ec] p-5 transition hover:border-forest-300">
                <Icon size={21} className="text-forest-600" />
                <h3 className="mt-3 font-serif text-xl text-forest-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
                  看今日选择 <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>



      <section className="container py-8 sm:py-12">
        <p className="text-xs font-semibold tracking-[.2em] text-forest-500">FROM MARKET TO YOU</p>
        <h2 className="mt-2 font-serif text-3xl text-forest-900">从采收到送达</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {deliverySteps.map(({ title, text, Icon }, index) => (
            <article key={title} className="relative rounded-2xl bg-[#eeeadd] p-5">
              <span className="text-xs font-semibold text-forest-500">0{index + 1}</span>
              <Icon className="mt-4 text-forest-700" size={22} />
              <h3 className="mt-3 font-serif text-xl text-forest-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eef0e7]">
        <div className="container py-8 sm:py-12">
          <div className="rounded-3xl bg-white p-6 shadow-soft sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <p className="text-xs font-semibold tracking-[.18em] text-forest-500">BEFORE ORDERING</p>
              <h2 className="mt-2 font-serif text-3xl text-forest-900">购买前说明</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                野生菌价格会随当天行情、品相和供应量变化，页面信息用于当日选择，最终价格以确认时为准。
              </p>
            </div>
            <Link href="/products" className="mt-5 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-700 sm:mt-0">
              查看今日行情 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="wechat" className="scroll-mt-20 bg-[#604833] text-white">
        <div className="container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
          <div>
            <p className="text-xs font-semibold tracking-[.18em] text-amber-200">WECHAT CONTACT</p>
            <h2 className="mt-2 font-serif text-3xl">需要确认当天品相？</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">打开微信二维码卡片，长按识别或复制微信号咨询。</p>
          </div>
          <WechatContactDialog className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-amber-100 px-6 py-3 text-sm font-semibold text-forest-900">
            联系微信
          </WechatContactDialog>
        </div>
      </section>

      <footer className="mobile-safe-footer bg-[#38281d] px-5 py-8 text-center text-xs leading-6 text-white/65">
        {siteConfig.brandName} · {siteConfig.businessAddress}
        <br />
        联系电话：
        <a className="underline underline-offset-2" href={'tel:' + siteConfig.contactPhoneHref}>
          {siteConfig.contactPhoneDisplay}
        </a>
        {' · '}微信：{siteConfig.wechatNumber}
        <br />© 2026 {siteConfig.brandName}
      </footer>
    </main>
  );
}
