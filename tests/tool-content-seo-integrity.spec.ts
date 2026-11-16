import { test, expect } from '@playwright/test';
import { getToolContent, extractToolFaqs } from '../src/lib/tool-content';
import { toolsDatabase, getToolBySlug } from '../src/lib/tools-db';
import { getOptimizedToolTitle } from '../src/lib/seo/metadata';

test.describe('Tool Content & SEO Template Integrity (Phase 1 SEO Recovery)', () => {

  // Test 1: unicode-to-inpage never enters PDF page-manipulation branch and avoids unrelated regional fonts
  test('1. unicode-to-inpage never enters PDF page-manipulation branch and avoids unrelated regional fonts', () => {
    const sections = getToolContent('unicode-to-inpage', 'Urdu Unicode to InPage Converter', 'Convert standard Urdu Unicode text to InPage editor format.');
    const fullText = sections.map(s => `${s.title} ${s.content}`).join(' ');

    // Must NOT contain any PDF document/page manipulation text
    expect(fullText).not.toContain('removing pages');
    expect(fullText).not.toContain('scanned sideways');
    expect(fullText).not.toContain('embedded vector fonts');
    expect(fullText).not.toContain('update the document index');
    expect(fullText).not.toContain('reordering pages');
    expect(fullText).not.toContain('Cloudmersive');
    expect(fullText).not.toContain('Word-to-PDF');

    // Must NOT contain unrelated regional font references
    expect(fullText).not.toContain('Burmese');
    expect(fullText).not.toContain('Zawgyi');
    expect(fullText).not.toContain('Nepali');
    expect(fullText).not.toContain('Preeti');
    expect(fullText).not.toContain('Bengali');
    expect(fullText).not.toContain('Bijoy');

    // Must be tightly focused on Urdu Unicode & InPage compatibility
    expect(fullText).toContain('InPage');
    expect(fullText).toContain('Nastaliq');
    expect(fullText).toContain('Phonetic');

    // FAQs must not contain PDF questions
    const faqs = extractToolFaqs(sections);
    const allQuestions = faqs.map(f => f.question).join(' ');
    expect(allQuestions).not.toContain('modifying or converting pages');
    expect(allQuestions).not.toContain('PDF files');
  });

  // Test 2: Font converters receive font-specific instructions and advice
  test('2. Font converters receive font-specific instructions and advice', () => {
    const fontSlugs = [
      'unicode-to-inpage',
      'inpage-to-unicode',
      'krutidev-to-unicode',
      'unicode-to-krutidev',
      'asees-to-unicode',
      'bijoy-to-unicode',
      'zawgyi-to-unicode'
    ];

    for (const slug of fontSlugs) {
      const toolData = getToolBySlug(slug);
      const title = toolData?.tool?.title || slug;
      const desc = toolData?.tool?.description || '';
      const sections = getToolContent(slug, title, desc);
      const fullText = sections.map(s => `${s.title} ${s.content}`).join(' ');

      // Should never have PDF page advice
      expect(fullText).not.toContain('update the document index');
      expect(fullText).not.toContain('scanned sideways');

      // Should have font / Unicode / typing guidance
      const hasFontContext =
        fullText.toLowerCase().includes('unicode') ||
        fullText.toLowerCase().includes('font') ||
        fullText.toLowerCase().includes('typing') ||
        fullText.toLowerCase().includes('text');
      expect(hasFontContext).toBe(true);
    }
  });

  // Test 3: PNG-to-PDF has no irrelevant page-management FAQs and no duplicate transparency FAQs
  test('3. PNG-to-PDF has no irrelevant page-management FAQs and no duplicate transparency FAQs', () => {
    const sections = getToolContent('png-to-pdf', 'PNG to PDF', 'Convert PNG image to standard PDF');
    const fullText = sections.map(s => `${s.title} ${s.content}`).join(' ');

    expect(fullText).not.toContain('reordering pages update the document index');
    expect(fullText).not.toContain('removing pages, scrubbing metadata');
    expect(fullText).not.toContain('scanned sideways');

    const faqs = extractToolFaqs(sections);
    const questionsText = faqs.map(f => f.question).join(' ');
    expect(questionsText).not.toContain('modifying or converting pages');

    // Exactly one transparent PNG question (no duplicate questions)
    const transparentQuestions = faqs.filter(f => /transparent/i.test(f.question));
    expect(transparentQuestions.length).toBe(1);
  });

  // Test 4: PNG-to-PDF does not display duplicate usage guides
  test('4. PNG-to-PDF does not display duplicate usage guides', () => {
    const sections = getToolContent('png-to-pdf', 'PNG to PDF', 'Convert PNG image to standard PDF');
    const guideSections = sections.filter(s =>
      /step|guide|how to use|how it works|instruction/i.test(s.title)
    );

    // Authored guide exists, so enrichContentIfShort must NOT push another generic guide
    expect(guideSections.length).toBe(1);
    expect(guideSections[0].title).toBe('Step-by-step guide');
  });

  // Test 5: FAQ JSON-LD matches visible FAQs
  test('5. FAQ JSON-LD matches visible FAQs for audited tools', () => {
    const slugs = ['unicode-to-inpage', 'png-to-pdf', 'jwt-decoder', 'exam-photo-resizer'];

    for (const slug of slugs) {
      const toolData = getToolBySlug(slug);
      const title = toolData?.tool?.title || slug;
      const desc = toolData?.tool?.description || '';
      const sections = getToolContent(slug, title, desc);
      const faqs = extractToolFaqs(sections);

      // Verify each extracted FAQ corresponds to visible text in the FAQ section
      const faqSection = sections.find(s =>
        s.title.toLowerCase().includes('faq') || s.title.toLowerCase().includes('question')
      );

      if (faqs.length > 0) {
        expect(faqSection).toBeDefined();
        for (const faq of faqs) {
          expect(faqSection!.content).toContain(faq.question);
          // Question and answer must not be empty or generic placeholders
          expect(faq.question.trim().length).toBeGreaterThan(5);
          expect(faq.answer.trim().length).toBeGreaterThan(10);
        }
      }
    }
  });

  // Test 6: JWT title and H1 are aligned (no "Offline" vs "Online" contradiction)
  test('6. JWT title and H1 are aligned', () => {
    const toolData = getToolBySlug('jwt-decoder');
    expect(toolData).toBeDefined();

    const tool = toolData!.tool;
    const h1Title = tool.title;
    const pageTitle = getOptimizedToolTitle(tool, 'jwt-decoder');

    // Both should use "Browser-Based JWT Decoder & Parser"
    expect(h1Title).toBe('Browser-Based JWT Decoder & Parser');
    expect(pageTitle).toContain('Browser-Based JWT Decoder & Parser');

    // Neither should have "Offline" in title
    expect(h1Title).not.toContain('Offline');
    expect(pageTitle).not.toContain('Offline');

    // Neither should have "Online (JSON Web Token)" suffix
    expect(h1Title).not.toContain('Online (JSON Web Token)');
  });

  // Test 7: Existing PDF tools continue receiving relevant content
  test('7. Existing PDF tools continue receiving relevant content', () => {
    const genuinePdfSlugs = [
      'remove-pages',
      'extract-pages',
      'organize-pdf',
      'rotate-pdf',
      'split-pdf',
      'merge-pdf'
    ];

    for (const slug of genuinePdfSlugs) {
      const toolData = getToolBySlug(slug);
      const title = toolData?.tool?.title || slug;
      const desc = toolData?.tool?.description || '';
      const sections = getToolContent(slug, title, desc);
      const fullText = sections.map(s => `${s.title} ${s.content}`).join(' ');

      // Should have document guidance
      expect(fullText.length).toBeGreaterThan(200);
      const hasDocContext =
        fullText.toLowerCase().includes('document') ||
        fullText.toLowerCase().includes('pdf') ||
        fullText.toLowerCase().includes('pages');
      expect(hasDocContext).toBe(true);
    }
  });

  // Test 8: Existing conversion functionality and database definitions not affected
  test('8. Existing conversion functionality and database definitions not affected', () => {
    const unicodeTool = toolsDatabase.fonts['unicode-to-inpage'];
    expect(unicodeTool).toBeDefined();
    expect(unicodeTool.converterType).toBe('font');
    expect(unicodeTool.fontCategory).toBe('urdu');

    const pngTool = toolsDatabase.document['png-to-pdf'];
    expect(pngTool).toBeDefined();
    expect(pngTool.inputFormat).toBe('png');
    expect(pngTool.outputFormat).toBe('pdf');

    const jwtTool = toolsDatabase.developer['jwt-decoder'];
    expect(jwtTool).toBeDefined();
    expect(jwtTool.isInteractive).toBe(true);

    const examPhoto = toolsDatabase.exam['exam-photo-resizer'];
    expect(examPhoto).toBeDefined();

    const examSig = toolsDatabase.exam['exam-signature-resizer'];
    expect(examSig).toBeDefined();
  });

});
