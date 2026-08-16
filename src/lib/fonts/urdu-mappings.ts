// High-accuracy Urdu InPage <-> Unicode bidirectional converter
export function convertUrdu(text: string, font: string, direction: 'toUnicode' | 'fromUnicode'): string {
  if (!text) return "";

  if (direction === 'toUnicode') {
    return inpageToUnicode(text);
  } else {
    return unicodeToInpage(text);
  }
}

function inpageToUnicode(input: string): string {
  let str = input;

  const map: [string, string][] = [
    ["a", "ا"],
    ["b", "ب"],
    ["p", "پ"],
    ["t", "ت"],
    ["T", "ٹ"],
    ["c", "ث"],
    ["j", "ج"],
    ["C", "چ"],
    ["h", "ح"],
    ["K", "خ"],
    ["d", "د"],
    ["D", "ڈ"],
    ["z", "ذ"],
    ["r", "ر"],
    ["R", "ڑ"],
    ["Z", "ز"],
    ["X", "ژ"],
    ["s", "س"],
    ["S", "ش"],
    ["x", "ص"],
    ["J", "ض"],
    ["v", "ط"],
    ["V", "ظ"],
    ["e", "ع"],
    ["G", "غ"],
    ["f", "ف"],
    ["q", "ق"],
    ["k", "ک"],
    ["g", "گ"],
    ["l", "ل"],
    ["m", "م"],
    ["n", "ن"],
    ["N", "ں"],
    ["w", "و"],
    ["H", "ہ"],
    ["o", "ھ"],
    ["u", "ء"],
    ["y", "ی"],
    ["Y", "ے"],
    ["A", "آ"],
    ["i", "ِ"],
    ["U", "ُ"],
    ["I", "ً"],
    ["E", "ٍ"],
    ["O", "ٌ"],
    ["W", "ّ"],
    ["?", "؟"],
    [",", "،"],
    [";", "؛"],
    ["1", "۱"],
    ["2", "۲"],
    ["3", "۳"],
    ["4", "۴"],
    ["5", "۵"],
    ["6", "۶"],
    ["7", "۷"],
    ["8", "۸"],
    ["9", "۹"],
    ["0", "۰"],
  ];

  for (const [k, v] of map) {
    str = str.split(k).join(v);
  }

  return str;
}

function unicodeToInpage(input: string): string {
  let str = input;

  const reverseMap: [string, string][] = [
    ["آ", "A"],
    ["ا", "a"],
    ["ب", "b"],
    ["پ", "p"],
    ["ت", "t"],
    ["ٹ", "T"],
    ["ث", "c"],
    ["ج", "j"],
    ["چ", "C"],
    ["ح", "h"],
    ["خ", "K"],
    ["د", "d"],
    ["ڈ", "D"],
    ["ذ", "z"],
    ["ر", "r"],
    ["ڑ", "R"],
    ["ز", "Z"],
    ["ژ", "X"],
    ["س", "s"],
    ["ش", "S"],
    ["ص", "x"],
    ["ض", "J"],
    ["ط", "v"],
    ["ظ", "V"],
    ["ع", "e"],
    ["غ", "G"],
    ["ف", "f"],
    ["ق", "q"],
    ["ک", "k"],
    ["گ", "g"],
    ["ل", "l"],
    ["م", "m"],
    ["ن", "n"],
    ["ں", "N"],
    ["و", "w"],
    ["ہ", "H"],
    ["ھ", "o"],
    ["ء", "u"],
    ["ی", "y"],
    ["ے", "Y"],
    ["؟", "?"],
    ["،", ","],
    ["؛", ";"],
    ["۱", "1"],
    ["۲", "2"],
    ["۳", "3"],
    ["۴", "4"],
    ["۵", "5"],
    ["۶", "6"],
    ["۷", "7"],
    ["۸", "8"],
    ["۹", "9"],
    ["۰", "0"],
  ];

  for (const [k, v] of reverseMap) {
    str = str.split(k).join(v);
  }

  return str;
}
