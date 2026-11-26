/**
 * Checks whether a Whisper transcription is a degenerate repetition loop
 * or wrong-script hallucination (such as Windows WebGPU fp16 glitches emitting
 * repeated Devanagari tokens for English audio).
 */
export interface DegenerateCheckResult {
  isDegenerate: boolean;
  reason?: string;
}

export function detectDegenerateTranscription(
  text: string,
  language?: string
): DegenerateCheckResult {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return { isDegenerate: false };
  }

  const normalizedWords = trimmed
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase())
    .filter(Boolean);

  if (normalizedWords.length === 0) {
    return { isDegenerate: false };
  }

  // 1. Consecutive identical-word run (e.g., "लिया लिया लिया लिया")
  let runCount = 1;
  for (let i = 1; i < normalizedWords.length; i++) {
    if (normalizedWords[i] === normalizedWords[i - 1]) {
      runCount++;
      if (runCount >= 4) {
        return {
          isDegenerate: true,
          reason: `Consecutive word repetition detected ("${normalizedWords[i]}" repeated ${runCount} times).`,
        };
      }
    } else {
      runCount = 1;
    }
  }

  // 2. Single-word frequency dominance across multi-word output
  if (normalizedWords.length >= 6) {
    const counts = new Map<string, number>();
    let topWord = "";
    let topCount = 0;
    for (const w of normalizedWords) {
      const next = (counts.get(w) || 0) + 1;
      counts.set(w, next);
      if (next > topCount) {
        topCount = next;
        topWord = w;
      }
    }
    if (topCount / normalizedWords.length >= 0.6) {
      return {
        isDegenerate: true,
        reason: `Single token "${topWord}" dominated ${topCount}/${normalizedWords.length} words.`,
      };
    }
  }

  // 3. Repeated short phrase / extreme low diversity
  if (normalizedWords.length >= 8) {
    const uniqueCount = new Set(normalizedWords).size;
    if (uniqueCount / normalizedWords.length < 0.25) {
      return {
        isDegenerate: true,
        reason: `Low lexical diversity (${uniqueCount} unique tokens out of ${normalizedWords.length}).`,
      };
    }
  }

  // 4. Script mismatch guard: English mode should not output purely non-Latin script
  if (language === "en" && normalizedWords.length >= 4) {
    const hasLatinLetters = /[A-Za-z]/.test(trimmed);
    const nonLatinLetters = (trimmed.match(/[\p{L}]/gu) || []).length;
    if (!hasLatinLetters && nonLatinLetters >= 4) {
      return {
        isDegenerate: true,
        reason: "Detected non-Latin script tokens while English transcription was selected.",
      };
    }
  }

  return { isDegenerate: false };
}
