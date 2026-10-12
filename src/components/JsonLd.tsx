import { TOOLS } from '@/config/tools';

interface JsonLdProps {
  toolId: string;
}

export default function JsonLd({ toolId }: JsonLdProps) {
  const tool = TOOLS[toolId];
  if (!tool) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `https://www.converterforall.com${tool.path}`,
    applicationCategory: tool.category === 'sarkari' ? 'UtilitiesApplication' : 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
