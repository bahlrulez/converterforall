import { SubtitleFile } from '../types';
import { formatVttTimestamp } from '../timestamp';

export function compileVtt(file: SubtitleFile): string {
  let output = 'WEBVTT\n\n';
  
  if (file.metadata?.headers) {
    // Re-insert headers, skipping the WEBVTT part if it was already there
    for (const header of file.metadata.headers) {
      if (header !== 'WEBVTT') {
        output += `${header}\n`;
      }
    }
    if (file.metadata.headers.length > 1) {
      output += '\n';
    }
  }

  let id = 1;

  for (const cue of file.cues) {
    if (cue.endMs <= cue.startMs) continue; // Skip invalid
    
    // Optional: We can output IDs, but they are optional in VTT. Let's output sequential IDs for structure.
    output += `${id++}\n`;
    
    const settings = cue.settings ? ` ${cue.settings}` : '';
    output += `${formatVttTimestamp(cue.startMs)} --> ${formatVttTimestamp(cue.endMs)}${settings}\n`;
    output += `${cue.text}\n\n`;
  }

  return output.trim();
}
