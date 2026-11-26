// Página local de un solo uso para guardar la clave de Gemini en .env.
// Solo escucha en 127.0.0.1, exige un token aleatorio en la URL, no imprime la clave y se cierra al guardarla.
import { createServer } from 'node:http';
import { writeFileSync, chmodSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const token = randomBytes(16).toString('hex');
const PORT = 4322;

const page = (msg = '') => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Clave de Gemini</title><style>
body{margin:0;font:16px/1.5 -apple-system,system-ui,sans-serif;background:#0d2238;color:#14202c;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}
.c{background:#fff;border-radius:16px;padding:28px;max-width:440px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.3)}
h1{font-size:1.4rem;margin:0 0 6px;color:#0d2238}p{color:#536170;margin:0 0 16px}
label{font-weight:700;display:block;margin-bottom:6px}
input{font:inherit;width:100%;box-sizing:border-box;min-height:48px;padding:10px 14px;border:1.5px solid #c5ced8;border-radius:10px}
button{margin-top:14px;width:100%;min-height:48px;border:0;border-radius:10px;background:#f6a91d;font:700 1rem inherit;cursor:pointer}
.ok{background:#e8f6ee;color:#16794c;padding:12px;border-radius:10px;font-weight:600}.err{background:#fdecea;color:#b42318;padding:12px;border-radius:10px;font-weight:600;margin-bottom:12px}
small{display:block;margin-top:14px;color:#536170}
</style></head><body><div class="c">${msg}</div></body></html>`;

const form = (err = '') => page(`<h1>Clave de Gemini</h1><p>Se guarda solo en tu Mac, en el archivo .env de la carpeta Nexclima. No pasa por el chat.</p>
${err ? `<div class="err">${err}</div>` : ''}
<form method="POST" action="/${token}" autocomplete="off"><label for="k">Pega tu clave</label>
<input id="k" name="key" type="password" required autocomplete="off" spellcheck="false" autofocus>
<button type="submit">Guardar clave</button></form>
<small>Esta página se cierra sola al guardar.</small>`);

const server = createServer((req, res) => {
  const ok = req.url === `/${token}`;
  if (!ok) { res.writeHead(404); return res.end(); }
  if (req.method === 'GET') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(form()); }
  if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
  const origin = req.headers.origin;
  if (origin && origin !== `http://127.0.0.1:${PORT}`) { res.writeHead(403); return res.end(); }
  let body = '';
  req.on('data', (c) => { body += c; if (body.length > 4096) req.destroy(); });
  req.on('end', () => {
    const key = (new URLSearchParams(body).get('key') || '').trim();
    if (!/^[A-Za-z0-9_\-]{20,200}$/.test(key)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(form('Eso no parece una clave de Gemini. Cópiala otra vez desde AI Studio.'));
    }
    const file = join(root, '.env');
    writeFileSync(file, `GEMINI_API_KEY=${key}\n`, { mode: 0o600 });
    chmodSync(file, 0o600);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(page('<h1>Listo</h1><div class="ok">Clave guardada en tu Mac. Ya puedes cerrar esta página y volver al chat.</div>'));
    console.log('CLAVE GUARDADA en .env (no se muestra).');
    setTimeout(() => process.exit(0), 300);
  });
});
server.listen(PORT, '127.0.0.1', () => console.log(`URL: http://127.0.0.1:${PORT}/${token}`));
setTimeout(() => { console.log('Tiempo agotado: página cerrada sin guardar.'); process.exit(0); }, 30 * 60 * 1000);
