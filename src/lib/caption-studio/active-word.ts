import { CaptionWord } from './types';

/**
 * Determines the index of the currently spoken word from a CaptionWord array.
 * Rule: word.start <= currentTime < word.end
 * 
 * Safely handles:
 * - empty, null, or undefined array -> -1
 * - currentTime before first word -> -1
 * - currentTime after last word -> -1
 * - gaps between words -> -1
 * - invalid/negative/non-finite timestamps -> -1
 * - zero or negative word duration -> -1
 * 
 * Never mutates the input words array.
 */
export function getActiveWordIndex(
  words: CaptionWord[] | undefined | null,
  currentTime: number
): number {
  if (!words || !Array.isArray(words) || words.length === 0) {
    return -1;
  }

  if (!Number.isFinite(currentTime) || currentTime < 0) {
    return -1;
  }

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w) continue;

    const start = w.start;
    const end = w.end;

    // Validate timestamp sanity
    if (
      typeof start !== 'number' ||
      typeof end !== 'number' ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start < 0 ||
      end <= start
    ) {
      continue;
    }

    if (currentTime >= start && currentTime < end) {
      return i;
    }
  }

  return -1;
}
