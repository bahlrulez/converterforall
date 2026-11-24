import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { inspectSeoSystem } from '../src/lib/seo/audit/system-inspector';
import { runFullSeoAudit } from '../src/lib/seo/audit/audit-runner';
import { siteMetadata } from '../src/lib/seo/site-metadata';
import { SITE_TITLE_TEMPLATE } from '../src/lib/seo/site-config';

test.describe('SEO Audit Truthfulness & False-Positive Elimination', () => {
  test('1. inspectSeoSystem does not falsely claim live XML sitemap endpoint exists', () => {
    const inspection = inspectSeoSystem();
    expect(inspection.sitemap.hasSitemapXml).toBe(false);
    expect(
      inspection.sitemap.issues.some((issue) =>
        issue.includes('Live /sitemap.xml endpoint availability and XML response headers are unverified')
      )
    ).toBe(true);
  });

  test('2. inspectSeoSystem does not falsely claim live canonical tags are verified without HTTP crawl', () => {
    const inspection = inspectSeoSystem();
    expect(inspection.canonicalStrategy.isSelfReferentialCanonical).toBe(false);
    expect(
      inspection.canonicalStrategy.issues.some((issue) =>
        issue.includes('live deployed <link rel="canonical"> tags are not verified without an HTTP crawl')
      )
    ).toBe(true);
  });

  test('3. inspectSeoSystem acknowledges schema generators in templates but marks live rich results unverified', () => {
    const inspection = inspectSeoSystem();
    expect(inspection.schemaGeneration.hasWebSiteSchema).toBe(true);
    expect(inspection.schemaGeneration.hasOrganizationSchema).toBe(true);
    expect(inspection.schemaGeneration.hasBreadcrumbListSchema).toBe(true);
    expect(inspection.schemaGeneration.hasSoftwareApplicationSchema).toBe(true);

    expect(
      inspection.schemaGeneration.issues.some((issue) =>
        issue.includes('Source inspection found JSON-LD generators')
      )
    ).toBe(true);
    expect(
      inspection.schemaGeneration.issues.some((issue) =>
        issue.includes('Live JSON-LD syntax validity, schema.org conformance, and Google Rich Results eligibility are unverified')
      )
    ).toBe(true);
  });

  test('4. Root siteMetadata observed template is checked and not silently substituted with fallback', () => {
    const inspection = inspectSeoSystem();
    expect(inspection.metadataGeneration.titleTemplate).toBe(SITE_TITLE_TEMPLATE);
    // Root metadata has valid template matching SITE_TITLE_TEMPLATE, so no template mismatch issue
    expect(
      inspection.metadataGeneration.issues.some((iss) => iss.includes('template property defined'))
    ).toBe(false);
  });

  test('5. Inventory collector properly separates noindex tools from redirect aliases', () => {
    const { summary, inventory } = runFullSeoAudit();

    // Verify aliases are redirects, not noindex
    const aliases = inventory.filter((item) => item.isAlias);
    expect(aliases.length).toBeGreaterThan(0);
    expect(aliases.every((item) => item.indexability === 'redirect')).toBe(true);

    // Verify summary counts match inventory precisely
    const noindexItems = inventory.filter((item) => item.indexability === 'noindex');
    expect(summary.totalNoindexPages).toBe(noindexItems.length);
    expect(summary.totalAliasRoutes).toBe(aliases.length);
  });

  test('6. Audit dashboard source does not contain false-positive indicators or misleading labels', () => {
    const dashboardPath = path.join(process.cwd(), 'src/app/admin/seo-audit/audit-dashboard-client.tsx');
    const content = fs.readFileSync(dashboardPath, 'utf8');

    // KPI Card 2 must not mislabel noindex tools as aliases
    expect(content).not.toContain('{summary.totalNoindexPages} Aliases (Noindex/Alt)');
    expect(content).toContain('{summary.totalNoindexPages} Noindex Tools ({summary.totalAliasRoutes} Redirect Aliases)');

    // KPI Card 3 & 4 copy
    expect(content).toContain('Flagged for review (&lt;250w or fallback copy)');
    expect(content).toContain('Shared across &gt;1 route (inc. aliases)');

    // No hardcoded "Healthy" sitemap badge
    expect(content).not.toContain('Healthy ({systemInspection.sitemap.totalUrls} URLs)');
    expect(content).toContain('Route Manifest ({systemInspection.sitemap.totalUrls} URLs)');

    // No hardcoded "Alias Risk Detected" or "Active" or "Verified" badges
    expect(content).not.toMatch(/<span[^>]*>\s*Verified\s*<\/span>/);
    expect(content).toContain('Source Templates Found');
    expect(content).toContain('Source Configured');

    // No blanket claim that self-referential canonicals are verified on primary tools
    expect(content).not.toContain('Self-referential on primary tools: <span className="text-emerald-400 font-medium">Yes</span>');
    expect(content).toContain('Declared in route templates (Live HTML unverified)');

    // Breadcrumb and SoftwareApplication schemas qualified
    expect(content).not.toContain('Emitted on all tools');
    expect(content).toContain('Declared in tool, category &amp; blog templates');
    expect(content).toContain('Unverified (Requires deployed Google test)');
  });

  test('7. Global site-metadata uses truthful browser-first phrasing without blanket private claims', () => {
    expect(siteMetadata.title).toBeDefined();
    if (typeof siteMetadata.title === 'object' && siteMetadata.title !== null && 'default' in siteMetadata.title) {
      expect(siteMetadata.title.default).toContain('Browser-First');
      expect(siteMetadata.title.default).not.toContain('Private PDF');
    }

    if (siteMetadata.openGraph && typeof siteMetadata.openGraph === 'object' && 'title' in siteMetadata.openGraph) {
      expect(siteMetadata.openGraph.title).toContain('Browser-First');
      expect(siteMetadata.openGraph.title).not.toContain('Private PDF');
    }

    if (siteMetadata.description) {
      expect(siteMetadata.description).toContain('Most tools run directly in your browser');
      expect(siteMetadata.description).toContain('optional cloud and AI features');
    }
  });

  test('8. Category page copy and fallbacks do not make unverified absolute claims', () => {
    const categoryPagePath = path.join(process.cwd(), 'src/app/category/[slug]/page.tsx');
    const content = fs.readFileSync(categoryPagePath, 'utf8');

    // Audio suite
    expect(content).not.toContain('without quality loss');
    expect(content).not.toContain('Lossless Audio Trimming');
    expect(content).toContain('Precision Audio Trimming');

    // Document & Image daily limits/size limits qualified
    expect(content).toContain('Because processing runs in your browser, very large batches are subject only to available device memory');
    expect(content).toContain('Common Format Support');

    // Fallback editorial
    expect(content).not.toContain('without uploading files to third-party servers');
    expect(content).toContain('Browser-First Architecture');
    expect(content).toContain('Where external services or cloud options are required, they are disclosed per tool');
    expect(content).toContain('discarded once conversion finishes');
  });
});
