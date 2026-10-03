import { StyleSettings } from './style-types';

export const FONT_OPTIONS = [
  { label: 'Poppins (Clean Pop)', value: '"Poppins", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif', files: ['poppins-latin-800-normal.woff2', 'poppins-devanagari-800-normal.woff2', 'NotoSansGurmukhi-Bold.woff2'] },
  { label: 'Baloo 2 (Playful)', value: '"Baloo 2", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif', files: ['baloo-2-latin-800-normal.woff2', 'baloo-2-devanagari-800-normal.woff2', 'NotoSansGurmukhi-Bold.woff2'] },
  { label: 'Mukta (Modern)', value: '"Mukta", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif', files: ['mukta-latin-800-normal.woff2', 'mukta-devanagari-800-normal.woff2', 'NotoSansGurmukhi-Bold.woff2'] },
  { label: 'Noto Sans (Clean)', value: '"Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif', files: ['NotoSansDevanagari-Bold.woff2', 'NotoSansGurmukhi-Bold.woff2'] },
  { label: 'Hind (Sleek)', value: '"Hind", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif', files: ['Hind-Bold.woff2', 'NotoSansDevanagari-Bold.woff2', 'NotoSansGurmukhi-Bold.woff2'] },
];

/**
 * 6 Curated Distinct Presets covering real-world video caption styles:
 * 1. Bold Social: High-energy TikTok / Reels / Shorts with clean punchy outline
 * 2. Classic Subtitle: Movie / broadcast standard with soft shadow and balanced stroke
 * 3. Cinematic: Lower-third documentary dark bar with sleek typography
 * 4. Glass Blur: Translucent frosted glass card with soft glow
 * 5. Box Highlight: High-contrast badge with active word highlight box
 * 6. Neon Glow: Cyberpunk / gaming dual-pass electric glow
 */
export const PRESETS: Record<string, StyleSettings> = {
  'Bold Social': {
    fontFamily: '"Poppins", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.068,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.014,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 0.01,
    shadowOffsetX: 0.003,
    shadowOffsetY: 0.003,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.2,
    activeWordColor: '#FFDE59',
    activeWordHighlight: undefined
  },
  'Classic Subtitle': {
    fontFamily: '"Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.055,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.007,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowBlur: 0.012,
    shadowOffsetX: 0.004,
    shadowOffsetY: 0.004,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0.02,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#FFDE59',
    activeWordHighlight: undefined
  },
  'Cinematic': {
    fontFamily: '"Hind", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.045,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.002,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 0.008,
    shadowOffsetX: 0,
    shadowOffsetY: 0.002,
    backgroundColor: '#000000',
    backgroundOpacity: 0.75,
    backgroundPadding: 0.022,
    backgroundRadius: 0.008,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#60A5FA', // Sky blue highlight
    activeWordHighlight: undefined
  },
  'Glass Blur': {
    fontFamily: '"Mukta", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.06,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 0.02,
    shadowOffsetX: 0,
    shadowOffsetY: 0.004,
    backgroundColor: '#0F172A',
    backgroundOpacity: 0.65,
    backgroundPadding: 0.025,
    backgroundRadius: 0.035,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#38BDF8', // Cyan highlight
    activeWordHighlight: undefined
  },
  'Box Highlight': {
    fontFamily: '"Baloo 2", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.06,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 0.015,
    shadowOffsetX: 0,
    shadowOffsetY: 0.004,
    backgroundColor: '#DC2626',
    backgroundOpacity: 0.9,
    backgroundPadding: 0.022,
    backgroundRadius: 0.02,
    textAlign: 'center',
    lineHeight: 1.35,
    activeWordColor: '#FEF08A',
    activeWordBackgroundColor: 'rgba(0,0,0,0.6)',
    activeWordHighlight: undefined
  },
  'Neon Glow': {
    fontFamily: '"Baloo 2", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.065,
    textColor: '#22C55E', // Electric Neon Green
    outlineColor: '#000000',
    outlineWidth: 0.004,
    shadowColor: '#22C55E',
    shadowBlur: 0.035,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.25,
    activeWordColor: '#FACC15', // Neon gold highlight
    activeWordHighlight: undefined
  },

  // Backward compatibility aliases for existing presets & localStorage
  'Clean Pop': {
    fontFamily: '"Poppins", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.068,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.014,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 0.01,
    shadowOffsetX: 0.003,
    shadowOffsetY: 0.003,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.2,
    activeWordColor: '#FFDE59'
  },
  'Classic': {
    fontFamily: '"Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.055,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.007,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowBlur: 0.012,
    shadowOffsetX: 0.004,
    shadowOffsetY: 0.004,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0.02,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#FFDE59'
  },
  'Lower Third': {
    fontFamily: '"Hind", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.045,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.002,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 0.008,
    shadowOffsetX: 0,
    shadowOffsetY: 0.002,
    backgroundColor: '#000000',
    backgroundOpacity: 0.75,
    backgroundPadding: 0.022,
    backgroundRadius: 0.008,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#60A5FA'
  },
  'Glass': {
    fontFamily: '"Mukta", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.06,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 0.02,
    shadowOffsetX: 0,
    shadowOffsetY: 0.004,
    backgroundColor: '#0F172A',
    backgroundOpacity: 0.65,
    backgroundPadding: 0.025,
    backgroundRadius: 0.035,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#38BDF8'
  },
  'Box': {
    fontFamily: '"Baloo 2", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.06,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 0.015,
    shadowOffsetX: 0,
    shadowOffsetY: 0.004,
    backgroundColor: '#DC2626',
    backgroundOpacity: 0.9,
    backgroundPadding: 0.022,
    backgroundRadius: 0.02,
    textAlign: 'center',
    lineHeight: 1.35,
    activeWordColor: '#FEF08A',
    activeWordBackgroundColor: 'rgba(0,0,0,0.6)'
  },
  'Neon': {
    fontFamily: '"Baloo 2", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.065,
    textColor: '#22C55E',
    outlineColor: '#000000',
    outlineWidth: 0.004,
    shadowColor: '#22C55E',
    shadowBlur: 0.035,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.25,
    activeWordColor: '#FACC15'
  },
  'Bold Reels': {
    fontFamily: '"Poppins", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.068,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.014,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 0.01,
    shadowOffsetX: 0.003,
    shadowOffsetY: 0.003,
    backgroundColor: '#000000',
    backgroundOpacity: 0,
    backgroundPadding: 0,
    backgroundRadius: 0,
    textAlign: 'center',
    lineHeight: 1.2,
    activeWordColor: '#FFDE59'
  },
  'Highlight': {
    fontFamily: '"Baloo 2", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.06,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 0.015,
    shadowOffsetX: 0,
    shadowOffsetY: 0.004,
    backgroundColor: '#DC2626',
    backgroundOpacity: 0.9,
    backgroundPadding: 0.022,
    backgroundRadius: 0.02,
    textAlign: 'center',
    lineHeight: 1.35,
    activeWordColor: '#FEF08A'
  },
  'Minimal': {
    fontFamily: '"Hind", "Noto Sans Devanagari", "Noto Sans Gurmukhi", sans-serif',
    fontSize: 0.045,
    textColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineWidth: 0.002,
    shadowColor: 'rgba(0,0,0,0.6)',
    shadowBlur: 0.008,
    shadowOffsetX: 0,
    shadowOffsetY: 0.002,
    backgroundColor: '#000000',
    backgroundOpacity: 0.75,
    backgroundPadding: 0.022,
    backgroundRadius: 0.008,
    textAlign: 'center',
    lineHeight: 1.3,
    activeWordColor: '#60A5FA'
  }
};

/**
 * Display list for the UI Presets selector
 */
export const CURATED_PRESET_NAMES = [
  'Bold Social',
  'Classic Subtitle',
  'Cinematic',
  'Glass Blur',
  'Box Highlight',
  'Neon Glow'
] as const;

/**
 * Deterministically applies a preset while preserving user's active-word highlight state.
 * Never mutates input objects.
 */
export function applyPreset(currentStyle: StyleSettings, presetName: string): StyleSettings {
  const preset = PRESETS[presetName];
  if (!preset) return { ...currentStyle };

  return {
    ...currentStyle,
    ...preset,
    // Preserve active word toggle state if explicitly toggled by user
    activeWordHighlight: currentStyle.activeWordHighlight !== undefined
      ? currentStyle.activeWordHighlight
      : preset.activeWordHighlight,
    // Use preset curated active word styling
    activeWordColor: preset.activeWordColor || currentStyle.activeWordColor || '#FFDE59',
    activeWordBackgroundColor: preset.activeWordBackgroundColor !== undefined
      ? preset.activeWordBackgroundColor
      : currentStyle.activeWordBackgroundColor
  };
}
