// Comportamiento del sitio. esbuild lo empaqueta con Motion (solo lo que se usa) en dist/app.js.
import { animate } from 'motion/mini';
import { inView } from 'motion';
import { validUsPhone, normalizePhone, validName } from './lead-rules.mjs';

const d = document;
const root = d.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = [0.16, 1, 0.3, 1];
window.__m = true;

function track(name, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
}

// ---------- Aparición al entrar en pantalla (una sola vez) ----------
function reveal(el, delay = 0) {
  el.style.opacity = '1';
  if (reduce) return;
  animate(el, { opacity: [0, 1], transform: ['translateY(26px)', 'translateY(0)'] }, { duration: 0.8, delay, ease: EASE });
}
if (root.classList.contains('anim')) {
  // El callback no devuelve nada: Motion deja de observar ese elemento tras la primera vez.
  // (No llamar a la función de parada aquí: desconecta el observador compartido de todos.)
  inView('[data-reveal]', (el) => { if (!el.style.opacity) reveal(el); }, { amount: 0.15 });
  inView('[data-stagger]', (group) => {
    if (group.firstElementChild && group.firstElementChild.style.opacity) return;
    [...group.children].forEach((c, i) => reveal(c, Math.min(i, 8) * 0.07));
  }, { amount: 0.15 });
  // Red de seguridad: con un scroll muy rápido un bloque puede cruzar la pantalla sin que el
  // observador lo vea; al parar, todo lo que ya está por encima del borde inferior se muestra.
  let t;
  const sweep = () => d.querySelectorAll('[data-reveal],[data-stagger]>*').forEach((e) => {
    if (!e.style.opacity && e.getBoundingClientRect().top < innerHeight) reveal(e);
  });
  addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sweep, 180); }, { passive: true });
}

// ---------- Cabecera que se compacta al bajar ----------
const head = d.querySelector('.site-head');
if (head) {
  let on = false;
  const check = () => {
    const s = scrollY > 24;
    if (s !== on) { on = s; head.classList.toggle('scrolled', s); }
  };
  addEventListener('scroll', check, { passive: true });
  check();
}

// ---------- Menú móvil ----------
const btn = d.querySelector('.menu-btn');
const nav = d.getElementById('nav');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    d.body.style.overflow = open ? 'hidden' : '';
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && nav.classList.contains('open')) btn.click(); });
}

// ---------- Medición de clics ----------
d.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  const h = a.getAttribute('href');
  const loc = a.dataset.loc || 'page';
  if (h.startsWith('tel:')) track('phone_click', { location: loc });
  else if (h.includes('wa.me')) track('whatsapp_click', { location: loc });
  else if (h.startsWith('sms:')) track('sms_click', { location: loc });
});

// ---------- Formulario ----------
const loadedAt = performance.now();
d.querySelectorAll('.quote').forEach((box) => {
  const form = box.querySelector('form');
  if (!form) return;
  const msg = box.querySelector('.form-msg');
  const setErr = (name, bad) => {
    const f = form.elements[name];
    if (!f) return;
    f.closest('.field').classList.toggle('bad', bad);
    f.setAttribute('aria-invalid', String(bad));
    if (bad && !reduce) animate(f, { transform: ['translateX(0)', 'translateX(-6px)', 'translateX(5px)', 'translateX(-3px)', 'translateX(0)'] }, { duration: 0.4 });
  };
  form.addEventListener('input', (e) => { const w = e.target.closest('.field'); if (w) w.classList.remove('bad'); });
  let started = false;
  form.addEventListener('focusin', () => { if (!started) { started = true; track('lead_form_start', {}); } });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const issue = form.elements.issue.value;
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const bad = { issue: !issue, name: !validName(name), phone: !validUsPhone(normalizePhone(phone)) };
    Object.entries(bad).forEach(([k, v]) => setErr(k, v));
    const first = Object.keys(bad).find((k) => bad[k]);
    if (first) { form.elements[first].focus(); return; }

    const data = new FormData(form);
    data.set('e', String(Math.round(performance.now() - loadedAt)));
    data.set('page', location.pathname);
    const qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'].forEach((k) => { if (qs.get(k)) data.set(k, qs.get(k)); });

    const sbtn = form.querySelector('[type=submit]');
    const label = sbtn.textContent;
    sbtn.disabled = true; sbtn.textContent = 'Sending…';
    msg.className = 'form-msg'; msg.textContent = '';
    const endpoint = form.dataset.endpoint || '/api/lead';
    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    }).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      track('generate_lead', { issue, city: data.get('city') || '' });
      box.classList.add('done');
      const t = box.querySelector('.thanks');
      const h = t.querySelector('h3'); h.setAttribute('tabindex', '-1'); h.focus();
      if (!reduce) {
        animate(t, { opacity: [0, 1], transform: ['scale(.97)', 'scale(1)'] }, { duration: 0.6, ease: EASE });
        const path = t.querySelector('.draw');
        if (path) animate(path, { strokeDashoffset: [30, 0] }, { duration: 0.7, delay: 0.15, ease: EASE });
      }
    }).catch(() => {
      msg.className = 'form-msg err';
      msg.innerHTML = `We couldn’t send your request. Please call us at <a href="${form.dataset.tel}">${form.dataset.phone}</a>.`;
      if (!reduce) animate(msg, { opacity: [0, 1], transform: ['translateY(-6px)', 'translateY(0)'] }, { duration: 0.4, ease: EASE });
    }).finally(() => { sbtn.disabled = false; sbtn.textContent = label; });
  });
});

// ---------- Reserva online (Housecall Pro) ----------
// El widget (~5 KB) se carga cuando la página ya está lista o al primer gesto, nunca antes del contenido.
let hcpState = 0; // 0 sin cargar, 1 cargando, 2 listo
const hcpWaiters = [];
function loadHcp() {
  if (hcpState || !window.HCP_SRC) return;
  hcpState = 1;
  const s = d.createElement('script');
  s.src = window.HCP_SRC; s.async = true;
  s.onload = () => { hcpState = 2; hcpWaiters.splice(0).forEach((f) => f()); };
  s.onerror = () => { hcpState = 0; hcpWaiters.splice(0).forEach((f) => f(true)); };
  d.head.appendChild(s);
}
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 2500));
addEventListener('load', () => idle(loadHcp, { timeout: 4000 }));
['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, loadHcp, { once: true, passive: true }));

function toForm() {
  const f = d.getElementById('book');
  if (f) { f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); const i = f.querySelector('select, input'); if (i) setTimeout(() => i.focus({ preventScroll: true }), 500); }
}
function openBooking(loc) {
  const open = (failed) => {
    if (!failed && window.HCPWidget && typeof window.HCPWidget.openModal === 'function') {
      window.HCPWidget.openModal();
      track('booking_open', { location: loc });
    } else {
      track('booking_fallback', { location: loc });
      toForm();
    }
  };
  if (hcpState === 2) return open();
  let done = false;
  const once = (f) => { if (!done) { done = true; open(f); } };
  hcpWaiters.push(once);
  setTimeout(() => once(true), 4000);
  loadHcp();
}
d.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('[data-hcp-booking="true"]');
  if (!b) return;
  e.preventDefault();
  openBooking(b.dataset.loc || 'page');
});
