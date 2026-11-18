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

  // Test 7: Title length check (strictly <= 60 characters standalone and <= 60 with site suffix)
  test('7. Batch 1 page titles are strictly 60 characters or fewer', () => {
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
