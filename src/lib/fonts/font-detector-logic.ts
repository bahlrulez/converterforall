export function detectFont(text: string): { font: string; isUnicode: boolean; language?: string } {
  if (!text || text.trim() === '') {
    return { font: 'Unknown', isUnicode: false };
  }

  // 1. Check for Gurmukhi Unicode Range (0A00-0A7F)
  const hasGurmukhiUnicode = /[\u0A00-\u0A7F]/.test(text);
  if (hasGurmukhiUnicode) {
    return { font: 'Unicode (Gurmukhi)', isUnicode: true, language: 'Punjabi' };
  }

  // 2. Check for Devanagari Unicode Range (0900-097F)
  const hasDevanagariUnicode = /[\u0900-\u097F]/.test(text);
  if (hasDevanagariUnicode) {
    return { font: 'Unicode (Devanagari)', isUnicode: true, language: 'Hindi' };
  }

  // 3. Heuristics for Kruti Dev / DevLys (Hindi Legacy)
  // Kruti Dev uses standard ASCII letters to represent Hindi glyphs:
  // 'd' (क), 'p' (च), 'j' (र), 'f' (ि), 'k' (ा), 'h' (ी), 'y' (ल), 'u' (न), 's' (े), 'v' (अ), 'x' (ग), 'c' (ब), 'e' (म)
  const krutiDevMatches = (text.match(/[dpjfkyshuvxce]/g) || []).length;
  const totalAlpha = (text.match(/[a-zA-Z]/g) || []).length;
  
  if (totalAlpha > 0 && krutiDevMatches / totalAlpha > 0.45 && !/\b(the|and|for|with|this|that|from|have|are|you)\b/i.test(text)) {
    return { font: 'Kruti Dev 010', isUnicode: false, language: 'Hindi' };
  }

  // 4. Heuristics for AnmolLipi (Punjabi Legacy)
  // 'A' (ਆ), 'a' (ਅ), 's' (ਸ), 'd' (ਦ), 'f' (ਡ), 'g' (ਗ), 'h' (ਹ), 'j' (ਜ), 'k' (ਕ), 'l' (ਲ)
  const anmolLipiMatches = (text.match(/[Asdfghjklieo]/g) || []).length;
  if (totalAlpha > 0 && anmolLipiMatches / totalAlpha > 0.45 && !/\b(the|and|for|with|this|that|from|have|are|you)\b/i.test(text)) {
    return { font: 'AnmolLipi', isUnicode: false, language: 'Punjabi' };
  }

  // Fallback heuristic if it contains typical non-English ascii clusters
  if (/[dpjfy]/.test(text) && !/[a-zA-Z]{6,}/.test(text)) {
    return { font: 'Kruti Dev 010', isUnicode: false, language: 'Hindi' };
  }

  return { font: 'Unknown', isUnicode: false };
}
