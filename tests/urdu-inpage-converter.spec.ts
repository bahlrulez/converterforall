import { test, expect } from '@playwright/test';
import { unicodeToInpage, inpageToUnicode, convertUrdu, splitIntoSegments, trimTrailingPunctuation } from '../src/lib/fonts/urdu-mappings';

test.describe('Phase 4A: Urdu Unicode <-> InPage Classic Phonetic Engine', () => {

  test.describe('Suite 1: Single-Key Source-to-Key and Key-to-Character Mappings', () => {
    const singleKeyFixtures: [string, string, string, string][] = [
      // Name, Key, Unicode, Description
      ['Alif', 'a', '\u0627', 'ا'],
      ['Alif Madda', 'A', '\u0622', 'آ'],
      ['Bay', 'b', '\u0628', 'ب'],
      ['Combining Maddah Mark', 'B', '\u0653', 'ٓ'],
      ['Pay', 'p', '\u067E', 'پ'],
      ['Pesh (Damma)', 'P', '\u064F', 'ُ'],
      ['Te', 't', '\u062A', 'ت'],
      ['Tte', 'T', '\u0679', 'ٹ'],
      ['Che', 'c', '\u0686', 'چ'],
      ['Theh', 'C', '\u062B', 'ث'],
      ['Jeem', 'j', '\u062C', 'ج'],
      ['Zuad', 'J', '\u0636', 'ض'],
      ['Hah (Badi He)', 'h', '\u062D', 'ح'],
      ['Do-chashmi He', 'H', '\u06BE', 'ھ'],
      ['Gol Heh', 'o', '\u06C1', 'ہ'],
      ['Teh Marbuta Goal', 'O', '\u06C3', 'ۃ'],
      ['Kaaf', 'k', '\u06A9', 'ک'],
      ['Khah', 'K', '\u062E', 'خ'],
      ['Gaaf', 'g', '\u06AF', 'گ'],
      ['Ghain', 'G', '\u063A', 'غ'],
      ['Daal', 'd', '\u062F', 'د'],
      ['Ddaal', 'D', '\u0688', 'ڈ'],
      ['Zay', 'z', '\u0632', 'ز'],
      ['Zaal', 'Z', '\u0630', 'ذ'],
      ['Ray', 'r', '\u0631', 'ر'],
      ['Rray', 'R', '\u0691', 'ڑ'],
      ['Seen', 's', '\u0633', 'س'],
      ['Suad', 'S', '\u0635', 'ص'],
      ['Sheen', 'x', '\u0634', 'ش'],
      ['Zhay', 'X', '\u0698', 'ژ'],
      ['Toyen', 'v', '\u0637', 'ط'],
      ['Zoyen', 'V', '\u0638', 'ظ'],
      ['Ain', 'e', '\u0639', 'ع'],
      ['Khari Zabar', 'E', '\u0670', 'ٰ'],
      ['Fay', 'f', '\u0641', 'ف'],
      ['Do Zabar', 'F', '\u064B', 'ً'],
      ['Qaaf', 'q', '\u0642', 'ق'],
      ['Sukun / Jazm', 'Q', '\u0652', 'ْ'],
      ['Laam', 'l', '\u0644', 'ل'],
      ['Khara Zer', 'L', '\u0656', 'ٖ'],
      ['Meem', 'm', '\u0645', 'م'],
      ['Do Pesh', 'M', '\u064C', 'ٌ'],
      ['Noon', 'n', '\u0646', 'ن'],
      ['Noon Ghunna', 'N', '\u06BA', 'ں'],
      ['Waw', 'w', '\u0648', 'و'],
      ['Tashdeed', 'W', '\u0651', 'ّ'],
      ['Choti Yeh', 'i', '\u06CC', 'ی'],
      ['Zer (Kasra)', 'I', '\u0650', 'ِ'],
      ['Badi Yeh', 'y', '\u06D2', 'ے'],
      ['Zabar (Fatha)', 'Y', '\u064E', 'َ'],
      ['Hamza isolated', 'u', '\u0621', 'ء'],
      ['Yeh with Hamza', 'U', '\u0626', 'ئ'],
      ['Urdu Khatma', '.', '\u06D4', '۔'],
      ['Literal Hyphen', '-', '-', '-'],
      ['Question Mark', '?', '\u061F', '؟'],
      ['Comma', ',', '\u060C', '،'],
      ['Semicolon', ';', '\u061B', '؛'],
    ];

    for (const [name, key, unicodeChar] of singleKeyFixtures) {
      test(`Single-key mapping: ${name} ('${key}' <-> '${unicodeChar}')`, () => {
        expect(unicodeToInpage(unicodeChar)).toBe(key);
        expect(inpageToUnicode(key)).toBe(unicodeChar);
      });
    }

    test('Digits 0-9 bidirectional conversion', () => {
      const urduDigits = '۰۱۲۳۴۵۶۷۸۹';
      const latinDigits = '0123456789';
      expect(unicodeToInpage(urduDigits)).toBe(latinDigits);
      expect(inpageToUnicode(latinDigits)).toBe(urduDigits);
    });
  });

  test.describe('Suite 2: Audited Representative Urdu Word & Sentence Fixtures', () => {
    test('Basic word: اردو <-> ardw', () => {
      expect(unicodeToInpage('اردو')).toBe('ardw');
      expect(inpageToUnicode('ardw')).toBe('اردو');
    });

    test('Country name: پاکستان <-> pakstan', () => {
      expect(unicodeToInpage('پاکستان')).toBe('pakstan');
      expect(inpageToUnicode('pakstan')).toBe('پاکستان');
    });

    test('Capital city: اسلام آباد <-> aslam Abad', () => {
      expect(unicodeToInpage('اسلام آباد')).toBe('aslam Abad');
      expect(inpageToUnicode('aslam Abad')).toBe('اسلام آباد');
    });

    test('Che word: چاند <-> cand', () => {
      expect(unicodeToInpage('چاند')).toBe('cand');
      expect(inpageToUnicode('cand')).toBe('چاند');
    });

    test('Theh word: ثواب <-> Cwab', () => {
      expect(unicodeToInpage('ثواب')).toBe('Cwab');
      expect(inpageToUnicode('Cwab')).toBe('ثواب');
    });

    test('Hamza words: چائے, کوئی, ہوئے, لئے, مسئلہ', () => {
      expect(unicodeToInpage('چائے')).toBe('caUy');
      expect(inpageToUnicode('caUy')).toBe('چائے');

      expect(unicodeToInpage('کوئی')).toBe('kwUi');
      expect(inpageToUnicode('kwUi')).toBe('کوئی');

      expect(unicodeToInpage('ہوئے')).toBe('owUy');
      expect(inpageToUnicode('owUy')).toBe('ہوئے');

      expect(unicodeToInpage('لئے')).toBe('lUy');
      expect(inpageToUnicode('lUy')).toBe('لئے');

      expect(unicodeToInpage('مسئلہ')).toBe('msUlo');
      expect(inpageToUnicode('msUlo')).toBe('مسئلہ');
    });

    test('Waw Hamza composite: مؤرخ <-> muwrK', () => {
      expect(unicodeToInpage('مؤرخ')).toBe('muwrK');
      expect(inpageToUnicode('muwrK')).toBe('مؤرخ');
    });

    test('Gol Heh + Hamza composite: جذبۂ دل <-> jZbou dl', () => {
      expect(unicodeToInpage('جذبۂ دل')).toBe('jZbou dl');
      expect(inpageToUnicode('jZbou dl')).toBe('جذبۂ دل');
    });

    test('Sentence with Khatma: اردو ہماری قومی زبان ہے۔', () => {
      const urdu = 'اردو ہماری قومی زبان ہے۔';
      const phonetic = 'ardw omari qwmi zban oy.';
      expect(unicodeToInpage(urdu)).toBe(phonetic);
      expect(inpageToUnicode(phonetic)).toBe(urdu);
    });

    test('Diacritics sentence: اَلسَّلامُ عَلیْکُم <-> phonetic key stream with Tashdeed & Zabar', () => {
      const urdu = 'اَلسَّلامُ عَلیْکُم';
      // In Unicode NFC, Fatha (class 30, 'Y') canonically precedes Shadda (class 33, 'W')
      const canonicalPhonetic = unicodeToInpage(urdu);
      expect(canonicalPhonetic).toBe('aYlsYWlamP eYliQkPm');

      // Both key sequences (sYW and sWY) reverse to the canonical Unicode text under NFC:
      expect(inpageToUnicode('aYlsYWlamP eYliQkPm')).toBe(urdu.normalize('NFC'));
      expect(inpageToUnicode('aYlsWYlamP eYliQkPm')).toBe(urdu.normalize('NFC'));

      // Also verify full explicit Zabar on Laam (اَلسَّلَامُ عَلَیْکُم):
      const fullUrdu = 'اَلسَّلَامُ عَلَیْکُم';
      const fullCanonicalPhonetic = unicodeToInpage(fullUrdu);
      expect(fullCanonicalPhonetic).toBe('aYlsYWlYamP eYlYiQkPm');
      expect(inpageToUnicode('aYlsYWlYamP eYlYiQkPm')).toBe(fullUrdu.normalize('NFC'));
      expect(inpageToUnicode('aYlsWYlYamP eYlYiQkPm')).toBe(fullUrdu.normalize('NFC'));
    });

    test('Khatma + Digits: صفحہ نمبر ۱۲۔ <-> Sfho nmbr 12.', () => {
      expect(unicodeToInpage('صفحہ نمبر ۱۲۔')).toBe('Sfho nmbr 12.');
      expect(inpageToUnicode('Sfho nmbr 12.')).toBe('صفحہ نمبر ۱۲۔');
    });

    test('Tafseelat: تفصیلات <-> tfSilat', () => {
      expect(unicodeToInpage('تفصیلات')).toBe('tfSilat');
      expect(inpageToUnicode('tfSilat')).toBe('تفصیلات');
    });

    test('Raabta: رابطہ <-> rabvo', () => {
      expect(unicodeToInpage('رابطہ')).toBe('rabvo');
      expect(inpageToUnicode('rabvo')).toBe('رابطہ');
    });

    test('Misri with Alef Maksura normalization: مصرى -> mSri -> مصری', () => {
      expect(unicodeToInpage('مصرى')).toBe('mSri');
      expect(inpageToUnicode('mSri')).toBe('مصری');
    });

    test('Quran: precomposed and decomposed forms both map to qrAn and reverse to قرآن', () => {
      // 1. Precomposed Alif Madda (U+0642 U+0631 U+0622 U+0646)
      const precomposedQuran = '\u0642\u0631\u0622\u0646';
      expect(unicodeToInpage(precomposedQuran)).toBe('qrAn');

      // 2. Decomposed Alif + Combining Maddah (U+0642 U+0631 U+0627 U+0653 U+0646)
      const decomposedQuran = '\u0642\u0631\u0627\u0653\u0646';
      expect(unicodeToInpage(decomposedQuran)).toBe('qrAn');

      // 3. Reverse mapping
      expect(inpageToUnicode('qrAn')).toBe(precomposedQuran);
      expect(inpageToUnicode('qrAn')).toBe('قرآن');
    });

    test('Standalone Combining Maddah Mark (Shift+B): ٓ <-> B', () => {
      const maddah = '\u0653';
      expect(unicodeToInpage(maddah)).toBe('B');
      expect(inpageToUnicode('B')).toBe(maddah);
    });

    test('Khara Zer diacritic (Shift+L): بٖہ <-> bLo', () => {
      const input = 'بٖہ'; // ب + ٖ (U+0656) + ہ
      expect(unicodeToInpage(input)).toBe('bLo');
      expect(inpageToUnicode('bLo')).toBe(input);
    });

    test('Mixed-text phrase: پر ہیں. <-> pr oiN.', () => {
      // پ(p) + ر(r) + ' ' + ہ(o) + ی(i) + ں(N) + ۔(.) = pr oiN.
      const urdu = 'پر ہیں.';
      const phonetic = 'pr oiN.';
      expect(unicodeToInpage(urdu)).toBe(phonetic);
      expect(inpageToUnicode(phonetic)).toBe('پر ہیں۔');
    });

    test('Year with Hamza: ۱۹۴۷ء <-> 1947u', () => {
      expect(unicodeToInpage('۱۹۴۷ء')).toBe('1947u');
      expect(inpageToUnicode('1947u')).toBe('۱۹۴۷ء');
    });
  });

  test.describe('Suite 3: Canonicalization, Token Segment Isolation & Safety', () => {
    test('Composite ambiguity: uw, ou, Uy vs individual keystrokes', () => {
      // 1. Waw with Hamza (ؤ) vs separate sequence (ءو):
      // Exact round trip for precomposed ؤ:
      expect(unicodeToInpage('ؤ')).toBe('uw');
      expect(inpageToUnicode('uw')).toBe('ؤ');
      expect(inpageToUnicode(unicodeToInpage('ؤ'))).toBe('ؤ');

      // Separate sequence ء + و also produces 'uw':
      expect(unicodeToInpage('ءو')).toBe('uw');
      // Documented canonicalization: 'uw' reverses to precomposed ؤ (not the separate sequence ءو)
      expect(inpageToUnicode('uw')).toBe('ؤ');
      expect(inpageToUnicode(unicodeToInpage('ءو'))).toBe('ؤ');

      // 2. Heh Goal with Hamza / Izafat (ۂ) vs separate sequence (ہء):
      // Exact round trip for precomposed ۂ:
      expect(unicodeToInpage('ۂ')).toBe('ou');
      expect(inpageToUnicode('ou')).toBe('ۂ');
      expect(inpageToUnicode(unicodeToInpage('ۂ'))).toBe('ۂ');

      // Separate sequence ہ + ء also produces 'ou':
      expect(unicodeToInpage('ہء')).toBe('ou');
      // Documented canonicalization: 'ou' reverses to precomposed ۂ (not the separate sequence ہء)
      expect(inpageToUnicode('ou')).toBe('ۂ');
      expect(inpageToUnicode(unicodeToInpage('ہء'))).toBe('ۂ');

      // 3. Badi Yeh with Hamza (ۓ) vs standard digraph (ئے):
      // Precomposed U+06D3 (ۓ) maps to 'Uy'
      expect(unicodeToInpage('ۓ')).toBe('Uy');
      expect(unicodeToInpage('گۓ')).toBe('gUy');
      // Standard digraph U+0626 U+06D2 (ئے) also maps to 'Uy'
      expect(unicodeToInpage('ئے')).toBe('Uy');
      expect(unicodeToInpage('گئے')).toBe('gUy');
      // Documented canonicalization: 'Uy' always reverses to standard digraph ئے
      expect(inpageToUnicode('Uy')).toBe('ئے');
      expect(inpageToUnicode('gUy')).toBe('گئے');
      // Exact round-trip holds for ئے:
      expect(inpageToUnicode(unicodeToInpage('ئے'))).toBe('ئے');
      // Canonicalizing round-trip for ۓ:
      expect(inpageToUnicode(unicodeToInpage('ۓ'))).toBe('ئے');

      // 4. Individual keystroke disambiguation:
      expect(inpageToUnicode('u')).toBe('ء');
      expect(inpageToUnicode('w')).toBe('و');
      expect(inpageToUnicode('o')).toBe('ہ');
      expect(inpageToUnicode('U')).toBe('ئ');
      expect(inpageToUnicode('y')).toBe('ے');

      // Keystrokes separated by space remain isolated characters, not composites:
      expect(inpageToUnicode('u w')).toBe('ء و');
      expect(inpageToUnicode('o u')).toBe('ہ ء');
      expect(inpageToUnicode('U y')).toBe('ئ ے');
    });

    test('Arabic Kaf normalization: كتاب -> ktab -> کتاب', () => {
      expect(unicodeToInpage('كتاب')).toBe('ktab');
      expect(inpageToUnicode('ktab')).toBe('کتاب');
    });

    test('URL segment isolation and exact restoration', () => {
      const input = 'تفصیلات https://converterforall.com پر ہیں.';
      const converted = unicodeToInpage(input);
      expect(converted).toBe('tfSilat https://converterforall.com pr oiN.');

      const restored = inpageToUnicode(converted);
      expect(restored).toBe('تفصیلات https://converterforall.com پر ہیں۔');
    });

    test('Email segment isolation and exact restoration', () => {
      const input = 'رابطہ info@example.com پر.';
      const converted = unicodeToInpage(input);
      expect(converted).toBe('rabvo info@example.com pr.');

      const restored = inpageToUnicode(converted);
      expect(restored).toBe('رابطہ info@example.com پر۔');
    });

    test('URLs containing query strings, fragments, semicolons, colons, and exclamation marks', () => {
      // 1. Query strings with multiple parameters: ?q=urdu&lang=en
      const queryUrl = 'https://converterforall.com/search?q=urdu&lang=en';
      expect(inpageToUnicode(queryUrl)).toBe(queryUrl);
      expect(unicodeToInpage(queryUrl)).toBe(queryUrl);

      // 2. Fragments containing colons: #sec:1
      const fragUrl = 'https://converterforall.com/docs#sec:1';
      expect(inpageToUnicode(fragUrl)).toBe(fragUrl);
      expect(unicodeToInpage(fragUrl)).toBe(fragUrl);

      // 3. Matrix parameters with semicolons: /item;id=123/view
      const matrixUrl = 'https://converterforall.com/item;id=123/view';
      expect(inpageToUnicode(matrixUrl)).toBe(matrixUrl);
      expect(unicodeToInpage(matrixUrl)).toBe(matrixUrl);

      // 4. Query parameter separator with semicolon: ?q=a;b=2
      const semiQueryUrl = 'https://converterforall.com/search?q=a;b=2';
      expect(inpageToUnicode(semiQueryUrl)).toBe(semiQueryUrl);
      expect(unicodeToInpage(semiQueryUrl)).toBe(semiQueryUrl);

      // 5. Port numbers with colon: :8080/path
      const portUrl = 'https://converterforall.com:8080/path';
      expect(inpageToUnicode(portUrl)).toBe(portUrl);
      expect(unicodeToInpage(portUrl)).toBe(portUrl);

      // 6. Hashbang routes with exclamation marks: /#!/home
      const hashbangUrl = 'https://converterforall.com/app/#!/home';
      expect(inpageToUnicode(hashbangUrl)).toBe(hashbangUrl);
      expect(unicodeToInpage(hashbangUrl)).toBe(hashbangUrl);
    });

    test('URLs ending in query strings, fragments, colons, semicolons, and exclamation marks', () => {
      // 1. URL ending in query string parameter: /search?q=urdu
      const endQuery = 'https://converterforall.com/search?q=urdu';
      expect(inpageToUnicode(endQuery)).toBe(endQuery);
      expect(unicodeToInpage(endQuery)).toBe(endQuery);

      // 2. URL ending in fragment: /docs#faq
      const endFrag = 'https://converterforall.com/docs#faq';
      expect(inpageToUnicode(endFrag)).toBe(endFrag);
      expect(unicodeToInpage(endFrag)).toBe(endFrag);

      // 3. URL ending in terminal hashbang: /app/#! (preserved by explicit hashbang heuristic)
      const endHashbang = 'https://converterforall.com/app/#!';
      expect(inpageToUnicode(endHashbang)).toBe(endHashbang);
      expect(unicodeToInpage(endHashbang)).toBe(endHashbang);

      // 4. URL ending in colon in prose: https://converterforall.com:
      expect(inpageToUnicode('https://converterforall.com:')).toBe('https://converterforall.com:');
      expect(unicodeToInpage('https://converterforall.com:')).toBe('https://converterforall.com:');

      // 5. URL ending in semicolon in prose: https://converterforall.com;
      expect(inpageToUnicode('https://converterforall.com;')).toBe('https://converterforall.com؛');
      expect(unicodeToInpage('https://converterforall.com؛')).toBe('https://converterforall.com;');

      // 6. URL ending in exclamation mark in prose: https://converterforall.com!
      expect(inpageToUnicode('https://converterforall.com!')).toBe('https://converterforall.com!');
      expect(unicodeToInpage('https://converterforall.com!')).toBe('https://converterforall.com!');
    });

    test('Ambiguity trade-off: URLs whose path ends in :, ;, !, or ?', () => {
      // Documented behavior: In plain text, terminal punctuation cannot be distinguished from URL syntax.
      // The heuristic intentionally detaches terminal punctuation to prioritize surrounding prose conversion.

      // 1. URL whose path ends in colon: https://converterforall.com/path:
      // Since ':' passes through unchanged by character mapping, test actual tokenizer segmentation directly:
      expect(splitIntoSegments('https://converterforall.com/path:')).toEqual([
        { type: 'protected', value: 'https://converterforall.com/path' },
        { type: 'translatable', value: ':' },
      ]);
      expect(trimTrailingPunctuation('https://converterforall.com/path:')).toEqual({
        clean: 'https://converterforall.com/path',
        trailing: ':',
      });
      expect(inpageToUnicode('https://converterforall.com/path:')).toBe('https://converterforall.com/path:');
      expect(unicodeToInpage('https://converterforall.com/path:')).toBe('https://converterforall.com/path:');

      // 2. URL whose path ends in semicolon: https://converterforall.com/path;
      // In inpageToUnicode: terminal ';' is treated as sentence semicolon and converts to Urdu semicolon '؛'
      expect(splitIntoSegments('https://converterforall.com/path;')).toEqual([
        { type: 'protected', value: 'https://converterforall.com/path' },
        { type: 'translatable', value: ';' },
      ]);
      expect(inpageToUnicode('https://converterforall.com/path;')).toBe('https://converterforall.com/path؛');
      expect(unicodeToInpage('https://converterforall.com/path؛')).toBe('https://converterforall.com/path;');

      // 3. URL whose path ends in exclamation: https://converterforall.com/path!
      // Since '!' passes through unchanged by character mapping, test actual tokenizer segmentation directly:
      expect(splitIntoSegments('https://converterforall.com/path!')).toEqual([
        { type: 'protected', value: 'https://converterforall.com/path' },
        { type: 'translatable', value: '!' },
      ]);
      expect(trimTrailingPunctuation('https://converterforall.com/path!')).toEqual({
        clean: 'https://converterforall.com/path',
        trailing: '!',
      });
      expect(inpageToUnicode('https://converterforall.com/path!')).toBe('https://converterforall.com/path!');
      expect(unicodeToInpage('https://converterforall.com/path!')).toBe('https://converterforall.com/path!');

      // Contrast with Hashbang exception ('#!'): exclamation mark preceded by '#' is NOT detached
      expect(splitIntoSegments('https://converterforall.com/app/#!')).toEqual([
        { type: 'protected', value: 'https://converterforall.com/app/#!' },
      ]);
      expect(trimTrailingPunctuation('https://converterforall.com/app/#!')).toEqual({
        clean: 'https://converterforall.com/app/#!',
        trailing: '',
      });

      // 4. URL ending in question mark: https://converterforall.com/path? and https://converterforall.com/?
      // In inpageToUnicode: terminal '?' is treated as sentence question mark and converts to Urdu question mark '؟'
      expect(splitIntoSegments('https://converterforall.com/path?')).toEqual([
        { type: 'protected', value: 'https://converterforall.com/path' },
        { type: 'translatable', value: '?' },
      ]);
      expect(inpageToUnicode('https://converterforall.com/path?')).toBe('https://converterforall.com/path؟');
      expect(unicodeToInpage('https://converterforall.com/path؟')).toBe('https://converterforall.com/path?');

      expect(splitIntoSegments('https://converterforall.com/?')).toEqual([
        { type: 'protected', value: 'https://converterforall.com/' },
        { type: 'translatable', value: '?' },
      ]);
      expect(inpageToUnicode('https://converterforall.com/?')).toBe('https://converterforall.com/؟');
      expect(unicodeToInpage('https://converterforall.com/؟')).toBe('https://converterforall.com/?');

      // 5. Verification that internal query strings, fragments, ports, and balanced parens remain intact
      const complexUrl = 'https://converterforall.com/path?q=test:1;sort=desc!&lang=ur#sec:2';
      expect(splitIntoSegments(complexUrl)).toEqual([
        { type: 'protected', value: complexUrl },
      ]);
      expect(inpageToUnicode(complexUrl)).toBe(complexUrl);
      expect(unicodeToInpage(complexUrl)).toBe(complexUrl);

      // 6. Verification that protected email content remains intact and detaches terminal ':' and '!'
      const email = 'info.user+tag@sub.example.com';
      expect(splitIntoSegments(email)).toEqual([
        { type: 'protected', value: email },
      ]);
      expect(inpageToUnicode(email)).toBe(email);
      expect(unicodeToInpage(email)).toBe(email);

      expect(splitIntoSegments('info.user+tag@sub.example.com:')).toEqual([
        { type: 'protected', value: 'info.user+tag@sub.example.com' },
        { type: 'translatable', value: ':' },
      ]);
      expect(splitIntoSegments('info.user+tag@sub.example.com!')).toEqual([
        { type: 'protected', value: 'info.user+tag@sub.example.com' },
        { type: 'translatable', value: '!' },
      ]);
    });

    test('Raw and decomposed Unicode URLs (IRIs) preservation and segmentation: https://example.com/صفحہ and https://example.com/\u0627\u0653', () => {
      // 1. Raw Urdu IRI preservation and segmentation
      // The tokenizer regex https?://[^\s]+ matches all non-whitespace characters, including Unicode Urdu script.
      // Raw Urdu IRIs are treated as protected URL tokens and preserved unchanged in both directions.

      const urduUrl = 'https://example.com/صفحہ';
      expect(splitIntoSegments(urduUrl)).toEqual([
        { type: 'protected', value: urduUrl },
      ]);
      expect(inpageToUnicode(urduUrl)).toBe(urduUrl);
      expect(unicodeToInpage(urduUrl)).toBe(urduUrl);

      // Raw Urdu IRI with trailing sentence Khatma
      expect(splitIntoSegments('https://example.com/صفحہ۔')).toEqual([
        { type: 'protected', value: urduUrl },
        { type: 'translatable', value: '۔' },
      ]);
      expect(unicodeToInpage('https://example.com/صفحہ۔')).toBe('https://example.com/صفحہ.');
      expect(inpageToUnicode('https://example.com/صفحہ.')).toBe('https://example.com/صفحہ۔');

      // Raw Urdu IRI with terminal ':' and '!'
      expect(splitIntoSegments('https://example.com/صفحہ:')).toEqual([
        { type: 'protected', value: urduUrl },
        { type: 'translatable', value: ':' },
      ]);
      expect(splitIntoSegments('https://example.com/صفحہ!')).toEqual([
        { type: 'protected', value: urduUrl },
        { type: 'translatable', value: '!' },
      ]);

      // Raw Urdu IRI embedded in natural Urdu sentence context
      const sentenceUnicode = 'یہ لنک دیکھیں: https://example.com/صفحہ۔';
      const sentenceInpage = unicodeToInpage(sentenceUnicode);
      expect(sentenceInpage).toBe('io lnk dikHiN: https://example.com/صفحہ.');
      expect(inpageToUnicode(sentenceInpage)).toBe(sentenceUnicode);

      // 2. Decomposed Unicode URL preservation
      // URLs containing decomposed Unicode (e.g. Alif + combining Maddah \u0627\u0653) must remain exactly
      // decomposed without being mutated into precomposed \u0622 by NFC normalization.
      const decomposedUrl = 'https://example.com/\u0627\u0653';
      expect(splitIntoSegments(decomposedUrl)).toEqual([
        { type: 'protected', value: decomposedUrl },
      ]);
      expect(unicodeToInpage(decomposedUrl)).toBe(decomposedUrl);
      expect(unicodeToInpage(decomposedUrl)).toHaveLength(22);
      expect(inpageToUnicode(decomposedUrl)).toBe(decomposedUrl);
      expect(inpageToUnicode(decomposedUrl)).toHaveLength(22);

      // 3. Mixed prose: decomposed Urdu text outside the URL still follows intended NFC normalization and conversion
      // Outside URL: decomposed Quran 'قر\u0627\u0653ن' (Alif + combining Maddah)
      // Inside URL: decomposed URL 'https://example.com/\u0627\u0653'
      const mixedProse = 'قر\u0627\u0653ن ' + decomposedUrl;
      const mixedInpage = unicodeToInpage(mixedProse);
      expect(mixedInpage).toBe('qrAn ' + decomposedUrl);
      expect(mixedInpage.endsWith('\u0627\u0653')).toBe(true);

      const mixedReversed = inpageToUnicode(mixedInpage);
      expect(mixedReversed).toBe('قرآن ' + decomposedUrl);
      expect(mixedReversed.startsWith('\u0642\u0631\u0622\u0646')).toBe(true);
      expect(mixedReversed.endsWith('\u0627\u0653')).toBe(true);

      // 4. Decomposed-Unicode URL followed by sentence punctuation in both directions
      // Khatma / period:
      expect(splitIntoSegments(decomposedUrl + '۔')).toEqual([
        { type: 'protected', value: decomposedUrl },
        { type: 'translatable', value: '۔' },
      ]);
      expect(unicodeToInpage(decomposedUrl + '۔')).toBe(decomposedUrl + '.');
      expect(inpageToUnicode(decomposedUrl + '.')).toBe(decomposedUrl + '۔');

      // Comma:
      expect(splitIntoSegments(decomposedUrl + '،')).toEqual([
        { type: 'protected', value: decomposedUrl },
        { type: 'translatable', value: '،' },
      ]);
      expect(unicodeToInpage(decomposedUrl + '،')).toBe(decomposedUrl + ',');
      expect(inpageToUnicode(decomposedUrl + ',')).toBe(decomposedUrl + '،');

      // Question mark:
      expect(splitIntoSegments(decomposedUrl + '؟')).toEqual([
        { type: 'protected', value: decomposedUrl },
        { type: 'translatable', value: '؟' },
      ]);
      expect(unicodeToInpage(decomposedUrl + '؟')).toBe(decomposedUrl + '?');
      expect(inpageToUnicode(decomposedUrl + '?')).toBe(decomposedUrl + '؟');
    });

    test('Sentence punctuation following URLs with query strings, fragments, ports, and hashbangs', () => {
      // 1. Query string + period
      expect(inpageToUnicode('https://converterforall.com/search?q=urdu.')).toBe('https://converterforall.com/search?q=urdu۔');
      expect(unicodeToInpage('https://converterforall.com/search?q=urdu۔')).toBe('https://converterforall.com/search?q=urdu.');

      // 2. Query string + comma
      expect(inpageToUnicode('https://converterforall.com/search?q=urdu,')).toBe('https://converterforall.com/search?q=urdu،');
      expect(unicodeToInpage('https://converterforall.com/search?q=urdu،')).toBe('https://converterforall.com/search?q=urdu,');

      // 3. Query string + question mark
      expect(inpageToUnicode('https://converterforall.com/search?q=urdu?')).toBe('https://converterforall.com/search?q=urdu؟');
      expect(unicodeToInpage('https://converterforall.com/search?q=urdu؟')).toBe('https://converterforall.com/search?q=urdu?');

      // 4. Query string + semicolon
      expect(inpageToUnicode('https://converterforall.com/search?q=urdu;')).toBe('https://converterforall.com/search?q=urdu؛');
      expect(unicodeToInpage('https://converterforall.com/search?q=urdu؛')).toBe('https://converterforall.com/search?q=urdu;');

      // 5. Query string + exclamation mark
      expect(inpageToUnicode('https://converterforall.com/search?q=urdu!')).toBe('https://converterforall.com/search?q=urdu!');
      expect(unicodeToInpage('https://converterforall.com/search?q=urdu!')).toBe('https://converterforall.com/search?q=urdu!');

      // 6. Fragment + period
      expect(inpageToUnicode('https://converterforall.com/docs#faq.')).toBe('https://converterforall.com/docs#faq۔');
      expect(unicodeToInpage('https://converterforall.com/docs#faq۔')).toBe('https://converterforall.com/docs#faq.');

      // 7. Port + period
      expect(inpageToUnicode('https://converterforall.com:8080.')).toBe('https://converterforall.com:8080۔');
      expect(unicodeToInpage('https://converterforall.com:8080۔')).toBe('https://converterforall.com:8080.');

      // 8. Hashbang + period
      expect(inpageToUnicode('https://converterforall.com/app/#!/home.')).toBe('https://converterforall.com/app/#!/home۔');
      expect(unicodeToInpage('https://converterforall.com/app/#!/home۔')).toBe('https://converterforall.com/app/#!/home.');
    });

    test('Balanced parentheses, brackets, and unbalanced prose parentheses in URLs', () => {
      // 1. Balanced parentheses alone (Wikipedia-style)
      const wikiUrl = 'https://en.wikipedia.org/wiki/Urdu_(language)';
      expect(inpageToUnicode(wikiUrl)).toBe(wikiUrl);
      expect(unicodeToInpage(wikiUrl)).toBe(wikiUrl);

      // 2. Balanced parentheses with trailing sentence punctuation
      expect(inpageToUnicode('https://en.wikipedia.org/wiki/Urdu_(language).')).toBe('https://en.wikipedia.org/wiki/Urdu_(language)۔');
      expect(unicodeToInpage('https://en.wikipedia.org/wiki/Urdu_(language)۔')).toBe('https://en.wikipedia.org/wiki/Urdu_(language).');

      expect(inpageToUnicode('https://en.wikipedia.org/wiki/Urdu_(language),')).toBe('https://en.wikipedia.org/wiki/Urdu_(language)،');
      expect(unicodeToInpage('https://en.wikipedia.org/wiki/Urdu_(language)،')).toBe('https://en.wikipedia.org/wiki/Urdu_(language),');

      expect(inpageToUnicode('https://en.wikipedia.org/wiki/Urdu_(language)?')).toBe('https://en.wikipedia.org/wiki/Urdu_(language)؟');
      expect(unicodeToInpage('https://en.wikipedia.org/wiki/Urdu_(language)؟')).toBe('https://en.wikipedia.org/wiki/Urdu_(language)?');

      // 3. Unbalanced prose parentheses around URL
      expect(inpageToUnicode('(https://converterforall.com)')).toBe('(https://converterforall.com)');
      expect(unicodeToInpage('(https://converterforall.com)')).toBe('(https://converterforall.com)');

      expect(inpageToUnicode('(https://converterforall.com).')).toBe('(https://converterforall.com)۔');
      expect(unicodeToInpage('(https://converterforall.com)۔')).toBe('(https://converterforall.com).');
    });

    test('Email addresses with full sentence punctuation suite and prose context', () => {
      // 1. Period
      expect(inpageToUnicode('info@example.com.')).toBe('info@example.com۔');
      expect(unicodeToInpage('info@example.com۔')).toBe('info@example.com.');

      // 2. Comma
      expect(inpageToUnicode('info@example.com,')).toBe('info@example.com،');
      expect(unicodeToInpage('info@example.com،')).toBe('info@example.com,');

      // 3. Question mark
      expect(inpageToUnicode('info@example.com?')).toBe('info@example.com؟');
      expect(unicodeToInpage('info@example.com؟')).toBe('info@example.com?');

      // 4. Semicolon
      expect(inpageToUnicode('info@example.com;')).toBe('info@example.com؛');
      expect(unicodeToInpage('info@example.com؛')).toBe('info@example.com;');

      // 5. Colon
      expect(inpageToUnicode('info@example.com:')).toBe('info@example.com:');
      expect(unicodeToInpage('info@example.com:')).toBe('info@example.com:');

      // 6. Exclamation mark
      expect(inpageToUnicode('info@example.com!')).toBe('info@example.com!');
      expect(unicodeToInpage('info@example.com!')).toBe('info@example.com!');

      // 7. Both conversion directions with surrounding Urdu prose, spaces, and punctuation intact
      const emailProseQInpage = 'rabvo info@example.com? pr oiN.';
      const emailProseQUnicode = 'رابطہ info@example.com؟ پر ہیں۔';
      expect(inpageToUnicode(emailProseQInpage)).toBe(emailProseQUnicode);
      expect(unicodeToInpage(emailProseQUnicode)).toBe(emailProseQInpage);

      const emailProseSemiInpage = 'rabvo info@example.com; pr oiN.';
      const emailProseSemiUnicode = 'رابطہ info@example.com؛ پر ہیں۔';
      expect(inpageToUnicode(emailProseSemiInpage)).toBe(emailProseSemiUnicode);
      expect(unicodeToInpage(emailProseSemiUnicode)).toBe(emailProseSemiInpage);

      const urlProseQInpage = 'tfSilat https://converterforall.com? pr oiN.';
      const urlProseQUnicode = 'تفصیلات https://converterforall.com؟ پر ہیں۔';
      expect(inpageToUnicode(urlProseQInpage)).toBe(urlProseQUnicode);
      expect(unicodeToInpage(urlProseQUnicode)).toBe(urlProseQInpage);

      const urlProseSemiInpage = 'tfSilat https://converterforall.com; pr oiN.';
      const urlProseSemiUnicode = 'تفصیلات https://converterforall.com؛ پر ہیں۔';
      expect(inpageToUnicode(urlProseSemiInpage)).toBe(urlProseSemiUnicode);
      expect(unicodeToInpage(urlProseSemiUnicode)).toBe(urlProseSemiInpage);
    });

    test('Teh Marbuta non-corruption: Arabic ة (U+0629) is preserved untouched', () => {
      const arabicText = 'صلوة اور زكوة'; // Contains Arabic Teh Marbuta U+0629
      const converted = unicodeToInpage(arabicText);
      expect(converted).toContain('\u0629');
      expect(converted).not.toContain('o'); // Must NOT be corrupted to Gol Heh key
      expect(converted).not.toContain('ہ');
    });

    test('Alef Hamza non-corruption: Arabic أ (U+0623) and إ (U+0625) are preserved untouched', () => {
      const input = 'أحمد اور إسلام';
      const converted = unicodeToInpage(input);
      expect(converted).toContain('\u0623');
      expect(converted).toContain('\u0625');
      expect(converted).toBe('أhmd awr إslam');
    });

    test('Digit range hyphen preservation: 1947-1948', () => {
      const range = '1947-1948';
      expect(unicodeToInpage(range)).toBe(range);
      expect(unicodeToInpage('۱۹۴۷-۱۹۴۸')).toBe(range);
      expect(inpageToUnicode(range)).toBe('۱۹۴۷-۱۹۴۸');
      expect(inpageToUnicode(range)).not.toContain('۔');
    });

    test('Decimal number preservation: 3.14', () => {
      expect(inpageToUnicode('3.14')).toBe('3.14');
      expect(inpageToUnicode('3.14')).not.toContain('۔');
    });

    test('Directional English handling in inpageToUnicode: cat -> چات', () => {
      expect(inpageToUnicode('cat')).toBe('چات');
    });

    test('convertUrdu general entry point function', () => {
      expect(convertUrdu('اردو', 'inpage', 'fromUnicode')).toBe('ardw');
      expect(convertUrdu('ardw', 'inpage', 'toUnicode')).toBe('اردو');
      expect(convertUrdu('', 'inpage', 'toUnicode')).toBe('');
    });
  });
});
