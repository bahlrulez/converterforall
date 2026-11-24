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

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Builds schema instances with meaningful sample inputs for robust structural verification.
 */
export function buildSampleSchema(schemaType: string): Record<string, unknown> | null {
  switch (schemaType) {
    case "WebSite":
      return buildWebSiteSchema();
    case "Organization":
      return buildOrganizationSchema();
    case "BreadcrumbList":
      return buildBreadcrumbSchema([
        { name: "Home", url: SITE_ORIGIN, position: 1 },
        { name: "Sample Tool", url: `${SITE_ORIGIN}/sample-tool`, position: 2 }
      ]);
    case "SoftwareApplication":
      return buildSoftwareAppSchema({
        name: "Sample PDF Converter",
        description: "In-browser PDF converter utility.",
        url: `${SITE_ORIGIN}/sample-tool`,
        applicationCategory: "UtilitiesApplication"
      });
    case "FAQPage":
      return buildFaqPageSchema([
        { question: "How does this tool process files?", answer: "It executes directly in your browser without remote uploads." }
      ]);
    case "CollectionPage":
      return buildCollectionPageSchema({
        name: "Document Converters",
        description: "PDF and Office conversion tools.",
        url: `${SITE_ORIGIN}/category/document`,
        tools: [{ name: "PDF Splitter", url: `${SITE_ORIGIN}/split-pdf` }]
      });
    case "Article":
      return buildArticleSchema({
        title: "How to Convert Files in Your Browser",
        description: "Practical guide to in-browser conversion.",
        url: `${SITE_ORIGIN}/blog/guide`,
        datePublished: "2026-01-01"
      });
    default:
      return null;
  }
}

/**
 * Rigorously validates that a generated schema sample contains all required properties and valid structure.
 */
export function validateBuiltSchema(schemaType: string, output: Record<string, unknown> | null): SchemaValidationResult {
  const errors: string[] = [];

  if (!output || typeof output !== "object") {
    return { isValid: false, errors: ["Schema output is null or not an object."] };
  }

  if (schemaType === "WebSite" || schemaType === "Organization") {
    const items = Array.isArray(output["@graph"]) ? (output["@graph"] as Record<string, unknown>[]) : [output];
    const match = items.find((item) => item["@type"] === schemaType);
    if (!match) {
      errors.push(`Missing @type "${schemaType}".`);
    } else {
      if (!match.name || typeof match.name !== "string" || match.name.trim() === "") {
        errors.push(`${schemaType} missing name.`);
      }
      if (!match.url || typeof match.url !== "string" || match.url.trim() === "") {
        errors.push(`${schemaType} missing url.`);
      }
      if (!match["@id"]) {
        errors.push(`${schemaType} missing @id.`);
      }
    }
  } else if (schemaType === "BreadcrumbList") {
    if (output["@type"] !== "BreadcrumbList") {
      errors.push("Missing @type BreadcrumbList.");
    }
    const items = output.itemListElement;
    if (!Array.isArray(items) || items.length === 0) {
      errors.push("Breadcrumbs must contain a non-empty itemListElement array.");
    } else {
      const allValid = items.every((i: unknown) => {
        if (!i || typeof i !== "object") return false;
        const rec = i as Record<string, unknown>;
        return rec["@type"] === "ListItem" && rec.name && (rec.item || rec.url);
      });
      if (!allValid) {
        errors.push("Breadcrumb items must have @type ListItem, non-empty name, and item/url.");
      }
    }
  } else if (schemaType === "FAQPage") {
    if (output["@type"] !== "FAQPage") {
      errors.push("Missing @type FAQPage.");
    }
    const mainEntity = output.mainEntity;
    if (!Array.isArray(mainEntity) || mainEntity.length === 0) {
      errors.push("FAQPage must contain a non-empty mainEntity array of questions.");
    } else {
      const allValid = mainEntity.every((q: unknown) => {
        if (!q || typeof q !== "object") return false;
        const rec = q as Record<string, unknown>;
        const ans = rec.acceptedAnswer as Record<string, unknown> | undefined;
        return (
          rec["@type"] === "Question" &&
          rec.name &&
          ans &&
          ans["@type"] === "Answer" &&
          ans.text
        );
      });
      if (!allValid) {
        errors.push("FAQPage items must contain @type Question, non-empty name, and acceptedAnswer with non-empty Answer text.");
      }
    }
  } else if (schemaType === "SoftwareApplication") {
    if (output["@type"] !== "SoftwareApplication") {
      errors.push("Missing @type SoftwareApplication.");
    }
    if (!output.name || typeof output.name !== "string" || output.name.trim() === "") {
      errors.push("SoftwareApplication missing name.");
    }
    if (!output.url || typeof output.url !== "string" || output.url.trim() === "") {
      errors.push("SoftwareApplication missing url.");
    }
    const offers = output.offers as Record<string, unknown> | undefined;
    if (!offers || offers["@type"] !== "Offer" || offers.price !== "0" || !offers.priceCurrency) {
      errors.push("SoftwareApplication must contain a valid 0-price Offer.");
    }
  } else if (schemaType === "CollectionPage") {
    if (output["@type"] !== "CollectionPage") {
      errors.push("Missing @type CollectionPage.");
    }
    if (!output.name || typeof output.name !== "string" || output.name.trim() === "") {
      errors.push("CollectionPage missing category name.");
    }
    if (!output.url || typeof output.url !== "string" || output.url.trim() === "") {
      errors.push("CollectionPage missing category url.");
    }
    if (!output.description || typeof output.description !== "string" || output.description.trim() === "") {
      errors.push("CollectionPage missing description.");
    }
  } else if (schemaType === "Article") {
    if (output["@type"] !== "Article") {
      errors.push("Missing @type Article.");
    }
    if (!output.headline || typeof output.headline !== "string" || output.headline.trim() === "") {
      errors.push("Article missing headline.");
    }
    if (!output.description || typeof output.description !== "string" || output.description.trim() === "") {
      errors.push("Article missing description.");
    }
    if (!output.url || typeof output.url !== "string" || output.url.trim() === "") {
      errors.push("Article missing url.");
    }
    if (!output.datePublished || typeof output.datePublished !== "string" || output.datePublished.trim() === "") {
      errors.push("Article missing datePublished.");
    }
  }

  return { isValid: errors.length === 0, errors };
}
