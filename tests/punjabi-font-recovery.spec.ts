import { test, expect } from '@playwright/test';
import { convertPunjabi } from '../src/lib/fonts/punjabi-mappings';
import { PunjabiFontConvertor } from '../src/lib/fonts/punjabi-engine';
import { getToolContent, extractToolFaqs } from '../src/lib/tool-content';
import { toolsDatabase } from '../src/lib/tools-db';
import { TIER_C_NOINDEX_SLUGS } from '../src/config/sitemap-lastmod';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Phase 2, Batch 1: Punjabi Font Converter Recovery & Forensic Gate', () => {

  const targetRoutes = [
    'asees-to-unicode',
    'unicode-to-asees',
    'anmollipi-to-unicode',
    'unicode-to-anmollipi',
    'joy-to-unicode',
    'unicode-to-joy',
    'satluj-to-unicode',
    'unicode-to-satluj',
    'unicode-to-raavi',
    'gurbani-akhar-to-unicode',
  ];

  test('1. P0 Font Alias Integrity & Engine Isolation', () => {
    // 1.1 asees -> Asees
    const aseesGreeting = convertPunjabi('ਸਤਿ', 'asees', 'fromUnicode');
    expect(convertPunjabi(aseesGreeting, 'asees', 'toUnicode')).toBe('ਸਤਿ');
    expect(convertPunjabi(aseesGreeting, 'Asees', 'toUnicode')).toBe('ਸਤਿ');

    // 1.2 anmollipi and anmol-lipi -> AnmolLipi (NOT GurbaniLipi)
    // Critical distinction between AnmolLipi and GurbaniLipi:
    // In AnmolLipi, Gurmukhi numerals (੧੨੩) encode to dedicated high-order character codes (0xf1, 0xf2, 0xf3).
    // In GurbaniLipi, Gurmukhi numerals encode directly to standard numeric keys '123' (0x31, 0x32, 0x33).
    const anmolEncodedGurmukhi1 = convertPunjabi('੧', 'anmollipi', 'fromUnicode');
    expect(anmolEncodedGurmukhi1.charCodeAt(0), 'AnmolLipi encodes Gurmukhi 1 to high-order 0xf1').toBe(0xf1);

    const anmolHyphenEncoded1 = convertPunjabi('੧', 'anmol-lipi', 'fromUnicode');
    expect(anmolHyphenEncoded1.charCodeAt(0), 'anmol-lipi alias encodes Gurmukhi 1 to high-order 0xf1').toBe(0xf1);

    const anmolUpperEncoded1 = convertPunjabi('੧', 'AnmolLipi', 'fromUnicode');
    expect(anmolUpperEncoded1.charCodeAt(0), 'AnmolLipi normalized encodes Gurmukhi 1 to high-order 0xf1').toBe(0xf1);

    // 1.3 gurbani-akhar and gurbanilipi -> GurbaniLipi
    const gurbaniEncodedGurmukhi1 = convertPunjabi('੧', 'gurbani-akhar', 'fromUnicode');
    expect(gurbaniEncodedGurmukhi1, 'GurbaniLipi encodes Gurmukhi 1 to ASCII 1').toBe('1');

    const gurbaniLipiEncoded1 = convertPunjabi('੧', 'gurbanilipi', 'fromUnicode');
    expect(gurbaniLipiEncoded1, 'gurbanilipi alias encodes Gurmukhi 1 to ASCII 1').toBe('1');

    const gurbaniNormalizedEncoded1 = convertPunjabi('੧', 'Gurbani-Akhar', 'fromUnicode');
    expect(gurbaniNormalizedEncoded1, 'Gurbani-Akhar normalized encodes Gurmukhi 1 to ASCII 1').toBe('1');

    // 1.4 Prove AnmolLipi and GurbaniLipi are isolated and never resolve to each other
    expect(anmolEncodedGurmukhi1).not.toBe(gurbaniEncodedGurmukhi1);
    expect(anmolHyphenEncoded1).not.toBe(gurbaniEncodedGurmukhi1);
  });

  test('2. P0 Punjabi Classification Isolation: Non-Punjabi routes retain their content families', () => {
    // 2.1 krutidev-to-unicode (Hindi Mangal)
    const krutiContent = getToolContent('krutidev-to-unicode', 'Kruti Dev to Unicode Converter', '');
    const krutiText = krutiContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(krutiText).toContain('Mangal');
    expect(krutiText).toContain('Kruti Dev');
    expect(krutiText).not.toContain('Gurmukhi');
    expect(krutiText).not.toContain('PSSSB');

    // 2.2 unicode-to-krutidev (Hindi Kruti Dev)
    const uKrutiContent = getToolContent('unicode-to-krutidev', 'Unicode to Kruti Dev Converter', '');
    const uKrutiText = uKrutiContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(uKrutiText).toContain('Kruti Dev');
    expect(uKrutiText).not.toContain('Gurmukhi');

    // 2.3 bijoy-to-unicode (Bengali)
    const bijoyContent = getToolContent('bijoy-to-unicode', 'Bijoy to Unicode Converter', '');
    const bijoyText = bijoyContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(bijoyText).toContain('Bijoy');
    expect(bijoyText).toContain('Bengali');
    expect(bijoyText).not.toContain('Gurmukhi');
    expect(bijoyText).not.toContain('Punjabi');

    // 2.4 preeti-to-unicode (Nepali)
    const preetiContent = getToolContent('preeti-to-unicode', 'Preeti to Unicode Converter', '');
    const preetiText = preetiContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(preetiText).toContain('Preeti');
    expect(preetiText).toContain('Nepali');
    expect(preetiText).not.toContain('Gurmukhi');

    // 2.5 zawgyi-to-unicode (Burmese)
    const zawgyiContent = getToolContent('zawgyi-to-unicode', 'Zawgyi to Unicode Converter', '');
    const zawgyiText = zawgyiContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(zawgyiText).toContain('Zawgyi');
    expect(zawgyiText).toContain('Burmese');
    expect(zawgyiText).not.toContain('Gurmukhi');
  });

  test('3. P1 Independent Mapping Golden Tests (Known-Input / Known-Output Fixtures)', () => {
    // 3.1 Sihari pre-base repositioning (typed before consonant in legacy ASCII -> stored after in Unicode)
    // In AnmolLipi: 'i' (Sihari) + 'k' (ਕ) -> 'ਕਿ'
    expect(convertPunjabi('ik', 'anmollipi', 'toUnicode')).toBe('ਕਿ');
    expect(convertPunjabi('is', 'anmollipi', 'toUnicode')).toBe('ਸਿ');

    // In Gurbani Akhar: 'i' + 'k' -> 'ਕਿ'
    expect(convertPunjabi('ik', 'gurbani-akhar', 'toUnicode')).toBe('ਕਿ');

    // In Asees: 'f' is Sihari. In typewriter layout, 's' is 'ਤ'. So 'fs' -> 'ਤਿ'
    expect(convertPunjabi('fs', 'asees', 'toUnicode')).toBe('ਤਿ');

    // 3.2 Bihari (ੀ)
    // In AnmolLipi: 'k' + 'I' -> 'ਕੀ'
    expect(convertPunjabi('kI', 'anmollipi', 'toUnicode')).toBe('ਕੀ');
    expect(convertPunjabi('sI', 'anmollipi', 'toUnicode')).toBe('ਸੀ');

    // 3.3 Subjoined consonants (Pairin characters)
    // Pairi Rara (੍ਰ): AnmolLipi 'p' + 'R' -> 'ਪ੍ਰ'
    expect(convertPunjabi('pR', 'anmollipi', 'toUnicode')).toBe('ਪ੍ਰ');
    expect(convertPunjabi('pR', 'gurbani-akhar', 'toUnicode')).toBe('ਪ੍ਰ');

    // Pairi Haha (੍ਹ): AnmolLipi 'p' + 'H' -> 'ਪ੍ਹ'
    expect(convertPunjabi('pH', 'anmollipi', 'toUnicode')).toBe('ਪ੍ਹ');
    expect(convertPunjabi('pH', 'gurbani-akhar', 'toUnicode')).toBe('ਪ੍ਹ');

    // Pairi Vava (੍ਵ): In AnmolLipi, 's' + 0xcd (Í) -> 'ਸ੍ਵ'
    expect(convertPunjabi('s\xcd', 'anmollipi', 'toUnicode')).toBe('ਸ੍ਵ');
    expect(convertPunjabi('s\xcd', 'gurbani-akhar', 'toUnicode')).toBe('ਸ੍ਵ');

    // 3.4 Bindi (ਂ), Tippi (ੰ), Addak (ੱ)
    // AnmolLipi: 'kM' -> 'ਕੰ' (Tippi)
    expect(convertPunjabi('kM', 'anmollipi', 'toUnicode')).toBe('ਕੰ');
    // AnmolLipi: 'kN' -> 'ਕਂ' (Bindi)
    expect(convertPunjabi('kN', 'anmollipi', 'toUnicode')).toBe('ਕਂ');
    // AnmolLipi: '~k' -> 'ੱਕ' (Addak)
    expect(convertPunjabi('~k', 'anmollipi', 'toUnicode')).toBe('ੱਕ');

    // 3.5 Extended Gurmukhi (Pairi Bindi letters)
    // AnmolLipi & Gurbani Akhar mappings:
    // S -> ਸ਼, ^ -> ਖ਼, Z -> ਗ਼, z -> ਜ਼, & -> ਫ਼, L -> ਲ਼
    expect(convertPunjabi('S', 'anmollipi', 'toUnicode')).toBe('ਸ਼');
    expect(convertPunjabi('^', 'anmollipi', 'toUnicode')).toBe('ਖ਼');
    expect(convertPunjabi('Z', 'anmollipi', 'toUnicode')).toBe('ਗ਼');
    expect(convertPunjabi('z', 'anmollipi', 'toUnicode')).toBe('ਜ਼');
    expect(convertPunjabi('&', 'anmollipi', 'toUnicode')).toBe('ਫ਼');
    expect(convertPunjabi('L', 'anmollipi', 'toUnicode')).toBe('ਲ਼');

    expect(convertPunjabi('S', 'gurbani-akhar', 'toUnicode')).toBe('ਸ਼');
    expect(convertPunjabi('^', 'gurbani-akhar', 'toUnicode')).toBe('ਖ਼');
    expect(convertPunjabi('Z', 'gurbani-akhar', 'toUnicode')).toBe('ਗ਼');
    expect(convertPunjabi('z', 'gurbani-akhar', 'toUnicode')).toBe('ਜ਼');
    expect(convertPunjabi('&', 'gurbani-akhar', 'toUnicode')).toBe('ਫ਼');
    expect(convertPunjabi('L', 'gurbani-akhar', 'toUnicode')).toBe('ਲ਼');

    // 3.6 Religious character: Ek Onkar (ੴ)
    // In AnmolLipi and Gurbani Akhar, '<>' encodes to Ek Onkar (ੴ)
    expect(convertPunjabi('<>', 'anmollipi', 'toUnicode')).toBe('ੴ');
    expect(convertPunjabi('<>', 'gurbani-akhar', 'toUnicode')).toBe('ੴ');

    // In Satluj, high-order character 'ý' (0xfd) encodes to Ek Onkar (ੴ)
    expect(convertPunjabi('\xfd', 'satluj', 'toUnicode')).toBe('ੴ');
  });

  test('4. P1 FAQ Relevance & Context Isolation Audit', () => {
    // 4.1 PSSSB exam relevance:
    // Must appear on asees-to-unicode (the primary exam layout)
    const aseesFaqs = extractToolFaqs(getToolContent('asees-to-unicode', 'Asees to Unicode', ''));
    const aseesMentionsPsssb = aseesFaqs.some(f => f.question.includes('PSSSB') || f.answer.includes('PSSSB'));
    expect(aseesMentionsPsssb, 'asees-to-unicode must address PSSSB typing test relevance').toBe(true);

    // Must NOT appear on gurbani-akhar-to-unicode, joy-to-unicode, or satluj-to-unicode
    const gurbaniFaqs = extractToolFaqs(getToolContent('gurbani-akhar-to-unicode', 'Gurbani Akhar to Unicode', ''));
    expect(gurbaniFaqs.some(f => f.question.includes('PSSSB') || f.answer.includes('PSSSB'))).toBe(false);

    const joyFaqs = extractToolFaqs(getToolContent('joy-to-unicode', 'Joy to Unicode', ''));
    expect(joyFaqs.some(f => f.question.includes('PSSSB') || f.answer.includes('PSSSB'))).toBe(false);

    const satlujFaqs = extractToolFaqs(getToolContent('satluj-to-unicode', 'Satluj to Unicode', ''));
    expect(satlujFaqs.some(f => f.question.includes('PSSSB') || f.answer.includes('PSSSB'))).toBe(false);

    // 4.2 Gurbani Akhar FAQs must specifically cover religious text / Ek Onkar
    expect(gurbaniFaqs.some(f => f.question.includes('Ek Onkar') || f.answer.includes('Gurbani'))).toBe(true);

    // 4.3 AnmolLipi FAQs must cover legacy ASCII and Dr. Thind layout
    const anmolFaqs = extractToolFaqs(getToolContent('anmollipi-to-unicode', 'AnmolLipi to Unicode', ''));
    expect(anmolFaqs.some(f => f.question.includes('AnmolLipi') && f.answer.includes('ASCII'))).toBe(true);

    // 4.4 All routes have exact parity between visible FAQ content and extracted FAQ items
    for (const slug of targetRoutes) {
      const tool = toolsDatabase.fonts[slug];
      const sections = getToolContent(slug, tool.title, tool.description);
      const faqs = extractToolFaqs(sections);
      expect(faqs.length, `Route '/${slug}' must have extracted FAQs`).toBeGreaterThan(0);

      // Verify privacy phrasing honesty in each FAQ section
      const faqText = faqs.map(f => `${f.question} ${f.answer}`).join(' ');
      expect(faqText).not.toContain('100% private: files never leave');
    }
  });

  test('5. P1 Cross-Family Regression Verification (Phase 1 Tools Unaffected)', () => {
    // 5.1 Unicode to InPage (Phase 1)
    const inpageContent = getToolContent('unicode-to-inpage', 'Unicode to InPage Urdu Converter', '');
    const inpageText = inpageContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(inpageText).toContain('InPage');
    expect(inpageText).toContain('Urdu');
    expect(inpageText).not.toContain('PDF');
    expect(inpageText).not.toContain('Gurmukhi');
    expect(inpageText).not.toContain('Asees');

    // 5.2 PNG to PDF (Phase 1)
    const pngContent = getToolContent('png-to-pdf', 'PNG to PDF Converter', '');
    const pngText = pngContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(pngText).toContain('PDF');
    expect(pngText).toContain('transparent');
    expect(pngText).not.toContain('Gurmukhi');
    expect(pngText).not.toContain('Kruti Dev');

    // 5.3 JWT Decoder (Phase 1)
    const jwtContent = getToolContent('jwt-decoder', 'JWT Decoder', '');
    const jwtText = jwtContent.map(s => `${s.title} ${s.content}`).join(' ');
    expect(jwtText).toContain('JWT');
    expect(jwtText).toContain('token');
    expect(jwtText).not.toContain('Gurmukhi');
  });

  test('6. Bidirectional Roundtrip Fidelity across Gurmukhi Test Corpus', () => {
    const corpus = [
      { name: 'Standard Greeting', text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' },
      { name: 'Pairi Rara (Subjoined R)', text: 'ਪ੍ਰੇਮ ਅਤੇ ਪਿਆਰ' },
      { name: 'Pairi Haha & Vava', text: 'ਪੜ੍ਹਾਈ ਅਤੇ ਸ੍ਵੈਮਾਣ' },
      { name: 'Tippi & Bindi', text: 'ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਸਿੰਘ ਅਤੇ ਕਾਂ' },
      { name: 'Addak (Gemination)', text: 'ਮਿੱਤਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ' },
    ];

    const fonts = ['satluj', 'joy', 'asees', 'anmollipi', 'gurbani-akhar'];

    for (const font of fonts) {
      for (const item of corpus) {
        const encoded = convertPunjabi(item.text, font, 'fromUnicode');
        expect(encoded.length, `${font} encoded text for '${item.name}' should not be empty`).toBeGreaterThan(0);

        const decoded = convertPunjabi(encoded, font, 'toUnicode');
        expect(decoded, `${font} round-trip decoded text for '${item.name}' must match input`).toBe(item.text);
      }
    }
  });

  test('7. Complete absence of Hindi / Indic contamination across all 7 Punjabi routes', () => {
    const forbiddenPatterns = [
      { name: 'Kruti Dev corruption (fgunh)', regex: /fgunh/i },
      { name: 'MP CPCT Exam', regex: /\bCPCT\b/i },
      { name: 'Mangal Font', regex: /\bMangal\b/i },
      { name: 'Kruti Dev', regex: /Kruti\s*Dev/i },
      { name: 'Bengali script', regex: /\bBengali\b/i },
      { name: 'Burmese script', regex: /\bBurmese\b/i },
      { name: 'Devanagari script', regex: /\bDevanagari\b/i },
    ];

    for (const slug of targetRoutes) {
      const tool = toolsDatabase.fonts[slug];
      const sections = getToolContent(slug, tool.title, tool.description);
      const allContent = sections.map(s => `${s.title} ${s.content}`).join(' ');

      for (const pattern of forbiddenPatterns) {
        const matches = allContent.match(pattern.regex);
        expect(
          matches,
          `Route '/${slug}' content must NOT contain ${pattern.name}. Found: ${matches ? matches[0] : ''}`
        ).toBeNull();
      }
    }
  });

  test('8. Indexability and Sitemap Tier configuration', () => {
    expect(TIER_C_NOINDEX_SLUGS.has('anmollipi-to-unicode')).toBe(false);
    expect(TIER_C_NOINDEX_SLUGS.has('gurbani-akhar-to-unicode')).toBe(false);
    expect(TIER_C_NOINDEX_SLUGS.has('unicode-to-raavi')).toBe(true);

    expect(TIER_C_NOINDEX_SLUGS.has('asees-to-unicode')).toBe(false);
    expect(TIER_C_NOINDEX_SLUGS.has('joy-to-unicode')).toBe(false);
    expect(TIER_C_NOINDEX_SLUGS.has('satluj-to-unicode')).toBe(false);
    expect(TIER_C_NOINDEX_SLUGS.has('unicode-to-asees')).toBe(false);
    expect(TIER_C_NOINDEX_SLUGS.has('unicode-to-satluj')).toBe(false);
  });

  test('9. Zero references to broken /raavi-to-unicode in src directory', () => {
    const srcDir = path.join(process.cwd(), 'src');
    
    function scanDir(dir: string): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results = results.concat(scanDir(fullPath));
        } else if (/\.(ts|tsx|js|jsx|json)$/.test(file)) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const allFiles = scanDir(srcDir);
    const violatingFiles: string[] = [];

    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('/raavi-to-unicode') || content.includes('raavi-to-unicode')) {
        violatingFiles.push(file);
      }
    }

    expect(violatingFiles, 'No file in src/ should reference raavi-to-unicode').toEqual([]);
  });

  test('10. Related tools recommendations for Punjabi tools only contain Punjabi converters', () => {
    const punjabiToolsWithClusters = [
      'anmollipi-to-unicode',
      'unicode-to-anmollipi',
      'joy-to-unicode',
      'unicode-to-joy',
      'asees-to-unicode',
      'unicode-to-asees',
      'satluj-to-unicode',
      'unicode-to-satluj',
      'gurbani-akhar-to-unicode',
    ];

    const relatedToolsFile = path.join(process.cwd(), 'src/components/tools/related-tools.tsx');
    const content = fs.readFileSync(relatedToolsFile, 'utf8');

    for (const slug of punjabiToolsWithClusters) {
      const regex = new RegExp(`"${slug}":\\s*\\[([^\\]]+)\\]`);
      const match = content.match(regex);
      if (match) {
        const clusterMembers = match[1];
        expect(clusterMembers).not.toContain('krutidev');
        expect(clusterMembers).not.toContain('preeti');
        expect(clusterMembers).not.toContain('bijoy');
      }
    }
  });

  test('11. Prerendered production HTML verification across all 7 routes', () => {
    for (const slug of targetRoutes) {
      const htmlPath = path.join(process.cwd(), '.next/server/app', `${slug}.html`);
      expect(fs.existsSync(htmlPath), `Prerendered HTML for '/${slug}' must exist`).toBe(true);

      const html = fs.readFileSync(htmlPath, 'utf8');

      if (slug === 'gurbani-akhar-to-unicode') {
        expect(html).not.toContain('This tool is not available yet.');
      }

      if (slug === 'unicode-to-raavi') {
        expect(html).toContain('This tool is not available yet.');
        expect(html).toContain('content="noindex');
      } else {
        expect(html).not.toContain('content="noindex');
      }

      expect(html).toContain(`<link rel="canonical" href="https://www.converterforall.com/${slug}"/>`);
      expect(html).not.toContain('fgunh');
      expect(html).not.toContain('CPCT');
      expect(html).not.toContain('Mangal');
    }
  });
});
