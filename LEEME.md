# NexClima: sitio nuevo

Sitio estático, rápido y sin WordPress, con 21 páginas, Tailwind CSS y animaciones con Motion. La portada transfiere
unos 310-400 KB en unas 10 peticiones, fotos incluidas (el sitio actual pesa unos 9 MB y hace 84).

## Cómo se usa
- Datos y textos: `src/data.mjs`. Estilos (Tailwind v4): `src/styles.css`. Animaciones y formulario (Motion): `src/app.js`.
- La primera vez: `npm install`. Para generar el sitio: `npm run build` → sale en `dist/`.
- Imágenes: originales en `img-src/` (hechas con Gemini: `node src/gemini-image.mjs`), versiones ligeras con
  `node src/images.mjs` → `public/img/`. La clave de Gemini está en `.env` (nunca se sube).
- Publicar: GitHub + Netlify (ver `netlify.toml`). El formulario funciona con Netlify Forms sin configurar nada más.
  En otro alojamiento (Vercel…) hay que poner un endpoint (Formspree u otro) en `formEndpoint`.

## Qué tiene
- **Captación**: barra de formulario en el primer pantallazo de cada página (problema, nombre, teléfono y ciudad),
  la ciudad se rellena sola en las páginas locales, barra fija en el móvil con «Llamar» y
  «Reservar», teléfono y WhatsApp junto al formulario, y aviso del teléfono si el envío falla.
- **Medición**: eventos `generate_lead`, `lead_form_start`, `phone_click`, `whatsapp_click` y `sms_click` (dataLayer /
  GA4), y guarda utm y gclid con cada lead.
- **SEO local**: 8 páginas de ciudad con contenido propio, las 4 páginas de servicio reescritas (adiós al texto
  industrial y de fontanería), esquema HVACBusiness + FAQPage + Service + BreadcrumbList, un solo H1 por página,
  sitemap.xml, robots.txt, canonical e imagen para compartir de 1200×630.
- **URLs del sitio actual conservadas** (servicios y La Vergne), así no se pierde posicionamiento.

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
