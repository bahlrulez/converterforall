import { CaptionChunk } from './types';

/**
 * Formats seconds into standard SubRip (SRT) timestamp format: HH:MM:SS,mmm
 */
export function formatSrtTimestamp(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    seconds = 0;
  }

  const totalMilliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((totalMilliseconds % 60_000) / 1000);
  const millis = totalMilliseconds % 1000;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  const mmm = String(millis).padStart(3, '0');

  return `${hh}:${mm}:${ss},${mmm}`;
}

/**
 * Formats seconds into WebVTT timestamp format: HH:MM:SS.mmm
 */
export function formatVttTimestamp(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    seconds = 0;
  }

  const totalMilliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((totalMilliseconds % 60_000) / 1000);
  const millis = totalMilliseconds % 1000;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  const mmm = String(millis).padStart(3, '0');

  return `${hh}:${mm}:${ss}.${mmm}`;
}

/**
 * Sanitizes a caption chunk's text for subtitle formatting.
 * Preserves internal line breaks, cleans up trailing/leading whitespace and carriage returns.
 */
function cleanCaptionText(text: string): string {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * Generates valid SubRip (SRT) format from CaptionChunk array.
 * Filters out empty captions, assigns sequential cue numbers, and guarantees valid timings.
 */
export function generateSrt(captions: CaptionChunk[]): string {
  if (!captions || captions.length === 0) {
    return '';
  }

  const validCues = captions
    .map(c => {
      const cleaned = cleanCaptionText(c.text);
      if (!cleaned) return null;

      let start = Number.isFinite(c.start) ? Math.max(0, c.start) : 0;
      let end = Number.isFinite(c.end) ? Math.max(0, c.end) : start + 1;

      // Guarantee positive duration of at least 100ms
      if (end <= start) {
        end = start + 0.1;
      }

      return { start, end, text: cleaned };
    })
    .filter((cue): cue is { start: number; end: number; text: string } => cue !== null);

  if (validCues.length === 0) {
    return '';
  }

  // Sort by start time to guarantee sequential cue ordering
  validCues.sort((a, b) => a.start - b.start);

  return validCues
    .map((cue, index) => {
      const cueNumber = index + 1;
      const startTime = formatSrtTimestamp(cue.start);
      const endTime = formatSrtTimestamp(cue.end);
      return `${cueNumber}\n${startTime} --> ${endTime}\n${cue.text}`;
    })
    .join('\n\n') + '\n';
}

/**
 * Generates valid WebVTT format from CaptionChunk array.
 * Includes WEBVTT header and sequential cue structures.
 */
export function generateVtt(captions: CaptionChunk[]): string {
  if (!captions || captions.length === 0) {
    return 'WEBVTT\n\n';
  }

  const validCues = captions
    .map(c => {
      const cleaned = cleanCaptionText(c.text);
      if (!cleaned) return null;

      let start = Number.isFinite(c.start) ? Math.max(0, c.start) : 0;
      let end = Number.isFinite(c.end) ? Math.max(0, c.end) : start + 1;

      if (end <= start) {
        end = start + 0.1;
      }

      return { start, end, text: cleaned };
    })
    .filter((cue): cue is { start: number; end: number; text: string } => cue !== null);

  if (validCues.length === 0) {
    return 'WEBVTT\n\n';
  }

  validCues.sort((a, b) => a.start - b.start);

  const cuesContent = validCues
    .map((cue, index) => {
      const cueNumber = index + 1;
      const startTime = formatVttTimestamp(cue.start);
      const endTime = formatVttTimestamp(cue.end);
      return `${cueNumber}\n${startTime} --> ${endTime}\n${cue.text}`;
    })
    .join('\n\n');

  return `WEBVTT\n\n${cuesContent}\n`;
}

/**
 * Cleans video filename to create safe subtitle filename.
 */
export function getSubtitleFilename(videoFilename: string, extension: 'srt' | 'vtt'): string {
  if (!videoFilename || typeof videoFilename !== 'string') {
    return `captions.${extension}`;
  }

  // Remove existing extension
  const base = videoFilename.replace(/\.[^/.]+$/, '');
  // Sanitize illegal filename characters
  const safeBase = base
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 100);

  return `${safeBase || 'captions'}.${extension}`;
}

/**
 * Downloads a subtitle file with UTF-8 BOM to ensure full compatibility
 * with text editors and video players handling Indic/Devanagari scripts.
 */
export function downloadSubtitleFile(content: string, filename: string, mimeType: 'text/srt' | 'text/vtt' | 'text/plain'): void {
  if (!content || !content.trim()) {
    throw new Error('Cannot export empty subtitle file. Please ensure captions have text.');
  }

  // UTF-8 BOM (\uFEFF) ensures Windows Notepad, media players, and NLEs parse Unicode/Devanagari correctly
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
