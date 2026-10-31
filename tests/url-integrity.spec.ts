import { test, expect } from '@playwright/test';
import { toolsDatabase, SLUG_ALIASES, getCanonicalToolSlugs, getToolBySlug } from '../src/lib/tools-db';
import { getAllBlogSlugs } from '../src/lib/blog-data';
import { convertPunjabi } from '../src/lib/fonts/punjabi-mappings';
import { PunjabiFontConvertor } from '../src/lib/fonts/punjabi-engine';
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

  test('5. Sitemap contains only intended, canonical URLs and 0 aliases (with restored Punjabi routes)', () => {
    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map(e => e.url);

    // All URLs must be canonical https://www.converterforall.com
    for (const url of sitemapUrls) {
      expect(url.startsWith('https://www.converterforall.com')).toBeTruthy();
      const slug = url.replace('https://www.converterforall.com/', '');
      
      // Ensure no alias is in sitemap
      expect(slug in SLUG_ALIASES, `Alias '${slug}' found in sitemap!`).toBeFalsy();
    }

    // Verify restored Punjabi routes explicitly appear in sitemap
    const restoredPunjabiSlugs = [
      'joy-to-unicode',
      'unicode-to-joy',
      'asees-to-unicode',
      'unicode-to-asees',
      'satluj-to-unicode',
      'unicode-to-satluj'
    ];
    for (const slug of restoredPunjabiSlugs) {
      const url = `https://www.converterforall.com/${slug}`;
      expect(sitemapUrls, `Approved restored route '${url}' must be present in sitemap`).toContain(url);
    }

    // Genuinely unverified slugs must continue to be excluded
    const genuinelyUnverifiedSlugs = new Set([
      'chanakya-to-unicode',
      'unicode-to-chanakya'
    ]);
    for (const slug of genuinelyUnverifiedSlugs) {
      const url = `https://www.converterforall.com/${slug}`;
      expect(sitemapUrls, `Unverified route '${url}' must be excluded from sitemap`).not.toContain(url);
    }

    // Import TIER_C_NOINDEX_SLUGS to ensure sitemap contains only indexable canonical tools
    const { TIER_C_NOINDEX_SLUGS } = require('../src/config/sitemap-lastmod');
    for (const toolSlug of canonicalSlugs) {
      const expectedUrl = `https://www.converterforall.com/${toolSlug}`;
      if (TIER_C_NOINDEX_SLUGS.has(toolSlug) || genuinelyUnverifiedSlugs.has(toolSlug)) {
        expect(sitemapUrls).not.toContain(expectedUrl);
      } else {
        expect(sitemapUrls).toContain(expectedUrl);
      }
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

  // =========================================================================
  // SUITE 10: Focused P0 Punjabi Recovery Tests (Joy, Asees, Satluj)
  // =========================================================================
  test.describe('10. P0 Punjabi Recovery Verification (Joy, Asees, Satluj)', () => {
    const p0Routes = [
      'joy-to-unicode',
      'unicode-to-joy',
      'asees-to-unicode',
      'unicode-to-asees',
      'satluj-to-unicode',
      'unicode-to-satluj'
    ];

    test('10.1 All six Punjabi routes are registered, canonical, and indexable', () => {
      const { TIER_C_NOINDEX_SLUGS } = require('../src/config/sitemap-lastmod');

      for (const slug of p0Routes) {
        const toolData = getToolBySlug(slug);
        expect(toolData, `Route '${slug}' must resolve in toolsDatabase`).not.toBeNull();
        expect(toolData?.toolSlug).toBe(slug);
        expect(toolData?.categorySlug).toBe('fonts');
        expect(toolData?.tool.fontCategory).toBe('punjabi');
        expect(canonicalSet.has(slug), `Route '${slug}' must be in canonical tools set`).toBe(true);
        expect(TIER_C_NOINDEX_SLUGS.has(slug), `Route '${slug}' must not be in TIER_C_NOINDEX_SLUGS`).toBe(false);
      }

      // Satluj cross-linking checks
      const satlujToUni = getToolBySlug('satluj-to-unicode');
      expect(satlujToUni?.tool.relatedTools).toContain('unicode-to-satluj');
      expect(satlujToUni?.tool.relatedTools).toContain('asees-to-unicode');
      expect(satlujToUni?.tool.relatedTools).toContain('joy-to-unicode');

      const uniToSatluj = getToolBySlug('unicode-to-satluj');
      expect(uniToSatluj?.tool.relatedTools).toContain('satluj-to-unicode');
      expect(uniToSatluj?.tool.relatedTools).toContain('unicode-to-asees');
      expect(uniToSatluj?.tool.relatedTools).toContain('unicode-to-joy');
    });

    test('10.2 Character table rule counts and mapping activation', () => {
      // Satluj character codes: 100 mapping rules
      const satlujRules = Object.keys((PunjabiFontConvertor as any).satluj || {}).length;
      expect(satlujRules, 'Satluj mapping table must contain 100 character rules').toBe(100);

      // Joy character codes: 119 mapping rules
      const joyRules = Object.keys((PunjabiFontConvertor as any).joy || {}).length;
      expect(joyRules, 'Joy mapping table must contain 119 character rules').toBe(119);

      // Asees character codes: 120 mapping rules
      const aseesRules = Object.keys((PunjabiFontConvertor as any).asees || {}).length;
      expect(aseesRules, 'Asees mapping table must contain 120 character rules').toBe(120);
    });

    test('10.3 Bidirectional round-trip engine fidelity across representative Gurmukhi texts', () => {
      // Representative test corpus covering vowels, subjoined consonants (pairin), nasalization, and gemination
      const corpus = [
        { name: 'Standard Greeting', text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' },
        { name: 'Pairi Rara (Subjoined R)', text: 'ਪ੍ਰੇਮ ਅਤੇ ਪਿਆਰ' },
        { name: 'Pairi Haha & Vava', text: 'ਪੜ੍ਹਾਈ ਅਤੇ ਸ੍ਵੈਮਾਣ' },
        { name: 'Tippi & Bindi', text: 'ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਸਿੰਘ ਅਤੇ ਕਾਂ' },
        { name: 'Addak (Gemination)', text: 'ਮਿੱਤਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ' },
        { name: 'Gurmukhi Digits', text: '੧ ੨ ੩ ੪ ੫' }
      ];

      // Note on encoding standards:
      // - Satluj uses high-order ANSI/legacy encoding (e.g. ÃÇå ÃÌÆ ÁÕÅñ)
      // - Joy and Asees use ASCII keyboard layout remapping
      // Automated tests verify internal engine consistency and round-trip fidelity.
      const fonts = ['satluj', 'joy', 'asees'];

      for (const font of fonts) {
        for (const item of corpus) {
          const encoded = convertPunjabi(item.text, font, 'fromUnicode');
          expect(encoded.length, `${font} encoded text for '${item.name}' should not be empty`).toBeGreaterThan(0);

          const decoded = convertPunjabi(encoded, font, 'toUnicode');
          expect(decoded, `${font} round-trip decoded text for '${item.name}' must match input`).toBe(item.text);
        }
      }

      // Exact high-order ANSI encoding verification for Satluj
      const satlujGreetingEncoded = convertPunjabi('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'satluj', 'fromUnicode');
      expect(satlujGreetingEncoded, 'Satluj greeting must encode to expected high-order ANSI string').toBe('ÃÇå ÃÌÆ ÁÕÅñ');
      expect(convertPunjabi('ÃÇå ÃÌÆ ÁÕÅñ', 'satluj', 'toUnicode')).toBe('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ');
    });

    test('10.4 Static prerendered HTML contains canonical links, valid title, and zero noindex', () => {
      for (const slug of p0Routes) {
        const htmlPath = path.join(process.cwd(), '.next/server/app', `${slug}.html`);
        expect(fs.existsSync(htmlPath), `Static prerendered HTML file for '/${slug}' must exist`).toBe(true);

        const html = fs.readFileSync(htmlPath, 'utf8');

        // Canonical tag
        const canonicalTag = `<link rel="canonical" href="https://www.converterforall.com/${slug}"/>`;
        expect(html, `Prerendered HTML for '/${slug}' must contain correct canonical link`).toContain(canonicalTag);

        // Noindex absence
        expect(html.includes('content="noindex'), `Prerendered HTML for '/${slug}' must NOT contain noindex`).toBe(false);

        // Trust badge strip
        expect(html).toContain('On-Device Browser Processing');
        expect(html).toContain('No Account or Limits');

        // Brand title
        expect(html).toContain('| ConverterForAll</title>');
      }
    });

    test('10.5 Internal links in home, FAQ, search, and blog resolve cleanly to restored Satluj routes', () => {
      // 1. Dropzone internal links
      const dropzoneCode = fs.readFileSync(path.resolve(__dirname, '../src/components/home/modern-dropzone.tsx'), 'utf-8');
      expect(dropzoneCode).toContain('handleTextSubmit(\'unicode-to-satluj\')');
      expect(dropzoneCode).toContain('handleTextSubmit(\'satluj-to-unicode\')');

      // 2. Hero search
      const heroCode = fs.readFileSync(path.resolve(__dirname, '../src/components/home/hero-search.tsx'), 'utf-8');
      expect(heroCode).toContain('slug: "unicode-to-satluj"');

      // 3. Blog data
      const blogCode = fs.readFileSync(path.resolve(__dirname, '../src/lib/blog-data.ts'), 'utf-8');
      expect(blogCode).toContain('href="/satluj-to-unicode"');

      // 4. Font profiles
      const profilesCode = fs.readFileSync(path.resolve(__dirname, '../src/lib/content/punjabi-font-profiles.ts'), 'utf-8');
      expect(profilesCode).toContain('slug: "satluj-to-unicode"');
      expect(profilesCode).toContain('slug: "unicode-to-satluj"');
    });

    test('10.6 Live application interface E2E browser verification across all six Punjabi routes', async ({ page }) => {
      // Confirm local server is reachable on port 3005 before executing live browser steps
      let isReachable = false;
      try {
        const res = await fetch('http://localhost:3005/satluj-to-unicode');
        isReachable = res.status === 200;
      } catch {
        isReachable = false;
      }

      // Must genuinely execute during audit verification
      expect(isReachable, 'Local application server must be running on http://localhost:3005 for genuine E2E verification').toBe(true);

      const liveTestScenarios = [
        {
          route: '/satluj-to-unicode',
          input: 'ÃÇå ÃÌÆ ÁÕÅñ', // Satluj high-order ANSI
          expectedOutput: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
          description: 'Satluj High-Order ANSI to Unicode'
        },
        {
          route: '/unicode-to-satluj',
          input: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
          expectedOutput: 'ÃÇå ÃÌÆ ÁÕÅñ',
          description: 'Unicode to Satluj High-Order ANSI'
        },
        {
          route: '/unicode-to-joy',
          input: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
          expectedOutput: ';fs ;Ãh nekb',
          description: 'Unicode to Joy (ASCII with High-Order Pairin Rara)'
        },
        {
          route: '/joy-to-unicode',
          input: ';fs ;Ãh nekb',
          expectedOutput: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
          description: 'Joy to Unicode'
        },
        {
          route: '/unicode-to-asees',
          input: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
          expectedOutput: ';fs ;qh nekb',
          description: 'Unicode to Asees Font (ASCII Keyboard Remapping)'
        },
        {
          route: '/asees-to-unicode',
          input: 'fgnko',
          expectedOutput: 'ਪਿਆਰ',
          description: 'Asees to Unicode (PSSSB typing test candidate string)'
        }
      ];

      for (const scenario of liveTestScenarios) {
        const pageErrors: string[] = [];
        const consoleErrors: string[] = [];
        const failedRequests: string[] = [];

        page.on('pageerror', err => pageErrors.push(err.message));
        page.on('console', msg => {
          if (msg.type() === 'error') {
            const text = msg.text();
            // Filter benign localhost analytics 404
            if (!text.includes('_vercel/insights') && !text.includes('Failed to load resource')) {
              consoleErrors.push(text);
            }
          }
        });
        page.on('requestfailed', req => {
          const url = req.url();
          const isThirdPartyTracker = url.includes('google-analytics') || url.includes('googletagmanager') || url.includes('_vercel');
          if (!isThirdPartyTracker) {
            failedRequests.push(`${req.method()} ${url}: ${req.failure()?.errorText || 'Unknown error'}`);
          }
        });

        const navResponse = await page.goto(`http://localhost:3005${scenario.route}`);
        expect(navResponse, `Navigation to '${scenario.route}' must return a response`).not.toBeNull();
        expect(navResponse!.status(), `Route '${scenario.route}' must return HTTP 200`).toBe(200);

        await page.waitForSelector('textarea', { timeout: 10000 });
        const textareas = page.locator('textarea');
        expect(await textareas.count(), `Route '${scenario.route}' must render input and output textareas`).toBeGreaterThanOrEqual(2);

        // Fill input textarea
        await textareas.nth(0).fill(scenario.input);
        // Wait for React state to process conversion
        await page.waitForTimeout(400);

        const convertedValue = await textareas.nth(1).inputValue();
        expect(convertedValue.trim(), `Live converter output on '${scenario.route}' (${scenario.description}) must match expectation`).toBe(scenario.expectedOutput);

        // Assert zero unhandled application exceptions, console errors, or failed page requests
        expect(pageErrors.length, `Runtime pageerror exceptions on '${scenario.route}': ${pageErrors.join(', ')}`).toBe(0);
        expect(consoleErrors.length, `Console.error events on '${scenario.route}': ${consoleErrors.join(', ')}`).toBe(0);
        expect(failedRequests.length, `Failed network requests on '${scenario.route}': ${failedRequests.join(', ')}`).toBe(0);
      }
    });
  });
});
