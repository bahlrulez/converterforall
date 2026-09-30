import { SubtitleFile } from '../types';
import { formatSbvTimestamp } from '../timestamp';

export function compileSbv(file: SubtitleFile): string {
  let output = '';

  for (const cue of file.cues) {
    if (cue.endMs <= cue.startMs) continue; // Skip invalid
    
    output += `${formatSbvTimestamp(cue.startMs)},${formatSbvTimestamp(cue.endMs)}\n`;
    output += `${cue.text}\n\n`;
  }

  return output.trim();
}
