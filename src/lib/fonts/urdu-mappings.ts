// High-accuracy Urdu Unicode <-> InPage Phonetic Key-Sequence bidirectional converter
// Verified against InPage Urdu 2.40 / 3.05 Built-in Phonetic Keyboard layout (Phonetic.kbd)

export interface Segment {
  type: 'protected' | 'translatable';
  value: string;
}

const PROTECTED_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|\b\d+\.\d+\b)/g;

// Product Heuristic: Sentence Punctuation Separation vs. Valid URL Syntax
//
// In RFC 3986, characters such as '?', ':', ';', and '!' are valid URI delimiters and can syntactically
// appear anywhere in a URI, including at the end of a path or query. However, in plain-text prose, URLs
// and email addresses are frequently embedded in sentences and immediately followed by sentence punctuation
// (such as '.', ',', '?', '!', ':', ';', or Urdu '۔', '،', '؛', '؟').
//
// Because plain text cannot definitively disambiguate whether a terminal character belongs to the URL or
// represents sentence punctuation, this converter implements an explicit, documented trade-off:
// 1. Terminal sentence marks ('.', ',', ';', ':', '?', '!', Urdu punctuation, and quotes) are heuristically
//    separated from the protected URL/email token so they can undergo proper character conversion in prose
//    ('.' <-> '۔', ',' <-> '،', ';' <-> '؛', '?' <-> '؟').
// 2. Exception: Hashbang fragment boundaries ('#!') at the end of a token are preserved as part of the URL.
// 3. Exception: Balanced parentheses/brackets (e.g. Wikipedia URLs '.../Urdu_(language)') are preserved in the URL.
// 4. Limitation: If a URL legitimately ends with a path character like ':', ';', '!', or a bare empty query '?',
//    that terminal character is treated as sentence punctuation and detached. Lossless preservation of terminal
//    ambiguous punctuation is therefore not guaranteed in plain text. Internal query strings, fragments, ports,
//    and parameters remain strictly protected.
// 5. Raw Urdu Characters in URLs (IRIs): The regex pattern https?:\/\/[^\s]+ matches any sequence of non-whitespace
//    characters. Raw Unicode Urdu characters in paths or query strings (e.g. 'https://example.com/صفحہ') are matched
//    as part of the protected URL token and preserved completely unchanged in both conversion directions.
// 6. Normalization Order and Protected Segments: Tokenization occurs before Unicode normalization.
//    Unicode NFC normalization is applied strictly to translatable text segments. Protected URLs,
//    emails, and numbers containing decomposed Unicode (e.g. 'https://example.com/\u0627\u0653')
//    are preserved byte-for-byte in both conversion directions without being mutated by NFC normalization.
const TRAILING_PUNCT_SET = new Set(['.', ',', ';', ':', '?', '\u06D4', '\u060C', '\u061B', '\u061F', '"', "'", '”', '’', '»', '«']);

export function trimTrailingPunctuation(token: string): { clean: string; trailing: string } {
  let clean = token;
  let trailing = '';

  while (clean.length > 0) {
    const lastChar = clean[clean.length - 1];

    // Heuristic 1: Hashbang preservation ('#!')
    // If '!' is immediately preceded by '#', it is an intentional hashbang fragment delimiter and preserved as part of the URL.
    if (lastChar === '!') {
      if (clean.endsWith('#!')) {
        break;
      }
      trailing = lastChar + trailing;
      clean = clean.slice(0, -1);
      continue;
    }

    // Heuristic 2: Known sentence-level punctuation (ASCII & Urdu marks, quotes)
    if (TRAILING_PUNCT_SET.has(lastChar)) {
      trailing = lastChar + trailing;
      clean = clean.slice(0, -1);
      continue;
    }

    if (lastChar === ')') {
      const openCount = (clean.match(/\(/g) || []).length;
      const closeCount = (clean.match(/\)/g) || []).length;
      if (closeCount > openCount) {
        trailing = lastChar + trailing;
        clean = clean.slice(0, -1);
        continue;
      }
    }

    if (lastChar === ']') {
      const openCount = (clean.match(/\[/g) || []).length;
      const closeCount = (clean.match(/\]/g) || []).length;
      if (closeCount > openCount) {
        trailing = lastChar + trailing;
        clean = clean.slice(0, -1);
        continue;
      }
    }

    break;
  }

  return { clean, trailing };
}

export function splitIntoSegments(input: string): Segment[] {
  if (!input) return [];
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PROTECTED_PATTERN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'translatable',
        value: input.slice(lastIndex, match.index),
      });
    }

    const rawToken = match[0];
    if (rawToken.startsWith('http://') || rawToken.startsWith('https://') || rawToken.startsWith('www.') || rawToken.includes('@')) {
      const { clean, trailing } = trimTrailingPunctuation(rawToken);
      if (clean) {
        segments.push({
          type: 'protected',
          value: clean,
        });
      }
      if (trailing) {
        segments.push({
          type: 'translatable',
          value: trailing,
        });
      }
    } else {
      // Decimal number
      segments.push({
        type: 'protected',
        value: rawToken,
      });
    }

    lastIndex = match.index + rawToken.length;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: 'translatable',
      value: input.slice(lastIndex),
    });
  }

  return segments;
}

const SINGLE_KEY_PAIRS: [string, string][] = [
  // Normal keys
  ['a', '\u0627'], // ا (Alif)
  ['b', '\u0628'], // ب (Bay)
  ['c', '\u0686'], // چ (Che)
  ['d', '\u062F'], // د (Daal)
  ['e', '\u0639'], // ع (Ain)
  ['f', '\u0641'], // ف (Fay)
  ['g', '\u06AF'], // گ (Gaaf)
  ['h', '\u062D'], // ح (Hah / Badi He)
  ['i', '\u06CC'], // ی (Choti Yeh)
  ['j', '\u062C'], // ج (Jeem)
  ['k', '\u06A9'], // ک (Urdu Keheh)
  ['l', '\u0644'], // ل (Laam)
  ['m', '\u0645'], // م (Meem)
  ['n', '\u0646'], // ن (Noon)
  ['o', '\u06C1'], // ہ (Gol Heh)
  ['p', '\u067E'], // پ (Pay)
  ['q', '\u0642'], // ق (Qaaf)
  ['r', '\u0631'], // ر (Ray)
  ['s', '\u0633'], // س (Seen)
  ['t', '\u062A'], // ت (Te)
  ['u', '\u0621'], // ء (Hamza isolated)
  ['v', '\u0637'], // ط (Toyen)
  ['w', '\u0648'], // و (Waw)
  ['x', '\u0634'], // ش (Sheen)
  ['y', '\u06D2'], // ے (Badi Yeh)
  ['z', '\u0632'], // ز (Zay)

  // Shift keys
  ['A', '\u0622'], // آ (Alif Madda)
  ['B', '\u0653'], // ٓ (Combining Maddah mark)
  ['C', '\u062B'], // ث (Theh)
  ['D', '\u0688'], // ڈ (Ddaal)
  ['E', '\u0670'], // ٰ (Khari Zabar)
  ['F', '\u064B'], // ً (Do Zabar / Fathatan)
  ['G', '\u063A'], // غ (Ghain)
  ['H', '\u06BE'], // ھ (Do-chashmi He)
  ['I', '\u0650'], // ِ (Zer / Kasra)
  ['J', '\u0636'], // ض (Zuad)
  ['K', '\u062E'], // خ (Khah)
  ['L', '\u0656'], // ٖ (Khara Zer)
  ['M', '\u064C'], // ٌ (Do Pesh / Dammatan)
  ['N', '\u06BA'], // ں (Noon Ghunna)
  ['O', '\u06C3'], // ۃ (Teh Marbuta Goal)
  ['P', '\u064F'], // ُ (Pesh / Damma)
  ['Q', '\u0652'], // ْ (Sukun / Jazm)
  ['R', '\u0691'], // ڑ (Rray)
  ['S', '\u0635'], // ص (Suad)
  ['T', '\u0679'], // ٹ (Tte)
  ['U', '\u0626'], // ئ (Yeh with Hamza)
  ['V', '\u0638'], // ظ (Zoyen)
  ['W', '\u0651'], // ّ (Tashdeed)
  ['X', '\u0698'], // ژ (Zhay)
  ['Y', '\u064E'], // َ (Zabar / Fatha)
  ['Z', '\u0630'], // ذ (Zaal)

  // Punctuation
  ['?', '\u061F'], // ؟
  [',', '\u060C'], // ،
  [';', '\u061B'], // ؛

  // Urdu Digits <-> Latin Digits
  ['0', '\u06F0'],
  ['1', '\u06F1'],
  ['2', '\u06F2'],
  ['3', '\u06F3'],
  ['4', '\u06F4'],
  ['5', '\u06F5'],
  ['6', '\u06F6'],
  ['7', '\u06F7'],
  ['8', '\u06F8'],
  ['9', '\u06F9'],
];

const KEY_TO_UNICODE = new Map<string, string>(SINGLE_KEY_PAIRS);
const UNICODE_TO_KEY = new Map<string, string>();
for (const [key, uni] of SINGLE_KEY_PAIRS) {
  UNICODE_TO_KEY.set(uni, key);
}

export function unicodeToInpage(input: string): string {
  if (!input) return '';
  const segments = splitIntoSegments(input);

  return segments.map(seg => {
    if (seg.type === 'protected') return seg.value;

    // Unicode normalization: compose decomposed sequences like Alif + combining Maddah (\u0627\u0653) into Alif Madda (\u0622)
    let text = seg.value.normalize('NFC');

    // Mobile / dialect normalizations
    text = text.replace(/\u0643/g, '\u06A9'); // Arabic Kaf -> Urdu Keheh
    text = text.replace(/[\u064A\u0649]/g, '\u06CC'); // Arabic Yeh / Alef Maksura -> Urdu Choti Yeh
    text = text.replace(/[\u0660-\u0669]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x0660 + 0x06F0)); // Arabic-Indic digits -> Urdu digits
    text = text.replace(/\u0640/g, ''); // Strip Kashida / Tatweel

    // Khatma conversion
    text = text.replace(/\u06D4/g, '.'); // Urdu Khatma -> period

    // Multi-character composites
    text = text.replace(/\u0624/g, 'uw'); // Waw with Hamza
    text = text.replace(/\u06C2/g, 'ou'); // Heh Goal with Hamza / Izafat
    text = text.replace(/\u06D3/g, 'Uy'); // Badi Yeh with Hamza

    let out = '';
    for (const ch of text) {
      out += UNICODE_TO_KEY.get(ch) || ch;
    }
    return out;
  }).join('');
}

export function inpageToUnicode(input: string): string {
  if (!input) return '';
  const segments = splitIntoSegments(input);

  return segments.map(seg => {
    if (seg.type === 'protected') return seg.value;

    let text = seg.value;

    // Multi-character composites (replace before single characters)
    text = text.replace(/uw/g, '\u0624'); // Waw with Hamza (ؤ)
    text = text.replace(/ou/g, '\u06C2'); // Heh Goal with Hamza (ۂ)
    text = text.replace(/Uy/g, '\u0626\u06D2'); // Documented canonicalization of Badi Yeh with Hamza (ئے)

    // Period to Khatma conversion (protecting decimals not caught by tokenizer)
    text = text.replace(/(?<!\d)\.|\.(?!\d)/g, '\u06D4');

    let out = '';
    for (const ch of text) {
      out += KEY_TO_UNICODE.get(ch) || ch;
    }
    return out.normalize('NFC');
  }).join('');
}

export function convertUrdu(text: string, font: string, direction: 'toUnicode' | 'fromUnicode'): string {
  if (!text) return '';

  if (direction === 'toUnicode') {
    return inpageToUnicode(text);
  } else {
    return unicodeToInpage(text);
  }
}
