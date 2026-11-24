import { SITE_ORIGIN, SITE_SCHEMA_TYPES } from "./site-config";

export interface BreadcrumbInputItem {
  name: string;
  url: string;
  position?: number;
}

export interface FaqInputItem {
  question: string;
  answer: string;
}

export interface SoftwareAppInput {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}

export interface CollectionPageInput {
  name: string;
  description: string;
  url: string;
  tools?: { name: string; url: string; description?: string }[];
}

export interface ArticleInput {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}

/**
 * Builds schema.org WebSite JSON-LD object.
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": SITE_SCHEMA_TYPES.website,
    "@id": `${SITE_ORIGIN}/#website`,
    "url": SITE_ORIGIN,
    "name": "ConverterForAll",
    "description": "Free online file and font converter for PDFs, images, videos, audio, and Indian regional scripts. Most tools run directly in your browser with zero signups or watermarks.",
    "publisher": {
      "@id": `${SITE_ORIGIN}/#organization`
    }
  };
}

/**
 * Builds schema.org Organization JSON-LD object.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": SITE_SCHEMA_TYPES.organization,
    "@id": `${SITE_ORIGIN}/#organization`,
    "name": "ConverterForAll",
    "url": `${SITE_ORIGIN}/`,
    "logo": `${SITE_ORIGIN}/icon.png`,
    "description": "Free web-first file conversion and optimization utilities with in-browser processing."
  };
}

/**
 * Builds schema.org homepage graph with WebSite and Organization entities.
 */
export function buildHomepageGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebSiteSchema(),
      buildOrganizationSchema()
    ]
  };
}

/**
 * Builds schema.org BreadcrumbList JSON-LD object.
 */
export function buildBreadcrumbSchema(items: BreadcrumbInputItem[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": SITE_SCHEMA_TYPES.breadcrumb,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": item.position ?? index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Builds schema.org SoftwareApplication JSON-LD object for tools.
 */
export function buildSoftwareAppSchema(params?: Partial<SoftwareAppInput>) {
  const name = params?.name || "ConverterForAll Tool";
  const description = params?.description || "In-browser file converter utility.";
  const url = params?.url || SITE_ORIGIN;
  const applicationCategory = params?.applicationCategory || "UtilitiesApplication";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": SITE_SCHEMA_TYPES.softwareApplication,
    "name": name,
    "url": url,
    "operatingSystem": "All",
    "applicationCategory": applicationCategory,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  if (params?.rating && params.rating.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": params.rating.ratingValue,
      "reviewCount": params.rating.reviewCount,
      "bestRating": String(params.rating.bestRating ?? 5),
      "worstRating": String(params.rating.worstRating ?? 1)
    };
  }

  return schema;
}

/**
 * Builds schema.org FAQPage JSON-LD object.
 */
export function buildFaqPageSchema(faqs: FaqInputItem[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": SITE_SCHEMA_TYPES.faqPage,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Builds schema.org CollectionPage JSON-LD object for category hubs.
 */
export function buildCollectionPageSchema(params?: Partial<CollectionPageInput>) {
  const name = params?.name || "Category Hub";
  const description = params?.description || "Collection of file conversion tools.";
  const url = params?.url || `${SITE_ORIGIN}/category`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url,
    ...(params?.tools && params.tools.length > 0 ? {
      "hasPart": params.tools.map(tool => ({
        "@type": "SoftwareApplication",
        "name": tool.name,
        "url": tool.url,
        ...(tool.description ? { "description": tool.description } : {})
      }))
    } : {})
  };
}

/**
 * Builds schema.org Article JSON-LD object for blog posts.
 */
export function buildArticleSchema(params?: Partial<ArticleInput>) {
  const title = params?.title || "Article";
  const description = params?.description || "ConverterForAll educational article.";
  const url = params?.url || `${SITE_ORIGIN}/blog`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": params?.datePublished || "2026-01-01",
    "dateModified": params?.dateModified || params?.datePublished || "2026-01-01",
    "author": {
      "@type": "Organization",
      "name": params?.authorName || "ConverterForAll Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_ORIGIN}/icon.png`
      }
    },
    ...(params?.imageUrl ? { "image": params.imageUrl } : {})
  };
}

/**
 * Registry of schema builders for source-level audit inspection and verification.
 */
export const SCHEMA_BUILDERS = {
  WebSite: buildWebSiteSchema,
  Organization: buildOrganizationSchema,
  BreadcrumbList: buildBreadcrumbSchema,
  SoftwareApplication: buildSoftwareAppSchema,
  FAQPage: buildFaqPageSchema,
  CollectionPage: buildCollectionPageSchema,
  Article: buildArticleSchema
} as const;

export type RegisteredSchemaType = keyof typeof SCHEMA_BUILDERS;
