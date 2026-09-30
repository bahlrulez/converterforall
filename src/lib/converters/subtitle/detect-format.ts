import { SubtitleFormat } from './types';

export function detectSubtitleFormat(content: string, filename?: string): SubtitleFormat | null {
  const text = content.trim();
  
  // 1. WEBVTT header -> VTT
  if (text.startsWith('WEBVTT')) {
    return 'VTT';
  }
  
  // 2. ASS/SSA structural signature -> ASS/SSA
  if (text.includes('[Script Info]') || text.includes('[V4+ Styles]')) {
    return 'ASS'; // We use ASS to refer to both ASS and SSA
  }
  
  // 3. SRT timestamp signature -> SRT
  // Look for: 00:00:00,000 --> 00:00:00,000
  if (/\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/.test(text)) {
    return 'SRT';
  }
  
  // 4. SBV timestamp signature -> SBV
  // Look for: 0:00:00.000,0:00:00.000
  if (/\d:\d{2}:\d{2}\.\d{3},\d:\d{2}:\d{2}\.\d{3}/.test(text)) {
    return 'SBV';
  }
  
  // 5. VTT without header but with VTT-style timestamps (rare but possible fallback)
  if (/\d{2}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}\.\d{3}/.test(text)) {
    return 'VTT';
  }

  // Fallback to extension if we couldn't detect from content securely
  if (filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'srt') return 'SRT';
    if (ext === 'vtt') return 'VTT';
    if (ext === 'sbv') return 'SBV';
    if (ext === 'ass' || ext === 'ssa') return 'ASS';
  }

  return null; // Could not detect
}
