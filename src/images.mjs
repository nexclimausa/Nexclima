// Optimiza las imágenes de img-src/ y el logo en public/img/ (WebP en varios anchos).
// Uso: node src/images.mjs
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/img');
mkdirSync(outDir, { recursive: true });

// [nombre de salida (descriptivo, ayuda al SEO), archivo original en img-src/, anchos, recorte 4:3 para tarjetas, recorte inferior]
// «recorte inferior» (0.11 = 11 %) quita la marca de agua de Gemini de las imágenes hechas con IA.
const WM = 0.11;
const jobs = [
  ['hvac-technician-ac-repair-middle-tennessee', 'hvac-technician-ac-repair-middle-tennessee.png', [640, 1024, 1376]],
  ['nexclima-hvac-technician-la-vergne-tn', 'nexclima-hvac-technician-la-vergne-tn.webp', [640, 1024, 1376]],
  ['hvac-service-visit-homeowner-tennessee', 'hvac-service-visit-homeowner-tennessee.webp', [640, 1024, 1376]],
  ['nashville-tn-skyline', 'nashville-tn-skyline.webp', [640, 1024, 1376]],
  ['central-air-conditioning-home-cooling', 'central-air-conditioning-home-cooling.webp', [640, 1024, 1376]],
  ['year-round-hvac-service-middle-tennessee', 'year-round-hvac-service-middle-tennessee.png', [640, 1024, 1376], false, WM],
  ['family-living-room-comfort', 'family-living-room-comfort.webp', [640, 1024, 1376]],
  ['homeowner-adjusting-thermostat', 'homeowner-adjusting-thermostat.webp', [640, 1024, 1376], false, WM],
  ['tennessee-home-winter-heating', 'tennessee-home-winter-heating.png', [640, 1024, 1376], false, WM],
  ['warm-bedroom-winter-heating', 'warm-bedroom-winter-heating.png', [640, 1024, 1376], false, WM],
  // Servicios: también se usan en tarjetas 4:3, así que llevan recorte propio («card»).
  ['ac-repair-technician-outdoor-unit', 'ac-repair-technician-outdoor-unit.webp', [640, 1024, 1376], true, WM],
  ['home-heating-family-winter-tennessee', 'home-heating-family-winter-tennessee.png', [640, 1024, 1376], true, WM],
  ['hvac-tune-up-air-filter-change', 'hvac-tune-up-air-filter-change.webp', [640, 1024, 1326], true],
  ['new-heat-pump-system-replacement', 'new-heat-pump-system-replacement.png', [640, 1024, 1376], true, WM],
];

for (const [name, srcFile, widths, card, cropBottom = 0] of jobs) {
  const file = join(root, 'img-src', srcFile);
  if (!existsSync(file)) { console.log(`falta ${srcFile}`); continue; }
  const m = await sharp(file).metadata();
  const base = await sharp(file).extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * (1 - cropBottom)) }).toBuffer();
  for (const w of widths) {
    const out = join(outDir, `${name}-${w}.webp`);
    const info = await sharp(base).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1200 ? 62 : 68, effort: 6 }).toFile(out);
    console.log(`${name}-${w}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
  if (card) for (const w of [480, 800]) {
    const out = join(outDir, `${name}-card-${w}.webp`);
    const info = await sharp(base).resize({ width: w, height: w * 3 / 4, fit: 'cover', position: sharp.strategy.attention }).webp({ quality: 68, effort: 6 }).toFile(out);
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
