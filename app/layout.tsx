import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: '菌鲜到｜昆明野生菌鲜选配送', description: '云南野生菌品质配送平台' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="zh-CN"><body>{children}</body></html>; }
