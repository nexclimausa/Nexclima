# NexClima: reglas del proyecto (para Claude, Codex y cualquier agente)

Web de NexClima Inc, empresa de climatización (HVAC) **solo residencial** con sede en La Vergne, TN. Atiende 8
ciudades: La Vergne, Smyrna, Murfreesboro, Nashville, Brentwood, Franklin, Mt. Juliet y Lebanon. El objetivo de la web
es **conseguir leads todos los días**: cada cambio debe mantener o mejorar la velocidad, el SEO local y la conversión.

- Los textos de la web van en **inglés** (el público es de EE. UU.). Habla con quien te pida cambios en su idioma.
- Muchos de los que editan no son técnicos: explica en frases cortas qué vas a cambiar y enséñalo antes de publicar.

## Cómo está hecho
- Sitio estático generado con Node, sin WordPress ni framework. Se publica en **Netlify** desde GitHub (rama `main`).
- `src/data.mjs`: **todos los datos y textos** (negocio, servicios, ciudades, reseñas, FAQ, ofertas). Casi cualquier
  cambio de contenido se hace aquí.
- `src/build.mjs`: plantillas de las páginas, schema (JSON-LD), sitemap, robots, cabeceras y redirecciones.
- `src/styles.css`: estilos con **Tailwind CSS v4** (entrada de Tailwind; el CSS final se mete en cada página).
- `src/app.js`: comportamiento y animaciones con **Motion** (`motion/mini` + `inView`), formulario y reservas. esbuild lo
  empaqueta en `dist/app.js`.
- `src/lead-rules.mjs` + `netlify/functions/lead.mjs`: filtro anti-spam del formulario (ver abajo).
- `img-src/`: imágenes originales. `public/img/`: versiones WebP optimizadas que usa la web. `public/` se copia tal cual.
- `dist/`: salida generada. **No se edita a mano ni se sube** (Netlify la genera).

## Comandos
- Instalar (la primera vez): `npm install`
- Generar la web: `npm run build` → `dist/`
- Ver en local: `python3 -m http.server 4321 --directory dist` y abrir http://localhost:4321/
- Optimizar imágenes tras cambiar algo en `img-src/`: `node src/images.mjs`
- Generar una imagen con Gemini (necesita `GEMINI_API_KEY` en `.env`): `node src/gemini-image.mjs --name <nombre> --aspect 4:3 --prompt "..."`
- Guardar la clave de Gemini de forma segura: `node src/key-setup.mjs` (abre una página local de un solo uso).

## Reglas que no se rompen
1. **Nunca inventes datos del negocio**: precios, licencia, garantía, horario, nota o número de reseñas, años de
   experiencia, tiempos de respuesta ni reseñas. En `src/data.mjs` esos campos están en `null`/`false` y la web no los
   muestra hasta que NexClima los confirme. Si alguien pide ponerlos, pide el dato real.
2. **NAP idéntico** (nombre, dirección, teléfono) en toda la web y igual que en el Perfil de Empresa de Google:
   NexClima Inc · 5479 Murfreesboro Rd Ste 5, La Vergne, TN 37086 · (615) 669-9287.
3. **No cambies las URLs existentes** (slugs de servicios y ciudades): conservan el posicionamiento del sitio anterior.
   Si una URL debe cambiar, añade una redirección 301 en `_redirects` (dentro de `src/build.mjs`).
4. **Un solo H1 por página**, títulos y meta descripciones únicos, y cada página de ciudad con contenido propio (nada
   de copiar una ciudad y cambiar el nombre).
5. **Nunca subas `.env`** ni claves o tokens. El `.gitignore` ya lo excluye; compruébalo antes de cada commit.
   (El token de Housecall Pro de `src/data.mjs` es público: es el identificador del widget de reservas.)
6. **Velocidad**: nada de librerías pesadas, sliders, fuentes externas ni scripts de terceros que carguen antes del
   contenido. Las imágenes van en WebP con `srcset`, `width`/`height` y `loading="lazy"` (salvo la del hero).
   El JavaScript empaquetado ronda 15 KB; si un cambio lo sube mucho, revisa qué se ha colado en el paquete.
7. **Animaciones**: sutiles y una sola vez. Respeta `prefers-reduced-motion` y no dejes contenido oculto si el
   JavaScript falla (el arranque en `<head>` quita la clase `anim` si Motion no carga).
8. **Imágenes**: las actuales son de ambientación hechas con IA (Gemini). No las presentes como fotos del equipo real.
   Sin logos de marcas, sin textos, sin caras reconocibles. Prioriza siempre las fotos reales que envíe NexClima.

## Leads, reservas y spam
- Los botones «Book…» (`data-hcp-booking="true"`) abren el widget de **Housecall Pro**, que se carga después de la
  página. Si no carga, llevan al formulario.
- El **formulario rápido** envía a `/api/lead` (función de Netlify). `src/lead-rules.mjs` descarta en silencio el spam
  (sin JavaScript, menos de 3 s en la página, trampa `bot-field`, nombres con enlaces o @, teléfonos imposibles en
  EE. UU., opciones que no están en la lista). Los leads buenos se reenvían a Netlify Forms (formulario
  `lead-verified`) y, si existe la variable `LEAD_WEBHOOK_URL`, a ese webhook.
- **No relajes el filtro sin motivo** (antes, el 90 % de los leads del formulario eran spam). Si se cambian las listas
  de problemas o ciudades, se cambian en `src/data.mjs` y el filtro las usa solas.
- Para probar el filtro tras tocarlo: llama a la función con leads buenos y malos y comprueba que solo pasan los buenos.

## Antes de dar un cambio por terminado
1. `npm run build` sin errores.
2. Mira las páginas afectadas en local a ancho de ordenador (1440 px) y de móvil (390 px): nada cortado, nada fuera
   del margen, el formulario visible en el primer pantallazo en ordenador.
3. Si tocaste el formulario o el filtro, prueba un envío bueno y uno de spam.
4. Commit con un mensaje claro en español. Al hacer push a `main`, Netlify publica en 1-2 minutos. Para cambios
   grandes, usa una rama y abre un pull request: Netlify crea una vista previa para revisarlo antes de publicar.

## Pendiente de confirmar con NexClima
Está en `LEEME.md` (nota y número de reseñas, precio de diagnóstico, licencia, garantía, horario, ofertas, correo
propio service@nexclima.us, ID de GA4 y fotos reales).
