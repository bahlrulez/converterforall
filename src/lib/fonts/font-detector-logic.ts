export function detectFont(text: string): { font: string; isUnicode: boolean; language?: string } {
  if (!text || text.trim() === '') {
    return { font: 'Unknown', isUnicode: false };
  }

  // Check for Gurmukhi Unicode Range (0A00-0A7F)
  const hasGurmukhiUnicode = /[\u0A00-\u0A7F]/.test(text);
  if (hasGurmukhiUnicode) {
    return { font: 'Unicode', isUnicode: true, language: 'Punjabi' };
  }

  // Check for Devanagari Unicode Range (0900-097F)
  const hasDevanagariUnicode = /[\u0900-\u097F]/.test(text);
  if (hasDevanagariUnicode) {
    return { font: 'Unicode', isUnicode: true, language: 'Hindi' };
  }

  // Heuristics for Kruti Dev (Hindi)
  // Kruti Dev uses specific ASCII mappings. 'd' is 'क', 'p' is 'च', 'j' is 'र', 'f' is 'ि'
  if (/[dpjfy]/.test(text) && !/[a-zA-Z]{5,}/.test(text)) {
    // A simplistic heuristic: if it has these chars but doesn't look like English words
    return { font: 'Kruti Dev 010', isUnicode: false, language: 'Hindi' };
  }

  // Heuristics for AnmolLipi (Punjabi)
  // 'A' is 'ਆ', 'a' is 'ਅ', 's' is 'ਸ'
  if (/[Aas]/.test(text) && !/[a-zA-Z]{5,}/.test(text)) {
    return { font: 'AnmolLipi', isUnicode: false, language: 'Punjabi' };
  }

  return { font: 'Unknown', isUnicode: false };
}
