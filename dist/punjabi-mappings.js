"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.punjabiMappings = void 0;
exports.convertPunjabi = convertPunjabi;
exports.punjabiMappings = {
    anmollipi: {
        fromUnicode: [
            [/ਆ/g, "A"],
            [/ਅ/g, "a"],
            [/ਇ/g, "e"],
            [/ਸ/g, "s"],
            [/ਹ/g, "h"],
            [/ਕ/g, "k"],
            [/ਖ/g, "K"],
            [/ਗ/g, "g"],
            [/ਘ/g, "G"],
            [/ਙ/g, "|"],
            [/ਚ/g, "c"],
            [/ਛ/g, "C"],
            [/ਜ/g, "j"],
            [/ਝ/g, "J"],
            [/ਞ/g, "\\"],
            [/ਟ/g, "t"],
            [/ਠ/g, "T"],
            [/ਡ/g, "d"],
            [/ਢ/g, "D"],
            [/ਣ/g, "x"],
            [/ਤ/g, "q"],
            [/ਥ/g, "Q"],
            [/ਦ/g, "d"],
            [/ਧ/g, "D"],
            [/ਨ/g, "n"],
            [/ਪ/g, "p"],
            [/ਫ/g, "P"],
            [/ਬ/g, "b"],
            [/ਭ/g, "B"],
            [/ਮ/g, "m"],
            [/ਯ/g, "y"],
            [/ਰ/g, "r"],
            [/ਲ/g, "l"],
            [/ਵ/g, "v"],
            [/ੜ/g, "V"],
            [/ਾ/g, "w"],
            [/ਿ/g, "i"],
            [/ੀ/g, "I"],
            [/ੁ/g, "u"],
            [/ੂ/g, "U"],
            [/ੇ/g, "e"],
            [/ੈ/g, "E"],
            [/ੋ/g, "o"],
            [/ੌ/g, "O"],
            [/ੰ/g, "M"],
            [/ੱ/g, "~"],
            [/ਏ/g, "ey"],
            [/੍/g, "@"],
            [/ਂ/g, "N"],
            [/ਸ਼/g, "S"],
            [/ਈ/g, "eI"],
            [/਼/g, "\u00e6"],
            [/ਖ਼/g, "^"],
            [/ਗ਼/g, "Z"],
            [/ਜ਼/g, "z"],
            [/ਫ਼/g, "&"],
            [/ਲ਼/g, "L"],
        ],
        toUnicode: [
            [/ey/g, "ਏ"],
            [/eI/g, "ਈ"],
            [/A/g, "ਆ"],
            [/a/g, "ਅ"],
            [/e/g, "ਇ"],
            [/s/g, "ਸ"],
            [/h/g, "ਹ"],
            [/k/g, "ਕ"],
            [/K/g, "ਖ"],
            [/g/g, "ਗ"],
            [/G/g, "ਘ"],
            [/\|/g, "ਙ"],
            [/c/g, "ਚ"],
            [/C/g, "ਛ"],
            [/j/g, "ਜ"],
            [/J/g, "ਝ"],
            [/\\/g, "ਞ"],
            [/t/g, "ਟ"],
            [/T/g, "ਠ"],
            [/d/g, "ਦ"],
            [/D/g, "ਧ"],
            [/x/g, "ਣ"],
            [/q/g, "ਤ"],
            [/Q/g, "ਥ"],
            [/n/g, "ਨ"],
            [/p/g, "ਪ"],
            [/P/g, "ਫ"],
            [/b/g, "ਬ"],
            [/B/g, "ਭ"],
            [/m/g, "ਮ"],
            [/y/g, "ਯ"],
            [/r/g, "ਰ"],
            [/l/g, "ਲ"],
            [/v/g, "ਵ"],
            [/V/g, "ੜ"],
            [/w/g, "ਾ"],
            [/i/g, "ਿ"],
            [/I/g, "ੀ"],
            [/u/g, "ੁ"],
            [/U/g, "ੂ"],
            [/o/g, "ੋ"],
            [/O/g, "ੌ"],
            [/M/g, "ੰ"],
            [/~/g, "ੱ"],
            [/@/g, "੍"],
            [/N/g, "ਂ"],
            [/S/g, "ਸ਼"],
            [/\u00e6/g, "਼"],
            [/\^/g, "ਖ਼"],
            [/Z/g, "ਗ਼"],
            [/z/g, "ਜ਼"],
            [/&/g, "ਫ਼"],
            [/L/g, "ਲ਼"],
        ],
    },
    asees: {
        fromUnicode: [[/ਸ/g, "s"] /* Simplified */],
        toUnicode: [[/s/g, "ਸ"] /* Simplified */],
    },
    joy: {
        fromUnicode: [[/ਸ/g, "s"]],
        toUnicode: [[/s/g, "ਸ"]],
    },
    satluj: {
        fromUnicode: [[/ਸ/g, "s"]],
        toUnicode: [[/s/g, "ਸ"]],
    },
    "gurbani-akhar": {
        fromUnicode: [[/ਸ/g, "s"]],
        toUnicode: [[/s/g, "ਸ"]],
    },
    raavi: {
        fromUnicode: [],
        toUnicode: [],
    },
    shahmukhi: {
        fromUnicode: [
            [/ਸ/g, "س"],
            [/ਹ/g, "ہ"],
            [/ਕ/g, "ک"],
            [/ਖ/g, "کھ"],
            [/ਗ/g, "گ"],
            [/ਮ/g, "م"],
            [/ਨ/g, "ن"],
            [/ਰ/g, "ر"],
            [/ਲ/g, "ل"],
            [/ਪ/g, "پ"],
        ],
        toUnicode: [
            [/س/g, "ਸ"],
            [/ہ/g, "ਹ"],
            [/ک/g, "ਕ"],
            [/کھ/g, "ਖ"],
            [/گ/g, "ਗ"],
            [/م/g, "ਮ"],
            [/ن/g, "ਨ"],
            [/ر/g, "ਰ"],
            [/ل/g, "ਲ"],
            [/پ/g, "ਪ"],
        ],
    }
};
var punjabi_engine_1 = require("./punjabi-engine");
var fontNameMap = {
    anmollipi: 'AnmolLipi',
    asees: 'Asees',
    joy: 'Joy',
    gurbanilipi: 'GurbaniLipi',
    unicode: 'Unicode'
};
function convertPunjabi(text, font, direction) {
    if (!text)
        return '';
    var mappedFontName = fontNameMap[font];
    if (mappedFontName) {
        if (direction === 'toUnicode') {
            return punjabi_engine_1.PunjabiFontConvertor.convert(text, 'Unicode', mappedFontName);
        }
        else {
            return punjabi_engine_1.PunjabiFontConvertor.convert(text, mappedFontName, 'Unicode');
        }
    }
    // Fallback for Shahmukhi and others
    var map = exports.punjabiMappings[font];
    if (!map)
        return text;
    var result = text;
    var rules = map[direction];
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var _a = rules_1[_i], pattern = _a[0], replacement = _a[1];
        if (pattern instanceof RegExp) {
            result = result.replace(pattern, replacement);
        }
        else {
            result = result.split(pattern).join(replacement);
        }
    }
    if (direction === 'toUnicode' && font !== 'shahmukhi') {
        result = result.replace(/i([ਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵੜਸ਼ਖ਼ਗ਼ਜ਼ੜਫ਼])/g, "$1ਿ");
    }
    else if (direction === 'fromUnicode' && font !== 'shahmukhi') {
        result = result.replace(/([ਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵੜਸ਼ਖ਼ਗ਼ਜ਼ੜਫ਼])ਿ/g, "i$1");
    }
    return result;
}
