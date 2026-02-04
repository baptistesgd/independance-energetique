export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
}

export const SITE_CONFIG = {
  name: 'Pôle Énergie & Autonomie',
  tagline: 'Votre indépendance énergétique commence ici',
  url: 'https://pole-energie-autonomie.fr',
  defaultImage: '/images/og-default.webp',
  twitterHandle: '@PoleEnergieAuto',
  locale: 'fr_FR',
};

export function generateSEOMeta(props: SEOProps) {
  const {
    title,
    description,
    canonical,
    ogImage = SITE_CONFIG.defaultImage,
    ogType = 'website',
    publishedDate,
    modifiedDate,
    author,
    keywords = [],
    noindex = false,
  } = props;

  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = canonical || SITE_CONFIG.url;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`;

  return {
    title: fullTitle,
    description,
    canonical: canonicalUrl,
    ogImage: ogImageUrl,
    ogType,
    publishedDate,
    modifiedDate,
    author,
    keywords: keywords.join(', '),
    noindex,
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedDate: string;
  modifiedDate?: string;
  author: {
    name: string;
    url?: string;
  };
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function generateLocalBusinessSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    description: 'Expert en solutions d\'autonomie énergétique : panneaux solaires, batteries de stockage, bornes de recharge et éolien domestique.',
    url: SITE_CONFIG.url,
    telephone: '+33-X-XX-XX-XX-XX',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 46.603354,
      longitude: 1.888334,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.facebook.com/PoleEnergieAutonomie',
      'https://www.linkedin.com/company/pole-energie-autonomie',
    ],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
