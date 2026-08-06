'use client';

import Image from 'next/image';
import { useState } from 'react';
import { buyerShowcases } from '@/data/buyer-showcases';

export function BuyerGallery() {
  const [expanded, setExpanded] = useState(false);
  const visibleStories = expanded ? buyerShowcases : buyerShowcases.slice(0, 3);

  return (
    <section id="buyers" className="bg-[#eef0e7]">
      <div className="container py-16 sm:py-24">
        <p className="text-xs font-semibold tracking-[.2em] text-forest-500">CUSTOMER MOMENTS</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">买家秀 · 鲜味到家</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">看看街坊们收到鲜菌后的真实分享，再决定今天想吃哪一种。</p>
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0">
          {visibleStories.map((story) => (
            <article key={story.id} className="w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-soft sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <Image src={story.image} alt={story.alt} fill sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-forest-700">{story.badge}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="font-medium text-stone-800">{story.customerName}</h3><span className="rounded-full bg-forest-50 px-2.5 py-1 text-xs text-forest-700">{story.mushroomType}</span></div>
                <p className="mt-3 text-sm leading-6 text-stone-600">“{story.comment}”</p>
              </div>
            </article>
          ))}
          {expanded ? (
            <article className="w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white p-5 text-center shadow-soft sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] lg:max-w-none">
              <h3 className="font-serif text-2xl text-stone-800">进群看今日鲜菌</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">每日更新到货品种、真实品相和当天价格</p>
              <Image
                src="/images/wechat-group-qr.jpg"
                alt="魅力之城野生菌预购群微信群二维码"
                width={590}
                height={992}
                loading="lazy"
                className="mx-auto mt-5 h-auto w-[200px] max-w-full"
              />
              <p className="mt-4 text-sm font-medium text-forest-700">长按识别二维码加入群聊</p>
              <p className="mt-2 text-xs leading-5 text-stone-500">群满或二维码失效，可添加微信咨询入群</p>
            </article>
          ) : null}
        </div>
        <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-700">
          {expanded ? '收起买家秀' : '查看更多买家秀'}
        </button>
        <p className="mt-2 text-xs leading-5 text-stone-500">群内持续更新到货实拍、当天品种与价格</p>
      </div>
    </section>
  );
}
