import { WorkerMessage } from '../lib/caption-studio/types';

let transcriber: any = null;
let isInitializing = false;

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'INITIALIZE':
      if (transcriber || isInitializing) return;
      
      try {
        isInitializing = true;
        self.postMessage({ type: 'INITIALIZING' });
        
        console.log('TRANSFORMERS SCRIPT: about to import @huggingface/transformers');
        const { pipeline, env } = await import('@huggingface/transformers');
        console.log('TRANSFORMERS SCRIPT: imported @huggingface/transformers successfully');
        env.allowLocalModels = false;
        if (env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.numThreads = 1;
        }

        // Exact configuration for the chosen whisper turbo timestamped model
        console.log('TRANSFORMERS SCRIPT: calling pipeline...');
        transcriber = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-large-v3-turbo_timestamped',
          {
            device: 'webgpu',
            dtype: {
              encoder_model: 'q4f16',
              decoder_model_merged: 'q4f16'
            },
            progress_callback: (progress: any) => {
              self.postMessage({ type: 'PROGRESS', progress });
            }
          }
        );
        console.log('TRANSFORMERS SCRIPT: pipeline call finished successfully');
        
        isInitializing = false;
        self.postMessage({ type: 'READY' });
      } catch (err: any) {
        isInitializing = false;
        self.postMessage({ type: 'ERROR', error: err.message || String(err) });
      }
      break;

    case 'TRANSCRIBE':
      if (!transcriber) {
        self.postMessage({ type: 'ERROR', error: 'Model not initialized' });
        return;
      }
      
      try {
        self.postMessage({ type: 'TRANSCRIBING' });
        
        const generateOptions: any = {
          task: 'transcribe',
          return_timestamps: 'word'
        };

        if (msg.language && msg.language !== 'auto') {
          generateOptions.language = msg.language;
        }

        const result = await transcriber(msg.pcm, generateOptions);

        self.postMessage({ 
          type: 'RESULT', 
          result: {
            text: result.text,
            segments: result.chunks,
            words: result.chunks?.flatMap((c: any) => 
              // Some chunk formats have a words array inside, or the chunks themselves are words depending on transformers.js v4 output structure
              c.timestamp ? [{ word: c.text, start: c.timestamp[0], end: c.timestamp[1] }] : []
            ) || []
          }
        });
        self.postMessage({ type: 'READY' });
        
      } catch (err: any) {
        self.postMessage({ type: 'ERROR', error: err.message || String(err) });
        // Assume worker is still ready for new requests unless it's a fatal WebGPU crash
        self.postMessage({ type: 'READY' });
      }
      break;

    case 'TERMINATE':
      // The main thread will call worker.terminate() anyway, but we can do some cleanup if needed
      transcriber = null;
      break;
  }
});
