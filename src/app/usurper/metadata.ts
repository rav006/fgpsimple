import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Admin | Fentiman Green Ltd',
  description: 'Admin dashboard for managing quote and contact inquiries at Fentiman Green Ltd.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Admin | Fentiman Green Ltd',
    description: 'Admin dashboard for managing quote and contact inquiries at Fentiman Green Ltd.',
    url: 'https://fentimangreen.co.uk/usurper',
    type: 'website',
  },
  other: {
    'script[type="application/ld+json"]': `{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Admin | Fentiman Green Ltd",
      "description": "Admin dashboard for managing quote and contact inquiries at Fentiman Green Ltd.",
      "url": "https://fentimangreen.co.uk/usurper"
    }`
  }
};

export default metadata;
