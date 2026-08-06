import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sprout } from 'lucide-react';
import { OrderForm } from '@/components/order-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '登记购买｜菌鲜到',
  description: '登记云南野生菌购买需求，工作人员将联系确认当天品相、价格与配送。',
  alternates: { canonical: '/order' },
};

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ec]">
      <header className="sticky top-0 z-30 border-b border-forest-100 bg-white/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-forest-900">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-700 text-white">
              <Sprout aria-hidden="true" size={20} />
            </span>
            <span className="truncate">{siteConfig.brandName}</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700">
            <ArrowLeft aria-hidden="true" size={17} />
            返回首页
          </Link>
        </div>
      </header>

      <div className="container grid gap-8 py-10 sm:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <section className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-forest-500">ORDER REQUEST</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">
            云南野生菌
            <br />
            登记购买
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-stone-600">
            填写购买需求后，工作人员会联系您确认当天鲜菌品相、实际价格、配送费用和送达时间。
          </p>
          <div className="mt-7 rounded-2xl border border-forest-100 bg-forest-50 p-5 text-sm leading-7 text-forest-900">
            <p>配送范围：{siteConfig.deliveryArea}</p>
            <p>满 {siteConfig.minOrderAmount} 元起送 · {siteConfig.deliverySpeed}</p>
            <p className="mt-2 text-xs text-forest-700">登记提交成功前请勿关闭页面或重复点击提交。</p>
          </div>
        </section>
        <OrderForm />
      </div>

      <footer className="bg-[#38281d] px-5 py-8 text-center text-xs leading-6 text-white/65">
        {siteConfig.brandName} · 联系电话：
        <a className="underline underline-offset-2" href={`tel:${siteConfig.contactPhoneHref}`}>
          {siteConfig.contactPhoneDisplay}
        </a>
        {' · '}微信：{siteConfig.wechatNumber}
      </footer>
    </main>
  );
}
