export interface CaptionCapabilities {
  webgpu: boolean;
  worker: boolean;
  audioDecode: boolean;
  videoDecode: boolean;
  videoEncode: boolean;
  crossOriginIsolated: boolean;
}

export type WorkerState =
  | 'IDLE'
  | 'INITIALIZING'
  | 'READY'
  | 'TRANSCRIBING'
  | 'ERROR';

export interface ASRWord {
  word: string;
  start: number;
  end: number;
}

export interface ASRSegment {
  text: string;
  start: number;
  end: number;
  words?: ASRWord[];
}

export const CAPTION_LANGUAGES = [
  { value: 'en', label: 'English (en)' },
  { value: 'auto', label: 'Auto-detect' },
  { value: 'hi', label: 'Hindi (hi)' },
  { value: 'pa', label: 'Punjabi (pa)' },
  { value: 'es', label: 'Spanish (es)' },
  { value: 'fr', label: 'French (fr)' },
  { value: 'de', label: 'German (de)' },
] as const;

export type CaptionLanguageCode = (typeof CAPTION_LANGUAGES)[number]['value'];

export interface ASRResult {
  text: string;
  segments: ASRSegment[];
  words: ASRWord[]; // Flat list of all words
  warning?: string;
  backend?: 'webgpu' | 'wasm';
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

export interface CaptionChunk {
  id: string;
  start: number;
  end: number;
  text: string;
  words: CaptionWord[];
}

export type WorkerMessage =
  | { type: 'INITIALIZE' }
  | { type: 'TRANSCRIBE'; pcm: Float32Array; language?: string }
  | { type: 'CANCEL' }
  | { type: 'TERMINATE' };

export type WorkerResponse =
  | { type: 'INITIALIZING'; status?: string }
  | { type: 'READY' }
  | { type: 'PROGRESS'; progress: any }
  | { type: 'TRANSCRIBING' }
  | { type: 'RESULT'; result: ASRResult }
  | { type: 'DONE' }
  | { type: 'ERROR'; error: string };
