import { unicodeToPreeti as convertUnicodeToPreeti } from "unicode-to-preeti";

// Ordered longest-first Preeti ASCII -> Unicode Devanagari substitution pairs
// (aligned with standard Preeti keyboard encoding; 'l' and '{' are handled with cluster reordering).
const PREETI_MULTI_TO_UNICODE: [string, string][] = [
  ["k|m", "फ्र"],
  ["cf‘", "ऑ"],
  ["c‘f", "ऑ"],
  ["cf}", "औ"],
  ["cf]", "ओ"],
  ["cf", "आ"],
  ["f‘", "ॉ"],
  ["f]", "ो"],
  ["f}", "ौ"],
  ["0f", "ण"],
  ["If", "क्ष"],
  ["if", "ष"],
  ["O{", "ई"],
  ["pm", "ऊ"],
  ["P]", "ऐ"],
  ["8Þ", "ड़"],
  ["9Þ", "ढ़"],
  ["6«", "ट्र"],
  ["7«", "ठ्र"],
  ["8«", "ड्र"],
  ["9«", "ढ्र"],
  ["qm", "क्र"],
  ["Qm", "क्त"],
  ["km", "फ"],
  ["em", "झ"],
];

const PREETI_CHAR_TO_UNICODE: Record<string, string> = {
  // Digits & punctuation
  ")": "०",
  "!": "१",
  "@": "२",
  "#": "३",
  "$": "४",
  "%": "५",
  "^": "६",
  "&": "७",
  "*": "८",
  "(": "९",
  ".": "।",
  "-": "❨",
  "_": "❩",
  "…": "‘",
  "<": "?",
  "ç": "ॐ",
  "˜": "ऽ",

  // Conjuncts & special glyphs
  "1": "ज्ञ",
  "¡": "ज्ञ्",
  "2": "द्द",
  "4": "द्ध",
  "¢": "द्घ",
  ">": "श्र",
  "?": "रु",
  "¿": "रू",
  "B": "द्य",
  "I": "क्ष्",
  "Q": "त्त",
  "ß": "द्म",
  "q": "त्र",
  "Ì": "त्र",
  "„": "ध्र",
  "‹": "ङ्घ",
  "•": "ड्ड",
  "›": "द्र",
  "§": "ट्ट",
  "°": "ड्ढ",
  "¶": "ठ्ठ",
  "Å": "हृ",
  "Ë": "ङ्ग",
  "Í": "ङ्क",
  "Î": "ङ्ख",
  "Ý": "ट्ठ",
  "å": "द्व",
  "|": "्र",
  "Ø": "्य",

  // Consonants & half-consonants
  "S": "क्",
  "s": "क",
  "V": "ख्",
  "v": "ख",
  "U": "ग्",
  "u": "ग",
  "£": "घ्",
  "3": "घ",
  "ª": "ङ",
  "R": "च्",
  "r": "च",
  "5": "छ",
  "H": "ज्",
  "h": "ज",
  "‰": "झ्",
  "´": "झ",
  "~": "ञ्",
  "`": "ञ",
  "6": "ट",
  "7": "ठ",
  "8": "ड",
  "9": "ढ",
  "0": "ण्",
  "T": "त्",
  "t": "त",
  "Y": "थ्",
  "y": "थ",
  "b": "द",
  "W": "ध्",
  "w": "ध",
  "G": "न्",
  "g": "न",
  "K": "प्",
  "k": "प",
  "ˆ": "फ्",
  "A": "ब्",
  "a": "ब",
  "E": "भ्",
  "e": "भ",
  "D": "म्",
  "d": "म",
  "o": "य",
  "/": "र",
  "N": "ल्",
  "n": "ल",
  "J": "व्",
  "j": "व",
  "Z": "श्",
  "z": "श",
  "i": "ष्",
  ":": "स्",
  ";": "स",
  "X": "ह्",
  "x": "ह",

  // Independent vowels & matras
  "c": "अ",
  "O": "इ",
  "p": "उ",
  "C": "ऋ",
  "P": "ए",
  '"': "ू",
  "'": "ु",
  "+": "ं",
  "f": "ा",
  "[": "ृ",
  "\\": "्",
  "]": "े",
  "}": "ै",
  "F": "ँ",
  "L": "ी",
  "M": "ः",
};

const REPH_MARKER = "\uE001";
const PRE_I_MARKER = "\uE002";

function preetiToUnicode(input: string): string {
  if (!input) return "";

  let out = "";
  let i = 0;

  while (i < input.length) {
    // 1. Multi-character Preeti tokens (longest match first)
    let matchedMulti = false;
    for (const [token, devanagari] of PREETI_MULTI_TO_UNICODE) {
      if (input.startsWith(token, i)) {
        out += devanagari;
        i += token.length;
        matchedMulti = true;
        break;
      }
    }
    if (matchedMulti) continue;

    const ch = input[i];
    if (ch === "l") {
      out += PRE_I_MARKER;
      i += 1;
      continue;
    }
    if (ch === "{") {
      out += REPH_MARKER;
      i += 1;
      continue;
    }

    // Legacy wrapper glyphs sometimes seen after 'm'
    if (ch === "'" && input[i + 1] === "m") {
      out += "m'";
      i += 2;
      continue;
    }

    out += PREETI_CHAR_TO_UNICODE[ch] ?? ch;
    i += 1;
  }

  // 2. Move pre-base Chhoti-I marker after the following consonant / halant conjunct
  const cons = "[क-हक्षत्रज्ञड़ढ़]";
  const preIRegex = new RegExp(`${PRE_I_MARKER}(${cons}(?:्${cons})*)`, "g");
  out = out.replace(preIRegex, "$1ि");
  out = out.replaceAll(PRE_I_MARKER, "ि");

  // 3. Reconstruct Reph ('र्') placed either immediately after base consonant cluster or after vowel signs
  const rephAfterClusterRegex = new RegExp(
    `(${cons}(?:्${cons})*)([ािीुूृेैोौंँः]*)${REPH_MARKER}`,
    "g"
  );
  out = out.replace(rephAfterClusterRegex, "र्$1$2");
  out = out.replaceAll(REPH_MARKER, "र्");

  return out;
}

/**
 * Bidirectional Nepali Preeti <-> Unicode converter.
 */
export function convertNepali(
  text: string,
  _font: string,
  direction: "toUnicode" | "fromUnicode"
): string {
  if (!text) return "";
  return direction === "toUnicode"
    ? preetiToUnicode(text)
    : convertUnicodeToPreeti(text);
}
