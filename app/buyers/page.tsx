import type { Metadata } from 'next';
import { BuyerGallery } from '@/components/buyer-gallery';
import { StoreHeader } from '@/components/store-header';

export const metadata: Metadata = {
  title: '买家秀｜菌鲜到',
  description: '查看已获授权的真实客户鲜菌反馈与图片。',
  alternates: { canonical: '/buyers' },
};

export default function BuyersPage() {
  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-[#eef0e7]">
        <BuyerGallery />
      </main>
    </>
  );
}