import { SubtitleFile, SubtitleCue } from '../types';
import { parseTimestamp } from '../timestamp';

export function parseSrt(content: string): SubtitleFile {
  // Normalize line endings
  const text = content.replace(/\r\n/g, '\n').trim();
  const blocks = text.split(/\n{2,}/);
  
  const cues: SubtitleCue[] = [];
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 2) continue;
    
    // First line might be an ID or a timestamp if ID is missing
    let id = '';
    let timeLine = '';
    let textLines = [];
    
    if (lines[0].includes('-->')) {
      timeLine = lines[0];
      textLines = lines.slice(1);
    } else {
      id = lines[0].trim();
      timeLine = lines[1] || '';
      textLines = lines.slice(2);
    }
    
    if (!timeLine.includes('-->')) continue;
    
    const [startStr, endStr] = timeLine.split('-->').map(s => s.trim());
    const startMs = parseTimestamp(startStr);
    const endMs = parseTimestamp(endStr);
    
    cues.push({
      id,
      startMs,
      endMs,
      text: textLines.join('\n').trim()
    });
  }
  
  return {
    format: 'SRT',
    cues
  };
}
