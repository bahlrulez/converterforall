/**
 * Exact code constants for Batch 1 Font Converter examples and snapshot verifications.
 * Prevents string escaping corruption, lost backticks, or divergence between test and rendered page.
 */
export const KRUTIDEV_SNAPSHOT_DATA = {
  naturalOfficeInput: "d`i;k ;g i= è;ku ls i<+sa vkSj viuk fooj.k le; ij HkstsaA",
  htmlEscapedInput: "d&#96;i;k ;g i= è;ku ls i&lt;+sa vkSj viuk fooj.k le; ij HkstsaA",
  expectedUnicode: "कृपया यह पत्र ध्यान से पढ़ें और अपना विवरण समय पर भेजें।",
  shortHindiInput: "d`i;k",
  shortHindiHtml: "d&#96;i;k",
  devlysInput: "Hkkjr gekjk ns'k gSA",
  devlysUnicode: "भारत हमारा देश है।",
  helloInput: "Hello World",
  helloUnicode: "भ्मससव ॅवतसक",
  dateInput: "01/01/2026",
  dateUnicode: "01ध्01ध्2026",
  smartQuotesInput: "‘Hkkjr’ “ns’k”",
  smartQuotesUnicode: "‘भारत’ “दे’ा”",
} as const;

export const UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA = {
  unicodeInput: "कृपया यह पत्र ध्यान से पढ़ें और अपना विवरण समय पर भेजें।",
  krutiOutput: "—i;k ;g i= /;ku ls i<+sa vkSj viuk fooj.k le; ij HkstsaA",
  htmlEscapedKruti: "—i;k ;g i= /;ku ls i&lt;+sa vkSj viuk fooj.k le; ij HkstsaA",
} as const;

// Chanakya example constants removed pending verified sample text from site owner
