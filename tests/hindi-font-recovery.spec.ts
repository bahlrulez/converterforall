import { test, expect } from '@playwright/test';
import { krutidevToUnicode, unicodeToKrutidev } from '../src/lib/fonts/krutidev-converter';
import { SLUG_ALIASES, getToolBySlug } from '../src/lib/tools-db';
import { TIER_C_NOINDEX_SLUGS } from '../src/config/sitemap-lastmod';
import { getToolContent } from '../src/lib/tool-content';
import { TIER_A_TOOLS } from '../src/components/layout/compact-tool-nav';

test.describe('Phase 2 Batch 2 – Hindi & KrutiDev Recovery Suite', () => {

  // ==========================================
  // 1. REPH TERMINATION & MANDATORY INPUTS (P0)
  // ==========================================
  test.describe('1. Reph Transformation & Loop Termination Safety', () => {
    const mandatoryRephCases: [string, string][] = [
      ['धर्म', '/keZ'],
      ['कर्म', 'deZ'],
      ['सूर्य', 'lw;Z'],
      ['सर्व', 'loZ'],
      ['गर्व', 'xoZ'],
      ['हर्ष', 'g"kZ'],
      ['मार्ग', 'ekxZ'],
      ['कार्य', 'dk;Z'],
      ['वर्ण', 'o.kZ'],
      ['दर्शन', "n'kZu"],
      ['आशीर्वाद', "vk'khokZn"],
      ['पुनर्जन्म', 'iqutZUe']
    ];

    for (const [hindi, expectedKruti] of mandatoryRephCases) {
      test(`Converts "${hindi}" to KrutiDev "${expectedKruti}" and roundtrips without hanging`, () => {
        const startTime = Date.now();
        const kruti = unicodeToKrutidev(hindi);
        const duration = Date.now() - startTime;

        // Provable termination: must finish well under 200ms
        expect(duration).toBeLessThan(200);
        expect(kruti).toBe(expectedKruti);

        // Roundtrip fidelity back to Unicode Devanagari
        const roundtrip = krutidevToUnicode(kruti);
        expect(roundtrip).toBe(hindi);
      });
    }

    test('Stress test: multiple Reph in paragraph terminates linearly in milliseconds', () => {
      const paragraph = mandatoryRephCases.map(c => c[0]).join(' ');
      const startTime = Date.now();
      const output = unicodeToKrutidev(paragraph);
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeLessThan(500);
      expect(output).toContain('/keZ');
      expect(output).toContain('deZ');
      expect(output).toContain('lw;Z');

      const back = krutidevToUnicode(output);
      expect(back).toBe(paragraph);
    });
  });

  // ==========================================
  // 2. HALF-SHA (ष्) & DOUBLE QUOTE RECOVERY (P0)
  // ==========================================
  test.describe('2. Half-Sha (ष्) vs Half-Sha (श्) Keyboard Mapping Fidelity', () => {
    const mandatoryShaCases: [string, string][] = [
      ['d"V', 'कष्ट'],
      ['Li"V', 'स्पष्ट'],
      ['–f"V', 'दृष्टि'],
      ['jk"Vª', 'राष्ट्र'],
      ['Js"B', 'श्रेष्ठ'],
      ['T;s"B', 'ज्येष्ठ'],
      ['u"V', 'नष्ट'],
      ['Hkz"V', 'भ्रष्ट'],
      ['l`f"V', 'सृष्टि'],
      ['egkjk"Vª', 'महाराष्ट्र']
    ];

    for (const [kruti, expectedUnicode] of mandatoryShaCases) {
      test(`Maps KrutiDev "${kruti}" correctly to half-Murdhanya Sha "${expectedUnicode}"`, () => {
        const actual = krutidevToUnicode(kruti);
        expect(actual).toBe(expectedUnicode);

        // Must not contain Talavya Sha (श्) corruption
        expect(actual).not.toContain('श्ट');
        expect(actual).not.toContain('श्ति');
      });
    }

    test('Distinguishes single quote (\') as श् and double quote (") as ष्', () => {
      expect(krutidevToUnicode("'")).toBe('श्');
      expect(krutidevToUnicode('"')).toBe('ष्');
      expect(krutidevToUnicode("'k")).toBe('श');
      expect(krutidevToUnicode('"k')).toBe('ष');
    });

    test('Preserves smart curly quotes in KrutiDev text without corruption', () => {
      const input = '‘Hkkjr’ “ns’k”';
      const actual = krutidevToUnicode(input);
      expect(actual).toBe('‘भारत’ “दे’ा”');
    });
  });

  // ==========================================
  // 3. RAKAR (्र) CONJUNCTS
  // ==========================================
  test.describe('3. Rakar (्र) Conjunct Consonants', () => {
    const rakarCases: [string, string][] = [
      ['Øe', 'क्रम'],
      ['çse', 'प्रेम'],
      ['izdk\'k', 'प्रकाश'],
      ['izdk"k', 'प्रकाष'],
      ['xzke', 'ग्राम'],
      ['czkã.k', 'ब्राह्मण'],
      ['Vªd', 'ट्रक'],
      ['Mªkboj', 'ड्राइवर']
    ];

    for (const [kruti, expectedUnicode] of rakarCases) {
      test(`Converts Rakar cluster "${kruti}" -> "${expectedUnicode}"`, () => {
        expect(krutidevToUnicode(kruti)).toBe(expectedUnicode);
      });
    }
  });

  // ==========================================
  // 4. NUKTA CONSONANTS
  // ==========================================
  test.describe('4. Nukta Consonants (क़, ख़, ग़, ज़, ड़, ढ़, फ़)', () => {
    const nuktaCases: [string, string][] = [
      ['d+', 'क़'],
      ['[+k', 'ख़'],
      ['x+', 'ग़'],
      ['t+', 'ज़'],
      ['M+', 'ड़'],
      ['<+', 'ढ़'],
      ['Q+', 'फ़'],
      ['isM+', 'पेड़'],
      ['i<+uk', 'पढ़ना']
    ];

    for (const [kruti, expected] of nuktaCases) {
      test(`Converts Nukta input "${kruti}" -> "${expected}"`, () => {
        expect(krutidevToUnicode(kruti)).toBe(expected);
      });
    }
  });

  // ==========================================
  // 5. HALANT CONJUNCTS & LIGATURES
  // ==========================================
  test.describe('5. Halant Conjuncts and Complex Ligatures', () => {
    const conjunctCases: [string, string][] = [
      ['{k', 'क्ष'],
      ['{ks=', 'क्षेत्र'],
      ['{ks=k', 'क्षेत्रा'],
      ['=', 'त्र'],
      ['i=', 'पत्र'],
      ['i=k', 'पत्रा'],
      ['K', 'ज्ञ'],
      ['Kku', 'ज्ञान'],
      ['J', 'श्र'],
      ['Jfed', 'श्रमिक'],
      ['fo|k', 'विद्या'],
      ['}kj', 'द्वार'],
      ['fpà', 'चिह्न'],
      ['czãk', 'ब्रह्मा'],
      ['mRlo', 'उत्सव'],
      ['lR;', 'सत्य'],
      ['vPNk', 'अच्छा'],
      ['fny~yh', 'दिल्ली'],
      ['mRrj', 'उत्तर']
    ];

    for (const [kruti, expected] of conjunctCases) {
      test(`Converts conjunct "${kruti}" -> "${expected}"`, () => {
        expect(krutidevToUnicode(kruti)).toBe(expected);
      });
    }
  });

  // ==========================================
  // 6. INDEPENDENT VOWELS & PRE-BASE I MATRA
  // ==========================================
  test.describe('6. Independent Vowels and Pre-base I Matra', () => {
    const vowelCases: [string, string][] = [
      ['v', 'अ'],
      ['vk', 'आ'],
      ['b', 'इ'],
      ['bZ', 'ई'],
      ['m', 'उ'],
      ['Å', 'ऊ'],
      [',', 'ए'],
      [',s', 'ऐ'],
      ['vks', 'ओ'],
      ['vkS', 'औ'],
      ['_', 'ऋ']
    ];

    for (const [kruti, expected] of vowelCases) {
      test(`Converts independent vowel "${kruti}" -> "${expected}"`, () => {
        expect(krutidevToUnicode(kruti)).toBe(expected);
      });
    }

    test('Chhoti I (f) repositioning before single consonant and conjuncts', () => {
      expect(krutidevToUnicode('fd')).toBe('कि');
      expect(krutidevToUnicode('fdrkc')).toBe('किताब');
      expect(krutidevToUnicode('fLFkfr')).toBe('स्थिति');
      expect(krutidevToUnicode('f=kHkqou')).toBe('त्रिभुवन');
      expect(krutidevToUnicode('bfrgkl')).toBe('इतिहास');
    });
  });

  // ==========================================
  // 7. ANUSVARA, CHANDRABINDU & PUNCTUATION
  // ==========================================
  test.describe('7. Anusvara, Chandrabindu, Numerals & Punctuation', () => {
    test('Anusvara (a) and Chandrabindu (¡) positioning', () => {
      expect(krutidevToUnicode('vax')).toBe('अंग');
      expect(krutidevToUnicode('pk¡n')).toBe('चाँद');
      expect(krutidevToUnicode('gal')).toBe('हंस');
      expect(krutidevToUnicode('g¡luk')).toBe('हँसना');
    });

    test('Devanagari punctuation: Danda (A) and Laaghava (ñ)', () => {
      expect(krutidevToUnicode('Hkkjr gekjk ns\'k gSA')).toBe('भारत हमारा देश है।');
      expect(krutidevToUnicode('ñ')).toBe('॰');
    });

    test('Alt-code Devanagari numerals vs standard digits', () => {
      expect(krutidevToUnicode('å ƒ „ … † ‡ ˆ ‰ Š ‹')).toBe('० १ २ ३ ४ ५ ६ ७ ८ ९');
      expect(krutidevToUnicode('01/01/2026')).toBe('01ध्01ध्2026');
    });
  });

  // ==========================================
  // 8. MANGAL TO KRUTI ALIAS & REDIRECT (P0)
  // ==========================================
  test.describe('8. Mangal to Kruti 301 Permanent Redirect Resolution', () => {
    test('mangal-to-kruti is registered in SLUG_ALIASES pointing to unicode-to-krutidev', () => {
      expect(SLUG_ALIASES['mangal-to-kruti']).toBe('unicode-to-krutidev');
    });

    test('getToolBySlug resolves mangal-to-kruti to canonical unicode-to-krutidev', () => {
      const toolData = getToolBySlug('mangal-to-kruti');
      expect(toolData).not.toBeNull();
      expect(toolData?.toolSlug).toBe('unicode-to-krutidev');
      expect(toolData?.tool.title).toBe('Unicode to Kruti Dev Converter');
    });

    test('Other mangal aliases resolve to correct canonical tools without chains', () => {
      expect(SLUG_ALIASES['mangal-to-krutidev']).toBe('unicode-to-krutidev');
      expect(SLUG_ALIASES['mangal-to-kruti-dev']).toBe('unicode-to-krutidev');
      expect(SLUG_ALIASES['krutidev-to-mangal']).toBe('krutidev-to-unicode');
      expect(SLUG_ALIASES['kruti-dev-to-mangal']).toBe('krutidev-to-unicode');
    });
  });

  // ==========================================
  // 9. CHANAKYA ROUTE SAFETY & DE-PROMOTION (P1)
  // ==========================================
  test.describe('9. Chanakya Route Safety & Navigation De-promotion', () => {
    test('Chanakya routes are marked noindex in TIER_C_NOINDEX_SLUGS', () => {
      expect(TIER_C_NOINDEX_SLUGS.has('chanakya-to-unicode')).toBe(true);
      expect(TIER_C_NOINDEX_SLUGS.has('unicode-to-chanakya')).toBe(true);
    });

    test('Chanakya routes are not promoted in TIER_A_TOOLS top nav', () => {
      const tierASlugs = TIER_A_TOOLS.map(t => t.slug);
      expect(tierASlugs).not.toContain('chanakya-to-unicode');
      expect(tierASlugs).not.toContain('unicode-to-chanakya');
      expect(tierASlugs).toContain('krutidev-to-unicode');
      expect(tierASlugs).toContain('unicode-to-krutidev');
    });

    test('Chanakya titles are strictly 60 characters or fewer', () => {
      const c1 = getToolBySlug('chanakya-to-unicode');
      const c2 = getToolBySlug('unicode-to-chanakya');
      expect((c1?.tool.seoTitle || c1?.tool.title)!.length).toBeLessThanOrEqual(60);
      expect((c2?.tool.seoTitle || c2?.tool.title)!.length).toBeLessThanOrEqual(60);
    });
  });

  // ==========================================
  // 10. HINDI CONTENT ISOLATION (P1)
  // ==========================================
  test.describe('10. Hindi Tool Content Isolation from Other Scripts', () => {
    const hindiSlugs = ['krutidev-to-unicode', 'unicode-to-krutidev'];
    const forbiddenRegionalTerms = ['Preeti', 'Bijoy', 'Zawgyi', 'Gurmukhi', 'PSSSB', 'Asees', 'Satluj', 'Joy', 'InPage'];

    for (const slug of hindiSlugs) {
      test(`Page content for ${slug} contains zero cross-language boilerplate leaks`, () => {
        const sections = getToolContent(slug, slug, '');
        const allText = sections.map(s => `${s.title} ${s.content}`).join(' ');

        for (const term of forbiddenRegionalTerms) {
          expect(allText).not.toContain(term);
        }

        // Verify Hindi-specific authenticity
        expect(allText).toContain('Mangal');
        expect(allText).toContain('Kruti Dev');
      });
    }
  });
});
