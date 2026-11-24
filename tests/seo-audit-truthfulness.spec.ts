import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { inspectSeoSystem } from '../src/lib/seo/audit/system-inspector';
import { runFullSeoAudit } from '../src/lib/seo/audit/audit-runner';
import { evaluateToolContent, countActualFaqQuestions, hasToolDomainSpecificTerms } from '../src/lib/seo/audit/thin-content-detector';
import { toolContent } from '../src/lib/tool-content';
import { getCanonicalToolSlugs, getToolBySlug } from '../src/lib/tools-db';
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildBreadcrumbSchema,
  buildSoftwareAppSchema,
  buildFaqPageSchema,
  buildCollectionPageSchema,
  buildArticleSchema,
  buildSampleSchema,
  validateBuiltSchema,
  SCHEMA_BUILDERS
} from '../src/lib/seo/schema-builders';
import { siteMetadata } from '../src/lib/seo/site-metadata';
import { SITE_TITLE_TEMPLATE } from '../src/lib/seo/site-config';
import { getToolProcessingBadges } from '../src/lib/seo/tool-processing-classification';
import { calculateToolSeoScore } from '../src/lib/seo/scoring/seo-scorer';

test.describe('SEO Audit Truthfulness & False-Positive Elimination', () => {
  test('1. inspectSeoSystem uses explicit unverified states for sitemap and canonical tags', () => {
    const inspection = inspectSeoSystem();

    // Sitemap: explicitly marked unverified without HTTP fetch
    expect(inspection.sitemap.verificationStatus).toBe('unverified');
    expect(inspection.sitemap.hasSitemapXml).toBeNull();
    expect(
      inspection.sitemap.issues.some((issue) =>
        issue.includes('Live /sitemap.xml endpoint availability and XML response headers are unverified')
      )
    ).toBe(true);

    // Canonical Strategy: explicitly marked unverified without HTTP crawl
    expect(inspection.canonicalStrategy.verificationStatus).toBe('unverified');
    expect(inspection.canonicalStrategy.isSelfReferentialCanonical).toBeNull();
    expect(
      inspection.canonicalStrategy.issues.some((issue) =>
        issue.includes('live deployed <link rel="canonical"> tags are not verified without an HTTP crawl')
      )
    ).toBe(true);
  });

  test('2. Schema inspection executes actual schema builders and dynamically reports generator states', () => {
    // 1. Invoke all actual schema builders and verify resulting @type values
    const webSite = buildWebSiteSchema();
    expect(webSite['@type']).toBe('WebSite');

    const org = buildOrganizationSchema();
    expect(org['@type']).toBe('Organization');

    const breadcrumbs = buildBreadcrumbSchema([{ name: 'Home', url: 'https://www.converterforall.com' }]);
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');

    const softwareApp = buildSoftwareAppSchema({ name: 'PDF Splitter', description: 'Split PDFs', url: 'https://www.converterforall.com/split-pdf' });
    expect(softwareApp['@type']).toBe('SoftwareApplication');

    const faq = buildFaqPageSchema([{ question: 'Is it free?', answer: 'Yes' }]);
    expect(faq['@type']).toBe('FAQPage');

    const collection = buildCollectionPageSchema({ name: 'PDF Tools', description: 'Collection', url: 'https://www.converterforall.com/category/document' });
    expect(collection['@type']).toBe('CollectionPage');

    const article = buildArticleSchema({ title: 'How to Convert', description: 'Guide', url: 'https://www.converterforall.com/blog/test' });
    expect(article['@type']).toBe('Article');

    // 2. Inspect system inspection results
    const inspection = inspectSeoSystem();
    expect(inspection.schemaGeneration.verificationStatus).toBe('source-declared');
    expect(inspection.schemaGeneration.hasWebSiteSchema).toBe(true);
    expect(inspection.schemaGeneration.hasOrganizationSchema).toBe(true);
    expect(inspection.schemaGeneration.hasBreadcrumbListSchema).toBe(true);
    expect(inspection.schemaGeneration.hasSoftwareApplicationSchema).toBe(true);
    expect(inspection.schemaGeneration.hasFaqPageSchema).toBe(true);
    expect(inspection.schemaGeneration.hasCollectionPageSchema).toBe(true);
    expect(inspection.schemaGeneration.hasArticleSchema).toBe(true);

    // 3. Verify generator statuses are distinguished
    const generators = inspection.schemaGeneration.generators;
    for (const key of Object.keys(SCHEMA_BUILDERS)) {
      expect(generators[key]).toBeDefined();
      expect(generators[key].status).toBe('source-declared');
      expect(generators[key].deployedValidation).toBe('unverified');
      expect(generators[key].richResultsEligibility).toBe('unverified');
    }

    // 4. Verify issue list is dynamically constructed and includes detected generator names
    const confirmationIssue = inspection.schemaGeneration.issues.find(iss => iss.includes('Source inspection confirmed functional schema builders for:'));
    expect(confirmationIssue).toBeDefined();
    expect(confirmationIssue).toContain('WebSite');
    expect(confirmationIssue).toContain('SoftwareApplication');

    expect(
      inspection.schemaGeneration.issues.some((issue) =>
        issue.includes('Live JSON-LD syntax validity, schema.org conformance, and Google Rich Results eligibility are unverified')
      )
    ).toBe(true);
  });

  test('3. Content specificity heuristic distinguishes dedicated records from generic fallback', () => {
    // Tool with dedicated content record and specific procedural/format instructions
    const krutiResult = evaluateToolContent('krutidev-to-unicode', 'Kruti Dev to Unicode Converter', 'Convert Kruti Dev font to Unicode Hindi text.');
    expect(krutiResult.hasDedicatedContentRecord).toBe(true);
    expect(krutiResult.hasToolSpecificContent).toBe(true);
    expect(krutiResult.isThinContent).toBe(false);

    // Generic fallback with boilerplate copy
    const fallbackResult = evaluateToolContent('imaginary-tool-xyz', 'Imaginary Tool', 'We built this tool to make everyday file tasks simple');
    expect(fallbackResult.hasDedicatedContentRecord).toBe(false);
    expect(fallbackResult.hasToolSpecificContent).toBe(false);
    expect(fallbackResult.isThinContent).toBe(true);
    expect(fallbackResult.thinContentReason).toContain('editorial review');
  });

  test('4. Root siteMetadata observed template is checked and not silently substituted with fallback', () => {
    const inspection = inspectSeoSystem();
    expect(inspection.metadataGeneration.titleTemplate).toBe(SITE_TITLE_TEMPLATE);
    expect(
      inspection.metadataGeneration.issues.some((iss) => iss.includes('template property defined'))
    ).toBe(false);
  });

  test('5. Redirect aliases have indexability = redirect, no independent page schema, and no false schema credits', () => {
    const { summary, inventory } = runFullSeoAudit();

    // Filter all aliases
    const aliases = inventory.filter((item) => item.isAlias);
    expect(aliases.length).toBeGreaterThan(0);

    for (const alias of aliases) {
      // Must have indexability = redirect
      expect(alias.indexability).toBe('redirect');
      // Must NOT receive positive schema credits
      expect(alias.structuredDataTypes).toEqual([]);
      expect(alias.breadcrumbStructure).toEqual([]);
      expect(alias.hasDedicatedContentRecord).toBe(false);
      expect(alias.hasToolSpecificContent).toBe(false);
      expect(alias.wordCount).toBe(0);
    }

    // Verify summary counts match inventory precisely
    const noindexItems = inventory.filter((item) => item.indexability === 'noindex');
    expect(summary.totalNoindexPages).toBe(noindexItems.length);
    expect(summary.totalAliasRoutes).toBe(aliases.length);
  });

  test('6. Audit dashboard UI reflects explicit unverified states and accurate measurement labels', () => {
    const dashboardPath = path.join(process.cwd(), 'src/app/admin/seo-audit/audit-dashboard-client.tsx');
    const content = fs.readFileSync(dashboardPath, 'utf8');

    // KPI Card 2 must not mislabel noindex tools as aliases
    expect(content).not.toContain('{summary.totalNoindexPages} Aliases (Noindex/Alt)');
    expect(content).toContain('{summary.totalNoindexPages} Noindex Tools ({summary.totalAliasRoutes} Redirect Aliases)');

    // KPI Card 3 & 4 copy
    expect(content).toContain('Flagged for review (&lt;250w or fallback copy)');
    expect(content).toContain('Shared across &gt;1 route (inc. aliases)');

    // Explicit unverified verification statuses in badges
    expect(content).toContain('{systemInspection.sitemap.verificationStatus}');
    expect(content).toContain('{systemInspection.canonicalStrategy.verificationStatus}');
    expect(content).toContain('{systemInspection.schemaGeneration.verificationStatus}');

    // Content specificity & editorial labels in inspection modal
    expect(content).toContain('Dedicated Content Record:');
    expect(content).toContain('Content Specificity Heuristic:');
    expect(content).toContain('Visible Word Count:');
    expect(content).toContain('Editorial Review Heuristic');
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

  test('8. Category page copy reconciles PDF, Image, Audio, Font, and Video claims truthfully', () => {
    const categoryPagePath = path.join(process.cwd(), 'src/app/category/[slug]/page.tsx');
    const content = fs.readFileSync(categoryPagePath, 'utf8');

    // PDF Category: distinguishes rasterizing compression from structural optimization
    expect(content).toContain('Fixed-size target compressors (like Compress PDF to 100KB) rasterize pages into images');
    expect(content).toContain('turns text into pixels and makes it non-selectable');
    expect(content).toContain('standard structural optimization retains crisp vector text');

    // Image Category: photo resizing without portal acceptance guarantees + local WASM AI
    expect(content).not.toContain('Biometric Passport Standards');
    expect(content).toContain('Standard Photo Cropping');
    expect(content).toContain('Always review your official portal guidelines');
    expect(content).toContain('ISNet via @imgly/background-removal');

    // Audio Category: WAV to MP3 lossy disclosure
    expect(content).not.toContain('without quality loss');
    expect(content).toContain('Precision Audio Trimming');
    expect(content).toContain('WAV is an uncompressed lossless format, whereas MP3 uses lossy compression');
    expect(content).toContain('not bit-for-bit lossless');

    // Font Category: selected regional font mappings, not universal compatibility
    expect(content).not.toContain('Universal Unicode Compatibility');
    expect(content).toContain('Selected Regional Font Mappings');
    expect(content).toContain('availability, mapping coverage, and reversibility differ between fonts and directions');

    // Video Category: accepted inputs and MP4 output format
    expect(content).not.toContain('convert formats to AVI, MOV, WebM, and MKV');
    expect(content).toContain('Audio Extraction & MP4 Export');
    expect(content).toContain('re-encode supported video inputs into web-ready MP4 files');
    expect(content).toContain('accept common video containers including MP4, MOV, WebM, MKV, and AVI');
  });

  test('9. Content specificity measurement accurately identifies depth, formats, real FAQs, and shallow stubs', () => {
    // A. Empty FAQ heading returns 0, never assumes 3 questions
    const emptyFaqHtml = '<h2>Frequently Asked Questions</h2><p>Find common questions and answers below.</p>';
    expect(countActualFaqQuestions(emptyFaqHtml)).toBe(0);

    // Ordinary definition-list terms in <dt> without a question are NOT counted
    const dtTermsHtml = '<dl><dt>Lossless Compression</dt><dd>Reduces file size without losing any pixel details.</dd></dl>';
    expect(countActualFaqQuestions(dtTermsHtml)).toBe(0);

    // Definition-list terms containing genuine questions with substantive answers are counted
    const dtQuestionsHtml = '<dl><dt>Is this converter completely free to use?</dt><dd>Yes, it is 100% free with no daily limits or accounts required.</dd></dl>';
    expect(countActualFaqQuestions(dtQuestionsHtml)).toBe(1);

    // Question markers without substantive answers are NOT counted
    const unansweredQuestionsHtml = '<p><strong>Q: Is there any daily file limit?</strong></p><p><strong>Q: How do I convert files?</strong></p>';
    expect(countActualFaqQuestions(unansweredQuestionsHtml)).toBe(0);

    const shortAnswerHtml = '<p><strong>Q: Is it free?</strong> Yes</p>';
    expect(countActualFaqQuestions(shortAnswerHtml)).toBe(0);

    // Actual detected questions with substantive answers are counted accurately
    const validFaqHtml = `
      <p><strong>Q1: Is this tool free?</strong> Yes, completely free.</p>
      <p><strong>Q2: Where are files processed?</strong> In your browser memory.</p>
    `;
    expect(countActualFaqQuestions(validFaqHtml)).toBe(2);

    // B. Dedicated record with substantive procedural/format depth -> specific
    const krutiResult = evaluateToolContent('krutidev-to-unicode', 'Kruti Dev to Unicode Converter', 'Convert Kruti Dev font to Unicode Hindi text.');
    expect(krutiResult.hasDedicatedContentRecord).toBe(true);
    expect(krutiResult.hasToolSpecificContent).toBe(true);
    expect(krutiResult.isThinContent).toBe(false);

    // C. Non-dedicated tool with substantive dynamic length conversion guide -> specific
    const lengthResult = evaluateToolContent('inches-to-centimeters', 'Convert Inches to Centimeters', 'Convert inches to centimeters.');
    expect(lengthResult.hasDedicatedContentRecord).toBe(false);
    expect(lengthResult.hasToolSpecificContent).toBe(true);
    expect(lengthResult.isThinContent).toBe(false);

    // D. Shallow stub (temporarily registering shallow stub into toolContent) -> hasDedicatedContentRecord is true but hasToolSpecificContent is false
    toolContent['test-shallow-stub'] = {
      sections: [{ title: 'Overview', content: '<p>A short test stub.</p>' }],
      disableAutoEnrich: true
    };
    try {
      const shallowResult = evaluateToolContent('test-shallow-stub', 'Shallow Stub Tool', 'A very short test stub description.');
      expect(shallowResult.hasDedicatedContentRecord).toBe(true);
      expect(shallowResult.hasToolSpecificContent).toBe(false);
      expect(shallowResult.isThinContent).toBe(true);
    } finally {
      delete toolContent['test-shallow-stub'];
    }

    // E. Generic fallback boilerplate -> false specificity and thin content
    const fallbackResult = evaluateToolContent('imaginary-tool-test', 'Imaginary Tool', 'We built this tool to make everyday file tasks simple.');
    expect(fallbackResult.hasDedicatedContentRecord).toBe(false);
    expect(fallbackResult.hasToolSpecificContent).toBe(false);
    expect(fallbackResult.isThinContent).toBe(true);

    // F. Tool-domain-aware technical terms validation
    // Unrelated formats cannot establish specificity for an image tool
    expect(hasToolDomainSpecificTerms('image-to-text', 'Convert .wav audio tracks with 48 kHz sample rate into .mp3 format.')).toBe(false);

    // Generic technical terminology alone ("compression") cannot establish specificity for a font converter
    expect(hasToolDomainSpecificTerms('krutidev-to-unicode', 'A high quality utility offering efficient compression and fast performance.')).toBe(false);

    // Unmatched tool domains cannot establish specificity via generic terms like ".pdf" or "compression"
    expect(hasToolDomainSpecificTerms('imaginary-unknown-tool', 'A high quality utility offering file compression into .pdf format.')).toBe(false);

    // True domain-matched terms succeed
    expect(hasToolDomainSpecificTerms('image-to-text', 'Extract text from png and jpg photos using optical character recognition.')).toBe(true);
    expect(hasToolDomainSpecificTerms('krutidev-to-unicode', 'Converts legacy Kruti Dev Hindi font to standard Unicode with proper matra placement.')).toBe(true);
    expect(hasToolDomainSpecificTerms('mp3-to-wav', 'Converts lossy MP3 audio into 44.1 kHz 16-bit PCM WAV lossless audio.')).toBe(true);
  });

  test('10. Redirect aliases are excluded from rendered-page averages, link diagnostics, and duplicate counts', () => {
    const { summary, inventory } = runFullSeoAudit();

    const renderedPages = inventory.filter((item) => !item.isAlias);
    const aliases = inventory.filter((item) => item.isAlias);

    expect(renderedPages.length).toBeGreaterThan(0);
    expect(aliases.length).toBeGreaterThan(0);

    // Averages must divide by renderedPageCount, NOT inventory.length
    const expectedAvgWords = Math.round(
      renderedPages.reduce((acc, item) => acc + item.wordCount, 0) / renderedPages.length
    );
    expect(summary.averageWordCount).toBe(expectedAvgWords);

    const expectedAvgScore = Math.round(
      renderedPages.reduce((acc, item) => acc + item.seoHealthScore, 0) / renderedPages.length
    );
    expect(summary.averageSeoScore).toBe(expectedAvgScore);

    // Missing schema and breadcrumb counts must only reflect rendered pages
    const missingBreadcrumbs = renderedPages.filter((item) => item.breadcrumbStructure.length === 0).length;
    expect(summary.pagesMissingBreadcrumbs).toBe(missingBreadcrumbs);

    // Weak internal linking total must strictly reflect rendered pages
    const expectedWeakLinks = renderedPages.filter((item) => item.incomingInternalLinkCount < 3).length;
    expect(summary.pagesWithWeakInternalLinking).toBe(expectedWeakLinks);

    // Duplicate titles & descriptions must strictly reflect rendered pages (no aliases in duplicate lists)
    for (const dup of summary.pagesWithDuplicateTitles) {
      for (const slug of dup.slugs) {
        const item = inventory.find((i) => i.urlPath === slug);
        expect(item?.isAlias, `Duplicate title list should not contain alias route: ${slug}`).toBe(false);
      }
    }

    for (const dup of summary.pagesWithDuplicateDescriptions) {
      for (const slug of dup.slugs) {
        const item = inventory.find((i) => i.urlPath === slug);
        expect(item?.isAlias, `Duplicate description list should not contain alias route: ${slug}`).toBe(false);
      }
    }

    // Scorer must not penalize legitimate 301 redirect aliases
    const sampleAlias = aliases[0];
    const aliasScore = calculateToolSeoScore({
      title: sampleAlias.currentTitle,
      metaDescription: sampleAlias.currentMetaDescription,
      canonicalUrl: sampleAlias.canonicalUrl,
      isAlias: true,
      wordCount: 0,
      isThinContent: false,
      incomingLinkCount: sampleAlias.incomingInternalLinkCount,
      hasBreadcrumbs: false,
      hasStructuredData: false,
    });

    expect(aliasScore.score).toBe(sampleAlias.seoHealthScore);
    expect(aliasScore.issues.some((issue) => issue.includes('Alias route: Should 301 redirect'))).toBe(false);
    expect(aliasScore.issues.some((issue) => issue.includes('Thin content'))).toBe(false);
    expect(aliasScore.issues.some((issue) => issue.includes('Missing BreadcrumbList'))).toBe(false);
    expect(aliasScore.issues.some((issue) => issue.includes('Missing SoftwareApplication'))).toBe(false);
  });

  test('11. Schema sample validation catches invalid structures and passes compliant schemas', () => {
    // Valid samples from buildSampleSchema pass
    for (const schemaType of Object.keys(SCHEMA_BUILDERS)) {
      const sample = buildSampleSchema(schemaType);
      const validation = validateBuiltSchema(schemaType, sample);
      expect(validation.isValid, `Sample for ${schemaType} should be valid`).toBe(true);
      expect(validation.errors).toEqual([]);
    }

    // Invalid Breadcrumbs (empty array or missing item/url)
    const emptyBreadcrumbs = validateBuiltSchema('BreadcrumbList', { '@type': 'BreadcrumbList', itemListElement: [] });
    expect(emptyBreadcrumbs.isValid).toBe(false);
    expect(emptyBreadcrumbs.errors.some((err) => err.includes('non-empty itemListElement'))).toBe(true);

    // Invalid FAQPage (empty array or missing Answer)
    const emptyFaq = validateBuiltSchema('FAQPage', { '@type': 'FAQPage', mainEntity: [] });
    expect(emptyFaq.isValid).toBe(false);
    expect(emptyFaq.errors.some((err) => err.includes('non-empty mainEntity'))).toBe(true);

    const faqMissingAnswer = validateBuiltSchema('FAQPage', {
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: 'Q1?' }]
    });
    expect(faqMissingAnswer.isValid).toBe(false);

    // Invalid SoftwareApplication (missing 0-price Offer)
    const appWithoutOffer = validateBuiltSchema('SoftwareApplication', {
      '@type': 'SoftwareApplication',
      name: 'Utility',
      url: 'https://www.converterforall.com/test'
    });
    expect(appWithoutOffer.isValid).toBe(false);
    expect(appWithoutOffer.errors.some((err) => err.includes('0-price Offer'))).toBe(true);

    // Invalid Article (missing datePublished)
    const articleWithoutDate = validateBuiltSchema('Article', {
      '@type': 'Article',
      headline: 'Guide',
      description: 'Test Guide',
      url: 'https://www.converterforall.com/blog/test'
    });
    expect(articleWithoutDate.isValid).toBe(false);
    expect(articleWithoutDate.errors.some((err) => err.includes('datePublished'))).toBe(true);
  });

  test('12. Tool page processing classifications truthfully disclose cloud vs local engines without blanket claims', () => {
    // Cloud / External Services
    const wordPdf = getToolProcessingBadges('word-to-pdf');
    expect(wordPdf.classification).toBe('cloud-opt-in');
    expect(wordPdf.heroBadge).toContain('Optional Cloud Engine');
    expect(wordPdf.trustBadge).toContain('Cloudmersive API');

    const pptPdf = getToolProcessingBadges('powerpoint-to-pdf');
    expect(pptPdf.classification).toBe('cloud-opt-in');
    expect(pptPdf.trustBadge).toContain('Cloudmersive API');

    const presentation = getToolProcessingBadges('presentation-maker');
    expect(presentation.classification).toBe('external-ai-mixed');
    expect(presentation.heroBadge).toContain('Google Gemini');
    expect(presentation.trustBadge).toContain('Google Gemini');
    expect(presentation.trustBadge).toContain('external image providers');

    // Genuine Client-Side AI/ML
    const bgRemoval = getToolProcessingBadges('remove-background');
    expect(bgRemoval.classification).toBe('client-ai');
    expect(bgRemoval.trustBadge).toContain('@imgly ISNet');

    const ocr = getToolProcessingBadges('image-to-text');
    expect(ocr.classification).toBe('client-ai');
    expect(ocr.trustBadge).toContain('Tesseract OCR');

    const captions = getToolProcessingBadges('video-caption-generator');
    expect(captions.classification).toBe('client-webcodecs');
    expect(captions.trustBadge).toContain('WebCodecs');

    // WebAssembly PDF tools
    const mergePdf = getToolProcessingBadges('merge-pdf', { title: 'Merge PDF', description: 'Merge PDFs', outputFormat: 'pdf' }, 'document');
    expect(mergePdf.classification).toBe('client-wasm-pdf');
    expect(mergePdf.heroBadge).toContain('WebAssembly PDF Utility');

    // Neutral fallback for unclassified tools
    const fallbackTool = getToolProcessingBadges('unclassified-custom-utility');
    expect(fallbackTool.classification).toBe('neutral-fallback');
    expect(fallbackTool.heroBadge).toBe('Free Online Utility');
    expect(fallbackTool.trustBadge).toBe('Browser-based file utility · No account required');
    expect(fallbackTool.trustBadge).not.toContain('100%');
    expect(fallbackTool.trustBadge).not.toContain('on-device');
  });

  test('13. Every canonical tool in toolsDatabase has an intentional processing classification', () => {
    const canonicalSlugs = getCanonicalToolSlugs();
    expect(canonicalSlugs.length).toBeGreaterThan(100);

    for (const slug of canonicalSlugs) {
      const toolData = getToolBySlug(slug);
      expect(toolData, `Tool data for canonical slug '${slug}' must resolve`).toBeDefined();
      if (toolData) {
        const badges = getToolProcessingBadges(slug, toolData.tool, toolData.categorySlug);
        expect(
          badges.classification,
          `Canonical tool '${slug}' must have an intentional classification, not neutral-fallback`
        ).not.toBe('neutral-fallback');
      }
    }

    // WebCodecs must only be assigned to video-caption-generator
    for (const slug of canonicalSlugs) {
      const toolData = getToolBySlug(slug);
      if (toolData) {
        const badges = getToolProcessingBadges(slug, toolData.tool, toolData.categorySlug);
        if (slug === 'video-caption-generator') {
          expect(badges.classification).toBe('client-webcodecs');
        } else {
          expect(
            badges.classification,
            `Tool '${slug}' must not be assigned client-webcodecs unless it explicitly uses WebCodecs`
          ).not.toBe('client-webcodecs');
        }
      }
    }

    // Video compressor must be WebAssembly FFmpeg (client-wasm-video)
    const videoCompressorData = getToolBySlug('video-compressor');
    expect(videoCompressorData).toBeDefined();
    if (videoCompressorData) {
      const badges = getToolProcessingBadges('video-compressor', videoCompressorData.tool, videoCompressorData.categorySlug);
      expect(badges.classification).toBe('client-wasm-video');
      expect(badges.trustBadge).toContain('FFmpeg');
    }

    // Audio tools must be WebAssembly audio processors (client-wasm-audio)
    const audioData = getToolBySlug('mp3-to-wav');
    expect(audioData).toBeDefined();
    if (audioData) {
      const badges = getToolProcessingBadges('mp3-to-wav', audioData.tool, audioData.categorySlug);
      expect(badges.classification).toBe('client-wasm-audio');
      expect(badges.trustBadge).toContain('Web Audio');
    }

    // Unknown slugs must fall back to neutral-fallback
    const unknownBadges = getToolProcessingBadges('totally-imaginary-slug');
    expect(unknownBadges.classification).toBe('neutral-fallback');
    expect(unknownBadges.heroBadge).toBe('Free Online Utility');
  });
});
