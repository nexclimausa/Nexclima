// Optimiza las imágenes de img-src/ y el logo en public/img/ (WebP en varios anchos).
// Uso: node src/images.mjs
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/img');
mkdirSync(outDir, { recursive: true });

const jobs = [
  ['hero', [640, 1024, 1376]],
  ['svc-ac', [480, 800, 1200]],
  ['svc-heating', [480, 800, 1200]],
  ['svc-maintenance', [480, 800, 1200]],
  ['svc-replacement', [480, 800, 1200]],
  ['about', [640, 1024]],
];
const src = (n) => ['jpeg', 'jpg', 'png'].map((e) => join(root, 'img-src', `${n}.${e}`)).find(existsSync);

for (const [name, widths] of jobs) {
  const file = src(name === 'hero' ? 'hero-test' : name);
  if (!file) { console.log(`falta ${name}`); continue; }
  for (const w of widths) {
    const out = join(outDir, `${name}-${w}.webp`);
    const info = await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1200 ? 62 : 68, effort: 6 }).toFile(out);
    console.log(`${name}-${w}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}

// Logo: recorta márgenes transparentes y exporta a 2x de su altura en cabecera.
const logo = join(root, 'Nexclima_logo_800x600.png');
if (existsSync(logo)) {
  const trimmed = await sharp(logo).trim().toBuffer();
  for (const h of [48, 96]) {
    const info = await sharp(trimmed).resize({ height: h }).webp({ quality: 90, alphaQuality: 100 }).toFile(join(outDir, `logo-${h}.webp`));
    console.log(`logo-${h}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
  const fav = await sharp(trimmed).extract({ left: 0, top: 0, width: (await sharp(trimmed).metadata()).height, height: (await sharp(trimmed).metadata()).height }).resize(64, 64).png().toFile(join(root, 'public/favicon.png'));
  console.log(`favicon.png ${fav.width}x${fav.height}`);
}
