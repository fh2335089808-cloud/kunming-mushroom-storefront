import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';

export function generateStaticParams() { return products.map((product) => ({ id: product.id })); }
export const dynamicParams = false;
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = products.find((item) => item.id === id); if (!product) notFound();
  return <main className="container py-12"><Link href="/products" className="text-sm text-forest-500">返回鲜菌列表</Link><h1 className="mt-6 text-4xl font-serif">{product.name}</h1><p className="mt-3 text-stone-600">{product.description}</p><p className="mt-6 text-2xl font-semibold text-forest-700">¥{product.price} <span className="text-sm font-normal">{product.spec}</span></p></main>;
}
