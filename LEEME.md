# NexClima: sitio nuevo

Sitio estático, rápido y sin WordPress, con 21 páginas, Tailwind CSS y animaciones con Motion. La portada transfiere
unos 310-400 KB en unas 10 peticiones, fotos incluidas (el sitio actual pesa unos 9 MB y hace 84).

## Cómo se usa
- Datos y textos: `src/data.mjs`. Estilos (Tailwind v4): `src/styles.css`. Animaciones y formulario (Motion): `src/app.js`.
- La primera vez: `npm install`. Para generar el sitio: `npm run build` → sale en `dist/`.
- Imágenes: originales en `img-src/` (hechas con Gemini: `node src/gemini-image.mjs`), versiones ligeras con
  `node src/images.mjs` → `public/img/`. La clave de Gemini está en `.env` (nunca se sube).
- Publicar: GitHub + Netlify (ver `netlify.toml`). El formulario usa una función de Netlify y Netlify Forms.

## Qué tiene
- **Captación**: barra de formulario en el primer pantallazo de cada página (problema, nombre, teléfono y ciudad),
  la ciudad se rellena sola en las páginas locales, barra fija en el móvil con «Llamar» y
  «Reservar», teléfono y WhatsApp junto al formulario, y aviso del teléfono si el envío falla.
- **Medición**: eventos `generate_lead`, `lead_form_start`, `booking_open`, `booking_fallback`, `phone_click`, `whatsapp_click` y `sms_click` (dataLayer /
  GA4), y guarda utm y gclid con cada lead.
- **SEO local**: 8 páginas de ciudad con contenido propio, las 4 páginas de servicio reescritas (adiós al texto
  industrial y de fontanería), esquema HVACBusiness + FAQPage + Service + BreadcrumbList, un solo H1 por página,
  sitemap.xml, robots.txt, canonical e imagen para compartir de 1200×630.
- **URLs del sitio actual conservadas** (servicios y La Vergne), así no se pierde posicionamiento.

## Pruebas sin indexar
Solo es producción el despliegue de `main` en el dominio real (`site.url`, https://nexclima.us). Cualquier otro
despliegue de Netlify (nexclima.netlify.app mientras no tenga el dominio, vistas previas de PR, ramas) sale con
`robots.txt` «Disallow: /», cabecera `X-Robots-Tag: noindex, nofollow` y `<meta name="robots" content="noindex,nofollow">`.
Al conectar nexclima.us en Netlify como dominio principal, **lanza un nuevo despliegue** (Deploys → Trigger deploy):
así el sitio pasa a indexable y nexclima.netlify.app redirige con 301 a nexclima.us.

## Leads, reservas y spam
- **Reservar online**: todos los botones «Book…» abren el widget de Housecall Pro (se carga después de la página para
  no frenarla). Si no cargara, bajan al formulario.
- **Formulario rápido** (problema, nombre, teléfono, ciudad): pasa por la función `netlify/functions/lead.mjs`, que
  descarta en silencio el spam (sin JavaScript, enviado en menos de 3 s, trampa invisible, nombres con enlaces o @,
  teléfonos imposibles en EE. UU., opciones inventadas). Los leads buenos se guardan en Netlify → **Forms →
  lead-verified**. Activa ahí las notificaciones por correo.
- Opcional: en Netlify → Environment variables, `LEAD_WEBHOOK_URL` envía cada lead bueno también a otra herramienta
  (Zapier, Make…), por ejemplo para crearlo en Housecall Pro.
- Las reglas del filtro están en `src/lead-rules.mjs`.

## PENDIENTE DE CONFIRMAR con NexClima (en `src/data.mjs`)
Nada de esto se muestra hasta que tenga un valor real:
1. ~~Valoración y número de reseñas de Google~~: hecho (5.0, 14 reseñas, sacado del Perfil de Empresa). Actualízalo de vez en cuando.
2. ~~Diagnóstico~~: hecho ($99; si contratan la reparación, solo pagan la reparación).
3. Licencia de Tennessee (`license`): pendiente. ~~Garantía~~ (1 año en instalaciones + fabricante 5-10 años) y ~~servicio el mismo día~~: hechos.
4. ~~Horario~~: hecho (lunes a sábado, 8:00-17:00, igual que en Google).
5. ~~Ofertas vigentes~~: hecho (28-11-2026, sin fecha de caducidad). /specials/ sale en el menú y en el sitemap.
6. Correo con dominio propio (service@nexclima.us) en lugar del Gmail.
7. ID de GA4 (`ga4`).
8. Fotos: ya se usan las de NexClima («Imagenes a Usar», con nombres descriptivos en `img-src/`). La del técnico junto al equipo es real; el resto son de ambientación hechas con IA (a las que tenían marca de agua se les recorta abajo en `src/images.mjs`).
9. Que se explique el precio antes de empezar cualquier trabajo (aparece en los puntos destacados).
10. ~~Financiación~~: hecho (28-11-2026, «Financing options available» en la portada junto a la garantía). Sin entidad, TAE, cuotas ni plazos hasta tener el dato real.

## Siguientes fases (según la auditoría)
- Versión en español de la portada y de 3 servicios.
- 6 artículos ancla (por qué el AC sopla aire caliente, cuánto cuesta cambiar el equipo en TN…).
- Páginas servicio × ciudad solo donde haya demanda (reparación de AC y reemplazo en Nashville, Franklin y Murfreesboro).
