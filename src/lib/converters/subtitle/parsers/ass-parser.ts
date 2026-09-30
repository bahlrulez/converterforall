import { SubtitleFile, SubtitleCue } from '../types';
import { parseTimestamp } from '../timestamp';

export function parseAss(content: string): SubtitleFile {
  const text = content.replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  
  const cues: SubtitleCue[] = [];
  let cueId = 1;
  let inEvents = false;
  
  // Default indices if Format line is missing
  let startIndex = 1;
  let endIndex = 2;
  let textIndex = 9;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('[')) {
      inEvents = trimmed === '[Events]';
      continue;
    }
    
    if (!inEvents) continue;
    
    if (trimmed.startsWith('Format:')) {
      const formatString = trimmed.substring(7).trim();
      const fields = formatString.split(',').map(s => s.trim().toLowerCase());
      startIndex = fields.indexOf('start');
      endIndex = fields.indexOf('end');
      textIndex = fields.indexOf('text');
      continue;
    }
    
    if (trimmed.startsWith('Dialogue:')) {
      // "Dialogue: " is 10 chars. Then the comma-separated data.
      const dataString = trimmed.substring(trimmed.indexOf(':') + 1).trim();
      // Text can contain commas, so we only split up to the textIndex
      const parts = dataString.split(',');
      
      if (parts.length <= textIndex) continue; // Malformed
      
      // Re-join anything from textIndex onwards as the actual text
      const textContent = parts.slice(textIndex).join(',');
      
      const startMs = parseTimestamp(parts[startIndex]?.trim() || '');
      const endMs = parseTimestamp(parts[endIndex]?.trim() || '');
      
      // ASS uses \N for newlines
      const normalizedText = textContent.replace(/\\N/g, '\n').replace(/\\n/g, '\n');
      
      cues.push({
        id: String(cueId++),
        startMs,
        endMs,
        text: normalizedText
      });
    }
  }
  
  return {
    format: 'ASS',
    cues
  };
}
