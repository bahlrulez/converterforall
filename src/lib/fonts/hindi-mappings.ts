export interface FontMap {
  fromUnicode: [RegExp | string, string][];
  toUnicode: [RegExp | string, string][];
}

// Basic mappings for Hindi fonts
export const hindiMappings: Record<string, FontMap> = {
  krutidev: {
    fromUnicode: [
      [/क/g, "d"],
      [/ख/g, "[k"],
      [/ग/g, "x"],
      [/घ/g, "?k"],
      [/च/g, "p"],
      [/छ/g, "N"],
      [/ज/g, "t"],
      [/झ/g, ">"],
      [/ट/g, "V"],
      [/ठ/g, "B"],
      [/ड/g, "M"],
      [/ढ/g, "<"],
      [/ण/g, ".k"],
      [/त/g, "r"],
      [/थ/g, "Fk"],
      [/द/g, "n"],
      [/ध/g, "èk"],
      [/न/g, "u"],
      [/प/g, "i"],
      [/फ/g, "Q"],
      [/ब/g, "c"],
      [/भ/g, "Hk"],
      [/म/g, "e"],
      [/य/g, ";"],
      [/र/g, "j"],
      [/ल/g, "y"],
      [/व/g, "o"],
      [/श/g, "’k"],
      [/ष/g, "\"k"],
      [/स/g, "l"],
      [/ह/g, "g"],
      [/ा/g, "k"],
      [/ि/g, "f"],
      [/ी/g, "h"],
      [/ु/g, "q"],
      [/ू/g, "w"],
      [/े/g, "s"],
      [/ै/g, "S"],
      [/ो/g, "ks"],
      [/ौ/g, "kS"],
      [/ं/g, "a"],
      [/ँ/g, "¡"],
    ],
    toUnicode: [
      [/d/g, "क"],
      [/\[k/g, "ख"],
      [/x/g, "ग"],
      [/\?k/g, "घ"],
      [/p/g, "च"],
      [/N/g, "छ"],
      [/t/g, "ज"],
      [/>/g, "झ"],
      [/V/g, "ट"],
      [/B/g, "ठ"],
      [/M/g, "ड"],
      [/</g, "ढ"],
      [/\.k/g, "ण"],
      [/r/g, "त"],
      [/Fk/g, "थ"],
      [/n/g, "द"],
      [/èk/g, "ध"],
      [/u/g, "न"],
      [/i/g, "प"],
      [/Q/g, "फ"],
      [/c/g, "ब"],
      [/Hk/g, "भ"],
      [/e/g, "म"],
      [/;/g, "य"],
      [/j/g, "र"],
      [/y/g, "ल"],
      [/o/g, "व"],
      [/’k/g, "श"],
      [/\"k/g, "ष"],
      [/l/g, "स"],
      [/g/g, "ह"],
      [/k/g, "ा"],
      [/f/g, "ि"],
      [/h/g, "ी"],
      [/q/g, "ु"],
      [/w/g, "ू"],
      [/s/g, "े"],
      [/S/g, "ै"],
      [/ks/g, "ो"],
      [/kS/g, "ौ"],
      [/a/g, "ं"],
      [/¡/g, "ँ"],
    ],
  },
  devlys: {
    fromUnicode: [[/क/g, "d"]],
    toUnicode: [[/d/g, "क"]],
  },
  chanakya: {
    fromUnicode: [[/क/g, "d"]],
    toUnicode: [[/d/g, "क"]],
  },
  shusha: {
    fromUnicode: [[/क/g, "d"]],
    toUnicode: [[/d/g, "क"]],
  },
  aps: {
    fromUnicode: [[/क/g, "d"]],
    toUnicode: [[/d/g, "क"]],
  },
  shreelipi: {
    fromUnicode: [[/क/g, "d"]],
    toUnicode: [[/d/g, "क"]],
  }
};

import { krutidevToUnicode, unicodeToKrutidev } from './krutidev-converter';

export function convertHindi(text: string, font: string, direction: 'toUnicode' | 'fromUnicode'): string {
  if (!text) return '';
  
  if (font === 'krutidev' || font === 'Krutidev') {
    if (direction === 'toUnicode') {
      return krutidevToUnicode(text);
    } else {
      return unicodeToKrutidev(text);
    }
  }

  const map = hindiMappings[font];
  if (!map) return text;

  let result = text;
  const rules = map[direction];
  
  for (const [pattern, replacement] of rules) {
    if (pattern instanceof RegExp) {
      result = result.replace(pattern, replacement);
    } else {
      result = result.split(pattern).join(replacement);
    }
  }

  if (direction === 'toUnicode') {
    result = result.replace(/f([\u0900-\u097F])/g, "$1\u093F");
  } else if (direction === 'fromUnicode') {
    result = result.replace(/([\u0900-\u097F])\u093F/g, "f$1");
  }

  return result;
}