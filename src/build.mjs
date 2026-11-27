// Genera el sitio estático en dist/. Uso: npm run build  (o node src/build.mjs)
// CSS: Tailwind v4 (src/styles.css). JS: esbuild + Motion (src/app.js). Imágenes: node src/images.mjs.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import * as esbuild from 'esbuild';
import { site, reviews, issues, services, cities, homeFaq, specials, specialsConfirmed } from './data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), out, { recursive: true });

// CSS con Tailwind (escanea este archivo y app.js para generar solo las clases usadas)
mkdirSync(join(root, '.tmp'), { recursive: true });
execFileSync(join(root, 'node_modules/.bin/tailwindcss'), ['-i', join(root, 'src/styles.css'), '-o', join(root, '.tmp/site.css'), '--minify'], { cwd: root, stdio: 'pipe' });
const css = readFileSync(join(root, '.tmp/site.css'), 'utf8').replace(/\/\*![\s\S]*?\*\//, '');

// JS con Motion, empaquetado y minificado
await esbuild.build({ entryPoints: [join(root, 'src/app.js')], bundle: true, minify: true, format: 'iife', target: 'es2019', outfile: join(out, 'app.js'), legalComments: 'none' });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (slug) => (slug ? `/${slug}/` : '/');
const abs = (slug) => site.url + url(slug);
const cityBy = Object.fromEntries(cities.map((c) => [c.slug, c]));
const cityList = cities.map((c) => c.name);
const cityText = 'Nashville, Smyrna, La Vergne, Murfreesboro, Franklin, Brentwood, Mt. Juliet and Lebanon';

// ---------- Imágenes ----------
// Imágenes de ambientación generadas con IA (Gemini). Sustituir por fotos reales de NexClima cuando existan.
// Fotos: «file» es el nombre del archivo en /img/ (descriptivo, ayuda al SEO). «card» = tiene recorte 4:3 para tarjetas.
const IMG = {
  hero: { file: 'hvac-technician-ac-repair-middle-tennessee', w: [640, 1024, 1376], ratio: [1376, 768], alt: 'HVAC technician repairing an outdoor AC unit beside a brick home, with a NexClima service van in the driveway', pos: '62% 50%' },
  about: { file: 'nexclima-hvac-technician-la-vergne-tn', w: [640, 1024, 1376], ratio: [1376, 917], alt: 'NexClima HVAC technician next to the outdoor AC unit of a Middle Tennessee home', pos: '72% 35%' },
  visit: { file: 'hvac-service-visit-homeowner-tennessee', w: [640, 1024, 1376], ratio: [1376, 917], alt: 'HVAC technician greeting a homeowner at her front porch, with a NexClima van parked outside', pos: '62% 50%' },
  nashville: { file: 'nashville-tn-skyline', w: [640, 1024, 1376], ratio: [1376, 771], alt: 'Nashville, Tennessee skyline at dusk', pos: '60% 50%' },
  coolhome: { file: 'central-air-conditioning-home-cooling', w: [640, 1024, 1376], ratio: [1376, 562], alt: 'Family relaxing in a cool, bright living room while the central air conditioning runs', pos: '60% 50%' },
  yearround: { file: 'year-round-hvac-service-middle-tennessee', w: [640, 1024, 1376], ratio: [1376, 519], alt: 'HVAC technician in front of a Middle Tennessee home shown in winter snow and summer sun', pos: '50% 50%' },
  familyroom: { file: 'family-living-room-comfort', w: [640, 1024, 1376], ratio: [1376, 615], alt: 'Family watching TV in a comfortable living room with cool air from the vent', pos: '60% 50%' },
  thermostat: { file: 'homeowner-adjusting-thermostat', w: [640, 1024, 1376], ratio: [1376, 668], alt: 'Homeowner adjusting a smart thermostat in her living room', pos: '35% 40%' },
  winterhome: { file: 'tennessee-home-winter-heating', w: [640, 1024, 1376], ratio: [1376, 684], alt: 'Brick home with warm lights on during a snowy Tennessee winter evening', pos: '50% 50%' },
  bedroom: { file: 'warm-bedroom-winter-heating', w: [640, 1024, 1376], ratio: [1376, 668], alt: 'Parent tucking a child into bed in a warm room while snow falls outside', pos: '60% 50%' },
  'svc-ac': { file: 'ac-repair-technician-outdoor-unit', w: [640, 1024, 1376], ratio: [1376, 668], card: true, alt: 'HVAC technician checking refrigerant pressure on an outdoor AC unit with gauges', pos: '55% 50%' },
  'svc-heating': { file: 'home-heating-family-winter-tennessee', w: [640, 1024, 1376], ratio: [1376, 668], card: true, alt: 'Family staying warm in their living room while snow falls outside', pos: '55% 50%' },
  'svc-maintenance': { file: 'hvac-tune-up-air-filter-change', w: [640, 1024, 1326], ratio: [1326, 768], card: true, alt: 'HVAC technician replacing a return air filter during a home tune-up', pos: '45% 40%' },
  'svc-replacement': { file: 'new-heat-pump-system-replacement', w: [640, 1024, 1376], ratio: [1376, 668], card: true, alt: 'New heat pump installed beside a home after a winter snowfall', pos: '50% 60%' },
};
const srcset = (n) => IMG[n].w.map((w) => `/img/${IMG[n].file}-${w}.webp ${w}w`).join(', ');
const largest = (n) => `/img/${IMG[n].file}-${IMG[n].w.at(-1)}.webp`;
const pic = (n, sizes, extra = '') => `<img src="/img/${IMG[n].file}-${IMG[n].w[1] || IMG[n].w[0]}.webp" srcset="${srcset(n)}" sizes="${sizes}" width="${IMG[n].ratio[0]}" height="${IMG[n].ratio[1]}" alt="${esc(IMG[n].alt)}" loading="lazy" decoding="async"${extra}>`;
// Tarjetas 4:3: usan el recorte «card» para que no se vean borrosas.
const cardPic = (n, sizes) => IMG[n].card
  ? `<img src="/img/${IMG[n].file}-card-480.webp" srcset="/img/${IMG[n].file}-card-480.webp 480w, /img/${IMG[n].file}-card-800.webp 800w" sizes="${sizes}" width="800" height="600" alt="${esc(IMG[n].alt)}" loading="lazy" decoding="async">`
  : pic(n, sizes);
const svcImg = { [services[0].slug]: 'svc-ac', [services[1].slug]: 'svc-heating', [services[2].slug]: 'svc-maintenance', [services[3].slug]: 'svc-replacement' };

// ---------- Iconos (SVG en línea, sin peticiones) ----------
const I = {
  snow: '<path d="M12 2v20M4.9 6l14.2 12M4.9 18 19.1 6M9 3.5 12 6l3-2.5M9 20.5 12 18l3 2.5M2.8 9.8 6.4 11 5.5 14.6M21.2 9.8 17.6 11l.9 3.6"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-6.8 0-3.5-2.4-5.6-3.9-7.7-.6 1.7-1.6 2.6-2.6 3 0-3.4-1.7-6.6-4.5-8.5.4 3.3-1.3 5.4-2.6 7.2C4.3 11 3 12.6 3 15.2 3 19.2 7 22 12 22Z"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>',
  house: '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-5.5h5V21"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2Z"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>',
  shield: '<path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.5 3.5 5.2"/>',
  star: '<path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9Z"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5Z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6.5V12l3.5 2"/>',
  ok: '<circle cx="12" cy="12" r="10"/><path class="draw" d="m7 12.5 3.2 3.2L17 9"/>',
};
const icon = (n, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${I[n]}</svg>`;
// Botón que abre la reserva online de Housecall Pro (si el widget no carga, baja al formulario).
const book = (label, cls = 'btn btn-sun', loc = 'header') => `<a class="${cls}" href="#book" data-hcp-booking="true" data-loc="${loc}">${label}</a>`;
const logoImg = (h = 46, lazy = false) => `<img src="/img/logo-48.webp" srcset="/img/logo-48.webp 1x, /img/logo-96.webp 2x" width="${Math.round(h * 386 / 96)}" height="${h}" alt="NexClima Inc"${lazy ? ' loading="lazy"' : ''}>`;

// ---------- Pruebas de confianza (solo datos confirmados) ----------
const diagText = site.diagnosticPrice ? `${site.diagnosticPrice} diagnostic${site.diagnosticWaived ? ', waived when we do the repair' : ''}` : '';
// Puntos del hero: el precio del diagnóstico sustituye a «price explained» y, si cabe, se añade el servicio el mismo día.
// Máximo 3 para que el formulario siga viéndose en el primer pantallazo en ordenador.
function heroTicks(ticks) {
  const t = ticks.map((x) => (diagText && /price explained/i.test(x) ? diagText : x));
  if (site.license) t.push(site.license);
  if (site.responseTime && t.length < 3) t.push('Same-day service available');
  return t.slice(0, 3);
}
function ratingLine(cls = '') {
  const inner = site.googleRating && site.googleReviewCount
    ? `<span>${site.googleRating} from <a href="${site.reviewsUrl}" rel="noopener" target="_blank">${site.googleReviewCount} Google reviews</a></span>`
    : `<span>Rated 5 stars by homeowners on <a href="${site.reviewsUrl}" rel="noopener" target="_blank">Google</a></span>`;
  return `<p class="stars ${cls}"><b aria-hidden="true">★★★★★</b> ${inner}</p>`;
}
const afterSend = site.responseTime ? `We’ll call you back ${site.responseTime}.` : 'We call you back to confirm a time.';

// ---------- Hero (foto + texto) y barra de formulario ----------
const rise = (ms) => `motion-safe:animate-rise [animation-delay:${ms}ms]`;
function hero({ img = 'hero', eyebrow = '', crumbs = '', h1, lead, ticks = [], call = true }) {
  const t = heroTicks(ticks);
  return `<section class="hero on-dark">
  <img class="hero-img motion-safe:animate-settle" src="${largest(img)}" srcset="${srcset(img)}" sizes="100vw" width="${IMG[img].ratio[0]}" height="${IMG[img].ratio[1]}" alt="${esc(IMG[img].alt)}" fetchpriority="high" decoding="async" style="object-position:${IMG[img].pos}">
  <div class="wrap hero-in"><div class="hero-copy">
    ${crumbs ? `<p class="crumbs ${rise(0)}">${crumbs}</p>` : ''}
    ${eyebrow ? `<p class="eyebrow ${rise(0)}">${icon('pin')} ${eyebrow}</p>` : ''}
    <h1 class="${rise(60)}">${h1}</h1>
    ${ratingLine(rise(140))}
    <p class="lead ${rise(200)}">${lead}</p>
    ${t.length ? `<ul class="ticks">${t.map((x, i) => `<li class="${rise(260 + i * 60)}">${icon('check')}<span>${x}</span></li>`).join('')}</ul>` : ''}
    ${call ? `<div class="hero-actions ${rise(300 + t.length * 60)}"><a class="btn btn-sun ring-icon" href="${site.phoneHref}" data-loc="hero">${icon('phone')} Call ${site.phone}</a></div>` : ''}
  </div></div>
</section>`;
}

function quoteBar({ title = 'Request service', city = '' } = {}) {
  const endpoint = site.formEndpoint || '/api/lead';
  const cityOpts = ['', ...cityList, 'Other'].map((c) => `<option value="${esc(c)}"${c === city ? ' selected' : ''}>${c ? esc(c) : 'Select city'}</option>`).join('');
  const issueOpts = ['', ...issues].map((x) => `<option value="${esc(x)}">${x ? esc(x) : 'Choose one'}</option>`).join('');
  return `<div class="quote-wrap wrap motion-safe:animate-rise [animation-delay:380ms]" id="book"><div class="quote">
  <div class="quote-head"><h2>${esc(title)}</h2><p>${esc(afterSend)} No obligation.</p></div>
  <form name="lead" method="POST" action="${endpoint}" data-endpoint="${endpoint}" data-tel="${site.phoneHref}" data-phone="${site.phone}" novalidate>
    <input type="hidden" name="e" value="">
    <p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <div class="qgrid">
      <div class="field"><label for="q-issue">What’s going on?</label><select id="q-issue" name="issue" required>${issueOpts}</select><span class="err">Choose the closest option.</span></div>
      <div class="field"><label for="q-name">Your name</label><input id="q-name" name="name" autocomplete="name" required><span class="err">Enter your name.</span></div>
      <div class="field"><label for="q-phone">Mobile phone</label><input id="q-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="(615) 555-0123"><span class="err">Enter a valid US mobile number.</span></div>
      <div class="field"><label for="q-city">City</label><select id="q-city" name="city" autocomplete="address-level2">${cityOpts}</select></div>
      <button type="submit" class="btn btn-sun">Request service</button>
    </div>
    <div class="form-msg" role="alert"></div>
    <p class="form-note">Want to pick a time yourself? <a href="#book" data-hcp-booking="true" data-loc="form">Book online</a> · We never share your number · <a href="/privacy-policy/">Privacy</a> · Prefer to talk? <a href="${site.phoneHref}" data-loc="form">${site.phone}</a> or <a href="${site.whatsapp}" data-loc="form" rel="noopener">WhatsApp</a></p>
  </form>
  <div class="thanks" role="status">${icon('ok')}<div><h3>Request received</h3><p>${esc(afterSend)} If it’s urgent, call <a href="${site.phoneHref}">${site.phone}</a>.</p></div></div>
</div></div>`;
}

// ---------- Schema ----------
const business = {
  '@type': 'HVACBusiness',
  '@id': `${site.url}/#business`,
  name: site.name,
  legalName: site.legalName,
  url: site.url + '/',
  telephone: '+1-615-669-9287',
  email: site.email,
  image: `${site.url}/og.jpg`,
  logo: `${site.url}/img/logo-96.webp`,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', streetAddress: site.street, addressLocality: site.city, addressRegion: site.region, postalCode: site.zip, addressCountry: 'US' },
  areaServed: cities.map((c) => ({ '@type': 'City', name: `${c.name}, TN` })),
  sameAs: Object.values(site.social),
  founder: site.founders.map((n) => ({ '@type': 'Person', name: n })),
  ...(site.hoursConfirmed ? { openingHours: site.hours.map((h) => h.schema) } : {}),
};
const crumbsLd = (items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([n, s], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(s) })) });
const faqLd = (faq) => ({ '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

// ---------- Plantilla ----------
const navItems = [
  ['AC Repair', services[0].slug], ['Heating', services[1].slug], ['Maintenance', services[2].slug], ['Replacement', services[3].slug],
  ['Service Areas', 'service-areas'], ...(specialsConfirmed ? [['Specials', 'specials']] : []), ['About', 'about-us'], ['Contact', 'contact-us'],
];
const animBoot = `<script>(function(d){if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('anim');setTimeout(function(){if(!window.__m)d.classList.remove('anim')},2500)}})(document.documentElement)</script>`;
function layout({ slug, title, desc, body, ld = [], noindex = false, mbar = true, heroImg = '' }) {
  const canonical = abs(slug);
  const graph = { '@context': 'https://schema.org', '@graph': [business, { '@type': 'WebPage', '@id': canonical, url: canonical, name: title, description: desc, isPartOf: { '@id': `${site.url}/#website` }, about: { '@id': `${site.url}/#business` } }, ...ld] };
  const ga = site.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.ga4}');</script>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
${heroImg ? `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset(heroImg)}" imagesizes="100vw" fetchpriority="high">` : ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="NexClima">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.url}/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d2238">
<meta name="geo.region" content="US-TN"><meta name="geo.placename" content="La Vergne">
<link rel="icon" href="/favicon.png" type="image/png">
${animBoot}
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
${ga}
<script>window.HCP_SRC=${JSON.stringify(`https://online-booking.housecallpro.com/script.js?token=${site.hcp.token}&orgName=${site.hcp.org}`)}</script>
<script src="/app.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span class="hide-s">Residential heating &amp; cooling · ${cityText.replace(' and ', ' &amp; ')}</span><a href="${site.phoneHref}" data-loc="topbar">Call ${site.phone}</a></div></div>
<header class="site-head"><div class="wrap">
  <a class="logo" href="/" aria-label="NexClima home">${logoImg()}</a>
  <nav class="nav" id="nav" aria-label="Main">${navItems.map(([n, s]) => `<a href="${url(s)}"${s === slug ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
  <div class="head-cta"><a class="head-phone" href="${site.phoneHref}" data-loc="header">${icon('phone')}<span>${site.phone}</span></a>${book('Book service')}</div>
  <button class="menu-btn" aria-controls="nav" aria-expanded="false" aria-label="Open menu">${icon('menu')}</button>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-foot"><div class="wrap">
  <div class="cols">
    <div><a class="logo" href="/" aria-label="NexClima home">${logoImg(44, true)}</a>
      <p style="margin-top:16px">Residential heating and air conditioning repair, maintenance and replacement for homes across Middle Tennessee.</p>
      <p><strong style="color:#fff">${esc(site.legalName)}</strong><br>${esc(site.street)}<br>${esc(site.city)}, ${site.region} ${site.zip}<br><a href="${site.phoneHref}" data-loc="footer">${site.phone}</a><br><a href="mailto:${site.email}">${site.email}</a></p>
      ${site.hoursConfirmed ? `<p>${site.hours.map((h) => `${h.days}: ${h.time}`).join('<br>')}</p>` : ''}
    </div>
    <div><h3>Services</h3><ul>${services.map((s) => `<li><a href="${url(s.slug)}">${s.nav}</a></li>`).join('')}<li><a href="/hvac-services/">All HVAC services</a></li></ul></div>
    <div><h3>Service areas</h3><ul>${cities.map((c) => `<li><a href="${url(c.slug)}">HVAC in ${c.name}</a></li>`).join('')}</ul></div>
    <div><h3>Company</h3><ul><li><a href="/about-us/">About us</a></li><li><a href="/contact-us/">Contact</a></li>${specialsConfirmed ? '<li><a href="/specials/">Specials</a></li>' : ''}<li><a href="${site.reviewsUrl}" rel="noopener" target="_blank">Google reviews</a></li><li><a href="${site.social.facebook}" rel="noopener">Facebook</a></li><li><a href="${site.social.instagram}" rel="noopener">Instagram</a></li><li><a href="/privacy-policy/">Privacy policy</a></li></ul></div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} ${esc(site.legalName)}. All rights reserved.</span><span>Residential HVAC only · Based in ${esc(site.city)}, Tennessee · Serving 8 Middle Tennessee cities</span></div>
</div></footer>
${mbar ? `<div class="mbar motion-safe:animate-slide-up"><a class="btn btn-ghost ring-icon" href="${site.phoneHref}" data-loc="mobilebar">${icon('phone')} Call now</a>${book('Book service', 'btn btn-sun', 'mobilebar')}</a></div>` : ''}
</body>
</html>`;
}

// ---------- Bloques reutilizables ----------
const proofStrip = () => `<section class="proof" aria-label="Why homeowners choose NexClima"><div class="wrap" data-stagger>
  <div class="item">${icon('users')}<span><b>${site.homeownersServed} homeowners</b><span>served in Middle Tennessee</span></span></div>
  <div class="item">${icon('house')}<span><b>100% residential</b><span>homes only, no commercial jobs</span></span></div>
  <div class="item">${icon('pin')}<span><b>Local to La Vergne</b><span>8 cities, one local team</span></span></div>
  <div class="item">${icon('star')}<span><b>${site.googleRating && site.googleReviewCount ? `${site.googleRating} on Google (${site.googleReviewCount} reviews)` : '5-star reviews'}</b><span><a href="${site.reviewsUrl}" rel="noopener" target="_blank">Read them on Google</a></span></span></div>
</div></section>`;

// Selector de ciudad en la portada: enlaces a las páginas locales (cercanía para el cliente y enlazado interno para el SEO).
const cityPicker = () => `<section class="city-pick" aria-label="Choose your city"><div class="wrap" data-reveal>
  <p>${icon('pin')}<span><b>Where is your home?</b> Pick your city for local service details.</span></p>
  <nav class="chips">${cities.map((c) => `<a href="${url(c.slug)}">${esc(c.name)}</a>`).join('')}</nav>
</div></section>`;

const head = (h2, p = '', extra = '') => `<div class="sec-head" data-reveal><h2>${h2}</h2>${p ? `<p>${p}</p>` : ''}${extra}</div>`;

const serviceCards = (list = services, h = 'h3') => `<div class="grid ${list.length === 4 ? 'g4' : 'g3'}" data-stagger>${list.map((s) => `<a class="card pic" href="${url(s.slug)}"><span class="ph">${cardPic(svcImg[s.slug], '(max-width: 620px) 92vw, (max-width: 1000px) 46vw, 280px')}</span><span class="cb"><${h}>${s.short}</${h}><p>${esc(s.card)}</p><span class="more">${s.short} details <i>→</i></span></span></a>`).join('')}</div>`;

const reviewGrid = (list = reviews) => `<div class="grid g2" data-stagger>${list.map((r) => `<figure class="review"><b class="st" aria-label="5 out of 5 stars">★★★★★</b><blockquote><p>“${esc(r.text)}”</p></blockquote><figcaption>${esc(r.name)}<span>Google review · ${esc(r.tag)}</span></figcaption></figure>`).join('')}</div>`;

const howItWorks = () => `<section class="sec dark on-dark"><div class="wrap">
  ${head('How a service visit works', 'No guessing about what happens after you call.')}
  <ol class="steps3" data-stagger>
    <li><h3>You tell us what’s wrong</h3><p>Call, text or use the form. We ask a few questions and book the earliest time that works for you.</p></li>
    <li><h3>We find the cause and explain it</h3><p>The technician tests the system, shows you what failed and gives you the price before any work starts.</p></li>
    <li><h3>We fix it and check it</h3><p>Repair done, system tested in both modes, and tips so the same problem doesn’t come back.</p></li>
  </ol>
</div></section>`;

const areasGrid = (list = cities) => `<div class="areas" data-stagger>${list.map((c) => `<a href="${url(c.slug)}">${c.name}<span>${c.county.replace(' County', ' Co.')}</span></a>`).join('')}</div>`;

const faqBlock = (faq, title = 'Frequently asked questions') => `<section class="sec"><div class="wrap split top">
  ${head(title, `Still unsure? Call <a href="${site.phoneHref}" data-loc="faq">${site.phone}</a> and ask a technician.`)}
  <div class="faq" data-stagger>${faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>`;

const ctaBand = (h = 'Need heat or AC fixed?', p = `Call ${site.phone} or book online. We serve ${cityText}.`) => `<section class="cta-band on-dark"><div class="wrap" data-reveal>
  <div><h2>${esc(h)}</h2><p>${esc(p)}</p></div>
  <div class="acts"><a class="btn btn-sun" href="${site.phoneHref}" data-loc="cta">${icon('phone')} Call ${site.phone}</a>${book('Book online', 'btn btn-ghost', 'cta')}</div>
</div></section>`;

const pages = [];
const add = (slug, html, { sitemap = true, priority = '0.7' } = {}) => pages.push({ slug, html, sitemap, priority });

// ---------- Inicio ----------
{
  const body = `
${hero({ eyebrow: 'Based in La Vergne, TN', h1: '<span class="hl">Heating &amp; AC repair</span> for Middle Tennessee homes', lead: `Local, <strong>residential-only HVAC technicians</strong>${site.responseTime ? ' with <strong>same-day service</strong>' : ''}. We find the real cause, explain your options in plain words and get your home comfortable again.`, ticks: ['Repair, tune-ups and new systems for homes only', `${site.homeownersServed} Middle Tennessee homeowners served`, 'The price explained before any work starts'] })}
${quoteBar({ title: 'Get your AC or heat fixed' })}
${cityPicker()}
${proofStrip()}
<section class="sec first" id="services"><div class="wrap">
  ${head('Residential HVAC services', 'One local team for everything your heating and cooling system needs, from a noisy blower to a full replacement.')}
  ${serviceCards()}
</div></section>
<section class="sec soft"><div class="wrap split">
  ${head('Sound familiar?', 'These are the calls we get most. If one of them is happening at your house, a technician can usually find the cause in one visit.', book('Book a diagnosis', 'btn btn-sun', 'signs'))}
  <ul class="signs" data-stagger>${['AC running, but blowing warm air', 'Heat pump covered in ice', 'Water leaking under the indoor unit', 'Some rooms always hot or cold', 'Strange noise or smell from the vents', 'Power bill higher than last year'].map((x) => `<li>${x}</li>`).join('')}</ul>
</div></section>
${howItWorks()}
<section class="sec"><div class="wrap">
  ${head('What homeowners say about NexClima', `Real reviews from Google, from homeowners across Middle Tennessee. <a href="${site.reviewsUrl}" rel="noopener" target="_blank">Read all reviews</a>.`)}
  ${reviewGrid()}
</div></section>
<section class="sec soft"><div class="wrap">
  ${head('Areas we serve', 'Our shop is on Murfreesboro Road in La Vergne, so we reach most of Middle Tennessee within a short drive. Pick your city for local details.')}
  ${areasGrid()}
</div></section>
<section class="sec"><div class="wrap split">
  <div data-reveal><h2>A local team, not a call center</h2>
    <p>NexClima was started by ${site.founders.join(' and ')} to give Middle Tennessee homeowners an HVAC company that answers its own phone, shows up when it says it will and explains things honestly.</p>
    <p>We work only on homes. That focus means our technicians know the heat pumps, gas furnaces and air handlers found in local houses, and the problems Tennessee summers and winters cause.</p>
    <ul class="facts" style="margin:22px 0 26px">
      <li>${icon('shield')}<span><strong>Honest recommendations.</strong> If a repair makes more sense than a new system, we tell you.</span></li>
      <li>${icon('house')}<span><strong>Clean work.</strong> Shoe covers inside and the work area cleaned up before we leave.</span></li>
      <li>${icon('chat')}<span><strong>Easy to reach.</strong> Call, text or <a href="${site.whatsapp}" rel="noopener" data-loc="about">WhatsApp</a> the same local number.</span></li>
    </ul>
    <a class="btn btn-ghost" href="/about-us/">About our team</a></div>
  <div class="frame" data-reveal>${pic('about', '(max-width: 900px) 92vw, 560px')}</div>
</div></section>
${faqBlock(homeFaq)}
${ctaBand()}`;
  add('', layout({ slug: '', heroImg: 'hero', title: 'Heating & AC Repair in Middle Tennessee | NexClima HVAC', desc: `Residential HVAC repair, tune-ups and replacement in ${cityText}, TN. Local La Vergne team. Call ${site.phone} or book online.`, body, ld: [faqLd(homeFaq), { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url + '/', name: 'NexClima' }] }), { priority: '1.0' });
}

// ---------- Hub de servicios ----------
add('hvac-services', layout({
  slug: 'hvac-services', heroImg: 'hero', title: 'Residential HVAC Services in Middle Tennessee | NexClima',
  desc: `AC repair, heating repair, tune-ups and HVAC replacement for homes in ${cityText}. Call ${site.phone}.`,
  ld: [crumbsLd([['Home', ''], ['HVAC services', 'hvac-services']])],
  body: `${hero({ crumbs: '<a href="/">Home</a> / HVAC services', h1: 'Residential HVAC services', lead: 'Repair, maintenance and replacement for central air conditioners, heat pumps and furnaces, for homes across Middle Tennessee.', ticks: ['Homes only: houses, townhomes and condos', 'All major brands', 'The price explained before work starts'] })}
  ${quoteBar()}
  <section class="sec first"><div class="wrap">${head('Choose a service')}${serviceCards()}</div></section>
  ${howItWorks()}${ctaBand()}`,
}), { priority: '0.8' });

// ---------- Páginas de servicio ----------
for (const s of services) {
  const others = services.filter((x) => x !== s);
  const body = `
${hero({ img: svcImg[s.slug], crumbs: `<a href="/">Home</a> / <a href="/hvac-services/">HVAC services</a> / ${s.short}`, h1: esc(s.h1), lead: esc(s.lead), ticks: ['Local technicians based in La Vergne', s.slug === 'system-replacement' && site.warranty ? '1-year installation warranty + 5–10 year manufacturer parts warranty' : 'The price explained before work starts'] })}
${quoteBar({ title: `Book ${s.short.toLowerCase()}` })}
<section class="sec soft first"><div class="wrap split">
  ${head(`Signs you need ${s.short.toLowerCase()}`, 'If you notice any of these, call before a small problem becomes an expensive one.', book('Book a visit', 'btn btn-sun', 'signs'))}
  <ul class="signs" data-stagger>${s.signs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
</div></section>
<section class="sec"><div class="wrap">
  ${head(`What our ${s.short.toLowerCase()} covers`)}
  <div class="grid g2" data-stagger>${s.work.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>
${howItWorks()}
<section class="sec"><div class="wrap">${head('Reviews from local homeowners')}${reviewGrid(reviews.slice(0, 2))}</div></section>
<section class="sec soft"><div class="wrap">${head(`${s.short} near you`, `We provide ${s.short.toLowerCase()} in these Middle Tennessee cities.`)}${areasGrid()}</div></section>
${faqBlock(s.faq, `${s.short} questions`)}
<section class="sec soft"><div class="wrap">${head('Other HVAC services')}${serviceCards(others)}</div></section>
${ctaBand()}`;
  add(s.slug, layout({
    slug: s.slug, heroImg: svcImg[s.slug], title: `${s.title} | NexClima`, desc: s.meta, body,
    ld: [crumbsLd([['Home', ''], ['HVAC services', 'hvac-services'], [s.short, s.slug]]), faqLd(s.faq), { '@type': 'Service', name: s.title, serviceType: s.short, provider: { '@id': `${site.url}/#business` }, areaServed: cities.map((c) => `${c.name}, TN`), url: abs(s.slug), image: `${site.url}${largest(svcImg[s.slug])}` }],
  }), { priority: '0.9' });
}

// ---------- Hub de zonas ----------
add('service-areas', layout({
  slug: 'service-areas', heroImg: 'visit', title: 'HVAC Service Areas in Middle Tennessee | NexClima',
  desc: `NexClima provides residential heating and AC service in ${cityText}, TN. Find your city.`,
  ld: [crumbsLd([['Home', ''], ['Service areas', 'service-areas']])],
  body: `${hero({ img: 'visit', crumbs: '<a href="/">Home</a> / Service areas', h1: 'HVAC service areas in Middle Tennessee', lead: 'From our shop on Murfreesboro Road in La Vergne we serve eight cities across Rutherford, Davidson, Williamson and Wilson counties.' })}
  ${quoteBar()}
  <section class="sec first"><div class="wrap">${head('Choose your city')}
  <div class="grid g2" data-stagger>${cities.map((c) => `<a class="card" href="${url(c.slug)}"><h3>${c.name}, TN</h3><p>${esc(c.drive)}. ZIP ${c.zips.join(', ')}.</p><span class="more">HVAC in ${c.name} <i>→</i></span></a>`).join('')}</div></div></section>
  ${ctaBand()}`,
}), { priority: '0.8' });

// ---------- Páginas de ciudad ----------
// Foto de cada ciudad: Nashville tiene la suya; el resto rota para que no se repita la misma.
const cityImgs = ['visit', 'hero', 'about', 'svc-maintenance'];
const cityImgFor = { 'La Vergne': 'visit', Smyrna: 'yearround', Murfreesboro: 'winterhome', Nashville: 'nashville', Brentwood: 'coolhome', Franklin: 'familyroom', 'Mt. Juliet': 'thermostat', Lebanon: 'bedroom' };
cities.forEach((c, ci) => {
  const img = cityImgFor[c.name] || cityImgs[ci % cityImgs.length];
  const faq = [
    [`Do you offer AC and heating repair in ${c.name}, TN?`, `Yes. We repair, maintain and replace central air conditioners, heat pumps and furnaces for homes throughout ${c.name}, including ${c.areas.slice(0, 3).join(', ')}.`],
    [`How far is NexClima from ${c.name}?`, `${c.drive}. Call ${site.phone} and we’ll give you the earliest time available.`],
    [`Which ZIP codes in ${c.name} do you cover?`, `${c.zips.join(', ')}${c.zips.length > 1 ? ' and the areas around them' : ' and the surrounding area'}. If you’re unsure, just call and ask.`],
    ['Do you work on commercial buildings?', 'No. We focus on homes only: houses, townhomes and condos.'],
  ];
  const body = `
${hero({ img, crumbs: `<a href="/">Home</a> / <a href="/service-areas/">Service areas</a> / ${c.name}`, eyebrow: `${c.name}, ${c.county}`, h1: `HVAC repair &amp; AC service in <span class="hl">${c.name}, TN</span>`, lead: esc(c.intro), ticks: [esc(c.drive), 'Residential AC, heat pump and furnace service', 'The price explained before work starts'] })}
${quoteBar({ title: `Request service in ${c.name}`, city: c.name })}
<section class="sec first"><div class="wrap split top">
  <div class="prose" data-reveal><h2>Heating and cooling for ${c.name} homes</h2>
    <p>${esc(c.local)}</p>
    <p>Whatever the age of your home, our approach is the same: inspect the equipment, explain what we find and give you practical repair or replacement options with the price up front.</p></div>
  <div data-reveal><h3>Neighborhoods we serve in ${c.name}</h3><ul class="tags">${c.areas.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
    <h3 style="margin-top:24px">ZIP codes</h3><ul class="tags">${c.zips.map((z) => `<li>${z}</li>`).join('')}</ul></div>
</div></section>
<section class="sec soft"><div class="wrap">${head(`HVAC services in ${c.name}`)}${serviceCards()}</div></section>
${howItWorks()}
<section class="sec"><div class="wrap">${head('What Middle Tennessee homeowners say')}${reviewGrid(reviews.slice(0, 2))}</div></section>
${faqBlock(faq, `HVAC service in ${c.name}: questions`)}
<section class="sec soft"><div class="wrap">${head('Nearby areas we also serve')}
<div class="areas" data-stagger>${c.nearby.map((n) => `<a href="${url(n)}">${cityBy[n].name}<span>${cityBy[n].county.replace(' County', ' Co.')}</span></a>`).join('')}<a href="/service-areas/">All areas<span>8 cities</span></a></div></div></section>
${ctaBand(`Need HVAC service in ${c.name}?`, `Call ${site.phone} or book online. Local team based in La Vergne.`)}`;
  add(c.slug, layout({
    slug: c.slug, heroImg: img, title: `HVAC Repair & AC Service in ${c.name}, TN | NexClima`,
    desc: `Residential AC repair, heating repair, tune-ups and HVAC replacement in ${c.name}, TN (${c.zips.join(', ')}). Local team. Call ${site.phone}.`,
    body, ld: [crumbsLd([['Home', ''], ['Service areas', 'service-areas'], [c.name, c.slug]]), faqLd(faq)],
  }), { priority: '0.9' });
});

// ---------- Nosotros ----------
add('about-us', layout({
  slug: 'about-us', heroImg: 'about', title: 'About NexClima | Local HVAC Company in La Vergne, TN',
  desc: `NexClima is a residential HVAC company based in La Vergne, TN, founded by ${site.founders.join(' and ')}. Serving homeowners across Middle Tennessee.`,
  ld: [crumbsLd([['Home', ''], ['About us', 'about-us']])],
  body: `${hero({ img: 'about', crumbs: '<a href="/">Home</a> / About us', h1: 'A local HVAC company for Middle Tennessee homes', lead: `NexClima was founded by ${site.founders.join(' and ')} with a simple idea: treat every home like our own and every homeowner like a neighbor.`, ticks: [`${site.homeownersServed} homeowners served`, 'Residential only', `Based on Murfreesboro Road in ${site.city}`] })}
  ${quoteBar()}
  <section class="sec first"><div class="wrap split">
    <div class="prose" data-reveal><h2>Our story</h2>
    <p>${site.founders.join(' and ')} started NexClima to build the kind of HVAC company they would want to call themselves: one that picks up the phone, shows up on time, and explains what is wrong without pressure to buy more than you need.</p>
    <p>Today we focus entirely on homes in ${cityText}. We repair and maintain air conditioners, heat pumps and furnaces, and we help homeowners choose the right new system when the old one has had its day.</p></div>
    <ul class="facts" data-stagger>
      <li>${icon('shield')}<span><strong>Honest recommendations.</strong> Repair when repair makes sense; replacement only when it really pays off.</span></li>
      <li>${icon('chat')}<span><strong>Clear communication.</strong> You know what we found, what it costs and what happens next.</span></li>
      <li>${icon('house')}<span><strong>Homeowner first.</strong> Shoe covers, a clean work area and respect for your home.</span></li>
    </ul>
  </div></section>
  <section class="sec soft"><div class="wrap">${head('Reviews from our customers')}${reviewGrid()}</div></section>
  ${ctaBand()}`,
}), { priority: '0.6' });

// ---------- Contacto ----------
add('contact-us', layout({
  slug: 'contact-us', heroImg: 'hero', title: 'Contact NexClima | HVAC Service in La Vergne & Middle TN',
  desc: `Call ${site.phone}, text, WhatsApp or book online. NexClima, ${site.street}, ${site.city}, TN ${site.zip}.`,
  ld: [crumbsLd([['Home', ''], ['Contact', 'contact-us']])],
  body: `${hero({ crumbs: '<a href="/">Home</a> / Contact', h1: 'Contact NexClima', lead: 'The fastest way to get help is to call. You can also text, send a WhatsApp message or use the form.', call: false,
    ticks: [`<a style="color:#fff" href="${site.phoneHref}" data-loc="contact">${site.phone}</a> · call or <a style="color:#fff" href="${site.sms}" data-loc="contact">text</a>`, `<a style="color:#fff" href="${site.whatsapp}" rel="noopener" data-loc="contact">Message us on WhatsApp</a>`, `${esc(site.street)}, ${esc(site.city)}, ${site.region} ${site.zip} · <a style="color:#fff" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`NexClima ${site.street} ${site.city} TN ${site.zip}`)}" rel="noopener" target="_blank">Get directions</a>`, ...(site.hoursConfirmed ? [site.hours.map((h) => `${h.days}: ${h.time}`).join(' · ')] : [])] })}
  ${quoteBar()}
  <section class="sec soft first"><div class="wrap">${head('Areas we serve')}${areasGrid()}</div></section>`,
}), { priority: '0.6' });

// ---------- Ofertas ----------
add('specials', layout({
  slug: 'specials', heroImg: 'svc-maintenance', title: 'HVAC Specials & Tune-Up Offers | NexClima',
  desc: 'Current NexClima offers on HVAC tune-ups and service for Middle Tennessee homeowners.',
  noindex: !specialsConfirmed,
  ld: [crumbsLd([['Home', ''], ['Specials', 'specials']])],
  body: `${hero({ img: 'svc-maintenance', crumbs: '<a href="/">Home</a> / Specials', h1: 'Current HVAC offers', lead: 'Mention the offer when you call or in the form.', call: false })}
  ${quoteBar()}
  <section class="sec first"><div class="wrap"><div class="grid g2" data-stagger>${specials.map((o) => `<div class="offer"><h2 style="font-size:1.4rem">${esc(o.title)}</h2><p class="price">${esc(o.price)} ${o.was ? `<s>${esc(o.was)}</s>` : ''}</p><p>${esc(o.text)}</p>${book('Claim this offer', 'btn btn-sun', 'specials')}</div>`).join('')}</div></div></section>`,
}), { sitemap: specialsConfirmed, priority: '0.5' });

// ---------- Privacidad ----------
add('privacy-policy', layout({
  slug: 'privacy-policy', title: 'Privacy Policy | NexClima', desc: 'How NexClima collects and uses the information you send us.',
  body: `<section class="sec"><div class="wrap prose"><h1>Privacy policy</h1>
  <p>When you contact NexClima by phone, text, WhatsApp, email or our online form, we collect the details you give us (such as your name, phone number, city and the problem with your system) only to respond to your request and schedule service.</p>
  <p>We do not sell or rent your information. We share it only with the people at NexClima who need it to help you, and with service providers that host this website and deliver form messages.</p>
  <p>This website may use analytics cookies to understand how visitors use it, for example which pages lead to a call or a form request. You can block cookies in your browser settings.</p>
  <p>To ask us to update or delete your information, call <a href="${site.phoneHref}">${site.phone}</a> or email <a href="mailto:${site.email}">${site.email}</a>.</p>
  <p>${esc(site.legalName)}, ${esc(site.street)}, ${esc(site.city)}, ${site.region} ${site.zip}.</p></div></section>`,
}), { priority: '0.2' });

// ---------- Gracias (sin JS) ----------
add('thank-you', layout({
  slug: 'thank-you', title: 'Request received | NexClima', desc: 'We received your service request.', noindex: true, mbar: false,
  body: `<section class="sec"><div class="wrap prose"><h1>Thanks, we got your request</h1><p>${esc(afterSend)} If it’s urgent, call <a href="${site.phoneHref}">${site.phone}</a>.</p><p><a class="btn btn-sun" href="/">Back to home</a></p></div></section>`,
}), { sitemap: false });

// ---------- Escribir ----------
for (const p of pages) {
  const dir = p.slug ? join(out, p.slug) : out;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), p.html);
}
writeFileSync(join(out, '404.html'), layout({ slug: '404', title: 'Page not found | NexClima', desc: 'Page not found.', noindex: true,
  body: `<section class="sec"><div class="wrap prose"><h1>We couldn’t find that page</h1><p>Need heating or AC help? Call <a href="${site.phoneHref}">${site.phone}</a> or start from our <a href="/">home page</a>.</p></div></section>` }));

// Formulario oculto para que Netlify registre «lead-verified» (la función reenvía aquí los leads buenos).
mkdirSync(join(out, 'forms'), { recursive: true });
writeFileSync(join(out, 'forms/lead-verified.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Form</title></head><body>
<form name="lead-verified" method="POST" data-netlify="true" hidden>
${['subject', 'issue', 'name', 'phone', 'city', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid'].map((n) => `<input name="${n}">`).join('')}
</form></body></html>`);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((p) => p.sitemap).map((p) => `<url><loc>${abs(p.slug)}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thank-you/\nDisallow: /forms/\n\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(out, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/app.js\n  Cache-Control: public, max-age=604800\n/img/*\n  Cache-Control: public, max-age=31536000, immutable\n/og.jpg\n  Cache-Control: public, max-age=2592000\n`);
writeFileSync(join(out, '_redirects'), `/careers/  /contact-us/  301\n/home/  /  301\n/wp-admin/*  /  301\n/wp-login.php  /  301\n/feed/  /  301\n`);

console.log(`OK: ${pages.length + 1} páginas en dist/ · CSS ${Math.round(css.length / 1024)} KB · JS ${Math.round(readFileSync(join(out, 'app.js')).length / 1024)} KB`);
