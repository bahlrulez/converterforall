import { SystemSeoInspection } from "../types";
import { toolsDatabase, getCanonicalToolSlugs, SLUG_ALIASES, getToolBySlug } from "@/lib/tools-db";
import sitemap, { BASE_SITEMAP_ROUTES } from "@/app/sitemap";
import robots from "@/app/robots";
import { siteMetadata } from "@/lib/seo/site-metadata";
import {
  ENABLE_VERCEL_ANALYTICS,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_SITE_VERIFICATION_TOKEN,
  SITE_ORIGIN,
  SITE_SCHEMA_TYPES,
} from "@/lib/seo/site-config";
import { NOINDEX_CATEGORIES, TIER_C_NOINDEX_SLUGS } from "@/config/sitemap-lastmod";
import { TOOLS } from "@/config/tools";

function asArray(value: string | string[] | undefined): string[] {
  if (typeof value === "string") return [value];
  return Array.isArray(value) ? value : [];
}

export function inspectSeoSystem(): SystemSeoInspection {
  const sitemapEntries = sitemap();
  const sitemapUrls = sitemapEntries.map((entry) => new URL(entry.url));
  const sitemapPaths = sitemapUrls.map((url) => url.pathname);
  const sitemapPathSet = new Set(sitemapPaths);
  const sitemapIssues: string[] = [];

  const duplicateSitemapPaths = sitemapPaths.filter((path, index) => sitemapPaths.indexOf(path) !== index);
  if (duplicateSitemapPaths.length > 0) {
    sitemapIssues.push(`Duplicate sitemap paths detected: ${Array.from(new Set(duplicateSitemapPaths)).join(", ")}.`);
  }

  const foreignSitemapUrls = sitemapUrls.filter((url) => url.origin !== SITE_ORIGIN);
  if (foreignSitemapUrls.length > 0) {
    sitemapIssues.push(`${foreignSitemapUrls.length} sitemap URL(s) do not use the configured canonical origin.`);
  }

  const noindexCategorySet = new Set<string>(NOINDEX_CATEGORIES);
  const allCategorySlugs = Object.keys(toolsDatabase);
  const expectedIndexableCategoryPaths = allCategorySlugs
    .filter((slug) => !noindexCategorySet.has(slug))
    .map((slug) => `/category/${slug}`);
  const noindexCategoryPaths = allCategorySlugs
    .filter((slug) => noindexCategorySet.has(slug))
    .map((slug) => `/category/${slug}`);

  const missingCategoryPaths = expectedIndexableCategoryPaths.filter((path) => !sitemapPathSet.has(path));
  const listedNoindexCategories = noindexCategoryPaths.filter((path) => sitemapPathSet.has(path));
  if (missingCategoryPaths.length > 0) {
    sitemapIssues.push(`Indexable category route(s) missing from sitemap: ${missingCategoryPaths.join(", ")}.`);
  }
  if (listedNoindexCategories.length > 0) {
    sitemapIssues.push(`Noindex category route(s) incorrectly listed in sitemap: ${listedNoindexCategories.join(", ")}.`);
  }

  const canonicalDbSlugs = getCanonicalToolSlugs();
  const configToolSlugs = Object.values(TOOLS).map((tool) => tool.path.startsWith("/") ? tool.path.slice(1) : tool.path);
  const expectedToolSlugs = Array.from(new Set([...canonicalDbSlugs, ...configToolSlugs]));
  const expectedIndexableToolPaths = expectedToolSlugs
    .filter((slug) => !TIER_C_NOINDEX_SLUGS.has(slug))
    .filter((slug) => slug !== "chanakya-to-unicode" && slug !== "unicode-to-chanakya")
    .map((slug) => `/${slug}`);
  const noindexToolPaths = Array.from(TIER_C_NOINDEX_SLUGS).map((slug) => `/${slug}`);
  const missingToolPaths = expectedIndexableToolPaths.filter((path) => !sitemapPathSet.has(path));
  const listedNoindexTools = noindexToolPaths.filter((path) => sitemapPathSet.has(path));
  if (missingToolPaths.length > 0) {
    sitemapIssues.push(`Indexable tool route(s) missing from sitemap: ${missingToolPaths.slice(0, 20).join(", ")}${missingToolPaths.length > 20 ? " …" : ""}.`);
  }
  if (listedNoindexTools.length > 0) {
    sitemapIssues.push(`Noindex tool route(s) incorrectly listed in sitemap: ${listedNoindexTools.join(", ")}.`);
  }

  const basePathSet = new Set<string>(BASE_SITEMAP_ROUTES.map((path) => path || "/"));
  const categoryRouteCount = sitemapPaths.filter((path) => path.startsWith("/category/")).length;
  const blogRouteCount = sitemapPaths.filter((path) => path.startsWith("/blog/")).length;
  const baseRouteCount = sitemapPaths.filter((path) => basePathSet.has(path)).length;
  const knownToolPathSet = new Set(expectedToolSlugs.map((slug) => `/${slug}`));
  const toolRouteCount = sitemapPaths.filter((path) => knownToolPathSet.has(path)).length;

  // Static source inspection does not make an HTTP request to verify deployment availability.
  sitemapIssues.push("Sitemap membership is checked from the generated route list; deployed HTTP status and Google fetchability are not verified here.");

  const robotsConfig = robots();
  const robotRules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
  const wildcardRule = robotRules.find((rule) => rule.userAgent === "*");
  const allowedPaths = asArray(wildcardRule?.allow);
  const disallowedPaths = asArray(wildcardRule?.disallow);
  const robotsIssues: string[] = [];
  const sitemapUrl = typeof robotsConfig.sitemap === "string" ? robotsConfig.sitemap : undefined;
  const expectedSitemapUrl = `${SITE_ORIGIN}/sitemap.xml`;
  const isCrawlerAllowed = allowedPaths.includes("/") && !disallowedPaths.some((path) => path === "/" || path === "/*");
  if (!wildcardRule) robotsIssues.push("robots.txt has no wildcard user-agent rule.");
  if (!isCrawlerAllowed) robotsIssues.push("robots.txt does not explicitly allow the site root for crawlers.");
  if (sitemapUrl !== expectedSitemapUrl) robotsIssues.push(`robots.txt sitemap URL does not match the canonical sitemap URL (${expectedSitemapUrl}).`);
  robotsIssues.push("robots.txt is validated from source configuration; deployed headers and the live robots.txt response are not fetched.");

  const canonicalIssues: string[] = [];
  const unresolvedAliasTargets = Object.entries(SLUG_ALIASES)
    .filter(([, target]) => !canonicalDbSlugs.includes(target) || getToolBySlug(target)?.toolSlug !== target)
    .map(([alias, target]) => `/${alias} → /${target}`);
  const aliasCanonicalCollisions = Object.keys(SLUG_ALIASES).filter((alias) => canonicalDbSlugs.includes(alias));
  if (unresolvedAliasTargets.length > 0) {
    canonicalIssues.push(`Alias target(s) do not resolve to canonical tools: ${unresolvedAliasTargets.join(", ")}.`);
  }
  if (aliasCanonicalCollisions.length > 0) {
    canonicalIssues.push(`Alias slug(s) collide with canonical tool slugs: ${aliasCanonicalCollisions.join(", ")}.`);
  }
  canonicalIssues.push("Canonical URLs are checked from the shared origin and route configuration; deployed canonical tags and permanent redirect responses require an HTTP crawl.");

  const metadataIssues: string[] = [];
  const metadataBase = siteMetadata.metadataBase;
  const metadataBaseOrigin = metadataBase instanceof URL ? metadataBase.origin : undefined;
  const titleTemplate = typeof siteMetadata.title === "object" && siteMetadata.title !== null
    ? siteMetadata.title.template || ""
    : "";
  const openGraph = siteMetadata.openGraph;
  const twitter = siteMetadata.twitter;
  const hasMetadataBase = metadataBaseOrigin === SITE_ORIGIN;
  const hasOpenGraph = Boolean(openGraph && typeof openGraph === "object" && "title" in openGraph && "description" in openGraph);
  const hasTwitterCard = Boolean(twitter && typeof twitter === "object" && "card" in twitter && "description" in twitter);
  if (!hasMetadataBase) metadataIssues.push(`metadataBase must match ${SITE_ORIGIN}.`);
  if (!titleTemplate) metadataIssues.push("Root metadata has no title template.");
  if (!hasOpenGraph) metadataIssues.push("Open Graph title or description is missing.");
  if (!hasTwitterCard) metadataIssues.push("Twitter card or description is missing.");

  const schemaIssues: string[] = [];
  const hasOrganizationSchema = SITE_SCHEMA_TYPES.organization === "Organization";
  const hasWebSiteSchema = SITE_SCHEMA_TYPES.website === "WebSite";
  const hasBreadcrumbListSchema = SITE_SCHEMA_TYPES.breadcrumb === "BreadcrumbList";
  const hasSoftwareApplicationSchema = SITE_SCHEMA_TYPES.softwareApplication === "SoftwareApplication";
  schemaIssues.push("Schema type declarations exist in the source; JSON-LD validity and rich-result eligibility require a deployed structured-data test.");

  const analyticsIssues: string[] = [];
  const googleAnalyticsId = GOOGLE_ANALYTICS_MEASUREMENT_ID;
  const googleSiteVerification = GOOGLE_SITE_VERIFICATION_TOKEN;
  const vercelAnalyticsEnabled = ENABLE_VERCEL_ANALYTICS;
  if (!googleAnalyticsId) analyticsIssues.push("Google Analytics measurement ID is not configured.");
  if (!googleSiteVerification) analyticsIssues.push("Google site verification token is not configured.");
  analyticsIssues.push("Analytics configuration is checked from source only; live GA4 collection, consent behavior, and Search Console ownership are not verified.");

  return {
    sitemap: {
      totalUrls: sitemapEntries.length,
      urlCountsByType: {
        baseRoutes: baseRouteCount,
        categoryRoutes: categoryRouteCount,
        toolRoutes: toolRouteCount,
        blogRoutes: blogRouteCount,
      },
      hasSitemapXml: sitemapEntries.length > 0 && sitemapEntries.every((entry) => entry.url === SITE_ORIGIN || entry.url.startsWith(`${SITE_ORIGIN}/`)),
      issues: sitemapIssues,
    },
    robotsTxt: {
      isCrawlerAllowed,
      disallowedPaths,
      sitemapUrl,
      issues: robotsIssues,
    },
    canonicalStrategy: {
      baseUrl: SITE_ORIGIN,
      isSelfReferentialCanonical: hasMetadataBase && SITE_ORIGIN === "https://www.converterforall.com",
      handlesAliasesCorrectly: unresolvedAliasTargets.length === 0 && aliasCanonicalCollisions.length === 0,
      issues: canonicalIssues,
    },
    metadataGeneration: {
      hasMetadataBase,
      titleTemplate,
      hasOpenGraph,
      hasTwitterCard,
      issues: metadataIssues,
    },
    schemaGeneration: {
      hasOrganizationSchema,
      hasWebSiteSchema,
      hasBreadcrumbListSchema,
      hasSoftwareApplicationSchema,
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
