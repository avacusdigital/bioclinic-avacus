import { CLINIC_CONFIG, FAQ_ITEMS, SERVICES } from '../config/clinic';

/**
 * Gera os dados estruturados JSON-LD oficiais da BioClinic Estética Avançada.
 * Sem avaliações ou AggregateRating fictícios.
 */
export function buildStructuredDataJson(): string {
  const siteUrl = CLINIC_CONFIG.siteUrl.replace(/\/$/, '');

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: CLINIC_CONFIG.name,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}${CLINIC_CONFIG.logo.src}`,
        },
        email: CLINIC_CONFIG.contact.email,
        telephone: `+${CLINIC_CONFIG.contact.whatsappInternational}`,
        sameAs: [CLINIC_CONFIG.social.instagram.url],
      },
      {
        '@type': 'HealthAndBeautyBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: CLINIC_CONFIG.name,
        description: CLINIC_CONFIG.seo.description,
        url: siteUrl,
        image: `${siteUrl}${CLINIC_CONFIG.seo.ogImage}`,
        logo: `${siteUrl}${CLINIC_CONFIG.logo.src}`,
        telephone: `+${CLINIC_CONFIG.contact.whatsappInternational}`,
        email: CLINIC_CONFIG.contact.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${CLINIC_CONFIG.contact.address.street} - ${CLINIC_CONFIG.contact.address.neighborhood}`,
          addressLocality: CLINIC_CONFIG.contact.address.city,
          addressRegion: CLINIC_CONFIG.contact.address.state,
          postalCode: CLINIC_CONFIG.contact.address.postalCode,
          addressCountry: CLINIC_CONFIG.contact.address.country,
        },
        areaServed: {
          '@type': 'City',
          name: `${CLINIC_CONFIG.contact.address.city} - ${CLINIC_CONFIG.contact.address.state}`,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:30',
            closes: '19:30',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '10:00',
            closes: '19:30',
          },
        ],
        hasMap: CLINIC_CONFIG.contact.mapsShareUrl,
        sameAs: [CLINIC_CONFIG.social.instagram.url],
        founder: {
          '@type': 'Person',
          name: CLINIC_CONFIG.professional.name,
          jobTitle: CLINIC_CONFIG.professional.role,
          identifier: CLINIC_CONFIG.professional.registration,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Procedimentos Estéticos BioClinic',
          itemListElement: SERVICES.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.name,
              description: service.shortDescription,
              serviceType:
                service.category === 'facial' ? 'Procedimento Facial' : 'Procedimento Corporal',
              provider: {
                '@id': `${siteUrl}/#localbusiness`,
              },
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Serviços',
            item: `${siteUrl}/#servicos`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Agendamento',
            item: `${siteUrl}/#agendamento`,
          },
        ],
      },
    ],
  };

  return JSON.stringify(graph);
}
