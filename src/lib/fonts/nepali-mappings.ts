// High-accuracy Nepali Preeti <-> Unicode bidirectional converter
export function convertNepali(text: string, font: string, direction: 'toUnicode' | 'fromUnicode'): string {
  if (!text) return "";

  if (direction === 'toUnicode') {
    return preetiToUnicode(text);
  } else {
    return unicodeToPreeti(text);
  }
}

function preetiToUnicode(input: string): string {
  let str = input;

  // Multi-character replacements
  const multiMap: [string, string][] = [
    ["qm", "र्फ"],
    ["km", "र्फ"],
    ["em", "र्म"],
    ["|", "।"],
    ["1", "१"],
    ["2", "२"],
    ["3", "३"],
    ["4", "४"],
    ["5", "५"],
    ["6", "६"],
    ["7", "७"],
    ["8", "८"],
    ["9", "९"],
    ["0", "०"],
    ["˜", "्"],
    ["q", "त्र"],
    ["w", "ध"],
    ["e", "भ"],
    ["r", "च"],
    ["t", "त"],
    ["y", "थ"],
    ["u", "ग"],
    ["i", "ष"],
    ["o", "य"],
    ["p", "उ"],
    ["a", "ब"],
    ["s", "क"],
    ["d", "म"],
    ["f", "ा"],
    ["g", "न"],
    ["h", "ज"],
    ["j", "व"],
    ["k", "प"],
    ["l", "ि"],
    [";", "स"],
    ["'", "ु"],
    ["z", "श"],
    ["x", "ह"],
    ["c", "अ"],
    ["v", "ख"],
    ["b", "द"],
    ["n", "ल"],
    ["m", "फ"],
    [",", "र"],
    [".", "े"],
    ["/", "र"],
    ["Q", "त्त"],
    ["W", "द्ध"],
    ["E", "भ्"],
    ["R", "च्"],
    ["T", "त्"],
    ["Y", "थ्"],
    ["U", "ग्"],
    ["I", "क्ष्"],
    ["O", "इ"],
    ["P", "ए"],
    ["A", "ब्"],
    ["S", "क्"],
    ["D", "म्"],
    ["F", "ाँ"],
    ["G", "न्"],
    ["H", "ज्"],
    ["J", "व्"],
    ["K", "प्"],
    ["L", "ी"],
    [":", "स्"],
    ['"', "ू"],
    ["Z", "श्"],
    ["X", "ह्"],
    ["C", "ऋ"],
    ["V", "ख्"],
    ["B", "द्"],
    ["N", "ल्"],
    ["M", "फ्"],
    ["<", "ँ"],
    [">", "ै"],
    ["?", "रु"],
    ["~", "्"],
    ["`", "ञ"],
    ["!", "ज्ञ"],
    ["@", "द्द"],
    ["#", "घ"],
    ["$", "द्ध"],
    ["%", "छ"],
    ["^", "ट"],
    ["&", "ठ"],
    ["*", "ड"],
    ["(", "ढ"],
    [")", "ण"],
    ["_", "ः"],
    ["+", "ं"],
    ["{", "ओ"],
    ["}", "औ"],
  ];

  for (const [key, val] of multiMap) {
    str = str.split(key).join(val);
  }

  // Post-fix 'ि' (chhoti i) position reordering: 'l' comes before consonant in Preeti, after in Unicode
  // Regex to move trailing 'ि' after the consonant
  str = str.replace(/ि([क-ह](्[क-ह])*)/g, "$1ि");
  // Fix reph (र्)
  str = str.replace(/([क-ह](्[क-ह])*)([ािीुूेैोौँं]*)\{/g, "र्$1$3");

  return str;
}

function unicodeToPreeti(input: string): string {
  let str = input;

  // Pre-process: move 'ि' before the consonant
  str = str.replace(/([क-ह](्[क-ह])*)ि/g, "l$1");

  const reverseMap: [string, string][] = [
    ["।", "|"],
    ["१", "1"],
    ["२", "2"],
    ["३", "3"],
    ["४", "4"],
    ["५", "5"],
    ["६", "6"],
    ["७", "7"],
    ["८", "8"],
    ["९", "9"],
    ["०", "0"],
    ["त्र", "q"],
    ["ध", "w"],
    ["भ", "e"],
    ["च", "r"],
    ["त", "t"],
    ["थ", "y"],
    ["ग", "u"],
    ["ष", "i"],
    ["य", "o"],
    ["उ", "p"],
    ["ब", "a"],
    ["क", "s"],
    ["म", "d"],
    ["ा", "f"],
    ["न", "g"],
    ["ज", "h"],
    ["व", "j"],
    ["प", "k"],
    ["स", ";"],
    ["ु", "'"],
    ["श", "z"],
    ["ह", "x"],
    ["अ", "c"],
    ["ख", "v"],
    ["द", "b"],
    ["ल", "n"],
    ["फ", "m"],
    ["र", "/"],
    ["े", "."],
    ["ै", ">"],
    ["ी", "L"],
    ["ू", '"'],
    ["ं", "+"],
    ["ँ", "<"],
    ["ः", "_"],
    ["ज्ञ", "!"],
    ["घ", "#"],
    ["छ", "%"],
    ["ट", "^"],
    ["ठ", "&"],
    ["ड", "*"],
    ["ढ", "("],
    ["ण", ")"],
    ["इ", "O"],
    ["ए", "P"],
    ["ऋ", "C"],
    ["ओ", "c]"],
    ["औ", "c}"],
    ["रु", "?"],
  ];

  for (const [key, val] of reverseMap) {
    str = str.split(key).join(val);
  }

  return str;
}
