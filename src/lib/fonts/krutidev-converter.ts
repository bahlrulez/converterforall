// Kruti Dev to Unicode converter
// Ported from krutidevC.js

export function krutidevToUnicode(text: string): string {
  if (!text) return "";

  const array_one = [
    "ñ", "Q+Z", "sas", "aa", ")Z", "ZZ", "'", "'", "\"", "\"",
    "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹",
    "¶+", "d+", "[+k", "[+", "x+", "T+", "t+", "M+", "<+", "Q+", ";+", "j+", "u+",
    "Ùk", "Ù", "ä", "–", "—", "é", "™", "=kk", "f=k",
    "à", "á", "â", "ã", "ºz", "º", "í", "{k", "{", "=", "«",
    "Nî", "Vî", "Bî", "Mî", "<î", "|", "K", "}",
    "J", "Vª", "Mª", "<ªª", "Nª", "Ø", "Ý", "nzZ", "æ", "ç", "Á", "xz", "#", ":",
    "v‚", "vks", "vkS", "vk", "v", "b±", "Ã", "bZ", "b", "m", "Å", ",s", ",", "_",
    "ô", "d", "Dk", "D", "[k", "[", "x", "Xk", "X", "Ä", "?k", "?", "³",
    "pkS", "p", "Pk", "P", "N", "t", "Tk", "T", ">", "÷", "¥",
    "ê", "ë", "V", "B", "ì", "ï", "M+", "<+", "M", "<", ".k", ".",
    "r", "Rk", "R", "Fk", "F", ")", "n", "/k", "èk", "/", "Ë", "è", "u", "Uk", "U",
    "i", "Ik", "I", "Q", "¶", "c", "Ck", "C", "Hk", "H", "e", "Ek", "E",
    ";", "¸", "j", "y", "Yk", "Y", "G", "o", "Ok", "O",
    "'k", "'", "\"k", "\"", "l", "Lk", "L", "g",
    "È", "z",
    "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Ö", "Ø", "Ù", "Ük", "Ü",
    "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
    "a", "¡", "%", "W", "•", "·", "∙", "·", "~j", "~", "\\", "+", " ः",
    "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "&", "Œ", "]", "~ ", "@"
  ];

  const array_two = [
    "॰", "QZ+", "sa", "a", "र्द्ध", "Z", "\"", "\"", "'", "'",
    "०", "१", "२", "३", "४", "५", "६", "७", "८", "९",
    "फ़्", "क़", "ख़", "ख़्", "ग़", "ज़्", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
    "त्त", "त्त्", "क्त", "दृ", "कृ", "न्न", "न्न्", "=k", "f=",
    "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष", "क्ष्", "त्र", "त्र्",
    "छ्य", "ट्य", "ठ्य", "ड्य", "ढ्य", "द्य", "ज्ञ", "द्व",
    "श्र", "ट्र", "ड्र", "ढ्र", "छ्र", "क्र", "फ्र", "र्द्र", "द्र", "प्र", "प्र", "ग्र", "रु", "रू",
    "ऑ", "ओ", "औ", "आ", "अ", "ईं", "ई", "ई", "इ", "उ", "ऊ", "ऐ", "ए", "ऋ",
    "क्क", "क", "क", "क्", "ख", "ख्", "ग", "ग", "ग्", "घ", "घ", "घ्", "ङ",
    "चै", "च", "च", "च्", "छ", "ज", "ज", "ज्", "झ", "झ्", "ञ",
    "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड़", "ढ़", "ड", "ढ", "ण", "ण्",
    "त", "त", "त्", "थ", "थ्", "द्ध", "द", "ध", "ध", "ध्", "ध्", "ध्", "न", "न", "न्",
    "प", "प", "प्", "फ", "फ्", "ब", "ब", "ब्", "भ", "भ्", "म", "म", "म्",
    "य", "य्", "र", "ल", "ल", "ल्", "ळ", "व", "व", "व्",
    "श", "श्", "ष", "ष्", "स", "स", "स्", "ह",
    "ीं", "्र",
    "द्द", "ट्ट", "ट्ठ", "ड्ड", "कृ", "भ", "्य", "ड्ढ", "झ्", "क्र", "त्त्", "श", "श्",
    "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
    "ं", "ँ", "ः", "ॅ", "ऽ", "ऽ", "ऽ", "ऽ", "्र", "्", "?", "़", ":",
    "'", "'", "\"", "\"", ";", "(", ")", "{", "}", "=", "।", ".", "-", "µ", "॰", ",", "् ", "/"
  ];

  let modified_substring = text;

  // Replace array_one elements with array_two elements
  for (let i = 0; i < array_one.length; i++) {
    const pattern = new RegExp(escapeRegExp(array_one[i]), 'g');
    modified_substring = modified_substring.replace(pattern, array_two[i]);
  }

  // Special glyph replacements
  modified_substring = modified_substring.replace(/±/g, "Zं");
  modified_substring = modified_substring.replace(/Æ/g, "र्f");

  // Fix position of 'f' (choti i ki matra)
  let position_of_i = modified_substring.indexOf("f");
  while (position_of_i !== -1) {
    const character_next_to_i = modified_substring.charAt(position_of_i + 1);
    if (character_next_to_i) {
      const character_to_be_replaced = "f" + character_next_to_i;
      modified_substring = modified_substring.replace(character_to_be_replaced, character_next_to_i + "ि");
    }
    position_of_i = modified_substring.indexOf("f", position_of_i + 1);
  }

  // Fix 'fa' (िं)
  modified_substring = modified_substring.replace(/Ç/g, "fa");
  modified_substring = modified_substring.replace(/É/g, "र्fa");

  position_of_i = modified_substring.indexOf("fa");
  while (position_of_i !== -1) {
    const character_next_to_ip2 = modified_substring.charAt(position_of_i + 2);
    if (character_next_to_ip2) {
      const character_to_be_replaced = "fa" + character_next_to_ip2;
      modified_substring = modified_substring.replace(character_to_be_replaced, character_next_to_ip2 + "िं");
    }
    position_of_i = modified_substring.indexOf("fa", position_of_i + 2);
  }

  // Fix 'h' (ी)
  modified_substring = modified_substring.replace(/Ê/g, "ीZ");

  // Eliminate wrong 'ि्'
  let position_of_wrong_ee = modified_substring.indexOf("ि्");
  while (position_of_wrong_ee !== -1) {
    const consonant_next_to_wrong_ee = modified_substring.charAt(position_of_wrong_ee + 2);
    if (consonant_next_to_wrong_ee) {
      const character_to_be_replaced = "ि्" + consonant_next_to_wrong_ee;
      modified_substring = modified_substring.replace(character_to_be_replaced, "्" + consonant_next_to_wrong_ee + "ि");
    }
    position_of_wrong_ee = modified_substring.indexOf("ि्", position_of_wrong_ee + 2);
  }

  // Handle reph (Z)
  const set_of_matras = "अ आ इ ई उ ऊ ए ऐ ओ औ ा ि ी ु ू ृ े ै ो ौ ं : ँ ॅ";
  let position_of_R = modified_substring.indexOf("Z");
  
  while (position_of_R > 0) {
    let probable_position_of_half_r = position_of_R - 1;
    let character_at_probable_position_of_half_r = modified_substring.charAt(probable_position_of_half_r);

    while (set_of_matras.includes(character_at_probable_position_of_half_r) && probable_position_of_half_r >= 0) {
      probable_position_of_half_r--;
      character_at_probable_position_of_half_r = modified_substring.charAt(probable_position_of_half_r);
    }

    if (probable_position_of_half_r >= 0) {
      const substring_to_be_replaced = modified_substring.substring(probable_position_of_half_r, position_of_R + 1);
      const replace_with = "र्" + modified_substring.substring(probable_position_of_half_r, position_of_R);
      modified_substring = modified_substring.replace(substring_to_be_replaced, replace_with);
    }

    position_of_R = modified_substring.indexOf("Z", position_of_R + 1);
  }

  return modified_substring;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function unicodeToKrutidev(text: string): string {
  if (!text) return "";

  let modified_substring = text;

  // Add spaces at the end to avoid undefined chars
  modified_substring += '  ';

  // Handle ि (choti i ki matra) - move it before the consonant
  let position_of_f = modified_substring.indexOf("ि");
  while (position_of_f !== -1) {
    const character_left_to_f = modified_substring.charAt(position_of_f - 1);
    modified_substring = modified_substring.replace(character_left_to_f + "ि", "f" + character_left_to_f);
    
    position_of_f = position_of_f - 1;
    
    // Handle conjuncts (move ि before entire conjunct)
    while (modified_substring.charAt(position_of_f - 1) === "्" && position_of_f !== 0) {
      const string_to_be_replaced = modified_substring.charAt(position_of_f - 2) + "्";
      modified_substring = modified_substring.replace(string_to_be_replaced + "f", "f" + string_to_be_replaced);
      position_of_f = position_of_f - 2;
    }
    
    position_of_f = modified_substring.indexOf("ि", position_of_f + 1);
  }

  // Handle र् (reph) - move it to after the consonant+matras
  const set_of_matras = "ािीुूृेैोौं:ँॅ";
  let position_of_half_R = modified_substring.indexOf("र्");
  
  while (position_of_half_R > 0) {
    let probable_position_of_Z = position_of_half_R + 2;
    let character_right_to_probable_position_of_Z = modified_substring.charAt(probable_position_of_Z + 1);
    
    // Find non-matra position right to probable_position_of_Z
    while (set_of_matras.indexOf(character_right_to_probable_position_of_Z) !== -1) {
      probable_position_of_Z = probable_position_of_Z + 1;
      character_right_to_probable_position_of_Z = modified_substring.charAt(probable_position_of_Z + 1);
    }
    
    const string_to_be_replaced = modified_substring.substring(
      position_of_half_R + 2,
      probable_position_of_Z + 1
    );
    modified_substring = modified_substring.replace(
      "र्" + string_to_be_replaced,
      string_to_be_replaced + "Z"
    );
    position_of_half_R = modified_substring.indexOf("र्");
  }

  // Remove the added spaces
  modified_substring = modified_substring.substring(0, modified_substring.length - 2);

  // Reverse mapping arrays
  const array_one = [
    "'", "'", '"', '"', "(", ")", "{", "}", "=", "।", "?", "-", "µ", "॰", ",", ".", "् ",
    "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "x",
    "फ़्", "क़", "ख़", "ग़", "ज़्", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
    "त्त्", "त्त", "क्त", "दृ", "कृ",
    "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष्", "क्ष", "त्र्", "त्र", "ज्ञ",
    "छ्य", "ट्य", "ठ्य", "ड्य", "ढ्य", "द्य", "द्व",
    "श्र", "ट्र", "ड्र", "ढ्र", "छ्र", "क्र", "फ्र", "द्र", "प्र", "ग्र", "रु", "रू",
    "Z",
    "ओ", "औ", "आ", "अ", "ई", "इ", "उ", "ऊ", "ऐ", "ए", "ऋ",
    "क्", "क", "क्क", "ख्", "ख", "ग्", "ग", "घ्", "घ", "ङ",
    "चै", "च्", "च", "छ", "ज्", "ज", "झ्", "झ", "ञ",
    "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड", "ढ", "ण्", "ण",
    "त्", "त", "थ्", "थ", "द्ध", "द", "ध्", "ध", "न्", "न",
    "प्", "प", "फ्", "फ", "ब्", "ब", "भ्", "भ", "म्", "म",
    "य्", "य", "र", "ल्", "ल", "ळ", "व्", "व",
    "श्", "श", "ष्", "ष", "स्", "स", "ह",
    "ऑ", "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
    "ं", "ँ", "ः", "ॅ", "ऽ", "् ", "्"
  ];

  const array_two = [
    "^", "*", 'Þ', 'ß', "¼", "½", "¿", "À", "¾", "A", "\\", "&", "&", "Œ", "]", "-", "~ ",
    "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹", "Û",
    "¶", "d", "[k", "x", "T", "t", "M+", "<+", "Q", ";", "j", "u",
    "Ù", "Ùk", "ä", "–", "—",
    "à", "á", "â", "ã", "ºz", "º", "í", "{", "{k", "«", "=", "K",
    "Nî", "Vî", "Bî", "Mî", "<î", "|", "}",
    "J", "Vª", "Mª", "<ªª", "Nª", "Ø", "Ý", "æ", "ç", "xz", "#", ":",
    "Z",
    "vks", "vkS", "vk", "v", "bZ", "b", "m", "Å", ",s", ",", "_",
    "D", "d", "ô", "[", "[k", "X", "x", "?", "?k", "³",
    "pkS", "P", "p", "N", "T", "t", "÷", ">", "¥",
    "ê", "ë", "V", "B", "ì", "ï", "M", "<", ".", ".k",
    "R", "r", "F", "Fk", ")", "n", "/", "/k", "U", "u",
    "I", "i", "¶", "Q", "C", "c", "H", "Hk", "E", "e",
    "¸", ";", "j", "Y", "y", "G", "O", "o",
    "'", "'k", "\"", "\"k", "L", "l", "g",
    "v‚", "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
    "a", "¡", "%", "W", "·", "~ ", "~"
  ];

  // Replace array elements
  for (let i = 0; i < array_one.length; i++) {
    if (array_one[i]) {
      let idx = 0;
      while (idx !== -1) {
        modified_substring = modified_substring.replace(array_one[i], array_two[i]);
        idx = modified_substring.indexOf(array_one[i]);
      }
    }
  }

  return modified_substring;
}
