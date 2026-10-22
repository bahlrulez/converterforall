import { test, expect } from '@playwright/test';
import { toolsDatabase, SLUG_ALIASES, getCanonicalToolSlugs, getToolBySlug } from '../src/lib/tools-db';
import { TOOLS } from '../src/config/tools';
import { getAllBlogSlugs } from '../src/lib/blog-data';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

test.describe('URL Integrity, Slug Aliases & Sitemap Audit', () => {

  const canonicalSlugs = getCanonicalToolSlugs();
  const canonicalSet = new Set(canonicalSlugs);

  test('1. Reported URL /ml-ttkarthika-to-unicode must not be in tool registry or sitemap', () => {
    // Confirm Case C resolution
    expect(getToolBySlug('ml-ttkarthika-to-unicode')).toBeNull();
    expect('ml-ttkarthika-to-unicode' in SLUG_ALIASES).toBeFalsy();
    expect(canonicalSet.has('ml-ttkarthika-to-unicode')).toBeFalsy();

    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map(e => e.url);
    expect(sitemapUrls.some(u => u.includes('ml-ttkarthika-to-unicode'))).toBeFalsy();
  });

  test('2. All SLUG_ALIASES must resolve to valid canonical tools in a single hop', () => {
    for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
      // Must not self-redirect
      expect(alias).not.toBe(target);

      // Target must exist in toolsDatabase
      const targetTool = getToolBySlug(target);
      expect(targetTool, `Alias '${alias}' points to missing tool '${target}'`).not.toBeNull();

      // Must be a single hop: target cannot be another alias
      expect(target in SLUG_ALIASES, `Alias '${alias}' chains to another alias '${target}'`).toBeFalsy();
      expect(targetTool?.toolSlug).toBe(target);
    }
  });

  test('3. No duplicate redirects between next.config.ts and SLUG_ALIASES', () => {
    const nextConfigContent = fs.readFileSync(path.resolve(__dirname, '../next.config.ts'), 'utf-8');
    const redirectRegex = /source:\s*"([^"]+)",\s*destination:\s*"([^"]+)"/g;
    let match;
    const legacySources: string[] = [];
    while ((match = redirectRegex.exec(nextConfigContent)) !== null) {
      legacySources.push(match[1]);
    }

    // Check for internal duplicates in legacyRedirects
    const uniqueLegacy = new Set(legacySources);
    expect(legacySources.length).toBe(uniqueLegacy.size);

    // Check for overlap between legacyRedirects and SLUG_ALIASES
    for (const source of legacySources) {
      const slug = source.replace(/^\//, '');
      expect(slug in SLUG_ALIASES, `Redirect '${source}' is duplicated in both legacyRedirects and SLUG_ALIASES`).toBeFalsy();
    }
  });

  test('4. All next.config.ts redirect destinations must be valid', () => {
    const nextConfigContent = fs.readFileSync(path.resolve(__dirname, '../next.config.ts'), 'utf-8');
    const redirectRegex = /source:\s*"([^"]+)",\s*destination:\s*"([^"]+)"/g;
    let match;
    const blogSlugs = new Set(getAllBlogSlugs());
    const validCategories = new Set(Object.keys(toolsDatabase));

    while ((match = redirectRegex.exec(nextConfigContent)) !== null) {
      const source = match[1];
      const destination = match[2];
      const cleanDest = destination.replace(/^\//, '');

      // Allowed root or special destinations
      if (cleanDest === '' || cleanDest === 'about' || cleanDest === 'contact' || cleanDest === 'privacy' || cleanDest === 'terms' || cleanDest === 'tools') {
        continue;
      }

      if (cleanDest.startsWith('category/')) {
        const cat = cleanDest.replace('category/', '');
        expect(validCategories.has(cat), `Redirect from '${source}' points to non-existent category '${cat}'`).toBeTruthy();
        continue;
      }

      if (cleanDest.startsWith('blog/')) {
        const blogSlug = cleanDest.replace('blog/', '');
        expect(blogSlugs.has(blogSlug), `Redirect from '${source}' points to non-existent blog '${blogSlug}'`).toBeTruthy();
        continue;
      }

      // Must be a valid tool in toolsDatabase
      const tool = getToolBySlug(cleanDest);
      expect(tool, `Redirect from '${source}' points to non-existent tool '${cleanDest}'`).not.toBeNull();
      // Must not chain to an alias
      expect(cleanDest in SLUG_ALIASES, `Redirect from '${source}' chains to alias '${cleanDest}'`).toBeFalsy();
    }
  });

  test('5. Sitemap contains only intended, canonical URLs and 0 aliases', () => {
    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map(e => e.url);

    // All URLs must be canonical https://www.converterforall.com
    for (const url of sitemapUrls) {
      expect(url.startsWith('https://www.converterforall.com')).toBeTruthy();
      const slug = url.replace('https://www.converterforall.com/', '');
      
      // Ensure no alias is in sitemap
      expect(slug in SLUG_ALIASES, `Alias '${slug}' found in sitemap!`).toBeFalsy();
    }

    // Every canonical tool must be in sitemap
    for (const toolSlug of canonicalSlugs) {
      const expectedUrl = `https://www.converterforall.com/${toolSlug}`;
      expect(sitemapUrls).toContain(expectedUrl);
    }
  });

  test('6. All relatedTools in toolsDatabase must resolve to canonical tools', () => {
    for (const [category, tools] of Object.entries(toolsDatabase)) {
      for (const [slug, tool] of Object.entries(tools)) {
        if (tool.relatedTools) {
          for (const related of tool.relatedTools) {
            expect(canonicalSet.has(related), `Tool '${slug}' references non-canonical related tool '${related}'`).toBeTruthy();
            expect(related in SLUG_ALIASES, `Tool '${slug}' references alias '${related}' instead of canonical tool`).toBeFalsy();
          }
        }
      }
    }
  });

  test('7. clusters in related-tools.tsx must contain only valid canonical tool slugs', () => {
    const relatedToolsContent = fs.readFileSync(path.resolve(__dirname, '../src/components/tools/related-tools.tsx'), 'utf-8');
    const clusterMatch = relatedToolsContent.match(/const clusters: Record<string, string\[\]> = \{([\s\S]*?)\n\s*\};/);
    expect(clusterMatch).not.toBeNull();

    if (clusterMatch) {
      const clusterBlock = clusterMatch[1];
      const lineRegex = /"([^"]+)":\s*\[([^\]]+)\]/g;
      let m;
      while ((m = lineRegex.exec(clusterBlock)) !== null) {
        const clusterKey = m[1];
        const items = m[2].split(',').map(s => s.trim().replace(/^"/, '').replace(/"$/, ''));
        for (const item of items) {
          if (item) {
            expect(canonicalSet.has(item), `Cluster '${clusterKey}' references invalid slug '${item}'`).toBeTruthy();
          }
        }
      }
    }
  });

  test('8. Existing working tools resolve correctly', () => {
    const coreTools = ['krutidev-to-unicode', 'pdf-to-word', 'merge-pdf', 'remove-background', 'exam-photo-resizer'];
    for (const slug of coreTools) {
      const toolData = getToolBySlug(slug);
      expect(toolData).not.toBeNull();
      expect(toolData?.toolSlug).toBe(slug);
      expect(toolData?.tool.title).toBeTruthy();
    }
  });

  test('9. Unknown slugs return null and never resolve to homepage or wrong tool', () => {
    const testUnknowns = [
      'ml-ttkarthika-to-unicode',
      'non-existent-converter-999',
      'fake-tool-xyz',
      'convert-tamil-to-unicode'
    ];
    for (const slug of testUnknowns) {
      expect(getToolBySlug(slug)).toBeNull();
    }
  });
});
