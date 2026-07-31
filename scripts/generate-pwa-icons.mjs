import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = await readFile(path.join(root, 'app', 'icon.svg'));
const outputDir = path.join(root, 'public', 'icons');
await mkdir(outputDir, { recursive: true });

for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(source)
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(outputDir, name));
}

const maskableMark = await sharp(source)
  .resize(360, 360)
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: '#24452c',
  },
})
  .composite([{ input: maskableMark, gravity: 'centre' }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(outputDir, 'icon-maskable-512.png'));

console.log('Generated PWA icons in public/icons');
