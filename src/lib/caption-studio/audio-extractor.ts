export const WHISPER_SAMPLE_RATE = 16000;
export const MIN_AUDIO_RMS = 1e-5;

export interface AudioBufferStats {
  rms: number;
  peak: number;
  length: number;
}

/**
 * Downmixes multi-channel PCM buffers into a single averaged mono Float32Array
 * and replaces any non-finite samples with 0.
 */
export function mixChannelsToMono(channels: readonly Float32Array[]): Float32Array {
  if (!channels || channels.length === 0) {
    return new Float32Array(0);
  }

  const length = channels[0].length;
  if (length === 0) {
    return new Float32Array(0);
  }

  const channelCount = channels.length;
  const mono = new Float32Array(length);

  if (channelCount === 1) {
    const ch0 = channels[0];
    for (let i = 0; i < length; i++) {
      const sample = ch0[i];
      mono[i] = Number.isFinite(sample) ? sample : 0;
    }
    return mono;
  }

  for (let i = 0; i < length; i++) {
    let sum = 0;
    let validChannels = 0;
    for (let c = 0; c < channelCount; c++) {
      const ch = channels[c];
      if (ch && i < ch.length && Number.isFinite(ch[i])) {
        sum += ch[i];
        validChannels++;
      }
    }
    mono[i] = validChannels > 0 ? sum / validChannels : 0;
  }

  return mono;
}

/**
 * Linearly resamples mono Float32Array PCM to `targetRate` when OfflineAudioContext
 * rendering is not available or as a deterministic fallback.
 */
export function resampleMonoPcm(
  pcm: Float32Array,
  sourceRate: number,
  targetRate: number = WHISPER_SAMPLE_RATE
): Float32Array {
  if (pcm.length === 0 || sourceRate <= 0 || targetRate <= 0 || sourceRate === targetRate) {
    return pcm;
  }

  const targetLength = Math.max(1, Math.round((pcm.length * targetRate) / sourceRate));
  const resampled = new Float32Array(targetLength);
  const ratio = sourceRate / targetRate;

  for (let i = 0; i < targetLength; i++) {
    const srcPos = i * ratio;
    const leftIdx = Math.floor(srcPos);
    const rightIdx = Math.min(pcm.length - 1, leftIdx + 1);
    const frac = srcPos - leftIdx;
    const left = Number.isFinite(pcm[leftIdx]) ? pcm[leftIdx] : 0;
    const right = Number.isFinite(pcm[rightIdx]) ? pcm[rightIdx] : left;
    resampled[i] = left + (right - left) * frac;
  }

  return resampled;
}

/**
 * Computes RMS energy and peak amplitude while normalizing samples strictly into [-1, 1].
 */
export function normalizeMonoPcm(pcm: Float32Array): {
  pcm: Float32Array;
  stats: AudioBufferStats;
} {
  if (pcm.length === 0) {
    return { pcm, stats: { rms: 0, peak: 0, length: 0 } };
  }

  let peak = 0;
  for (let i = 0; i < pcm.length; i++) {
    const val = Number.isFinite(pcm[i]) ? Math.abs(pcm[i]) : 0;
    if (val > peak) peak = val;
  }

  const normalized = new Float32Array(pcm.length);
  const scale = peak > 1 ? 1 / peak : 1;
  let sumSquares = 0;

  for (let i = 0; i < pcm.length; i++) {
    const raw = Number.isFinite(pcm[i]) ? pcm[i] : 0;
    const clamped = Math.max(-1, Math.min(1, raw * scale));
    normalized[i] = clamped;
    sumSquares += clamped * clamped;
  }

  const rms = Math.sqrt(sumSquares / normalized.length);
  const finalPeak = peak > 1 ? 1 : peak;
  return {
    pcm: normalized,
    stats: { rms, peak: finalPeak, length: normalized.length },
  };
}

/**
 * Validates that extracted PCM is non-empty, finite, normalized in [-1, 1],
 * and contains non-zero RMS energy.
 */
export function validateWhisperPcm(
  pcm: Float32Array,
  minRms: number = MIN_AUDIO_RMS
): AudioBufferStats {
  if (!pcm || pcm.length === 0) {
    throw new Error('No audio frames could be extracted from this video.');
  }

  let peak = 0;
  let sumSquares = 0;
  for (let i = 0; i < pcm.length; i++) {
    const sample = pcm[i];
    if (!Number.isFinite(sample)) {
      throw new Error('Decoded audio contains invalid non-finite PCM samples.');
    }
    const abs = Math.abs(sample);
    if (abs > peak) peak = abs;
    sumSquares += sample * sample;
  }

  const rms = Math.sqrt(sumSquares / pcm.length);
  if (!Number.isFinite(rms) || rms < minRms) {
    throw new Error(
      'No audible speech signal detected in this video (the audio track is silent or uses an unsupported audio codec).'
    );
  }

  return { rms, peak, length: pcm.length };
}

async function resampleWithOfflineContext(
  mono: Float32Array,
  sourceSampleRate: number,
  targetSampleRate: number
): Promise<Float32Array> {
  if (sourceSampleRate === targetSampleRate) {
    return mono;
  }

  const OfflineCtx =
    typeof window !== 'undefined'
      ? window.OfflineAudioContext || (window as any).webkitOfflineAudioContext
      : undefined;

  if (!OfflineCtx) {
    return resampleMonoPcm(mono, sourceSampleRate, targetSampleRate);
  }

  const targetLength = Math.max(
    1,
    Math.ceil((mono.length * targetSampleRate) / sourceSampleRate)
  );

  // Create source AudioBuffer at original decoded sample rate, then render into target 16kHz mono OfflineAudioContext
  const offlineCtx = new OfflineCtx(1, targetLength, targetSampleRate);
  const sourceBuffer = offlineCtx.createBuffer(1, mono.length, sourceSampleRate);
  sourceBuffer.copyToChannel(new Float32Array(mono), 0);

  const source = offlineCtx.createBufferSource();
  source.buffer = sourceBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  return new Float32Array(renderedBuffer.getChannelData(0));
}

export async function extractAudioFromVideo(file: File): Promise<Float32Array> {
  const arrayBuffer = await file.arrayBuffer();
  const targetSampleRate = WHISPER_SAMPLE_RATE;

  const OfflineCtx =
    typeof window !== 'undefined'
      ? window.OfflineAudioContext || (window as any).webkitOfflineAudioContext
      : undefined;
  const AudioContextClass =
    typeof window !== 'undefined'
      ? window.AudioContext || (window as any).webkitAudioContext
      : undefined;

  if (!OfflineCtx && !AudioContextClass) {
    throw new Error('Audio decoding (AudioContext) is not supported in this browser.');
  }

  let audioBuffer: AudioBuffer;
  let liveCtx: AudioContext | null = null;

  try {
    // Prefer OfflineAudioContext at 16kHz so hardware sample rate overrides cannot distort decoding
    if (OfflineCtx) {
      const decodeCtx = new OfflineCtx(1, 1, targetSampleRate);
      audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
    } else {
      liveCtx = new AudioContextClass!({ sampleRate: targetSampleRate });
      audioBuffer = await liveCtx.decodeAudioData(arrayBuffer);
    }

    if (audioBuffer.numberOfChannels === 0 || audioBuffer.length === 0) {
      throw new Error('No audio track found in this video file.');
    }

    // 1. Extract and average all channels into mono
    const channels: Float32Array[] = [];
    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      channels.push(audioBuffer.getChannelData(ch));
    }
    const monoPcm = mixChannelsToMono(channels);

    // 2. Explicitly guarantee 16,000 Hz output even if browser decoded at native 44.1kHz/48kHz
    const pcm16k =
      audioBuffer.sampleRate !== targetSampleRate
        ? await resampleWithOfflineContext(monoPcm, audioBuffer.sampleRate, targetSampleRate)
        : monoPcm;

    // 3. Normalize to [-1, 1] and verify non-zero RMS energy
    const { pcm } = normalizeMonoPcm(pcm16k);
    validateWhisperPcm(pcm);

    return pcm;
  } finally {
    if (liveCtx && liveCtx.state !== 'closed') {
      await liveCtx.close();
    }
  }
}
