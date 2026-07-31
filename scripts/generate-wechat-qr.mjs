import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'public', 'qrcode');
const assets = [
  { key: 'brand', url: 'https://www.kunming-mushroom.asia/?utm_source=wechat&utm_medium=qr&utm_campaign=brand', title: '菌鲜到', lines: ['云南野生菌 · 新鲜直达', '微信扫码了解当季菌子'], poster: 'brand-wechat-poster.png' },
  { key: 'order', url: 'https://www.kunming-mushroom.asia/order?src=wechat_qr&utm_source=wechat&utm_medium=qr&utm_campaign=direct_order', title: '云南野生菌订购登记', lines: ['微信扫码登记需求', '提交后由工作人员联系确认', '本页面不直接收款'], poster: 'order-wechat-poster.png' },
];
const qrOptions = { errorCorrectionLevel: 'H', margin: 4, width: 1200, color: { dark: '#1F3D2D', light: '#FFFFFFFF' } };
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function posterTextSvg(asset) {
  const secondary = asset.lines.map((line, index) => `<text x="540" y="${1140 + index * 64}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif" font-size="${index === asset.lines.length - 1 && asset.key === 'order' ? 34 : 40}" fill="${index === asset.lines.length - 1 && asset.key === 'order' ? '#7A6C58' : '#385443'}">${escapeXml(line)}</text>`).join('');
  return Buffer.from(`<svg width="1080" height="1440" viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg"><rect width="1080" height="1440" fill="#F5F0E5"/><circle cx="95" cy="90" r="44" fill="#294B38"/><path d="M80 96c22-4 39-20 43-43-24 5-40 20-43 43Z" fill="#D7C690"/><text x="540" y="180" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif" font-size="64" font-weight="700" fill="#1F3D2D">${escapeXml(asset.title)}</text><rect x="135" y="245" width="810" height="810" rx="36" fill="#FFFFFF"/>${secondary}<path d="M390 1360h300" stroke="#C8B889" stroke-width="3" stroke-linecap="round"/></svg>`);
}
await mkdir(outputDir, { recursive: true });
for (const asset of assets) {
  const pngPath = path.join(outputDir, `${asset.key}-wechat-qr.png`);
  const svgPath = path.join(outputDir, `${asset.key}-wechat-qr.svg`);
  await QRCode.toFile(pngPath, asset.url, { ...qrOptions, type: 'png' });
  await writeFile(svgPath, await QRCode.toString(asset.url, { ...qrOptions, type: 'svg' }), 'utf8');
  const posterQr = await sharp(pngPath).resize(720, 720, { fit: 'contain' }).png().toBuffer();
  await sharp(posterTextSvg(asset)).composite([{ input: posterQr, left: 180, top: 290 }]).png().toFile(path.join(outputDir, asset.poster));
}
console.log(`Generated ${assets.length * 3} assets in ${outputDir}`);