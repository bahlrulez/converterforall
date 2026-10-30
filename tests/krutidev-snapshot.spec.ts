import { test, expect } from '@playwright/test';
import { krutidevToUnicode, unicodeToKrutidev } from '../src/lib/fonts/krutidev-converter';
import { fontToolsContent } from '../src/lib/content/font-tools';
import { KRUTIDEV_SNAPSHOT_DATA, UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA } from '../src/lib/content/font-tools-data';
import { CUSTOM_TOOL_TITLES } from '../src/lib/seo/metadata';

test.describe('Kruti Dev 010 to Unicode Engine Snapshots & Batch 1 Integrity', () => {
  // Case 1: Page Example & Natural Office Sentence
  test('1. Converts natural office sentence with complex conjuncts, reordering, and halant', () => {
    const input = KRUTIDEV_SNAPSHOT_DATA.naturalOfficeInput;
    const output = krutidevToUnicode(input);
    expect(output).toBe(KRUTIDEV_SNAPSHOT_DATA.expectedUnicode);
    expect(output).toBe('कृपया यह पत्र ध्यान से पढ़ें और अपना विवरण समय पर भेजें।');
  });

  // Case 2: Mixed English Word
  test('2. Converts English word as Remington keyboard keystrokes without English preservation', () => {
    const input = KRUTIDEV_SNAPSHOT_DATA.helloInput;
    const output = krutidevToUnicode(input);
    expect(output).toBe(KRUTIDEV_SNAPSHOT_DATA.helloUnicode);
    expect(output).toBe('भ्मससव ॅवतसक');
  });

  // Case 3: Date with Forward Slashes
  test('3. Maps forward slashes in dates to Devanagari character', () => {
    const input = KRUTIDEV_SNAPSHOT_DATA.dateInput;
    const output = krutidevToUnicode(input);
    expect(output).toBe(KRUTIDEV_SNAPSHOT_DATA.dateUnicode);
    expect(output).toBe('01ध्01ध्2026');
  });

  // Case 4: Smart Quotes / Curly Apostrophes
  test('4. Curly apostrophe does not map to half-letter Sha', () => {
    const input = KRUTIDEV_SNAPSHOT_DATA.smartQuotesInput;
    const output = krutidevToUnicode(input);
    expect(output).toBe(KRUTIDEV_SNAPSHOT_DATA.smartQuotesUnicode);
    expect(output).toBe('‘भारत’ “दे’ा”');
  });

  // Case 5: DevLys 010 Sample Text
  test('5. Converts standard DevLys 010 sentence accurately', () => {
    const input = KRUTIDEV_SNAPSHOT_DATA.devlysInput;
    const output = krutidevToUnicode(input);
    expect(output).toBe(KRUTIDEV_SNAPSHOT_DATA.devlysUnicode);
    expect(output).toBe('भारत हमारा देश है।');
  });

  // Test 6: Unicode to Kruti Dev Roundtrip
  // NOTE: Automated round-trip tests prove internal converter engine consistency only.
  // Real-font visual verification in genuine Kruti Dev 010.ttf / Word is performed manually by the site owner.
  test('6. Converts Unicode Devanagari back to Kruti Dev 010 (engine consistency only; manual font verification required)', () => {
    const input = UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.unicodeInput;
    const output = unicodeToKrutidev(input);
    expect(output).toBe(UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.krutiOutput);
    expect(krutidevToUnicode(output)).toBe(input);
  });

  // Test 7: Rendered HTML contains exact input and engine output in <code>/<pre>
  test('7. Rendered HTML of krutidev-to-unicode contains exact input string and exact engine output in code/pre', () => {
    test.skip(!fontToolsContent['krutidev-to-unicode']?.disableAutoEnrich, 'Batch 1 content excluded until Word verification');
    const krutiData = fontToolsContent['krutidev-to-unicode'];
    expect(krutiData).toBeDefined();

    const allContent = krutiData.sections.map(s => s.content).join('\n');

    // Verify exact escaped input string appears in <pre><code>
    expect(allContent).toContain(`<code>${KRUTIDEV_SNAPSHOT_DATA.htmlEscapedInput}</code>`);
    // Verify exact engine output appears in <pre><code>
    expect(allContent).toContain(`<code>${KRUTIDEV_SNAPSHOT_DATA.expectedUnicode}</code>`);
    // Verify no unescaped backtick corruption in the example block
    expect(allContent).not.toContain('<code>dik ;g');
  });

  // Test 8: Hindi section contains Devanagari heading, phrase, backtick, and single "कृति देव" mention
  test('8. Hindi section uses कृतिदेव consistently, mentions कृति देव once, and preserves backtick in d`i;k', () => {
    test.skip(!fontToolsContent['krutidev-to-unicode']?.disableAutoEnrich, 'Batch 1 content excluded until Word verification');
    const krutiData = fontToolsContent['krutidev-to-unicode'];
    const hindiSection = krutiData.sections.find(s => s.title.includes('कृतिदेव से यूनिकोड'));
    expect(hindiSection).toBeDefined();

    // Verify Devanagari heading and phrase
    expect(hindiSection!.content).toContain('कृतिदेव से यूनिकोड कन्वर्टर');
    // Verify short Hindi input contains escaped backtick
    expect(hindiSection!.content).toContain(`<code>${KRUTIDEV_SNAPSHOT_DATA.shortHindiHtml}</code>`);
    expect(hindiSection!.content).toContain('d&#96;i;k');

    // Verify "कृति देव" is mentioned exactly once in the Hindi section copy
    const matches = hindiSection!.content.match(/कृति देव/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(1);

    // Verify "HTML-escaped" never appears in public copy
    expect(hindiSection!.content).not.toContain('HTML-escaped');
  });

  // Test 9: Public copy rules (no internal notes, correct DevLys & non-Unicode wording, Latin characters in FAQ)
  test('9. Batch 1 public copy follows strict tone, wording, and privacy rules', () => {
    test.skip(!fontToolsContent['krutidev-to-unicode']?.disableAutoEnrich, 'Batch 1 content excluded until Word verification');
    const batch1Slugs = ['krutidev-to-unicode', 'unicode-to-krutidev'];

    for (const slug of batch1Slugs) {
      const pageData = fontToolsContent[slug];
      expect(pageData).toBeDefined();

      const fullHtml = pageData.sections.map(s => `${s.title} ${s.content}`).join('\n');

      // Rule: No internal development notes in public copy
      expect(fullHtml).not.toContain('Verified from');
      expect(fullHtml).not.toContain('Generated directly by');
      expect(fullHtml).not.toContain('Rendered in server-side');
      expect(fullHtml).not.toContain('HTML-escaped');

      // Rule: DevLys phrasing must be "uses a similar layout; try a short sample first"
      expect(fullHtml).not.toContain('generally converts correctly');

      // Rule: No "legacy ASCII remapping font" or "ASCII characters"
      expect(fullHtml).not.toContain('legacy ASCII remapping font');
      expect(fullHtml).not.toContain('ASCII characters');

      // Rule: Must mention non-Unicode font phrasing
      expect(fullHtml).toContain('legacy non-Unicode font that reuses Latin keyboard character codes');
    }
  });

  // Test 10: Title length check (strictly <= 60 characters standalone and <= 60 with site suffix)
  test('10. Batch 1 page titles are strictly 60 characters or fewer', () => {
    const batch1Slugs = ['krutidev-to-unicode', 'unicode-to-krutidev'];

    for (const slug of batch1Slugs) {
      const title = CUSTOM_TOOL_TITLES[slug];
      expect(title).toBeDefined();
      expect(title.length).toBeLessThanOrEqual(60);

      // Verify title with layout template suffix "%s | ConverterForAll" is also <= 60 chars
      const fullTitleWithSuffix = `${title} | ConverterForAll`;
      expect(fullTitleWithSuffix.length).toBeLessThanOrEqual(60);
    }
  });
});
