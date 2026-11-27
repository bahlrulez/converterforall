import Rabbit from "rabbit-node";

/**
 * Bidirectional Myanmar Zawgyi <-> Unicode converter backed by the MIT-licensed
 * Rabbit conversion rule engine (handles medials, Kinzi, stacked pat-sint consonants,
 * vowel reordering, and alternate Zawgyi glyphs).
 */
export function convertBurmese(
  text: string,
  _font: string,
  direction: "toUnicode" | "fromUnicode"
): string {
  if (!text) return "";
  return direction === "toUnicode" ? Rabbit.zg2uni(text) : Rabbit.uni2zg(text);
}
