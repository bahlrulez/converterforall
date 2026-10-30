import { test, expect } from '@playwright/test';
import { blogDatabase, posts } from '@/lib/blog-data';
import { TOOL_CONTENT_CHANGED_DATES, PAGE_LASTMOD_DATES } from '@/config/sitemap-lastmod';
import sitemap from '@/app/sitemap';

test.describe('Blog Content Privacy Claims & Release Integrity', () => {
  const forbiddenPatterns = [
    /never\s+leaves?\s+your\s+(device|computer|phone)/i,
    /nothing\s+is\s+uploaded/i,
    /100%\s*(private|client-side|on-device)/i,
    /zero\s+upload/i,
    /zero\s+quality\s+loss/i,
    /deleted\s+immediately/i,
    /immediately\s+deleted/i,
    /never\s+uploaded/i,
    /no\s+uploads/i,
    /stays\s+on\s+your\s+device/i,
  ];

  test('1. No blog post in blogDatabase contains blanket privacy, zero-loss, deleted immediately, or stays on your device claims', () => {
    for (const [slug, post] of Object.entries(blogDatabase)) {
      const combined = `${post.title} ${post.description} ${post.content}`;
      for (const pattern of forbiddenPatterns) {
        const match = combined.match(pattern);
        expect(
          match,
          `Blog post "${slug}" should not match forbidden pattern ${pattern.toString()}, found: "${match?.[0]}"`
        ).toBeNull();
      }
    }
  });

  test('2. Merged blog post has updatedAt set to October 30, 2026', () => {
    const mergedPost = blogDatabase['why-stop-uploading-sensitive-pdfs-to-online-converters'];
    expect(mergedPost).toBeDefined();
    expect(mergedPost.updatedAt).toBe('October 30, 2026');

    const card = posts.find(p => p.slug === 'why-stop-uploading-sensitive-pdfs-to-online-converters');
    expect(card).toBeDefined();
    expect(card?.updatedAt).toBe('October 30, 2026');
  });

  test('3. Blog text includes exact standardized privacy disclosure for Word, PowerPoint, and Presentation Maker', () => {
    const post = blogDatabase['why-stop-uploading-sensitive-pdfs-to-online-converters'];
    const exactRequiredCopy = "Most of our tools run in your browser and do not upload your files. Word to PDF and PowerPoint to PDF have an optional cloud mode that sends the file to a third-party service (Cloudmersive). The AI Presentation Maker sends your prompt to Google Gemini.";
    expect(post.content).toContain(exactRequiredCopy);
  });

  test('4. sitemap-lastmod.ts records 2026-10-30 for modified pages and preserves trim-audio date', () => {
    expect(PAGE_LASTMOD_DATES['/clean-pdf-metadata']).toBe('2026-10-30');
    expect(PAGE_LASTMOD_DATES['/video-compressor']).toBe('2026-10-30');
    expect(PAGE_LASTMOD_DATES['/trim-audio']).toBe('2026-09-28');
    expect(PAGE_LASTMOD_DATES['/blog/why-stop-uploading-sensitive-pdfs-to-online-converters']).toBe('2026-10-30');

    expect(TOOL_CONTENT_CHANGED_DATES['clean-pdf-metadata']).toBe('2026-10-30');
    expect(TOOL_CONTENT_CHANGED_DATES['video-compressor']).toBe('2026-10-30');
    expect(TOOL_CONTENT_CHANGED_DATES['trim-audio']).toBeUndefined();
  });

  test('5. Sitemap generated output reflects updated lastModified dates', () => {
    const entries = sitemap();
    const cleanPdf = entries.find(e => e.url.endsWith('/clean-pdf-metadata'));
    const videoComp = entries.find(e => e.url.endsWith('/video-compressor'));
    const trimAudio = entries.find(e => e.url.endsWith('/trim-audio'));
    const blogPost = entries.find(e => e.url.endsWith('/blog/why-stop-uploading-sensitive-pdfs-to-online-converters'));

    expect(cleanPdf?.lastModified).toBeDefined();
    expect(new Date(cleanPdf!.lastModified!).toISOString()).toContain('2026-10-30');

    expect(videoComp?.lastModified).toBeDefined();
    expect(new Date(videoComp!.lastModified!).toISOString()).toContain('2026-10-30');

    // trim-audio was reverted to unrecorded in TOOL_CONTENT_CHANGED_DATES, so it omits lastmod or reflects 2026-09-28
    if (trimAudio?.lastModified) {
      expect(new Date(trimAudio.lastModified).toISOString()).not.toContain('2026-10-30');
    }

    expect(blogPost?.lastModified).toBeDefined();
    expect(new Date(blogPost!.lastModified!).toISOString()).toContain('2026-10-30');
  });

  test('6. video-compressor source code proves inputs, WebAssembly engine, and libx264/aac codecs', () => {
    const fs = require('fs');
    const path = require('path');

    const compSource = fs.readFileSync(path.join(process.cwd(), 'src/components/tools/video-compressor.tsx'), 'utf8');
    expect(compSource).not.toContain('Zero Quality Loss');
    expect(compSource).not.toContain('WebGPU Hardware Speed');
    expect(compSource).not.toContain('up to 85%');
    expect(compSource).toContain('In-Browser Video Compressor');
    expect(compSource).toContain('WebAssembly Engine');
    expect(compSource).toContain('".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"');

    const convSource = fs.readFileSync(path.join(process.cwd(), 'src/lib/converters/video.ts'), 'utf8');
    expect(convSource).toContain("'-vcodec', 'libx264'");
    expect(convSource).toContain("'-c:a', 'aac'");
    expect(convSource).toContain("type: 'video/mp4'");
  });

  test('7. No hardcoded links in src/app or src/components point to the 10 retired slugs', () => {
    const fs = require('fs');
    const path = require('path');

    const retiredSlugs = [
      'remove-pdf-properties',
      'pdf-privacy-scrubber',
      'cut-audio-free',
      'private-audio-trimmer',
      'compress-mkv',
      'compress-avi',
      'compress-webm',
      'compress-wmv',
      'compress-flv',
      'why-you-should-stop-uploading-sensitive-files-to-online-converters'
    ];

    function checkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkDir(fullPath);
        } else if (/\.(tsx|ts|jsx|js|html)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const slug of retiredSlugs) {
            // Check for hardcoded links like href="/slug" or href='/slug'
            const linkRegex = new RegExp(`href=["']/?${slug}["']`, 'i');
            expect(
              linkRegex.test(content),
              `File ${fullPath} should not contain hardcoded link to retired slug "${slug}"`
            ).toBe(false);
          }
        }
      }
    }

    checkDir(path.join(process.cwd(), 'src/app'));
    checkDir(path.join(process.cwd(), 'src/components'));
  });
});
