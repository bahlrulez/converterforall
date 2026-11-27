import { convertBijoyToUnicode } from "bijoy2unicode";

// Unicode -> Bijoy / SutonnyMJ multi-character conjuncts (matched longest-first)
const UNICODE_CONJUNCTS_TO_BIJOY: [string, string][] = [
  ["\u0995\u09CD\u09B7\u09CD\u09A3", "\xB2"], // ক্ষ্ণ
  ["\u099A\u09CD\u099B\u09CD\u09AC", "\u201DQ\xA6"], // চ্ছ্ব
  ["\u09AD\u09CD\u09B0\u09C1", "\xE5\u201C"], // ভ্রু
  ["\u09B8\u09CD\u09A4\u09CD\u09AC", "\xAF\xCD\xA1"], // স্ত্ব
  ["\u09A8\u09CD\u09A4\u09CD\u09AC", "\u0161\xCD\xA1"], // ন্ত্ব
  ["\u09A4\u09CD\u09A4\u09CD\u09AC", "\xCB\xA1"], // ত্ত্ব
  ["\u0995\u09CD\u09B7", "\xB6"], // ক্ষ
  ["\u0995\u09CD\u0995", "\xB0"], // ক্ক
  ["\u0995\u09CD\u099F", "\xB1"], // ক্ট
  ["\u0995\u09CD\u09A4", "\xB3"], // ক্ত
  ["\u0995\u09CD\u09AE", "\xB4"], // ক্ম
  ["\u0995\u09CD\u09B0", "\xB5"], // ক্র
  ["\u0995\u09CD\u09B8", "\xB7"], // ক্স
  ["\u0997\u09C1", "\xB8"], // গু
  ["\u0997\u09CD\u09A6", "\xBA"], // গ্দ
  ["\u0997\u09CD\u09A7", "\xBB"], // গ্ধ
  ["\u0997\u09CD\u09B2", "M\xF8"], // গ্ল
  ["\u0999\u09CD\u0995", "\xBC"], // ঙ্ক
  ["\u0999\u09CD\u0997", "\xBD"], // ঙ্গ
  ["\u099C\u09CD\u099C", "\xBE"], // জ্জ
  ["\u099C\u09CD\u099D", "\xC0"], // জ্ঝ
  ["\u099C\u09CD\u099E", "\xC1"], // জ্ঞ
  ["\u099E\u09CD\u099A", "\xC2"], // ঞ্চ
  ["\u099E\u09CD\u099B", "\xC3"], // ঞ্ছ
  ["\u099E\u09CD\u099C", "\xC4"], // ঞ্জ
  ["\u099E\u09CD\u099D", "\xC5"], // ঞ্ঝ
  ["\u099F\u09CD\u099F", "\xC6"], // ট্ট
  ["\u09A1\u09CD\u09A1", "\xC7"], // ড্ড
  ["\u09A3\u09CD\u099F", "\xC8"], // ণ্ট
  ["\u09A3\u09CD\u09A0", "\xC9"], // ণ্ঠ
  ["\u09A3\u09CD\u09A1", "\xCA"], // ণ্ড
  ["\u09A4\u09CD\u09A4", "\xCB"], // ত্ত
  ["\u09A4\u09CD\u09A5", "\xCC"], // ত্থ
  ["\u09A4\u09CD\u09AE", "\xCD"], // ত্ম
  ["\u09A4\u09CD\u09B0", "\xCE"], // ত্র
  ["\u09A6\u09CD\u09A6", "\xCF"], // দ্দ
  ["\u09A6\u09CD\u09A7", "\xD7"], // দ্ধ
  ["\u09A6\u09CD\u09AC", "\xD8"], // দ্ব
  ["\u09A6\u09CD\u09AE", "\xD9"], // দ্ম
  ["\u09A8\u09CD\u09A0", "\xDA"], // ন্ঠ
  ["\u09A8\u09CD\u09A1", "\xDB"], // ন্ড
  ["\u09A8\u09CD\u09A4", "\u0161\xCD"], // ন্ত
  ["\u09A8\u09CD\u09A7", "\xDC"], // ন্ধ
  ["\u09A8\u09CD\u09B8", "\xDD"], // ন্স
  ["\u09AA\u09CD\u099F", "\xDE"], // প্ট
  ["\u09AA\u09CD\u09A4", "\xDF"], // প্ত
  ["\u09AA\u09CD\u09AA", "\xE0"], // প্প
  ["\u09AA\u09CD\u09B2", "c\xF8"], // প্ল
  ["\u09AA\u09CD\u09B8", "\xE1"], // প্স
  ["\u09AC\u09CD\u099C", "\xE2"], // ব্জ
  ["\u09AC\u09CD\u09A6", "\xE3"], // ব্দ
  ["\u09AC\u09CD\u09A7", "\xE4"], // ব্ধ
  ["\u09AC\u09CD\u09B2", "e\xF8"], // ব্ল
  ["\u09AD\u09CD\u09B0", "\xE5"], // ভ্র
  ["\u09AE\u09CD\u09AB", "\xE7"], // ম্ফ
  ["\u09AE\u09CD\u09B2", "\xA4\xF8"], // ম্ল
  ["\u09B0\u09C1", "i\xE6"], // রু
  ["\u09B0\u09C2", "i\u0192"], // রূ
  ["\u09B2\u09CD\u0995", "\xE9"], // ল্ক
  ["\u09B2\u09CD\u0997", "\xEA"], // ল্গ
  ["\u09B2\u09CD\u099F", "\xEB"], // ল্ট
  ["\u09B2\u09CD\u09A1", "\xEC"], // ল্ড
  ["\u09B2\u09CD\u09AA", "\xED"], // ল্প
  ["\u09B2\u09CD\u09AB", "\xEE"], // ল্ফ
  ["\u09B6\u09C1", "\xEF"], // শু
  ["\u09B6\u09CD\u099A", "\xF0"], // শ্চ
  ["\u09B6\u09CD\u099B", "\xF1"], // শ্ছ
  ["\u09B6\u09CD\u09B2", "k\xF8"], // শ্ল
  ["\u09B7\u09CD\u09A3", "\xF2"], // ষ্ণ
  ["\u09B7\u09CD\u099F", "\xF3"], // ষ্ট
  ["\u09B7\u09CD\u09A0", "\xF4"], // ষ্ঠ
  ["\u09B7\u09CD\u09AB", "\xF5"], // ষ্ফ
  ["\u09B8\u09CD\u0996", "\xF6"], // স্খ
  ["\u09B8\u09CD\u099F", "\xF7"], // স্ট
  ["\u09B8\u09CD\u09A4", "\xAF\xCD"], // স্ত
  ["\u09B8\u09CD\u09A8", "\xF8"], // স্ন
  ["\u09B8\u09CD\u09AB", "\xF9"], // স্ফ
  ["\u09B8\u09CD\u09B2", "\xAF\xF8"], // স্ল
  ["\u09B9\u09C1", "\xFB"], // হু
  ["\u09B9\u09C3", "\xFC"], // হৃ
  ["\u09B9\u09CD\u09A8", "\xFD"], // হ্ন
  ["\u09B9\u09CD\u09AE", "\xFE"], // হ্ম
  // Decomposed nukta consonants -> precomposed Bijoy keys
  ["\u09A1\u09BC", "o"], // ড়
  ["\u09A2\u09BC", "p"], // ঢ়
  ["\u09AF\u09BC", "q"], // য়
  // Phola suffixes (must come before bare halant)
  ["\u09CD\u09AC", "^"], // ব-ফলা
  ["\u09CD\u09AF", "\xA8"], // য-ফলা
  ["\u09CD\u09B0", "\xD6"], // র-ফলা
  ["\u09CD\u09B2", "\xAC"], // ল-ফলা
  ["\u09CD\u09AE", "\xA5"], // ম-ফলা
  ["\u09CD\u09A8", "\xE8"], // ন-ফলা
  ["\u09CD\u09A4", "\u2014"], // ত-ফলা
  ["\u09CD\u09A5", "\u2019"], // থ-ফলা
  ["\u09CD\u0995", "\u2039"], // ক-ফলা
  ["\u09CD\u09AA", "\xFA"], // প-ফলা
  ["\u09CD\u09AD", "\xA2"], // ভ-ফলা
];

const UNICODE_CHARS_TO_BIJOY: Record<string, string> = {
  "\u0985": "A",
  "\u0986": "Av",
  "\u0987": "B",
  "\u0988": "C",
  "\u0989": "D",
  "\u098A": "E",
  "\u098B": "F",
  "\u098F": "G",
  "\u0990": "H",
  "\u0993": "I",
  "\u0994": "J",
  "\u0995": "K",
  "\u0996": "L",
  "\u0997": "M",
  "\u0998": "N",
  "\u0999": "O",
  "\u099A": "P",
  "\u099B": "Q",
  "\u099C": "R",
  "\u099D": "S",
  "\u099E": "T",
  "\u099F": "U",
  "\u09A0": "V",
  "\u09A1": "W",
  "\u09A2": "X",
  "\u09A3": "Y",
  "\u09A4": "Z",
  "\u09A5": "_",
  "\u09A6": "`",
  "\u09A7": "a",
  "\u09A8": "b",
  "\u09AA": "c",
  "\u09AB": "d",
  "\u09AC": "e",
  "\u09AD": "f",
  "\u09AE": "g",
  "\u09AF": "h",
  "\u09B0": "i",
  "\u09B2": "j",
  "\u09B6": "k",
  "\u09B7": "l",
  "\u09B8": "m",
  "\u09B9": "n",
  "\u09DC": "o",
  "\u09DD": "p",
  "\u09DF": "q",
  "\u09CE": "r",
  "\u0982": "s",
  "\u0983": "t",
  "\u0981": "u",
  "\u09BE": "v",
  "\u09BF": "w",
  "\u09C0": "x",
  "\u09C1": "y",
  "\u09C2": "~",
  "\u09C3": "\u201E",
  "\u09C7": "\u2021",
  "\u09C8": "\u02C6",
  "\u09D7": "\u0160",
  "\u09CD": "&",
  "\u0964": "|",
  "\u0965": "\\\\",
  "\u09E6": "0",
  "\u09E7": "1",
  "\u09E8": "2",
  "\u09E9": "3",
  "\u09EA": "4",
  "\u09EB": "5",
  "\u09EC": "6",
  "\u09ED": "7",
  "\u09EE": "8",
  "\u09EF": "9",
};

const BN_CONS = "[\u0995-\u09B9\u09DC\u09DD\u09DF]";

function unicodeToBijoy(src: string): string {
  if (!src) return "";
  let text = src;

  // 1. Move Reph ('র্') right after the consonant/conjunct cluster (and mark with placeholder)
  const REPH = "\uE010";
  const rephPattern = new RegExp(`\u09B0\u09CD(${BN_CONS}(?:\u09CD${BN_CONS})*)`, "g");
  text = text.replace(rephPattern, `$1${REPH}`);

  // 2. Decompose compound vowel kars ো (\u09CB) and ৌ (\u09CC)
  text = text.replaceAll("\u09CB", "\u09C7\u09BE");
  text = text.replaceAll("\u09CC", "\u09C7\u09D7");

  // 3. Move pre-base vowels (ি \u09BF, ে \u09C7, ৈ \u09C8) before the preceding consonant/conjunct + Reph cluster
  const preKarRegex = new RegExp(
    `(${BN_CONS}(?:\u09CD${BN_CONS})*${REPH}?)([\u09BF\u09C7\u09C8])`,
    "g"
  );
  text = text.replace(preKarRegex, "$2$1");

  // 4. Replace conjuncts (longest-first)
  for (const [uniSeq, bijoySeq] of UNICODE_CONJUNCTS_TO_BIJOY) {
    text = text.replaceAll(uniSeq, bijoySeq);
  }

  // 5. Replace remaining single Unicode characters and Reph placeholder
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === REPH) {
      out += "\xA9"; // ©
    } else {
      out += UNICODE_CHARS_TO_BIJOY[ch] ?? ch;
    }
  }

  return out;
}

/**
 * Bidirectional Bengali Bijoy (SutonnyMJ) <-> Unicode converter.
 */
export function convertBengali(
  text: string,
  _font: string,
  direction: "toUnicode" | "fromUnicode"
): string {
  if (!text) return "";
  return direction === "toUnicode"
    ? convertBijoyToUnicode(text)
    : unicodeToBijoy(text);
}
