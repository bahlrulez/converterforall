import { WorkerMessage } from '../lib/caption-studio/types';
import { detectDegenerateTranscription } from '../lib/caption-studio/asr-sanity';
import { MIN_AUDIO_RMS } from '../lib/caption-studio/audio-extractor';

const WHISPER_MODEL_ID = 'onnx-community/whisper-large-v3-turbo_timestamped';

let transcriber: any = null;
let activeDevice: 'webgpu' | 'wasm' = 'webgpu';
let isInitializing = false;

async function buildPipeline(device: 'webgpu' | 'wasm') {
  const { pipeline, env } = await import('@huggingface/transformers');
  env.allowLocalModels = false;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = 1;
  }

  const options: Record<string, any> =
    device === 'webgpu'
      ? {
          device: 'webgpu',
          // Keep Whisper encoder in fp32 to prevent Windows WebGPU q4f16 overflow/repetition loops
          dtype: {
            encoder_model: 'fp32',
            decoder_model_merged: 'q4',
          },
        }
      : {
          device: 'wasm',
          dtype: 'q8',
        };

  options.progress_callback = (progress: any) => {
    self.postMessage({ type: 'PROGRESS', progress });
  };

  return pipeline('automatic-speech-recognition', WHISPER_MODEL_ID, options);
}

function buildTranscribeOptions(language?: string) {
  const opts: Record<string, any> = {
    task: 'transcribe',
    return_timestamps: 'word',
    chunk_length_s: 30,
    stride_length_s: 5,
    no_repeat_ngram_size: 3,
    repetition_penalty: 1.15,
    condition_on_previous_text: false,
    compression_ratio_threshold: 2.4,
  };

  if (language && language !== 'auto') {
    opts.language = language;
  }

  return opts;
}

function formatWorkerResult(result: any, backend: 'webgpu' | 'wasm', warning?: string) {
  return {
    text: result?.text || '',
    segments: result?.chunks || [],
    words:
      result?.chunks?.flatMap((c: any) =>
        c.timestamp ? [{ word: c.text, start: c.timestamp[0], end: c.timestamp[1] }] : []
      ) || [],
    backend,
    ...(warning ? { warning } : {}),
  };
}

function hasValidPcmEnergy(pcm: Float32Array): boolean {
  if (!(pcm instanceof Float32Array) || pcm.length === 0) return false;
  let sumSq = 0;
  for (let i = 0; i < pcm.length; i++) {
    const v = pcm[i];
    if (!Number.isFinite(v)) return false;
    sumSq += v * v;
  }
  return Math.sqrt(sumSq / pcm.length) >= MIN_AUDIO_RMS;
}

self.addEventListener('message', async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'INITIALIZE':
      if (transcriber || isInitializing) return;

      try {
        isInitializing = true;
        self.postMessage({ type: 'INITIALIZING' });

        try {
          transcriber = await buildPipeline('webgpu');
          activeDevice = 'webgpu';
        } catch (webgpuErr) {
          console.warn('WebGPU initialization failed, falling back to WASM:', webgpuErr);
          transcriber = await buildPipeline('wasm');
          activeDevice = 'wasm';
        }

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

      if (!hasValidPcmEnergy(msg.pcm)) {
        self.postMessage({
          type: 'ERROR',
          error: 'No audible 16kHz PCM audio found in video track.',
        });
        self.postMessage({ type: 'READY' });
        return;
      }

      try {
        self.postMessage({ type: 'TRANSCRIBING' });

        const transcribeOptions = buildTranscribeOptions(msg.language);
        let result = await transcriber(msg.pcm, transcribeOptions);
        let warning: string | undefined;

        const initialCheck = detectDegenerateTranscription(result?.text || '', msg.language);
        if (initialCheck.isDegenerate) {
          console.warn('Degenerate Whisper output detected:', initialCheck.reason);

          if (activeDevice === 'webgpu') {
            try {
              if (typeof transcriber?.dispose === 'function') {
                await transcriber.dispose();
              }
              transcriber = await buildPipeline('wasm');
              activeDevice = 'wasm';

              const wasmResult = await transcriber(msg.pcm, transcribeOptions);
              const wasmCheck = detectDegenerateTranscription(wasmResult?.text || '', msg.language);
              result = wasmResult;

              warning = wasmCheck.isDegenerate
                ? 'Speech output looked repetitive even after CPU fallback. Check the selected language or edit captions directly.'
                : 'Switched to CPU fallback (WASM) after detecting a repetitive WebGPU output loop.';
            } catch (fallbackErr: any) {
              console.warn('WASM fallback failed after WebGPU loop:', fallbackErr);
              warning =
                'WebGPU produced repetitive output and CPU fallback failed. Try reloading or switching browser.';
            }
          } else {
            warning =
              'Speech output looked repetitive. Check that the selected spoken language matches your video.';
          }
        }

        self.postMessage({
          type: 'RESULT',
          result: formatWorkerResult(result, activeDevice, warning),
        });
        self.postMessage({ type: 'READY' });
      } catch (err: any) {
        self.postMessage({ type: 'ERROR', error: err.message || String(err) });
        self.postMessage({ type: 'READY' });
      }
      break;

    case 'TERMINATE':
      transcriber = null;
      break;
  }
});
