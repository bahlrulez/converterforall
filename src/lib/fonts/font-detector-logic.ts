export interface FontDetectionResult {
  font: string;
  isUnicode: boolean;
  language?: string;
  score?: number;
}

export function detectFont(text: string): FontDetectionResult {
  if (!text || text.trim() === '') {
    return { font: 'Unknown', isUnicode: false, score: 0 };
  }

  // 1. Check for Gurmukhi Unicode Range (0A00-0A7F)
  const hasGurmukhiUnicode = /[\u0A00-\u0A7F]/.test(text);
  if (hasGurmukhiUnicode) {
    return { font: 'Unicode (Gurmukhi)', isUnicode: true, language: 'Punjabi', score: 100 };
  }

  // 2. Check for Devanagari Unicode Range (0900-097F)
  const hasDevanagariUnicode = /[\u0900-\u097F]/.test(text);
  if (hasDevanagariUnicode) {
    return { font: 'Unicode (Devanagari)', isUnicode: true, language: 'Hindi', score: 100 };
  }

  // Heuristic Scoring for Legacy Fonts
  let krutiScore = 0;
  let chanakyaScore = 0;
  let aseesScore = 0;
  let anmolLipiScore = 0;

  // Kruti Dev specific clusters & characters
  // High frequency characters: 'd', 'p', 'j', 'f', 'k', 'y', 's', 'h'
  // Special extended characters: 'ç', 'Ý', 'æ', 'Ì', 'ð', 'Õ'
  const krutiHighFreq = (text.match(/[dpjfkyhuvxce]/g) || []).length;
  const krutiSpecial = (text.match(/[çÝæÌðÕ]/g) || []).length;
  krutiScore += (krutiHighFreq * 1) + (krutiSpecial * 5);

  // Walkman-Chanakya specific clusters & characters
  // High frequency mapping difference from Kruti: 'Z', 'b', 'c', 'd', 'e', 'w'
  // Chanakya has unique ascii diacritics mapping
  const chanakyaHighFreq = (text.match(/[Zbcdefw]/g) || []).length;
  const chanakyaUnique = (text.match(/[\{\}\[\]\~\`]/g) || []).length;
  chanakyaScore += (chanakyaHighFreq * 1) + (chanakyaUnique * 3);

  // Asees / Joy specific clusters (Punjabi)
  // Punjabi Asees commonly has 'dÃk', 'ih', 'iB', '¿'
  const aseesHighFreq = (text.match(/[dÃk\¿ihB]/g) || []).length;
  const aseesSpecial = (text.match(/dÃk|ih|iB/g) || []).length;
  aseesScore += (aseesHighFreq * 1) + (aseesSpecial * 5);

  // AnmolLipi specific clusters (Punjabi)
  const anmolHighFreq = (text.match(/[Asdfghjklieo]/g) || []).length;
  anmolLipiScore += (anmolHighFreq * 1);

  const totalLength = text.length || 1;
  
  // Normalize scores to a percentage 0-100 (approximate confidence)
  // We divide by text length and multiply by a factor, capped at 98.
  const krutiConfidence = Math.min(Math.round((krutiScore / totalLength) * 50), 98);
  const chanakyaConfidence = Math.min(Math.round((chanakyaScore / totalLength) * 50), 98);
  const aseesConfidence = Math.min(Math.round((aseesScore / totalLength) * 50), 98);
  const anmolLipiConfidence = Math.min(Math.round((anmolLipiScore / totalLength) * 50), 98);

  // If text contains common English words, reduce confidence for legacy fonts
  const hasEnglishWords = /\b(the|and|for|with|this|that|from|have|are|you)\b/i.test(text);
  const penalty = hasEnglishWords ? 50 : 0;

  const scores = [
    { font: 'Kruti Dev 010', language: 'Hindi', score: krutiConfidence - penalty },
    { font: 'Walkman-Chanakya', language: 'Hindi', score: chanakyaConfidence - penalty },
    { font: 'Asees', language: 'Punjabi', score: aseesConfidence - penalty },
    { font: 'AnmolLipi', language: 'Punjabi', score: anmolLipiConfidence - penalty }
  ];

  scores.sort((a, b) => b.score - a.score);
  const bestMatch = scores[0];

  if (bestMatch.score > 20) {
    return { font: bestMatch.font, isUnicode: false, language: bestMatch.language, score: Math.max(20, bestMatch.score) };
  }

  return { font: 'Unknown', isUnicode: false, score: 0 };
}
