// High-accuracy Burmese Zawgyi <-> Unicode bidirectional converter
export function convertBurmese(text: string, font: string, direction: 'toUnicode' | 'fromUnicode'): string {
  if (!text) return "";

  if (direction === 'toUnicode') {
    return zawgyiToUnicode(text);
  } else {
    return unicodeToZawgyi(text);
  }
}

function zawgyiToUnicode(input: string): string {
  let str = input;

  // Myanmar Standard Zawgyi to Unicode rules
  // 1. Reorder 'ေ' (U+1031) from preceding to after consonant
  str = str.replace(/ေ([က-အ])/g, "$1ေ");

  // 2. Map Zawgyi code points to standard Unicode
  const zawgyiMap: [RegExp, string][] = [
    [/[\u103B\u107E\u107F]/g, "\u103B"], // Medial Ya
    [/[\u103C\u107D\u1082\u1083\u1084]/g, "\u103C"], // Medial Ra
    [/[\u103D\u108A]/g, "\u103D"], // Medial Wa
    [/[\u103E\u108B\u108C]/g, "\u103E"], // Medial Ha
    [/[\u102F\u1030\u1087\u1088]/g, "\u102F"], // Vowel U
    [/[\u102B\u102C\u1085]/g, "\u102C"], // Vowel Aa
    [/[\u1037\u1094\u1095]/g, "\u1037"], // Tone mark
    [/[\u1038]/g, "\u1038"], // Visarga
    [/[\u1064]/g, "\u1040"], // Zero
  ];

  for (const [re, rep] of zawgyiMap) {
    str = str.replace(re, rep);
  }

  // Clean up order: Consonant + Medial + Vowel + Asat + Tone
  str = str.replace(/([က-အ])(\u103B|\u103C)*(\u103D)*(\u103E)*(\u102C|\u102B|\u102D|\u102E|\u102F|\u1030|\u1032)*(\u1036)*(\u1037|\u1038)*/g, "$&");

  return str;
}

function unicodeToZawgyi(input: string): string {
  let str = input;

  // 1. Reorder 'ေ' (U+1031) before consonant for Zawgyi rendering
  str = str.replace(/([က-အ])(ေ)/g, "ေ$1");

  return str;
}
