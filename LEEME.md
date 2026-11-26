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
1. Valoración y número de reseñas de Google (`googleRating`, `googleReviewCount`).
2. Precio del diagnóstico y si se descuenta al reparar (`diagnosticPrice`, `diagnosticWaived`).
3. Licencia de Tennessee (`license`), garantía (`warranty`) y tiempo de respuesta (`responseTime`).
4. Horario real (`hours` + `hoursConfirmed: true`).
5. Ofertas vigentes (`specials` + `specialsConfirmed: true`); hasta entonces /specials/ no sale en el menú.
6. Correo con dominio propio (service@nexclima.us) en lugar del Gmail.
7. ID de GA4 (`ga4`).
8. Fotos reales del equipo y de trabajos: las actuales son de ambientación hechas con IA (`img-src/`).
9. Que se explique el precio antes de empezar cualquier trabajo (aparece en los puntos destacados).

## Siguientes fases (según la auditoría)
- Versión en español de la portada y de 3 servicios.
- 6 artículos ancla (por qué el AC sopla aire caliente, cuánto cuesta cambiar el equipo en TN…).
- Páginas servicio × ciudad solo donde haya demanda (reparación de AC y reemplazo en Nashville, Franklin y Murfreesboro).
