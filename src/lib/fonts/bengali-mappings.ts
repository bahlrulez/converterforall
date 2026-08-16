// High-accuracy Bengali Bijoy (SutonnyMJ) <-> Unicode bidirectional converter
export function convertBengali(text: string, font: string, direction: 'toUnicode' | 'fromUnicode'): string {
  if (!text) return "";

  if (direction === 'toUnicode') {
    return bijoyToUnicode(text);
  } else {
    return unicodeToBijoy(text);
  }
}

function bijoyToUnicode(src: string): string {
  let text = src;

  // Conjuncts and special symbols in Bijoy SutonnyMJ
  const bijoyMap: [string, string][] = [
    ["&", "্"],
    ["1", "১"],
    ["2", "২"],
    ["3", "৩"],
    ["4", "৪"],
    ["5", "৫"],
    ["6", "৬"],
    ["7", "৭"],
    ["8", "৮"],
    ["9", "৯"],
    ["0", "০"],
    ["|", "।"],
    ["k", "ক"],
    ["K", "খ"],
    ["g", "গ"],
    ["G", "ঘ"],
    ["c", "চ"],
    ["C", "ছ"],
    ["j", "জ"],
    ["J", "ঝ"],
    ["t", "ট"],
    ["T", "ঠ"],
    ["d", "ড"],
    ["D", "ঢ"],
    ["N", "ণ"],
    ["Z", "য"],
    ["h", "হ"],
    ["m", "ম"],
    ["n", "ন"],
    ["p", "প"],
    ["P", "ফ"],
    ["b", "ব"],
    ["B", "ভ"],
    ["r", "র"],
    ["l", "ল"],
    ["s", "স"],
    ["S", "ষ"],
    ["x", "শ"],
    ["R", "ড়"],
    ["y", "য়"],
    ["a", "া"],
    ["i", "ি"],
    ["I", "ী"],
    ["u", "ু"],
    ["U", "ূ"],
    ["e", "ে"],
    ["E", "ৈ"],
    ["o", "ো"],
    ["O", "ৌ"],
    ["`", "ঁ"],
    ["~", "্"],
    ["A", "অ"],
    ["Av", "আ"],
    ["Bv", "ই"],
    ["C", "ঈ"],
    ["D", "উ"],
    ["E", "ঊ"],
    ["F", "ঋ"],
    ["G", "এ"],
    ["H", "ঐ"],
    ["I", "ও"],
    ["J", "ঔ"],
  ];

  // Reorder e-kar (ে) and i-kar (ি) which are typed before consonant in Bijoy
  // Regex to swap prefix vowels after consonants
  text = text.replace(/i([kKgGcCjJtTdDNZhmmnpPbBrlsSxRy])/g, "$1i");
  text = text.replace(/e([kKgGcCjJtTdDNZhmmnpPbBrlsSxRy])/g, "$1e");

  for (const [key, val] of bijoyMap) {
    text = text.split(key).join(val);
  }

  return text;
}

function unicodeToBijoy(src: string): string {
  let text = src;

  const reverseMap: [string, string][] = [
    ["।", "|"],
    ["১", "1"],
    ["২", "2"],
    ["৩", "3"],
    ["৪", "4"],
    ["৫", "5"],
    ["৬", "6"],
    ["৭", "7"],
    ["৮", "8"],
    ["৯", "9"],
    ["০", "0"],
    ["ক", "k"],
    ["খ", "K"],
    ["গ", "g"],
    ["ঘ", "G"],
    ["চ", "c"],
    ["ছ", "C"],
    ["জ", "j"],
    ["ঝ", "J"],
    ["ট", "t"],
    ["ঠ", "T"],
    ["ড", "d"],
    ["ঢ", "D"],
    ["ণ", "N"],
    ["য", "Z"],
    ["হ", "h"],
    ["ম", "m"],
    ["ন", "n"],
    ["প", "p"],
    ["ফ", "P"],
    ["ব", "b"],
    ["ভ", "B"],
    ["র", "r"],
    ["ল", "l"],
    ["স", "s"],
    ["ষ", "S"],
    ["শ", "x"],
    ["ড়", "R"],
    ["য়", "y"],
    ["া", "a"],
    ["ি", "i"],
    ["ী", "I"],
    ["ু", "u"],
    ["ূ", "U"],
    ["ে", "e"],
    ["ৈ", "E"],
    ["ো", "o"],
    ["ৌ", "O"],
    ["ঁ", "`"],
    ["্", "&"],
    ["অ", "A"],
    ["আ", "Av"],
    ["ই", "Bv"],
    ["ঈ", "C"],
    ["উ", "D"],
    ["ঊ", "E"],
    ["ঋ", "F"],
    ["এ", "G"],
    ["ঐ", "H"],
    ["ও", "I"],
    ["ঔ", "J"],
  ];

  // Reorder i-kar / e-kar before consonant for Bijoy layout
  text = text.replace(/([ক-হ](্[ক-হ])*)ি/g, "i$1");
  text = text.replace(/([ক-হ](্[ক-হ])*)ে/g, "e$1");

  for (const [key, val] of reverseMap) {
    text = text.split(key).join(val);
  }

  return text;
}
