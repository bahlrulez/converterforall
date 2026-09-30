export type SubtitleFormat = 'SRT' | 'VTT' | 'SBV' | 'ASS';

export interface SubtitleCue {
  id: string;        // E.g., '1' for SRT, optional string for VTT
  startMs: number;
  endMs: number;
  text: string;      // The actual dialogue (normalized to \n)
  settings?: string; // Additional settings (e.g., VTT alignment)
}

export interface SubtitleMetadata {
  headers?: string[]; // E.g., VTT region definitions, ASS script info
}

export interface SubtitleFile {
  format: SubtitleFormat;
  cues: SubtitleCue[];
  metadata?: SubtitleMetadata;
}

export interface ValidationIssue {
  type: 'overlap' | 'empty' | 'negative_duration' | 'malformed';
  cueIndex: number;
  message: string;
}

export interface SubtitleValidation {
  isValid: boolean;
  issues: ValidationIssue[];
  cuesCount: number;
}
