// Genera una imagen con la API de Gemini usando la clave guardada en .env (GEMINI_API_KEY).
// La clave nunca se imprime ni va en la URL: se envía en la cabecera x-goog-api-key.
// Uso:
//   node src/gemini-image.mjs --check                      (comprueba la clave y lista modelos de imagen)
//   node src/gemini-image.mjs --name hero --aspect 16:9 --prompt "..."
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');
if (!existsSync(envPath)) { console.error('Falta el archivo .env con GEMINI_API_KEY.'); process.exit(1); }
const key = readFileSync(envPath, 'utf8').match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) { console.error('El archivo .env no tiene GEMINI_API_KEY.'); process.exit(1); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, l) => (v.startsWith('--') ? [...a, [v.slice(2), l[i + 1]?.startsWith('--') || l[i + 1] === undefined ? true : l[i + 1]]] : a), []));
const API = 'https://generativelanguage.googleapis.com/v1beta';
const headers = { 'x-goog-api-key': key, 'Content-Type': 'application/json' };

async function imageModels() {
  const r = await fetch(`${API}/models?pageSize=200`, { headers });
  if (!r.ok) throw new Error(`La clave no funciona (HTTP ${r.status}).`);
  const { models = [] } = await r.json();
  return models.filter((m) => /image/i.test(m.name) && (m.supportedGenerationMethods || []).includes('generateContent')).map((m) => m.name.replace('models/', ''));
}

const list = await imageModels();
if (args.check) {
  console.log('Clave correcta. Modelos de imagen disponibles:\n' + list.map((m) => ' - ' + m).join('\n'));
  process.exit(0);
}
const model = args.model || list.find((m) => /pro-image/.test(m)) || list[0];
if (!model) { console.error('Tu cuenta no tiene modelos de imagen disponibles.'); process.exit(1); }
if (!args.name || !args.prompt) { console.error('Faltan --name y --prompt.'); process.exit(1); }

const body = {
  contents: [{ parts: [{ text: args.prompt }] }],
  generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: args.aspect || '16:9' } },
};
const r = await fetch(`${API}/models/${model}:generateContent`, { method: 'POST', headers, body: JSON.stringify(body) });
const j = await r.json();
if (!r.ok) { console.error(`Gemini respondió ${r.status}: ${j.error?.message || ''}`); process.exit(1); }
const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!part) { console.error('Gemini no devolvió imagen.', j.candidates?.[0]?.finishReason || ''); process.exit(1); }
const dir = join(root, 'img-src');
mkdirSync(dir, { recursive: true });
const ext = (part.inlineData.mimeType || 'image/png').split('/')[1];
const file = join(dir, `${args.name}.${ext}`);
writeFileSync(file, Buffer.from(part.inlineData.data, 'base64'));
console.log(`Guardada ${file} (modelo ${model})`);
