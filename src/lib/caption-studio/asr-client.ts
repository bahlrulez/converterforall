import { WorkerState, ASRResult, WorkerResponse, ASRWord } from './types';

export class ASRClient {
  private worker: Worker | null = null;
  private stateChangeCallback: ((state: WorkerState) => void) | null = null;
  private resultCallback: ((result: ASRResult) => void) | null = null;
  private errorCallback: ((error: string) => void) | null = null;
  private progressCallback: ((progress: any) => void) | null = null;
  private state: WorkerState = 'IDLE';

  constructor() {}

  public initialize(
    onStateChange: (state: WorkerState) => void,
    onResult: (result: ASRResult) => void,
    onError: (error: string) => void,
    onProgress?: (progress: any) => void
  ) {
    if (this.worker) return; // Already initialized

    this.stateChangeCallback = onStateChange;
    this.resultCallback = onResult;
    this.errorCallback = onError;
    if (onProgress) this.progressCallback = onProgress;

    this.worker = new Worker(new URL('../../workers/asr.worker.ts', import.meta.url), { type: 'module' });
    
    this.worker.onerror = (e) => {
      console.error('ASR Worker error event:', e);
      this.setState('ERROR');
      if (e instanceof ErrorEvent) {
        console.error('Error details:', e.message, e.filename, e.lineno);
        if (this.errorCallback) this.errorCallback(`Worker error: ${e.message}`);
      } else {
        if (this.errorCallback) this.errorCallback('Your browser ran out of memory or crashed while preparing the local AI model. Try closing other tabs/apps and retry.');
      }
    };

    this.worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      switch (msg.type) {
        case 'INITIALIZING':
          this.setState('INITIALIZING');
          break;
        case 'PROGRESS':
          if (this.progressCallback) this.progressCallback(msg.progress);
          break;
        case 'READY':
          this.setState('READY');
          break;
        case 'TRANSCRIBING':
          this.setState('TRANSCRIBING');
          break;
        case 'RESULT':
          const validatedResult = this.validateTimestamps(msg.result);
          if (this.resultCallback) this.resultCallback(validatedResult);
          break;
        case 'ERROR':
          this.setState('ERROR');
          if (this.errorCallback) this.errorCallback(msg.error);
          break;
      }
    };

    // Removed aggressive prewarm
    // We will initialize lazily when requested
  }

  public async prepare(): Promise<void> {
    if (this.state === 'READY') return;
    if (this.state === 'INITIALIZING') {
      // Wait for it to become ready
      return new Promise((resolve, reject) => {
        const check = setInterval(() => {
          if (this.state === 'READY') {
            clearInterval(check);
            resolve();
          } else if (this.state === 'ERROR') {
            clearInterval(check);
            reject(new Error('Failed to initialize AI Engine'));
          }
        }, 500);
      });
    }
    
    return new Promise((resolve, reject) => {
      // Temporarily hook into stateChange to resolve this promise
      const originalCallback = this.stateChangeCallback;
      this.stateChangeCallback = (s: WorkerState) => {
        if (originalCallback) originalCallback(s);
        if (s === 'READY') {
          this.stateChangeCallback = originalCallback; // Restore
          resolve();
        } else if (s === 'ERROR') {
          this.stateChangeCallback = originalCallback;
          reject(new Error('Failed to initialize AI Engine'));
        }
      };
      
      this.worker?.postMessage({ type: 'INITIALIZE' });
    });
  }

  public transcribe(pcm: Float32Array) {
    if (this.state !== 'READY') {
      if (this.errorCallback) this.errorCallback('Engine is not ready or is busy transcribing.');
      return;
    }
    
    // Transfer ownership of the ArrayBuffer to avoid copying large memory
    this.worker?.postMessage({ type: 'TRANSCRIBE', pcm }, [pcm.buffer]);
  }

  public terminate() {
    if (this.worker) {
      this.worker.postMessage({ type: 'TERMINATE' });
      this.worker.terminate();
      this.worker = null;
    }
    this.setState('IDLE');
  }

  private setState(newState: WorkerState) {
    this.state = newState;
    if (this.stateChangeCallback) this.stateChangeCallback(newState);
  }

  private validateTimestamps(result: ASRResult): ASRResult {
    const validWords: ASRWord[] = [];
    let lastValidStart = 0;

    for (const segment of result.segments) {
      const rawChunk = segment as any; 
      if (rawChunk.timestamp && Array.isArray(rawChunk.timestamp) && rawChunk.timestamp.length === 2) {
        let start = rawChunk.timestamp[0];
        let end = rawChunk.timestamp[1];

        if (
          typeof start === 'number' && typeof end === 'number' &&
          Number.isFinite(start) && Number.isFinite(end) &&
          start >= 0 && end >= start &&
          start >= lastValidStart
        ) {
          validWords.push({
            word: rawChunk.text,
            start,
            end
          });
          lastValidStart = start; // Monotonic ordering by start time
        }
      }
    }
    
    // The raw chunks from transformers are often the words themselves when return_timestamps: 'word' is set.
    return {
      text: result.text,
      segments: result.segments,
      words: validWords
    };
  }
}
