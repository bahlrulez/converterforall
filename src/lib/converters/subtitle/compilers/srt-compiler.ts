import { SubtitleFile } from '../types';
import { formatSrtTimestamp } from '../timestamp';

export function compileSrt(file: SubtitleFile): string {
  let output = '';
  let id = 1;

  for (const cue of file.cues) {
    if (cue.endMs <= cue.startMs) continue; // Skip invalid
    
    output += `${id++}\n`;
    output += `${formatSrtTimestamp(cue.startMs)} --> ${formatSrtTimestamp(cue.endMs)}\n`;
    output += `${cue.text}\n\n`;
  }

  return output.trim();
}
