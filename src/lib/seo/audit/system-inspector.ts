import { SystemSeoInspection } from "../types";
import { toolsDatabase, getCanonicalToolSlugs } from "@/lib/tools-db";
import { getAllBlogSlugs } from "@/lib/blog-data";

export function inspectSeoSystem(): SystemSeoInspection {
  const baseRoutesCount = 10; // '', about, contact, privacy, terms, disclaimer, accessibility, cookie-policy, editorial-policy, blog
  const categoryRoutesCount = Object.keys(toolsDatabase).length; // 7
  const canonicalToolsCount = getCanonicalToolSlugs().length; // 154
  const blogRoutesCount = getAllBlogSlugs().length; // Blog count
  const totalSitemapUrls = baseRoutesCount + categoryRoutesCount + canonicalToolsCount + blogRoutesCount;

  // 1. Sitemap Inspection
  const sitemapIssues: string[] = [];
  // Notice: sitemap uses weekly changeFrequency and lastModified = new Date() on build time
  // Note: Aliases are correctly excluded from sitemap.ts to prevent duplicate indexation!

  // 2. Robots.txt Inspection
  const robotsIssues: string[] = [];
  // robots.ts allows userAgent: '*', disallows /api/ and /private/
  // Need to ensure /admin/ is also disallowed or kept noindexed so debug routes stay private!
  robotsIssues.push("The /admin/ internal debug route should be blocked from crawler access via robots.txt or noindex directive.");

  // 3. Canonical Strategy Inspection
  const canonicalIssues: string[] = [];
  // In [slug]/page.tsx line 35:
  // alternates.canonical is `https://www.converterforall.com/${resolvedParams.slug}`
  // If an alias slug is visited (e.g. /kruti-dev-to-mangal), canonical points to itself rather than target /krutidev-to-unicode!
  canonicalIssues.push(
    "Critical Canonical Discrepancy: For alias routes in [slug]/page.tsx, canonical URL points to the alias slug instead of the canonical target slug (e.g. /kruti-dev-to-mangal points to itself instead of /krutidev-to-unicode)."
  );

  // 4. Metadata Generation Inspection
  const metadataIssues: string[] = [];
  // Title template in layout.tsx: "%s | ConverterForAll"
  // In [slug]/page.tsx: generates seoTitle or `${title} | 100% Free & Private Online Tool`
  // Note: Template in layout may double-suffix ConverterForAll if not careful.

  // 5. Schema Generation Inspection
  const schemaIssues: string[] = [];
  // Tool page injects BreadcrumbList and SoftwareApplication schemas
  // SoftwareApplication has offers { price: 0, priceCurrency: 'USD' } and aggregateRating
  // However, FAQPage schema is not yet injected into tool pages despite having rich FAQ sections!
  schemaIssues.push(
    "Opportunity: Tool pages feature rich FAQ sections in visible text, but do not yet emit structured FAQPage JSON-LD schemas."
  );

  // 6. Analytics and Search Console Integration
  const analyticsIssues: string[] = [];
  const googleAnalyticsId = "G-49NFK7K9W6";
  const googleSiteVerification = "google8e488f91621932b6";
  const vercelAnalyticsEnabled = true;

  return {
    sitemap: {
      totalUrls: totalSitemapUrls,
      urlCountsByType: {
        baseRoutes: baseRoutesCount,
        categoryRoutes: categoryRoutesCount,
        toolRoutes: canonicalToolsCount,
        blogRoutes: blogRoutesCount,
      },
      hasSitemapXml: true,
      issues: sitemapIssues,
    },
    robotsTxt: {
      isCrawlerAllowed: true,
      disallowedPaths: ["/api/", "/private/"],
      sitemapUrl: "https://www.converterforall.com/sitemap.xml",
      issues: robotsIssues,
    },
    canonicalStrategy: {
      baseUrl: "https://www.converterforall.com",
      isSelfReferentialCanonical: true,
      handlesAliasesCorrectly: false,
      issues: canonicalIssues,
    },
    metadataGeneration: {
      hasMetadataBase: true,
      titleTemplate: "%s | ConverterForAll",
      hasOpenGraph: true,
      hasTwitterCard: true,
      issues: metadataIssues,
    },
    schemaGeneration: {
      hasOrganizationSchema: true,
      hasWebSiteSchema: true,
      hasBreadcrumbListSchema: true,
      hasSoftwareApplicationSchema: true,
      issues: schemaIssues,
    },
    analyticsAndSearchConsole: {
      googleAnalyticsId,
      googleSiteVerification,
      vercelAnalyticsEnabled,
      issues: analyticsIssues,
    },
  };
}
