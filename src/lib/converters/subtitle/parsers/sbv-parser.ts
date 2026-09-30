import { SubtitleFile, SubtitleCue } from '../types';
import { parseTimestamp } from '../timestamp';

export function parseSbv(content: string): SubtitleFile {
  const text = content.replace(/\r\n/g, '\n').trim();
  const blocks = text.split(/\n{2,}/);
  
  const cues: SubtitleCue[] = [];
  let cueId = 1;
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 2) continue;
    
    const timeLine = lines[0];
    if (!timeLine.includes(',')) continue;
    
    // Some SBV variants might use other separators, but comma is standard YouTube SBV
    const [startStr, endStr] = timeLine.split(',').map(s => s.trim());
    const startMs = parseTimestamp(startStr);
    const endMs = parseTimestamp(endStr);
    const textLines = lines.slice(1);
    
    cues.push({
      id: String(cueId++),
      startMs,
      endMs,
      text: textLines.join('\n').trim()
    });
  }
  
  return {
    format: 'SBV',
    cues
  };
}
