// Optimiza las imágenes de img-src/ y el logo en public/img/ (WebP en varios anchos).
// Uso: node src/images.mjs
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/img');
mkdirSync(outDir, { recursive: true });

// [nombre de salida (descriptivo, ayuda al SEO), archivo original en img-src/, anchos]
const jobs = [
  ['hvac-technician-ac-repair-middle-tennessee', 'hvac-technician-ac-repair-middle-tennessee.png', [640, 1024, 1376]],
  ['nexclima-hvac-technician-la-vergne-tn', 'nexclima-hvac-technician-la-vergne-tn.webp', [640, 1024, 1376]],
  ['hvac-service-visit-homeowner-tennessee', 'hvac-service-visit-homeowner-tennessee.webp', [640, 1024, 1376]],
  ['nashville-tn-skyline', 'nashville-tn-skyline.webp', [640, 1024, 1376]],
  // Servicios: también se usan en tarjetas 4:3, así que llevan recorte propio («card»).
  ['central-air-conditioning-home-cooling', 'central-air-conditioning-home-cooling.webp', [640, 1024, 1376], 'card'],
  ['furnace-heating-repair-technician', 'furnace-heating-repair-technician.jpeg', [480, 800, 1200], 'card'],
  ['hvac-tune-up-air-filter-change', 'hvac-tune-up-air-filter-change.webp', [640, 1024, 1326], 'card'],
  ['new-heat-pump-installation-home', 'new-heat-pump-installation-home.jpeg', [480, 800, 1200], 'card'],
];

for (const [name, srcFile, widths, card] of jobs) {
  const file = join(root, 'img-src', srcFile);
  if (!existsSync(file)) { console.log(`falta ${srcFile}`); continue; }
  for (const w of widths) {
    const out = join(outDir, `${name}-${w}.webp`);
    const info = await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1200 ? 62 : 68, effort: 6 }).toFile(out);
    console.log(`${name}-${w}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
  if (card) for (const w of [480, 800]) {
    const out = join(outDir, `${name}-card-${w}.webp`);
    const info = await sharp(file).resize({ width: w, height: w * 3 / 4, fit: 'cover', position: sharp.strategy.attention }).webp({ quality: 68, effort: 6 }).toFile(out);
    console.log(`${name}-card-${w}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
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
