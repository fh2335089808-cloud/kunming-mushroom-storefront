'use client';

import Image from 'next/image';
import { Check, Copy, QrCode, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export type FreshProduct = {
  name: string;
  source: string;
  feature: string;
  cook: string;
  price: string;
  image: string;
  availability: string;
};

const quantities = ['500g', '1kg', '2kg', '自定义'];
const deliveries = ['昆明同城配送', '到店自取', '外地寄送咨询'];
const areas = ['官渡区', '五华区', '盘龙区', '西山区', '呈贡区', '其他区域'];
const arrivals = ['今天', '明天', '预约日期'];

export function FreshProducts({ products }: { products: FreshProduct[] }) {
  const [product, setProduct] = useState<FreshProduct | null>(null);
  const [quantity, setQuantity] = useState('500g');
  const [customQuantity, setCustomQuantity] = useState('');
  const [delivery, setDelivery] = useState('昆明同城配送');
  const [area, setArea] = useState('官渡区');
  const [arrival, setArrival] = useState('今天');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const closeDialog = () => setProduct(null);

  useEffect(() => {
    if (!product) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeDialog(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [product]);

  const inquiry = useMemo(() => {
    if (!product) return '';
    const selectedQuantity = quantity === '自定义' ? customQuantity || '待确认' : quantity;
    const selectedArea = delivery === '昆明同城配送' ? `（${area}）` : '';
    const selectedArrival = arrival === '预约日期' ? date || '待确认' : arrival;
    return `【菌鲜到询价单】
商品：${product.name}
参考价格：${product.price}
供应状态：${product.availability}
数量：${selectedQuantity}
配送方式：${delivery}${selectedArea}
送达时间：${selectedArrival}
备注：${note || '无'}

请帮我确认当天品相、库存和实际价格，谢谢。`;
  }, [product, quantity, customQuantity, delivery, area, arrival, date, note]);

  const copyInquiry = async () => {
    try { await navigator.clipboard.writeText(inquiry); }
    catch {
      const textarea = document.createElement('textarea');
      textarea.value = inquiry;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  const openInquiry = (selectedProduct: FreshProduct) => {
    setProduct(selectedProduct);
    setCopied(false);
    setShowQr(false);
  };

  return (
    <>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {products.map((item) => (
          <article key={item.name} className="overflow-hidden rounded-2xl bg-white shadow-soft">
            <div className="relative h-64"><Image fill sizes="(max-width: 768px) 100vw, 33vw" src={item.image} alt={item.name} className="object-cover" /></div>
            <div className="p-5">
              <p className="text-xs text-forest-500">{item.source}</p>
              <h3 className="mt-2 font-serif text-2xl">{item.name}</h3>
              <p className="mt-4 text-sm text-stone-700">{item.feature}</p>
              <p className="mt-1 text-sm text-stone-500">{item.cook}</p>
              <p className="mt-5 min-h-12 text-sm font-semibold leading-6 text-forest-700">{item.price}</p>
              <p className="mt-1 text-xs text-stone-500">供应状态 · {item.availability}</p>
              <p className="mt-2 text-xs leading-5 text-stone-400">野生菌价格随天气、产量和当天市场情况变化，请以微信确认结果为准。</p>
              <button type="button" onClick={() => openInquiry(item)} className="mt-5 block min-h-12 w-full rounded-xl border border-forest-500 py-3 text-center text-sm font-medium text-forest-700">咨询当天库存</button>
            </div>
          </article>
        ))}
      </div>

      {product && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/45 p-0 sm:items-center sm:justify-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="inquiry-title" className="max-h-[88svh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-[#f7f4ec] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div><p className="text-xs font-semibold tracking-[.16em] text-forest-500">WECHAT INQUIRY</p><h2 id="inquiry-title" className="mt-2 font-serif text-2xl">咨询当天库存</h2><p className="mt-2 text-sm text-stone-600">{product.name} · {product.price} · {product.availability}</p></div>
              <button type="button" onClick={closeDialog} aria-label="关闭询价窗口" className="rounded-full p-2 text-stone-500 hover:bg-stone-200"><X size={20} /></button>
            </div>
            <div className="mt-6 grid gap-5 text-sm">
              <Field label="数量"><div className="flex flex-wrap gap-2">{quantities.map((item) => <Choice key={item} selected={quantity === item} onClick={() => setQuantity(item)}>{item}</Choice>)}</div>{quantity === '自定义' && <input aria-label="自定义数量" value={customQuantity} onChange={(event) => setCustomQuantity(event.target.value)} placeholder="例如：3kg" className="mt-3 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-base outline-none focus:border-forest-500" />}</Field>
              <Field label="配送方式"><div className="flex flex-wrap gap-2">{deliveries.map((item) => <Choice key={item} selected={delivery === item} onClick={() => setDelivery(item)}>{item}</Choice>)}</div>{delivery === '昆明同城配送' && <div className="mt-3 flex flex-wrap gap-2">{areas.map((item) => <Choice key={item} selected={area === item} onClick={() => setArea(item)}>{item}</Choice>)}</div>}</Field>
              <Field label="送达时间"><div className="flex flex-wrap gap-2">{arrivals.map((item) => <Choice key={item} selected={arrival === item} onClick={() => setArrival(item)}>{item}</Choice>)}</div>{arrival === '预约日期' && <input aria-label="预约日期" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-3 w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-base outline-none focus:border-forest-500" />}</Field>
              <Field label="备注（选填）"><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="例如：需要处理干净、是否可以今天送达" className="w-full resize-none rounded-xl border border-stone-300 bg-white px-3 py-3 text-base outline-none focus:border-forest-500" /></Field>
              <div aria-live="polite" className="whitespace-pre-line rounded-2xl bg-white p-4 text-sm leading-6 text-stone-600">{inquiry}</div>
              <button type="button" onClick={copyInquiry} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest-700 px-4 py-3 text-sm font-semibold text-white">{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? '已复制，请添加微信后粘贴发送' : '复制询价内容'}</button>
              <button type="button" onClick={() => setShowQr((visible) => !visible)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-forest-500 px-4 py-3 text-sm font-semibold text-forest-700"><QrCode size={18} />查看微信二维码</button>
              {showQr && <div className="rounded-2xl bg-white p-3 text-center"><Image src="/images/wechat-qr.png" alt="微信二维码" width={300} height={444} className="mx-auto h-auto w-[250px] max-w-full object-contain" /><p className="mt-2 text-xs text-stone-500">长按识别二维码，或保存图片后使用微信扫码添加。</p></div>}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 font-medium text-stone-800">{label}</p>{children}</div>;
}

function Choice({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={selected} className={`min-h-10 rounded-full border px-3 py-2 text-sm transition ${selected ? 'border-forest-700 bg-forest-700 text-white' : 'border-stone-300 bg-white text-stone-600'}`}>{children}</button>;
}

