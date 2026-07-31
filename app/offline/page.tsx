import type { Metadata } from 'next';
import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export const metadata: Metadata = {
  title: '暂时无法连接｜菌鲜到',
  description: '网络恢复后可继续查看今日鲜菌并登记购买。',
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-[80svh] place-items-center bg-[#f7f4ec] px-6 py-16">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-50 text-forest-700">
          <WifiOff aria-hidden="true" size={28} />
        </span>
        <h1 className="mt-6 font-serif text-3xl text-forest-900">暂时无法连接网络</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          已缓存的页面仍可继续浏览。订单登记需要联网提交，请检查网络后重试。
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            重新连接
          </Link>
          <Link
            href="/#wechat"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest-500 px-5 py-2.5 text-sm font-semibold text-forest-700"
          >
            联系微信
          </Link>
        </div>
      </section>
    </main>
  );
}
