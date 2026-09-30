import { SubtitleFile, SubtitleCue } from '../types';
import { parseTimestamp } from '../timestamp';

export function parseVtt(content: string): SubtitleFile {
  const text = content.replace(/\r\n/g, '\n').trim();
  const blocks = text.split(/\n{2,}/);
  
  const cues: SubtitleCue[] = [];
  const metadata: { headers?: string[] } = { headers: [] };
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lines = block.split('\n');
    
    // First block is usually WEBVTT header
    if (i === 0 && lines[0].startsWith('WEBVTT')) {
      metadata.headers = lines;
      continue;
    }
    
    // VTT blocks can be comments
    if (lines[0].startsWith('NOTE')) {
      continue;
    }
    
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
    
    // Time line might have settings: "00:00:00.000 --> 00:00:01.000 align:middle"
    const [timeRange, ...settingsParts] = timeLine.split(/(?=\s[a-z]+:)/);
    const settings = settingsParts.join('').trim();
    
    const [startStr, endStr] = timeRange.split('-->').map(s => s.trim());
    const startMs = parseTimestamp(startStr);
    const endMs = parseTimestamp(endStr);
    
    cues.push({
      id,
      startMs,
      endMs,
      text: textLines.join('\n').trim(),
      ...(settings ? { settings } : {})
    });
  }
  
  return {
    format: 'VTT',
    cues,
    metadata
  };
}
