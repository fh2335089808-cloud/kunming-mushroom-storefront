import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jsQR from 'jsqr';
import sharp from 'sharp';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'public', 'qrcode');
const expected = {
  'brand-wechat-qr.png': 'https://www.kunming-mushroom.asia/?utm_source=wechat&utm_medium=qr&utm_campaign=brand',
  'brand-wechat-qr.svg': 'https://www.kunming-mushroom.asia/?utm_source=wechat&utm_medium=qr&utm_campaign=brand',
  'order-wechat-qr.png': 'https://order.kunming-mushroom.asia/?source=official&utm_source=wechat&utm_medium=qr&utm_campaign=direct_order',
  'order-wechat-qr.svg': 'https://order.kunming-mushroom.asia/?source=official&utm_source=wechat&utm_medium=qr&utm_campaign=direct_order',
};
for (const [filename, expectedUrl] of Object.entries(expected)) {
  const { data, info } = await sharp(path.join(outputDir, filename)).resize(1200, 1200, { fit: 'contain', background: '#FFFFFF' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const result = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  if (!result) throw new Error(`${filename}: QR code could not be decoded`);
  if (result.data !== expectedUrl) throw new Error(`${filename}: decoded URL does not match expected URL`);
  console.log(`${filename}\t${result.data}`);
}