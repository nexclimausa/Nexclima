// Recibe el formulario de la web, descarta el spam y reenvía los leads buenos a Netlify Forms
// (formulario "lead-verified", que avisa por correo) y, si existe, a un webhook (LEAD_WEBHOOK_URL).
// Los envíos sospechosos reciben la misma respuesta que los buenos, para que los robots no aprendan.

import { check, normalizePhone } from '../../src/lead-rules.mjs';
import { issues, cities } from '../../src/data.mjs';

const LISTS = { issues: new Set(issues), cities: new Set(['', ...cities.map((c) => c.name), 'Other']) };

function fmtPhone(d) { return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`; }

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  const ok = () => (wantsJson
    ? Response.json({ ok: true })
    : new Response(null, { status: 303, headers: { Location: '/thank-you/' } }));

  let f;
  try {
    const type = req.headers.get('content-type') || '';
    f = type.includes('application/json') ? await req.json() : Object.fromEntries(new URLSearchParams(await req.text()));
  } catch { return ok(); }

  const reasons = check(f, LISTS);
  if (reasons.length) {
    console.log('spam descartado:', reasons.join(','));
    return ok();
  }

  const lead = {
    issue: f.issue,
    name: String(f.name).trim(),
    phone: fmtPhone(normalizePhone(f.phone)),
    city: f.city || '',
    page: String(f.page || '').slice(0, 200),
    utm_source: String(f.utm_source || '').slice(0, 100),
    utm_medium: String(f.utm_medium || '').slice(0, 100),
    utm_campaign: String(f.utm_campaign || '').slice(0, 100),
    gclid: String(f.gclid || '').slice(0, 200),
  };

  const site = process.env.URL || new URL(req.url).origin;
  const tasks = [
    fetch(site + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'lead-verified', ...lead }).toString(),
    }),
  ];
  if (process.env.LEAD_WEBHOOK_URL) {
    tasks.push(fetch(process.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }));
  }
  const results = await Promise.allSettled(tasks);
  if (results[0].status !== 'fulfilled' || !results[0].value.ok) {
    console.error('No se pudo guardar el lead en Netlify Forms', results[0].reason || results[0].value.status);
    return wantsJson ? Response.json({ ok: false }, { status: 502 }) : new Response('Error', { status: 502 });
  }
  return ok();
};

export const config = { path: '/api/lead' };
