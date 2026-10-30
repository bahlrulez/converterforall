import { test, expect } from '@playwright/test';
import nextConfig from '../next.config';
import { toolsDatabase, getToolBySlug, SLUG_ALIASES } from '../src/lib/tools-db';
import { videoToolsContent } from '../src/lib/content/video-tools';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

test.describe('Redirects and Aliases Integrity', () => {
  const legacyFiveRedirects = [
    { source: '/images-to-pdf', destination: '/jpg-to-pdf' },
    { source: '/image-to-pdf', destination: '/jpg-to-pdf' },
    { source: '/sutonnymj-to-unicode', destination: '/bijoy-to-unicode' },
    { source: '/unicode-to-sutonnymj', destination: '/unicode-to-bijoy' },
    { source: '/base64-decode', destination: '/base64-encoder-decoder' },
  ];

  const approvedClusterRedirects = [
    // 1. PDF metadata tools -> clean-pdf-metadata
    { source: '/remove-pdf-properties', destination: '/clean-pdf-metadata' },
    { source: '/pdf-privacy-scrubber', destination: '/clean-pdf-metadata' },
    // 2. Audio trimmer tools -> trim-audio
    { source: '/cut-audio-free', destination: '/trim-audio' },
    { source: '/private-audio-trimmer', destination: '/trim-audio' },
    // 3. Video format compressors -> video-compressor
    { source: '/compress-mkv', destination: '/video-compressor' },
    { source: '/compress-avi', destination: '/video-compressor' },
    { source: '/compress-webm', destination: '/video-compressor' },
    { source: '/compress-wmv', destination: '/video-compressor' },
    { source: '/compress-flv', destination: '/video-compressor' },
    // 4. Merged blog post -> Post 2
    {
      source: '/blog/why-you-should-stop-uploading-sensitive-files-to-online-converters',
      destination: '/blog/why-stop-uploading-sensitive-pdfs-to-online-converters',
    },
  ];

  test('1. Legacy 5 duplicates return a single 301 redirect to their canonical target in next.config.ts', async () => {
    if (typeof nextConfig.redirects !== 'function') {
      throw new Error('nextConfig.redirects is not a function');
    }
    const allRedirects = await nextConfig.redirects();

    for (const item of legacyFiveRedirects) {
      const matches = allRedirects.filter(r => r.source === item.source);
      expect(matches.length, `Expected exactly one redirect rule for ${item.source}`).toBe(1);
      const rule = matches[0];
      expect(rule.destination).toBe(item.destination);
      expect((rule as any).statusCode === 301 || (rule as any).permanent === true).toBe(true);
    }
  });

  test('2. Approved cluster redirects return a single 301 redirect to canonical targets', async () => {
    if (typeof nextConfig.redirects !== 'function') {
      throw new Error('nextConfig.redirects is not a function');
    }
    const allRedirects = await nextConfig.redirects();

    for (const item of approvedClusterRedirects) {
      const matches = allRedirects.filter(r => r.source === item.source);
      expect(matches.length, `Expected exactly one redirect rule for ${item.source}`).toBe(1);
      const rule = matches[0];
      expect(rule.destination).toBe(item.destination);
      expect((rule as any).statusCode === 301 || (rule as any).permanent === true).toBe(true);
    }
  });

  test('3. No redirect chains: all redirect destinations must be canonical and never redirect again', async () => {
    if (typeof nextConfig.redirects !== 'function') {
      throw new Error('nextConfig.redirects is not a function');
    }
    const allRedirects = await nextConfig.redirects();
    const sourceSet = new Set(allRedirects.map(r => r.source));

    for (const rule of allRedirects) {
      // The destination should not be a redirect source (no A -> B -> C chains)
      expect(sourceSet.has(rule.destination), `Redirect chain detected: ${rule.source} -> ${rule.destination}`).toBeFalsy();
      
      // Also ensure tool destinations are not aliases in SLUG_ALIASES
      const cleanDest = rule.destination.replace(/^\//, '');
      if (!cleanDest.startsWith('blog/') && !cleanDest.startsWith('category/') && cleanDest !== '' && cleanDest !== 'about' && cleanDest !== 'contact') {
        expect(cleanDest in SLUG_ALIASES, `Redirect from ${rule.source} points to alias ${cleanDest}`).toBeFalsy();
      }
    }
  });

  test('4. Video Compressor format accuracy: states accepted input formats, outputs MP4, no claims of outputting MKV/AVI/WMV/FLV', () => {
    const vc = toolsDatabase.video['video-compressor'];
    expect(vc).toBeDefined();

    // Accepted inputs must include all 5 primary video formats
    const acceptedExtensions = Object.values(vc.acceptedTypes || {}).flat();
    expect(acceptedExtensions).toContain('.mp4');
    expect(acceptedExtensions).toContain('.mov');
    expect(acceptedExtensions).toContain('.mkv');
    expect(acceptedExtensions).toContain('.webm');
    expect(acceptedExtensions).toContain('.avi');

    // Output must strictly be mp4
    expect(vc.outputFormat).toBe('mp4');

    // Content sections must state supported inputs and MP4 output
    const vcContent = videoToolsContent['video-compressor'];
    expect(vcContent).toBeDefined();
    const allContentText = vcContent.sections.map(s => `${s.title} ${s.content}`).join(' ');
    
    expect(allContentText).toContain('MP4, MOV, MKV, WebM, and AVI');
    expect(allContentText).toContain('MP4 (H.264 video with AAC audio)');
    expect(allContentText).toContain('We do not output legacy or container formats like MKV, AVI, WMV, or FLV');

    // Check component file to verify dropzone & no redirected format links
    const compPath = path.resolve(__dirname, '../src/components/tools/video-compressor.tsx');
    const compCode = fs.readFileSync(compPath, 'utf-8');

    // Ensure no links to redirected pages in format presets
    expect(compCode).not.toContain('href="/compress-mkv"');
    expect(compCode).not.toContain('href="/compress-avi"');
    expect(compCode).not.toContain('href="/compress-webm"');
    expect(compCode).not.toContain('href="/compress-wmv"');
    expect(compCode).not.toContain('href="/compress-flv"');

    // Ensure links to kept canonical format pages exist
    expect(compCode).toContain('href="/compress-mp4"');
    expect(compCode).toContain('href="/compress-mov-video"');
  });

  test('5. Sitemap contains 0 redirected URLs and reflects exact updated count', () => {
    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map(e => e.url);

    for (const item of approvedClusterRedirects) {
      const fullUrl = `https://www.converterforall.com${item.source}`;
      expect(sitemapUrls).not.toContain(fullUrl);
    }

    // Held tools must remain in sitemap
    expect(sitemapUrls).toContain('https://www.converterforall.com/trim-mp3-online');
    expect(sitemapUrls).toContain('https://www.converterforall.com/compress-video-for-discord');
    expect(sitemapUrls).toContain('https://www.converterforall.com/compress-mp4');
    expect(sitemapUrls).toContain('https://www.converterforall.com/clean-pdf-metadata');
    expect(sitemapUrls).toContain('https://www.converterforall.com/trim-audio');
    expect(sitemapUrls).toContain('https://www.converterforall.com/video-compressor');
    expect(sitemapUrls).toContain('https://www.converterforall.com/blog/why-stop-uploading-sensitive-pdfs-to-online-converters');

    // New sitemap count must be 138 (148 - 9 tools - 1 blog)
    expect(sitemapEntries.length).toBe(138);
  });
});

