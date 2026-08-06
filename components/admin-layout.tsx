import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8f5]">
      <aside className="fixed hidden h-full w-60 bg-forest-900 p-6 text-white md:block">
        <Link href="/admin" className="text-xl font-bold">菌鲜到 · 管理台</Link>
        <nav className="mt-10 space-y-2 text-sm text-forest-100">
          <Link className="block rounded-lg bg-white/10 px-3 py-2" href="/admin">经营概览</Link>
          <Link className="block px-3 py-2" href="/admin/products">商品管理</Link>
          <Link className="block px-3 py-2" href="/admin/market">行情管理</Link>
          <Link className="block px-3 py-2" href="/admin/customers">客户 CRM</Link>
        </nav>
      </aside>
      <main className="p-6 md:ml-60 md:p-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">昆明 · 2026年07月13日</p>
            <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-forest-100 font-bold text-forest-700">管</div>
        </header>
        {children}
      </main>
    </div>
  );
}