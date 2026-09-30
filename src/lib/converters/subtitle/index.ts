import { SubtitleFile, SubtitleFormat } from './types';
import { parseSrt } from './parsers/srt-parser';
import { parseVtt } from './parsers/vtt-parser';
import { parseSbv } from './parsers/sbv-parser';
import { parseAss } from './parsers/ass-parser';
import { compileSrt } from './compilers/srt-compiler';
import { compileVtt } from './compilers/vtt-compiler';
import { compileSbv } from './compilers/sbv-compiler';
import { detectSubtitleFormat } from './detect-format';

export * from './types';
export * from './subtitle-utils';
export { detectSubtitleFormat };
export { formatSrtTimestamp, formatVttTimestamp, formatSbvTimestamp } from './timestamp';

export function parseSubtitle(content: string, format: SubtitleFormat): SubtitleFile {
  switch (format) {
    case 'SRT': return parseSrt(content);
    case 'VTT': return parseVtt(content);
    case 'SBV': return parseSbv(content);
    case 'ASS': return parseAss(content);
    default: throw new Error(`Unsupported format for parsing: ${format}`);
  }
}

export function compileSubtitle(file: SubtitleFile, targetFormat: SubtitleFormat): string {
  switch (targetFormat) {
    case 'SRT': return compileSrt(file);
    case 'VTT': return compileVtt(file);
    case 'SBV': return compileSbv(file);
    default: throw new Error(`Unsupported format for compiling: ${targetFormat}`);
  }
}
