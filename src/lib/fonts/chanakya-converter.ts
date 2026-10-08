// Chanakya to Unicode & Unicode to Chanakya converter
// Features full ligature, matra (Chhoti ee), and Reph positioning

const array_one = [
  "ñ", "Q+Z", "sas", "aa", ")Z", "ZZ", "‘", "’", "“", "”",
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
  "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "&", "Œ", "]", "~ ", "@",
  // Specific Chanakya glyphs (often identical or close to Kruti Dev, mapped defensively)
  "ाे", "ाै", "ंा",
  "्ा"
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
  "'", "'", "\"", "\"", ";", "(", ")", "{", "}", "=", "।", ".", "-", "µ", "॰", ",", "् ", "/",
  "ो", "ौ", "ां",
  ""
];

export function chanakyaToUnicode(text: string): string {
  if (!text) return "";
  
  let modifiedString = text;
  
  // Replace array mappings
  for (let input_symbol_idx = 0; input_symbol_idx < array_one.length; input_symbol_idx++) {
    const pattern = array_one[input_symbol_idx];
    const replacement = array_two[input_symbol_idx];
    modifiedString = modifiedString.split(pattern).join(replacement);
  }
  
  // Position "f" (Chhoti ee matra)
  let position_of_i = modifiedString.indexOf("f");
  while (position_of_i !== -1) {
    const charecter_next_to_i = modifiedString.charAt(position_of_i + 1);
    const charecter_to_be_replaced = "f" + charecter_next_to_i;
    modifiedString = modifiedString.replace(charecter_to_be_replaced, charecter_next_to_i + "ि");
    position_of_i = modifiedString.search(/f/);
  }
  
  // Position "्" (halant) when combined with Chhoti ee
  modifiedString = modifiedString.replace(/([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([्])([ि])/g, "$1$3$2");
  modifiedString = modifiedString.replace(/([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([्])([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([ि])/g, "$1$2$3$4");
  
  // Position "Z" (Reph)
  let position_of_Z = modifiedString.indexOf("Z");
  while (position_of_Z !== -1) {
    let probable_position_of_half_r = position_of_Z - 1;
    let charecter_at_probable_position_of_half_r = modifiedString.charAt(probable_position_of_half_r);
    
    // Matras logic
    while (
      charecter_at_probable_position_of_half_r != undefined && 
      charecter_at_probable_position_of_half_r.match(/[\u0900-\u097F]/) &&
      !charecter_at_probable_position_of_half_r.match(/[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]/) 
    ) {
      probable_position_of_half_r = probable_position_of_half_r - 1;
      charecter_at_probable_position_of_half_r = modifiedString.charAt(probable_position_of_half_r);
    }
    
    // Half letters logic
    let charecter_to_left = modifiedString.charAt(probable_position_of_half_r - 1);
    if (charecter_to_left !== undefined && charecter_to_left === "्") {
      probable_position_of_half_r = probable_position_of_half_r - 2;
    }
    
    let string_to_be_replaced = modifiedString.substr(probable_position_of_half_r, (position_of_Z - probable_position_of_half_r));
    modifiedString = modifiedString.replace(string_to_be_replaced + "Z", "र्" + string_to_be_replaced);
    position_of_Z = modifiedString.indexOf("Z");
  }
  
  return modifiedString;
}

export function unicodeToChanakya(text: string): string {
  if (!text) return "";
  
  let modifiedString = text;
  
  // Position Reph
  modifiedString = modifiedString.replace(/र्([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([ािीुूृेैोौंँः]*)/g, "$1$2Z");
  modifiedString = modifiedString.replace(/र्([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([्])([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([ािीुूृेैोौंँः]*)/g, "$1$2$3$4Z");
  
  // Position Chhoti ee
  modifiedString = modifiedString.replace(/([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([्])([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([ि])/g, "f$1$2$3");
  modifiedString = modifiedString.replace(/([कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह])([ि])/g, "f$1");
  
  // Reverse mapping
  for (let idx = 0; idx < array_two.length; idx++) {
    const pattern = array_two[idx];
    const replacement = array_one[idx];
    if (pattern !== "") {
       modifiedString = modifiedString.split(pattern).join(replacement);
    }
  }
  
  // Final cleanup
  modifiedString = modifiedString.replace(/f([d\[x\?pNt>VBcM<y\.ruF\èkniQcHje;jo\’k\"klg])/g, "f$1");
  
  return modifiedString;
}
