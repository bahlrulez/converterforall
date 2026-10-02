import { ASRWord, CaptionChunk, CaptionWord } from './types';

// Centralized Heuristics (Documented for tuning)
export const SEGMENTATION_CONFIG = {
  PAUSE_THRESHOLD_S: 0.4,       // 400ms pause indicates a natural break
  TARGET_CHARS: 30,             // Ideal visible characters per caption
  MAX_CHARS: 45,                // Hard limit for character length
  MIN_DURATION_S: 0.5,          // Minimum duration for a caption (unless bounded by silence)
  MAX_DURATION_S: 5.0,          // Maximum duration to prevent extremely long blocks
};

// Sentence-ending punctuation marks
const SENTENCE_ENDERS = new Set(['.', '?', '!', '।', '!', '?']);

// Determines if a word ends with a sentence boundary
function isSentenceBoundary(word: string): boolean {
  const lastChar = word.trim().slice(-1);
  return SENTENCE_ENDERS.has(lastChar);
}

// Punctuation-aware joiner
// Prevents spaces before certain punctuations, preserving natural language formatting.
function joinWords(words: CaptionWord[]): string {
  if (words.length === 0) return '';
  let result = words[0].word.trim();
  
  for (let i = 1; i < words.length; i++) {
    const currentWord = words[i].word.trim();
    // Some punctuation like "।" or "." might come back as separate words from some ASRs,
    // but typically Whisper attaches them to the word (e.g. "गए।"). 
    // If it is separate, avoid a leading space.
    if (/^[.,?!\u0964]/.test(currentWord)) {
      result += currentWord;
    } else {
      result += ' ' + currentWord;
    }
  }
  return result;
}

export function segmentCaptions(rawAsrWords: ASRWord[]): CaptionChunk[] {
  if (!rawAsrWords || rawAsrWords.length === 0) {
    return [];
  }

  // Sanitize: skip words with invalid timestamps
  const asrWords = rawAsrWords.filter(w => 
    typeof w.start === 'number' && !isNaN(w.start) &&
    typeof w.end === 'number' && !isNaN(w.end) &&
    w.start >= 0 && w.end >= w.start
  );

  if (asrWords.length === 0) {
    return [];
  }

  const chunks: CaptionChunk[] = [];
  let currentWords: CaptionWord[] = [];
  let chunkIndex = 0;

  for (let i = 0; i < asrWords.length; i++) {
    const current = asrWords[i];
    const next = i < asrWords.length - 1 ? asrWords[i + 1] : null;

    currentWords.push({
      word: current.word,
      start: current.start,
      end: current.end
    });

    const currentTextLength = joinWords(currentWords).length;
    const currentDuration = current.end - currentWords[0].start;

    // Conditions to break the segment
    let shouldBreak = false;

    // 1. Punctuation Boundary
    if (isSentenceBoundary(current.word)) {
      shouldBreak = true;
    }

    // 2. Natural Pause (Check gap to next word)
    if (next && (next.start - current.end) >= SEGMENTATION_CONFIG.PAUSE_THRESHOLD_S) {
      shouldBreak = true;
    }

    // 3. Length Constraints
    // If adding the NEXT word would exceed MAX_CHARS, we must break now.
    if (next) {
      const projectedLength = currentTextLength + 1 + next.word.trim().length;
      if (projectedLength > SEGMENTATION_CONFIG.MAX_CHARS) {
        shouldBreak = true;
      } else if (projectedLength >= SEGMENTATION_CONFIG.TARGET_CHARS) {
        // Soft break if we hit target characters and there's a minor pause or punctuation
        // Note: we already broke for punctuation above, but we can also prefer to break
        // if we have enough characters and some natural phrase end.
        if ((next.start - current.end) >= 0.15) {
          shouldBreak = true;
        }
      }
    }

    // 4. Max Duration Constraint
    if (next && (next.end - currentWords[0].start) > SEGMENTATION_CONFIG.MAX_DURATION_S) {
      shouldBreak = true;
    }

    // Never break if we are at the very end anyway, it gets pushed below.
    if (shouldBreak || !next) {
      chunks.push({
        id: `caption-${chunkIndex++}`,
        start: currentWords[0].start,
        end: currentWords[currentWords.length - 1].end,
        text: joinWords(currentWords),
        words: [...currentWords]
      });

      currentWords = [];
    }
  }

  return chunks;
}
