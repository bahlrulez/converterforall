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

export interface ASRResult {
  text: string;
  segments: ASRSegment[];
  words: ASRWord[]; // Flat list of all words
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
