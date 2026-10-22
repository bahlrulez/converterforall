import { test, expect } from '@playwright/test';
import nextConfig from '../next.config';

test.describe('Redirects and Aliases Integrity', () => {
  const fiveRedirects = [
    { source: '/images-to-pdf', destination: '/jpg-to-pdf' },
    { source: '/image-to-pdf', destination: '/jpg-to-pdf' },
    { source: '/sutonnymj-to-unicode', destination: '/bijoy-to-unicode' },
    { source: '/unicode-to-sutonnymj', destination: '/unicode-to-bijoy' },
    { source: '/base64-decode', destination: '/base64-encoder-decoder' },
  ];

  test('The 5 removed duplicates return a single 301 redirect to their canonical target in next.config.ts', async () => {
    if (typeof nextConfig.redirects !== 'function') {
      throw new Error('nextConfig.redirects is not a function');
    }
    const allRedirects = await nextConfig.redirects();

    for (const item of fiveRedirects) {
      const matches = allRedirects.filter(r => r.source === item.source);
      // Must exist exactly once
      expect(matches.length, `Expected exactly one redirect rule for ${item.source}`).toBe(1);
      const rule = matches[0];
      expect(rule.destination).toBe(item.destination);
      expect((rule as any).statusCode === 301 || (rule as any).permanent === true).toBe(true);
    }
  });
});
