import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: '菌鲜到｜昆明野生菌鲜选配送',
    short_name: '菌鲜到',
    description: '查看昆明当日野生菌行情、买家实拍并登记购买。',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f4ec',
    theme_color: '#24452c',
    lang: 'zh-CN',
    categories: ['food', 'shopping', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
