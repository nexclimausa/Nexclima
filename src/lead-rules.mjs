// Reglas anti-spam compartidas: las usan el navegador (src/app.js) y el servidor (netlify/functions/lead.mjs).

export function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  return d.length === 10 ? d : null;
}

// Números posibles en EE. UU. (plan NANP): área y central empiezan por 2-9, sin N11, sin 555-01xx de ficción.
export function validUsPhone(d) {
  if (!d) return false;
  const area = d.slice(0, 3), exch = d.slice(3, 6), line = d.slice(6);
  if (!/^[2-9]\d\d$/.test(area) || !/^[2-9]\d\d$/.test(exch)) return false;
  if (/^[2-9]11$/.test(area) || /^[2-9]11$/.test(exch)) return false;
  if (exch === '555' && /^01\d\d$/.test(line)) return false;
  if (/^(\d)\1{9}$/.test(d) || d === '1234567890' || d === '0123456789') return false;
  return true;
}

export function validName(n) {
  const s = String(n || '').trim();
  if (s.length < 2 || s.length > 60) return false;
  if (/https?:|www\.|\.com|\.net|\.ru|@|<|>|\[|\]/i.test(s)) return false;
  return /^[\p{L}][\p{L}\p{M} .'\-]*$/u.test(s);
}

// lists = { issues: Set, cities: Set } (el servidor las saca de data.mjs).
export function check(f, lists) {
  const reasons = [];
  if (f['bot-field']) reasons.push('honeypot');
  // «e» = milisegundos que la persona pasó en la página antes de enviar (lo mide el navegador, sin depender del reloj).
  const e = Number(f.e);
  if (!f.e || !Number.isFinite(e)) reasons.push('no-js');
  else if (e < 3000) reasons.push('too-fast');
  if (!lists.issues.has(f.issue)) reasons.push('issue');
  if (!lists.cities.has(f.city || '')) reasons.push('city');
  if (!validName(f.name)) reasons.push('name');
  if (!validUsPhone(normalizePhone(f.phone))) reasons.push('phone');
  return reasons;
}

