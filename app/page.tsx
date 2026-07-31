import Image from 'next/image';
import { ArrowRight, MapPin, PackageCheck, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';
import { FreshProducts } from '@/components/fresh-products';
import { OrderFormLink } from '@/components/order-form-link';
import { MobileNav } from '@/components/mobile-nav';
import { BuyerGallery } from '@/components/buyer-gallery';
import { siteConfig, siteCopy } from '@/config/site';

const ORDER_FORM_URL = siteConfig.orderFormUrl;

const products = [
  { name: '鸡枞菌', source: '云南当季鲜选', feature: '菌香浓郁，口感鲜嫩', cook: '适合清炒、煲汤、炖鸡', price: '今日参考价：¥168 / 500g（以当天到货为准）', image: '/images/mushrooms/jizong.webp', availability: '少量到货' },
  { name: '青头菌', source: '昆明木水花市场鲜选', feature: '肉质紧实，清甜回甘', cook: '适合清炒、蒸蛋、煮汤', price: '今日到货后现价，预计 ¥88–¥128 / 500g', image: '/images/mushrooms/greenhead.webp', availability: '供应充足' },
  { name: '松茸', source: '香格里拉高山到货', feature: '香气清冽，风味细腻', cook: '适合黄油煎、炖汤、蒸饭', price: '今日参考价：¥399 / 500g（以当天到货为准）', image: '/images/mushrooms/matsutake.webp', availability: '需要预订' },
  { name: '牛肝菌', source: '云南菌市当日鲜选', feature: '菌肉厚实，香气醇厚', cook: '适合爆炒、炒饭、意面', price: '今日到货后现价，预计 ¥108–¥148 / 500g', image: '/images/mushrooms/porcini.webp', availability: '随市场更新' },
];

const trust = [
  { title: '云南产区鲜选', text: '根据菌季和当天状态进行筛选', mobileText: '根据菌季和当天状态筛选', href: '#fresh', Icon: Sprout },
  { title: '每日市场更新', text: '价格、品种和库存随市场变化', mobileText: '价格、品种和库存随市场变化', href: '#market', Icon: PackageCheck },
  { title: '昆明同城配送', text: '具体配送范围和时效微信确认', mobileText: '具体配送范围与时效请咨询', href: ORDER_FORM_URL, Icon: MapPin },
];
const mobileTrust = [trust[1], trust[2], trust[0]];
const gallery = [['松茸', '/images/mushrooms/matsutake.webp'], ['牛肝菌', '/images/mushrooms/porcini.webp'], ['鸡枞菌', '/images/mushrooms/jizong.webp'], ['鸡油菌', '/images/mushrooms/chanterelle.webp'], ['大红菌', '/images/mushrooms/red-mushroom.webp'], ['青头菌', '/images/mushrooms/greenhead.webp'], ['干巴菌', '/images/mushrooms/termite-mushroom.webp'], ['竹荪', '/images/mushrooms/bamboo-fungus.webp']];
const recipes = [
  { name: '鲜菌海味小炒', note: '鲜菌搭配时蔬与虾仁，旺火快炒，保留山野清鲜。', image: '/images/mushrooms/seafood-mushroom.webp' },
  { name: '山野菌焖锅', note: '多种鲜菌慢火焖香，适合与家人分享的一餐。', image: '/images/mushrooms/mushroom-pot.webp' },
];

function ServiceLink({ children, className, href }: { children: ReactNode; className: string; href: string }) {
  return href === ORDER_FORM_URL
    ? <OrderFormLink baseUrl={ORDER_FORM_URL} className={className}>{children}</OrderFormLink>
    : <a href={href} className={className}>{children}</a>;
}

export default function Home() {
  return <main className="overflow-x-hidden bg-[#f7f4ec]">
    <section id="home" className="relative min-h-[68svh] overflow-hidden bg-forest-900 text-white sm:min-h-[720px]">
      <Image priority fetchPriority="high" decoding="sync" fill sizes="100vw" src="/images/forest-hero.webp" alt="云南山野森林" className="object-cover object-[58%_center] opacity-55 sm:object-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-forest-900/15 to-forest-900" />
      <MobileNav />
      <div className="container relative pb-5 pt-7 sm:pb-10 sm:pt-24">
        <p className="hidden text-xs font-semibold tracking-[.24em] text-amber-200 sm:block">KUNMING · WILD MUSHROOMS</p>
        <h1 className="mt-3 max-w-[390px] font-serif text-[40px] leading-[1.12] tracking-tight sm:mt-4 sm:max-w-3xl sm:text-7xl sm:leading-[1.15]">
          云南野生菌<br />
          <span className="text-amber-100">
            <span className="sm:hidden">
              <span className="min-[420px]:hidden">每日鲜选<br />昆明直送</span>
              <span className="hidden min-[420px]:inline">每日鲜选·昆明直送</span>
            </span>
            <span className="hidden sm:inline">每日鲜选 · 昆明直送</span>
          </span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:mt-7 sm:leading-8">深入云南菌市，精选当季新鲜野生菌。<br className="hidden sm:block" />每日更新上市品种、菌价和库存，让山野鲜味更快到达餐桌。</p>
        <div className="mt-4 max-w-2xl space-y-1.5 border-l border-amber-100/45 pl-3 text-xs leading-5 text-white/75 sm:text-sm"><p>{siteCopy.deliverySummary}</p><p>{siteCopy.brandSummary}</p></div>
        <div id="hero-actions" className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7"><OrderFormLink baseUrl={ORDER_FORM_URL} /><a href="#wechat" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-5 py-3 text-sm">微信咨询</a><a href="#market" className="hidden min-h-11 items-center px-2 text-sm text-white/80 underline decoration-white/35 underline-offset-4 sm:inline-flex">查看今日鲜菌</a></div>
      </div>
    </section>

    <section className="bg-white md:relative md:-mt-8 md:bg-transparent">
      <div className="container divide-y divide-forest-100 py-3 md:hidden">
        {mobileTrust.map(({ title, mobileText, Icon, href }) => (
          <ServiceLink key={title} href={href} className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors active:bg-forest-50">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-600"><Icon size={17} /></span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-forest-900">{title}</h2>
              <p className="mt-0.5 text-xs leading-5 text-stone-500">{mobileText}</p>
            </div>
            <ArrowRight aria-hidden="true" size={16} className="ml-auto shrink-0 text-stone-300 transition-transform group-hover:translate-x-0.5 group-active:translate-x-1" />
          </ServiceLink>
        ))}
      </div>
      <div className="container hidden grid-cols-3 gap-3 px-6 pb-2 md:grid">
        {trust.map(({ title, text, Icon, href }) => <ServiceLink key={title} href={href} className="group block rounded-2xl bg-white p-5 shadow-soft transition duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.99]"><div className="mb-3 flex items-center justify-between text-forest-500"><Icon size={21} /><ArrowRight aria-hidden="true" size={18} className="text-stone-300 transition-transform group-hover:translate-x-1" /></div><h2 className="font-serif text-xl">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-500">{text}</p></ServiceLink>)}
      </div>
    </section>

    <section id="market" className="container scroll-mt-20 pb-16 pt-8 sm:py-24"><p className="text-xs font-semibold tracking-[.2em] text-forest-500">TODAY&apos;S MARKET UPDATE</p><h2 className="mt-3 font-serif text-3xl sm:text-4xl">今日菌市行情</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500">每日从菌市带回当季鲜味。野生菌价格和供应量随天气与到货变化，以下为当天参考，具体品相、规格和库存请在询价时确认。</p><div id="fresh" className="scroll-mt-20"><FreshProducts products={products} /></div></section>

    <BuyerGallery />

    <aside className="bg-[#eeeadd]"><div className="container py-7 text-xs leading-6 text-stone-600 sm:py-8 sm:text-sm"><p className="font-semibold text-stone-700">温馨提示：</p><ul className="mt-2 space-y-1"><li>· 野生菌请务必彻底加热后食用</li><li>· 首次食用建议少量试吃，观察无不适后再正常食用</li><li>· 食用期间及以后一段时间请避免饮酒</li><li>· 如有特殊体质或过敏史，食用前请咨询清楚品种再决定</li></ul></div></aside>

    <section id="wechat" className="bg-[#604833] text-white"><div className="container grid gap-9 py-16 sm:py-24 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-semibold tracking-[.2em] text-amber-200">WECHAT CONTACT</p><h2 className="mt-3 font-serif text-4xl">加入云南鲜菌微信</h2><p className="mt-5 max-w-lg text-sm leading-7 text-white/80">每天分享当季鲜菌、市场变化和到货情况。</p><ul className="mt-6 grid gap-2 text-sm text-white/85 sm:grid-cols-2"><li>· 今日菌价更新</li><li>· 当季新品提醒</li><li>· 少量鲜菌预订</li><li>· 昆明配送咨询</li><li>· 野生菌食用建议</li></ul><p className="mt-7 text-xs leading-6 text-amber-100/80">长按识别二维码，或保存图片后使用微信扫码添加。</p></div><div className="justify-self-center rounded-2xl bg-white p-3 shadow-soft"><Image src="/images/wechat-qr.png" alt="微信二维码：希西" width={300} height={444} loading="lazy" className="h-auto w-[260px] max-w-[70vw] object-contain sm:w-[300px]" /></div></div></section>

    <section id="recipes" className="container py-16 sm:py-24"><p className="text-xs font-semibold tracking-[.2em] text-forest-500">MOUNTAIN TO TABLE</p><h2 className="mt-3 font-serif text-3xl sm:text-4xl">山野上桌 · 熟食做法</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">野生菌务必彻底加热后食用。以下是适合在家复刻的鲜菌搭配灵感。</p><div className="mt-8 grid gap-5 md:grid-cols-2">{recipes.map((recipe) => <article key={recipe.name} className="overflow-hidden rounded-2xl bg-[#e8e7d8] shadow-soft sm:grid sm:grid-cols-2"><div className="relative aspect-[4/5] sm:aspect-auto"><Image fill sizes="(max-width:768px) 100vw, 50vw" src={recipe.image} alt={recipe.name} className="object-cover" /></div><div className="flex flex-col justify-end p-6"><p className="text-xs font-semibold tracking-[.16em] text-forest-500">FRESH MUSHROOM RECIPE</p><h3 className="mt-3 font-serif text-2xl">{recipe.name}</h3><p className="mt-4 text-sm leading-7 text-stone-600">{recipe.note}</p><a href="#wechat" className="mt-6 text-sm font-semibold text-forest-700">微信咨询当日鲜菌搭配 →</a></div></article>)}</div></section>

    <section id="gallery" className="bg-[#eef0e7]"><div className="container py-16 sm:py-24"><p className="text-xs font-semibold tracking-[.2em] text-forest-500">MUSHROOM GALLERY</p><h2 className="mt-3 font-serif text-3xl sm:text-4xl">这一季，山野送来的颜色</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">每一种菌子都有自己的菌季与状态。以下为实拍鲜菌，具体到货请微信咨询。</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{gallery.map(([name, image]) => <figure key={name} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-forest-900"><Image fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" src={image} alt={`${name} 实拍`} className="object-cover transition duration-500 group-hover:scale-105" /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 font-serif text-lg text-white">{name}</figcaption></figure>)}</div></div></section>

    <section id="story" className="container py-16 sm:py-24"><div className="grid gap-9 md:grid-cols-2 md:items-center"><div><p className="text-xs font-semibold tracking-[.2em] text-forest-500">FROM MARKET TO TABLE</p><h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">一颗菌子的鲜味旅程</h2><p className="mt-6 text-sm leading-7 text-stone-600">云南的野生菌随着天气、海拔和菌季不断变化。</p><p className="mt-4 text-sm leading-7 text-stone-600">我们根据当天到货情况，查看菌子的完整度、新鲜度和品相，再选择适合家庭餐桌和餐饮使用的菌子。</p><p className="mt-4 text-sm leading-7 text-stone-600">这里不追求长期库存，而是跟随菌季，把当天状态更好的鲜菌分享给真正喜欢云南味道的人。</p></div><div className="grid grid-cols-2 gap-3"><div className="relative col-span-2 h-52 overflow-hidden rounded-2xl"><Image fill sizes="(max-width:768px) 100vw, 50vw" src="/images/forest-hero.webp" alt="云南山林" className="object-cover" /></div><div className="rounded-2xl bg-[#e8e7d8] p-5 text-sm text-forest-700">云南山林<br /><span className="text-xs text-stone-500">随菌季而来</span></div><div className="rounded-2xl bg-forest-900 p-5 text-sm text-white">市场鲜选<br /><span className="text-xs text-white/65">查看品相与状态</span></div></div></div></section>

    <footer className="mobile-safe-footer bg-[#38281d] px-5 py-8 text-center text-xs leading-6 text-white/65">云南野生菌鲜选<br />昆明同城配送范围和当天库存请通过微信咨询<br />{siteConfig.brandName} · 联系电话：<a className="underline underline-offset-2" href={`tel:${siteConfig.contactPhoneHref}`}>{siteConfig.contactPhoneDisplay}</a> · 微信：{siteConfig.wechatNumber} · 经营地址：{siteConfig.businessAddress}<br />© 2026 {siteConfig.brandName}</footer>
  </main>;
}
