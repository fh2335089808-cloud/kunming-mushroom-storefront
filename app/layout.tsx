import './globals.css';
import type { Metadata, Viewport } from 'next';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { NetworkStatus } from '@/components/network-status';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kunming-mushroom.asia'),
  title: '菌鲜到｜昆明野生菌鲜选配送',
  description: '云南野生菌品质配送平台',
  applicationName: '菌鲜到',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '菌鲜到',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#24452c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <PwaRegister />
        <NetworkStatus />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
