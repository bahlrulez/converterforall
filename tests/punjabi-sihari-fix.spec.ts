import { test, expect } from "@playwright/test";
import { convertPunjabi } from "../src/lib/fonts/punjabi-mappings";

test.describe("Punjabi Consecutive Sihari & Gurmukhi Engine Fix", () => {
  const realWordsCorpus = [
    { label: "Consecutive Sihari (ਵਿਦਿਆਰਥੀ)", word: "ਵਿਦਿਆਰਥੀ" },
    { label: "Initial vowel + Sihari (ਇਤਿਹਾਸ)", word: "ਇਤਿਹਾਸ" },
    { label: "Consecutive Sihari (ਵਿਗਿਆਨ)", word: "ਵਿਗਿਆਨ" },
    { label: "Consecutive Sihari with Bihari (ਕਿਰਿਆ)", word: "ਕਿਰਿਆ" },
    { label: "Tippi + Bihari (ਪੰਜਾਬੀ)", word: "ਪੰਜਾਬੀ" },
    { label: "Single Sihari + Pairin Rara (ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ)", word: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" },
    { label: "Single Sihari + Addak (ਸਿੱਖਿਆ)", word: "ਸਿੱਖਿਆ" },
    { label: "Pairin Rara + Sihari (ਪ੍ਰਿਥਵੀ)", word: "ਪ੍ਰਿਥਵੀ" },
    { label: "Pairin Rara + Consecutive Sihari (ਪ੍ਰਿਥਿਵੀ)", word: "ਪ੍ਰਿਥਿਵੀ" },
    { label: "Single Sihari (ਕਿਤਾਬ)", word: "ਕਿਤਾਬ" },
    { label: "Bindi + Tippi + Addak (ਮਿੱਤਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ)", word: "ਮਿੱਤਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ" },
    { label: "Pairin Vava + Haha (ਸ੍ਵੈਮਾਣ ਅਤੇ ਪੜ੍ਹਾਈ)", word: "ਸ੍ਵੈਮਾਣ ਅਤੇ ਪੜ੍ਹਾਈ" },
  ];

  const punjabiFonts = ["asees", "anmollipi", "satluj", "joy"] as const;

  test("1. Bidirectional roundtrip for consecutive Sihari, single Sihari, Bindi/Tippi, Addak, and Pairin across Asees, AnmolLipi, Satluj, and Joy", () => {
    for (const font of punjabiFonts) {
      for (const item of realWordsCorpus) {
        const legacy = convertPunjabi(item.word, font, "fromUnicode");
        expect(legacy.length, `${font}: legacy output should not be empty for ${item.word}`).toBeGreaterThan(0);

        const decoded = convertPunjabi(legacy, font, "toUnicode");
        expect(
          decoded,
          `${font}: failed ${item.label} (legacy=${JSON.stringify(legacy)})`
        ).toBe(item.word);
      }
    }
  });

  test("2. Legacy consecutive Sihari inputs decode to proper Gurmukhi without doubled Sihari matra", () => {
    // AnmolLipi consecutive Sihari legacy strings
    expect(convertPunjabi("ividAwrQI", "anmollipi", "toUnicode")).toBe("ਵਿਦਿਆਰਥੀ");
    expect(convertPunjabi("ivigAwn", "anmollipi", "toUnicode")).toBe("ਵਿਗਿਆਨ");
    expect(convertPunjabi("ieiqhws", "anmollipi", "toUnicode")).toBe("ਇਤਿਹਾਸ");
    expect(convertPunjabi("ikirAw", "anmollipi", "toUnicode")).toBe("ਕਿਰਿਆ");

    // Asees consecutive Sihari legacy strings
    expect(convertPunjabi("ftfdnkoEh", "asees", "toUnicode")).toBe("ਵਿਦਿਆਰਥੀ");
    expect(convertPunjabi("ftfrnkB", "asees", "toUnicode")).toBe("ਵਿਗਿਆਨ");

    // Verify no doubled Sihari U+0A3F U+0A3F artifact exists anywhere
    for (const font of punjabiFonts) {
      for (const word of ["ਵਿਦਿਆਰਥੀ", "ਵਿਗਿਆਨ", "ਕਿਰਿਆ", "ਇਤਿਹਾਸ", "ਪ੍ਰਿਥਿਵੀ"]) {
        const encoded = convertPunjabi(word, font, "fromUnicode");
        const decoded = convertPunjabi(encoded, font, "toUnicode");
        expect(decoded).not.toContain("\u0A3F\u0A3F");
      }
    }
  });
});
