// Datos del negocio y contenido del sitio. Edita aquí; luego `node src/build.mjs`.
// Todo lo marcado CONFIRMAR debe validarlo NexClima antes de publicar.

export const site = {
  url: 'https://nexclima.us',
  name: 'NexClima',
  legalName: 'NexClima Inc',
  phone: '(615) 669-9287',
  phoneHref: 'tel:+16156699287',
  sms: 'sms:+16156699287',
  whatsapp: 'https://wa.me/16156699287',
  email: 'nexclima.usa@gmail.com',
  street: '5479 Murfreesboro Rd Ste 5',
  city: 'La Vergne',
  region: 'TN',
  zip: '37086',
  // Horario tal como está en el Perfil de Empresa de Google (comprobado el 27-11-2026). Si cambia allí, cámbialo aquí.
  hours: [
    { days: 'Monday – Saturday', time: '8:00 AM – 5:00 PM', schema: 'Mo-Sa 08:00-17:00' },
  ],
  hoursConfirmed: true,
  founders: ['Willmer Vasquez', 'Maiker Briceño'],
  homeownersServed: '200+',
  social: {
    facebook: 'https://www.facebook.com/nexclima.us',
    instagram: 'https://www.instagram.com/Nexclima.us',
  },
  reviewsUrl: 'https://maps.google.com/?cid=15340710423373047795', // ficha de Google de Nexclima Inc
  // Destino del formulario: la función de Netlify que filtra el spam (netlify/functions/lead.mjs).
  // Los leads buenos llegan a Netlify Forms (formulario «lead-verified») con aviso por correo.
  formEndpoint: '/api/lead',
  // Housecall Pro: widget de reservas online (identificador público, ya visible en la web actual).
  hcp: { token: '24d4fbcb0c6c4212a1c0480e124b8689', org: 'Nexclima-Inc' },
  // ID de Google Analytics 4 (G-XXXX). Vacío = no se carga nada.
  ga4: '',
  // Decoración de temporada (temporal). 'christmas' = adornos de Navidad; null = web normal. Quítalo en enero.
  season: 'christmas',
  // --- Pruebas de confianza: solo se muestran si tienen valor (nunca inventar) ---
  googleRating: '5.0',      // Perfil de Empresa de Google, comprobado el 27-11-2026 (actualízalo de vez en cuando)
  googleReviewCount: 14,    // idem
  diagnosticPrice: '$99',   // confirmado por NexClima (27-11-2026): cualquier visita de diagnóstico
  diagnosticWaived: true,   // si contratan la reparación, solo pagan la reparación
  license: null,            // CONFIRMAR, p. ej. 'TN License #12345'
  warranty: '1-year warranty on new installations, plus the manufacturer’s 5–10 year parts warranty', // confirmado 27-11-2026
  // Financiación: confirmada por NexClima (28-11-2026). null = no se muestra.
  // Nunca añadir entidad, TAE, cuotas, plazos ni aprobación sin el dato real.
  financing: 'Financing options available',
  responseTime: 'the same day', // confirmado 27-11-2026: servicio el mismo día
  // Auditoría H-08: crear service@nexclima.us y ponerlo aquí en lugar del Gmail.
};

export const reviews = [
  {
    name: 'Joan Strohwig',
    text: 'They did a fantastic job accurately diagnosing the problem with our air conditioning unit. We had a family birthday the next day, and they worked hard to accommodate our schedule and get the job done so our guests would be comfortable.',
    tag: 'AC repair',
  },
  {
    name: 'Miche Lle',
    text: 'Our air went out, and what I thought would be an easy fix turned out to be the compressor. You made the process easy and communicated every step of the way. Trustworthy, reliable, and dependable.',
    tag: 'Compressor replacement',
  },
  {
    name: 'Rachel',
    text: 'I recently had maintenance done on my A/C unit, and I’m very satisfied. They cleaned the coil and the evaporator thoroughly. The technician was professional, on time, and now the system is running great.',
    tag: 'AC maintenance',
  },
  {
    name: 'Matthew Kitchin',
    text: 'NexClima provided great service, explained everything clearly, and made the whole process easy. Very professional and highly recommended.',
    tag: 'HVAC service',
  },
];

// Problemas que el cliente reconoce (alimentan el formulario y la sección de síntomas).
export const issues = [
  'AC not cooling',
  'No heat',
  'Weak airflow',
  'Water leaking from unit',
  'Strange noise or smell',
  'Thermostat issue',
  'Tune-up / maintenance',
  'New system estimate',
  'Other',
];

// Slugs antiguos conservados para no perder posicionamiento.
export const services = [
  {
    slug: 'air-conditioning-services-in-middle-tennessee',
    short: 'AC Repair',
    nav: 'Air conditioning',
    icon: 'snow',
    title: 'AC Repair & Air Conditioning Service in Middle Tennessee',
    h1: 'AC repair for Middle Tennessee homes',
    meta: 'AC not cooling? NexClima repairs central air conditioners and heat pumps in Nashville, La Vergne, Smyrna, Murfreesboro, Franklin and nearby. Call (615) 669-9287.',
    lead: 'When the house won’t cool down in a Tennessee July, you need a technician who finds the real cause and tells you plainly what it costs to fix. We repair central AC systems and heat pumps of every major brand.',
    card: 'Diagnosis and repair for central AC and heat pumps that won’t cool, freeze up, leak or short-cycle.',
    signs: [
      'The system runs but the air from the vents is warm',
      'Ice on the copper lines or the indoor coil',
      'Water around the indoor unit or a full drain pan',
      'The outdoor unit hums, clicks or won’t start',
      'The breaker trips when the AC kicks on',
      'Some rooms stay hot while others are cold',
    ],
    work: [
      ['Capacitors, contactors and motors', 'The most common summer failures. We test them under load and replace only what has failed.'],
      ['Refrigerant leaks', 'We find the leak before adding refrigerant, so you are not paying to refill a system that will be low again next month.'],
      ['Frozen coils and drain lines', 'Clogged filters, low airflow and blocked condensate lines, cleared and checked so they don’t come back.'],
      ['Compressors', 'When a compressor fails we lay out repair and replacement side by side, with the age of the system in mind.'],
    ],
    faq: [
      ['Why is my AC running but not cooling?', 'The usual causes are a dirty filter or coil, low refrigerant from a leak, a failed capacitor or fan motor at the outdoor unit, or a frozen indoor coil. Turn the system to “fan only” if you see ice, change the filter, and call us if it still won’t cool.'],
      ['Should I repair or replace my air conditioner?', 'If the system is under 10 years old and the repair is a part like a capacitor, motor or contactor, repair is usually the right call. If it is 12–15 years old, uses R-22 refrigerant, or needs a compressor or coil, we show you both options with prices so you can compare.'],
      ['Do you work on heat pumps?', 'Yes. Most Middle Tennessee homes use a heat pump for both cooling and heating, and we service and repair them year-round.'],
    ],
  },
  {
    slug: 'residential-heating-services',
    short: 'Heating Repair',
    nav: 'Heating',
    icon: 'flame',
    title: 'Heating Repair: Furnace & Heat Pump Service in Middle Tennessee',
    h1: 'Furnace and heat pump repair in Middle Tennessee',
    meta: 'No heat? NexClima repairs heat pumps, gas furnaces and electric furnaces in La Vergne, Nashville, Smyrna, Murfreesboro, Franklin and nearby. Call (615) 669-9287.',
    lead: 'A cold snap in Middle Tennessee is when heat pumps and furnaces show their weak points. We diagnose the problem, explain it in plain words and get the heat back on.',
    card: 'Heat pump, gas furnace and electric furnace repair when the house won’t warm up.',
    signs: [
      'The heat runs but the air feels lukewarm',
      'The heat pump is stuck in defrost or covered in ice',
      'The furnace starts, then shuts off after a few minutes',
      'A burning or electrical smell when the heat comes on',
      'The emergency or auxiliary heat light stays on',
      'Your power bill jumped with the first cold month',
    ],
    work: [
      ['Heat pumps', 'Reversing valves, defrost boards, sensors and refrigerant problems that leave a heat pump blowing cool air.'],
      ['Gas furnaces', 'Ignitors, flame sensors, pressure switches and inducer motors, with a safety check of the burner and venting.'],
      ['Electric furnaces and heat strips', 'Sequencers, elements and breakers, which decide whether backup heat actually works on the coldest nights.'],
      ['Thermostats', 'Wiring and settings checked, because a wrong setting can run expensive auxiliary heat all day.'],
    ],
    faq: [
      ['Why is my heat pump blowing cold air?', 'During defrost a heat pump briefly blows cooler air; that’s normal for a few minutes. If it lasts, the cause may be low refrigerant, a stuck reversing valve, a failed defrost control or backup heat that is not coming on.'],
      ['Is it normal for my heat pump to have ice on it?', 'A thin frost that clears every 30–90 minutes is normal. A solid block of ice, or ice that never clears, means the defrost cycle isn’t working and the unit needs service.'],
      ['What should I do if I smell gas?', 'Leave the house, don’t switch anything on or off, and call your gas company or 911 from outside. Call us once the gas company says it is safe.'],
    ],
  },
  {
    slug: 'tune-ups-maintenance',
    short: 'Maintenance',
    nav: 'Tune-ups & maintenance',
    icon: 'wrench',
    title: 'HVAC Tune-Ups & Maintenance in Middle Tennessee',
    h1: 'HVAC tune-ups and maintenance for your home',
    meta: 'Seasonal AC and heating tune-ups in La Vergne, Nashville, Smyrna, Murfreesboro, Franklin and nearby. Clean coils, tested parts, lower bills. Call (615) 669-9287.',
    lead: 'Most breakdowns we see in July and January start as small problems that a tune-up would have caught. Twice a year, spring for cooling and fall for heating, we clean, test and adjust your system.',
    card: 'Spring AC and fall heating tune-ups that catch weak parts before they fail.',
    signs: [
      'The system hasn’t been serviced in over a year',
      'Energy bills creep up from year to year',
      'Dust builds up quickly around the vents',
      'The system takes longer to reach the set temperature',
      'You are moving into a home with an unknown service history',
      'Your warranty requires yearly maintenance',
    ],
    work: [
      ['Coil cleaning', 'Outdoor condenser rinsed and indoor evaporator checked, so the system moves heat the way it was designed to.'],
      ['Electrical testing', 'Capacitors, contactors and connections measured. Weak parts are pointed out before they leave you without air.'],
      ['Refrigerant and airflow', 'Pressures, temperature split and airflow checked against the manufacturer’s numbers.'],
      ['Drain and safety checks', 'Condensate line flushed, float switch tested; on furnaces, burners, flame sensor and venting checked.'],
    ],
    faq: [
      ['How often should I service my HVAC system?', 'Twice a year: the cooling side in spring and the heating side in fall. With a heat pump, which works all year, both visits matter.'],
      ['What does an HVAC tune-up include?', 'Cleaning the coils, testing the electrical parts, checking refrigerant and airflow, flushing the drain line and testing safety controls. You get a short report of what we found.'],
      ['Can a tune-up lower my energy bill?', 'Yes. Dirty coils, weak parts and poor airflow all make the system run longer. Cleaning and adjusting them helps it reach temperature faster and use less power.'],
    ],
  },
  {
    slug: 'system-replacement',
    short: 'Replacement',
    nav: 'New system installation',
    icon: 'house',
    title: 'HVAC Replacement & New AC Installation in Middle Tennessee',
    h1: 'HVAC replacement sized for your home',
    meta: 'Replacing your AC, heat pump or furnace? NexClima sizes, quotes and installs new HVAC systems in Nashville, La Vergne, Smyrna, Murfreesboro, Franklin and nearby.',
    lead: 'A new system is a big purchase. We measure your home, look at the ductwork you already have and show you a few options, from a straightforward replacement to a high-efficiency heat pump, so you choose with the numbers in front of you.',
    card: 'New heat pumps, air conditioners and furnaces, sized to your home and installed cleanly.',
    signs: [
      'The system is 12–15 years old or more',
      'It still uses R-22 refrigerant',
      'A compressor or coil has failed out of warranty',
      'Repairs are adding up every season',
      'Some rooms never get comfortable',
      'You are remodeling or finishing a basement or bonus room',
    ],
    work: [
      ['Load calculation', 'We size the system to your home’s square footage, insulation, windows and sun, not just the old unit’s label.'],
      ['Duct inspection', 'A new unit on leaky or undersized ducts won’t perform. We check them and tell you what needs attention.'],
      ['Options side by side', 'Standard and high-efficiency choices, with what each costs up front and what it may save each month.'],
      ['Clean installation', 'Old equipment removed, new pad, line set and drain where needed, the system started and tested, and how it works explained to you.'],
    ],
    faq: [
      ['How do I know if it is time to replace my HVAC system?', 'Age (12–15+ years), frequent repairs, R-22 refrigerant, rising bills and rooms that never get comfortable are the usual signs. If the repair cost is approaching half the price of a new system, replacement is usually the better investment.'],
      ['What warranty comes with a new system?', 'Our installation work has a 1-year warranty, and the equipment carries the manufacturer’s parts warranty, usually 5 to 10 years depending on the brand and registration.'],
      ['Do I need repair or full system replacement?', 'It depends on the age of the equipment, the part that failed and what you plan for the home. We give you both prices so you can decide, with no pressure.'],
      ['Can a smart thermostat help lower energy bills?', 'Yes, when it is set up correctly. Schedules and setbacks cut run time, and on a heat pump the thermostat must be configured so it doesn’t lean on costly auxiliary heat.'],
    ],
  },
];

// Ciudades. Slugs con el patrón del sitio actual (hvac-services-<ciudad>-tn).
export const cities = [
  {
    slug: 'hvac-services-la-vergne-tn',
    name: 'La Vergne',
    county: 'Rutherford County',
    zips: ['37086'],
    drive: 'Our shop is on Murfreesboro Road in La Vergne',
    areas: ['Lake Forest', 'Waldron Road', 'Old Nashville Highway', 'Murfreesboro Road', 'Smyrna line'],
    intro: 'La Vergne is home base. Our shop is on Murfreesboro Road, so homeowners here get us the fastest of anywhere we work.',
    local: 'Many La Vergne neighborhoods were built from the 1980s through the 2000s, which means a lot of original heat pumps and air handlers are now at or past the end of their life. We see plenty of failed capacitors and worn blower motors in summer, and heat pumps that struggle in the January cold snaps.',
    nearby: ['hvac-services-smyrna-tn', 'hvac-services-nashville-tn', 'hvac-services-murfreesboro-tn'],
  },
  {
    slug: 'hvac-services-smyrna-tn',
    name: 'Smyrna',
    county: 'Rutherford County',
    zips: ['37167'],
    drive: 'About 10 minutes from our La Vergne shop',
    areas: ['Downtown Smyrna', 'Lee Victory Parkway', 'Sam Ridley Parkway', 'Almaville Road', 'Rocky Fork'],
    intro: 'Smyrna is right next door to our La Vergne shop, so we are often at your house the same day you call.',
    local: 'Smyrna has grown fast, with newer subdivisions along Sam Ridley and Almaville and older homes near downtown. Newer homes often have builder-grade systems that need their first major repair around year eight to twelve; older homes often need duct work along with the equipment.',
    nearby: ['hvac-services-la-vergne-tn', 'hvac-services-murfreesboro-tn', 'hvac-services-nashville-tn'],
  },
  {
    slug: 'hvac-services-murfreesboro-tn',
    name: 'Murfreesboro',
    county: 'Rutherford County',
    zips: ['37127', '37128', '37129', '37130'],
    drive: 'About 20 minutes from our La Vergne shop',
    areas: ['Blackman', 'Siegel', 'Indian Hills', 'Downtown & MTSU area', 'Gateway'],
    intro: 'From Blackman to the MTSU area, we repair and maintain heating and cooling systems for Murfreesboro homeowners and landlords.',
    local: 'Murfreesboro mixes historic homes near the square, rental houses around MTSU and large newer neighborhoods out toward Blackman and Siegel. Rentals in particular benefit from yearly tune-ups: a clogged filter or drain line left too long is the most common cause of a summer no-cool call.',
    nearby: ['hvac-services-smyrna-tn', 'hvac-services-la-vergne-tn', 'hvac-services-lebanon-tn'],
  },
  {
    slug: 'hvac-services-nashville-tn',
    name: 'Nashville',
    county: 'Davidson County',
    zips: ['37013', '37211', '37217', '37214', '37076'],
    drive: 'About 15–25 minutes from our La Vergne shop',
    areas: ['Antioch', 'Cane Ridge', 'Donelson', 'Hermitage', 'Crieve Hall'],
    intro: 'We serve Nashville homeowners from Antioch and Cane Ridge to Donelson and Hermitage, a short drive up I-24 from our shop.',
    local: 'Nashville’s humid summers and high pollen counts are hard on HVAC systems and on the people living with them. A system that is oversized, has a dirty coil or leaky ducts will leave the house clammy even when the thermostat is satisfied. We look at humidity and airflow, not just temperature.',
    nearby: ['hvac-services-la-vergne-tn', 'hvac-services-brentwood-tn', 'hvac-services-mt-juliet-tn'],
  },
  {
    slug: 'hvac-services-brentwood-tn',
    name: 'Brentwood',
    county: 'Williamson County',
    zips: ['37027'],
    drive: 'About 25 minutes from our La Vergne shop',
    areas: ['Maryland Farms', 'Concord Road', 'Crockett Road', 'Raintree', 'Brentwood Hills'],
    intro: 'Brentwood homes are larger than average, and many have two or three systems. We service, repair and replace each of them.',
    local: 'Many Brentwood homes run separate systems for the main floor, the upstairs and the bonus room, often with zoning. When one zone won’t keep up, the cause can be the equipment, a damper or the ducts. We check the whole setup so you don’t replace a unit that wasn’t the problem.',
    nearby: ['hvac-services-franklin-tn', 'hvac-services-nashville-tn', 'hvac-services-la-vergne-tn'],
  },
  {
    slug: 'hvac-services-franklin-tn',
    name: 'Franklin',
    county: 'Williamson County',
    zips: ['37064', '37067', '37069'],
    drive: 'About 30 minutes from our La Vergne shop',
    areas: ['Downtown Franklin', 'Cool Springs', 'Westhaven', 'Fieldstone Farms', 'Berry Farms'],
    intro: 'From historic homes downtown to newer neighborhoods in Westhaven and Berry Farms, we keep Franklin homes comfortable year-round.',
    local: 'Franklin’s older homes often have systems squeezed into crawl spaces and attics never meant for modern equipment, while newer homes tend to have high-efficiency heat pumps that need correct setup to deliver the savings they promise. Both reward a technician who takes time to look before quoting.',
    nearby: ['hvac-services-brentwood-tn', 'hvac-services-nashville-tn', 'hvac-services-smyrna-tn'],
  },
  {
    slug: 'hvac-services-mt-juliet-tn',
    name: 'Mt. Juliet',
    county: 'Wilson County',
    zips: ['37122'],
    drive: 'About 25 minutes from our La Vergne shop',
    areas: ['Providence', 'Del Webb Lake Providence', 'Willoughby Station', 'Nonaville Road', 'Gladeville'],
    intro: 'Mt. Juliet keeps growing, and so do the heating and cooling needs of its homes. We serve the whole city, from Providence to Gladeville.',
    local: 'A large share of Mt. Juliet homes were built in the last twenty years, so many systems are reaching the age where the first big repairs show up. Near Old Hickory Lake, extra humidity makes clean coils and a clear drain line especially important.',
    nearby: ['hvac-services-lebanon-tn', 'hvac-services-nashville-tn', 'hvac-services-la-vergne-tn'],
  },
  {
    slug: 'hvac-services-lebanon-tn',
    name: 'Lebanon',
    county: 'Wilson County',
    zips: ['37087', '37090'],
    drive: 'About 35 minutes from our La Vergne shop',
    areas: ['Downtown Lebanon', 'Cumberland University area', 'Hickory Ridge', 'Five Oaks', 'South Hartmann'],
    intro: 'We bring residential heating and cooling service to Lebanon homeowners, from the historic square to the newer neighborhoods off South Hartmann.',
    local: 'Lebanon has older homes near the square and the university, and plenty of newer construction toward I-40. Older houses often need a look at the ductwork and insulation along with the equipment; on newer ones, regular maintenance keeps the warranty and the efficiency intact.',
    nearby: ['hvac-services-mt-juliet-tn', 'hvac-services-murfreesboro-tn', 'hvac-services-nashville-tn'],
  },
];

export const homeFaq = [
  ['How fast can you come out?', 'We offer same-day service. Call us and we’ll give you the earliest time we have; homes close to our La Vergne shop, in La Vergne, Smyrna and southeast Nashville, are usually the quickest to reach.'],
  ['How much does a diagnostic visit cost?', 'The diagnostic visit is $99. If you go ahead with the repair, you only pay for the repair: the $99 is waived.'],
  ['What are the signs my AC system needs repair?', 'Warm air from the vents, ice on the lines, water around the indoor unit, new noises, a breaker that trips, or a power bill that jumps without a reason.'],
  ['Why is airflow weak in some rooms?', 'Usually a dirty filter or coil, a blower problem, closed or blocked vents, or leaky or undersized ductwork. We measure airflow to find which one it is.'],
  ['How often should I service my HVAC system?', 'Twice a year: cooling in spring, heating in fall. Heat pumps work all year, so both visits matter.'],
  ['Do you work on commercial buildings?', 'No. We focus on homes: houses, townhomes and condos, and the people who live in them.'],
  ['Which areas do you serve?', 'La Vergne, Smyrna, Murfreesboro, Nashville, Brentwood, Franklin, Mt. Juliet and Lebanon, and the communities in between.'],
];

// Ofertas vigentes, confirmadas por NexClima (28-11-2026). Sin fecha de caducidad: no la pongas en la web.
export const specials = [
  {
    title: 'Precision tune-up',
    price: '$79',
    was: '$129',
    text: 'AC or heating tune-up: coil cleaning, electrical testing, refrigerant and airflow check, drain flush and a written report.',
  },
  {
    title: 'Second opinion on a replacement quote',
    price: 'Free',
    was: '',
    text: 'Were you told you need a new system? Send us the quote; we’ll check whether a repair still makes sense.',
  },
];
export const specialsConfirmed = true; // confirmado 28-11-2026 (false = página oculta y con noindex)
