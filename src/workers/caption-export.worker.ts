/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Input,
  Mp4InputFormat,
  QuickTimeInputFormat,
  WebMInputFormat,
  BlobSource,
  Output,
  Mp4OutputFormat,
  BufferTarget,
  EncodedAudioPacketSource,
  EncodedVideoPacketSource,
  EncodedPacketSink,
  EncodedPacket,
  VideoCodec,
  AudioCodec,
  AUDIO_CODECS,
  AudioSampleSink,
  AudioSampleSource,
  canEncodeAudio,
  QUALITY_HIGH,
  UnsupportedInputFormatError,
  type Rotation
} from 'mediabunny';

import { ExportWorkerRequest, ExportWorkerResponse, ExportProgress } from '../lib/caption-studio/export-utils';
import { renderCaptionToCanvas } from '../lib/caption-studio/caption-renderer';
import { CaptionChunk } from '../lib/caption-studio/types';
import { StyleSettings, PositionSettings } from '../lib/caption-studio/style-types';

export type AudioExportRoute = 'DIRECT_COPY' | 'TRANSCODE_AAC' | 'VIDEO_ONLY' | 'UNSUPPORTED';

export interface AudioRoutingDecision {
  route: AudioExportRoute;
  reason: string;
  targetChannels?: number;
  targetSampleRate?: number;
  downmixed?: boolean;
  resampled?: boolean;
}

/**
 * Calculates standardized target sample rate and channel count for AAC audio encoding.
 * Enforces stereo downmixing for multichannel inputs (> 2 channels) and normalizes
 * all transcoding output to 48,000 Hz for universal AAC-LC (mp4a.40.2) encoder compatibility.
 */
export function calculateTargetAudioConfig(
  inputSampleRate: number = 48000,
  inputChannels: number = 2
): { targetSampleRate: number; targetChannels: number; downmixed: boolean; resampled: boolean } {
  const safeChannels = Number.isInteger(inputChannels) && inputChannels > 0 ? inputChannels : 2;
  const safeSampleRate = Number.isInteger(inputSampleRate) && inputSampleRate > 0 ? inputSampleRate : 48000;

  let targetChannels = safeChannels;
  let downmixed = false;
  if (safeChannels > 2) {
    targetChannels = 2; // Downmix multichannel to stereo for standard MP4 compatibility
    downmixed = true;
  }

  // Phase 2B.4.1: Every transcoding route normalizes to exactly 48,000 Hz.
  // This guarantees mp4a.40.2 (AAC-LC) and avoids WebCodecs rejection of HE-AAC or low sample rates.
  const targetSampleRate = 48000;
  const resampled = safeSampleRate !== 48000;

  return { targetSampleRate, targetChannels, downmixed, resampled };
}

/**
 * Evaluates audio track characteristics and environment capabilities to determine the safe export route:
 * - DIRECT_COPY: Original AAC packets preserved directly without generational loss (strictly limited to standard AAC-LC).
 * - TRANSCODE_AAC: Non-AAC audio or non-LC AAC decoded via AudioSampleSink and re-encoded to 48kHz AAC-LC via AudioSampleSource.
 * - VIDEO_ONLY: Controlled omission of audio when file has no audio or user opted into video-only fallback.
 * - UNSUPPORTED: Controlled failure when codec/profile is unrecognized or required encoder/decoder is unavailable.
 */
export function determineAudioExportRoute(params: {
  codec: AudioCodec | null;
  decoderConfig: AudioDecoderConfig | null;
  sampleRate?: number;
  numberOfChannels?: number;
  targetChannels?: number;
  targetSampleRate?: number;
  canDecode?: boolean;
  hasAudioEncoder?: boolean;
  aacEncoderSupported?: boolean;
  allowVideoOnlyFallback?: boolean;
}): AudioRoutingDecision {
  const {
    codec,
    decoderConfig,
    sampleRate = 48000,
    numberOfChannels = 2,
    canDecode = true,
    hasAudioEncoder = true,
    aacEncoderSupported = true,
    allowVideoOnlyFallback = false
  } = params;

  if (!codec) {
    return {
      route: 'VIDEO_ONLY',
      reason: 'No audio track present in media file.'
    };
  }

  // Check if codec is recognized by mediabunny
  if (!AUDIO_CODECS.includes(codec)) {
    if (allowVideoOnlyFallback) {
      return {
        route: 'VIDEO_ONLY',
        reason: `Unsupported audio codec '${codec}'. Falling back to video-only export per user opt-in.`
      };
    }
    return {
      route: 'UNSUPPORTED',
      reason: `Audio codec '${codec}' is unsupported for browser MP4 export. Transcoding to AAC is not available for this codec.`
    };
  }

  // Calculate standardized target configuration for transcoding routes (always 48kHz, mono/stereo)
  const baseTargetConfig = calculateTargetAudioConfig(sampleRate, numberOfChannels);
  const targetChannels = params.targetChannels ?? baseTargetConfig.targetChannels;
  const targetSampleRate = params.targetSampleRate ?? baseTargetConfig.targetSampleRate;
  const downmixed = params.targetChannels !== undefined
    ? numberOfChannels > targetChannels
    : baseTargetConfig.downmixed;
  const resampled = sampleRate !== targetSampleRate;

  // Path A: AAC Input Handling (Direct copy vs Transcode by profile)
  if (codec === 'aac') {
    if (!decoderConfig || !decoderConfig.codec) {
      if (allowVideoOnlyFallback) {
        return {
          route: 'VIDEO_ONLY',
          reason: 'AAC audio track is missing required decoder configuration metadata. Falling back to video-only export.'
        };
      }
      return {
        route: 'UNSUPPORTED',
        reason: 'AAC audio track is missing required decoder configuration metadata. Processing cannot proceed without valid decoder configuration.'
      };
    }

    const aacCodecString = decoderConfig.codec.trim().toLowerCase();
    const isAacLc = aacCodecString === 'mp4a.40.2' || aacCodecString === 'mp4a.40.02';

    // Direct Copy: Strictly limited to standard MPEG-4 AAC-LC (mp4a.40.2 / mp4a.40.02)
    if (isAacLc) {
      return {
        route: 'DIRECT_COPY',
        reason: 'Direct copy of AAC track (standard AAC-LC) with existing decoder configuration.',
        targetChannels: numberOfChannels,
        targetSampleRate: sampleRate,
        downmixed: false,
        resampled: false
      };
    }

    // Non-LC AAC (HE-AAC mp4a.40.5, HE-AACv2 mp4a.40.29, xHE-AAC mp4a.40.42, MPEG-2 AAC mp4a.67, etc.)
    // These profiles must NOT be direct-copied. They are transcoded to 48kHz AAC-LC only if decodable.
    if (!canDecode) {
      if (allowVideoOnlyFallback) {
        return {
          route: 'VIDEO_ONLY',
          reason: `Audio decoder cannot decode '${decoderConfig.codec}' profile. Falling back to video-only export per user opt-in.`
        };
      }
      return {
        route: 'UNSUPPORTED',
        reason: `Audio decoder cannot decode '${decoderConfig.codec}' profile. Browser decoding support is required to transcode to AAC-LC.`
      };
    }

    if (!hasAudioEncoder) {
      if (allowVideoOnlyFallback) {
        return {
          route: 'VIDEO_ONLY',
          reason: 'WebCodecs AudioEncoder is not available in this browser. Falling back to video-only export.'
        };
      }
      return {
        route: 'UNSUPPORTED',
        reason: `WebCodecs AudioEncoder is not available in this browser. Transcoding '${decoderConfig.codec}' to AAC-LC requires AudioEncoder.`
      };
    }

    if (!aacEncoderSupported) {
      if (allowVideoOnlyFallback) {
        return {
          route: 'VIDEO_ONLY',
          reason: `AAC AudioEncoder does not support ${targetChannels} ch @ ${targetSampleRate} Hz. Falling back to video-only export.`
        };
      }
      return {
        route: 'UNSUPPORTED',
        reason: `Browser AudioEncoder does not support the required AAC configuration (${targetChannels} channels, ${targetSampleRate} Hz).`
      };
    }

    return {
      route: 'TRANSCODE_AAC',
      reason: `Transcoding '${decoderConfig.codec}' audio to standard 48kHz AAC-LC.`,
      targetChannels,
      targetSampleRate,
      downmixed,
      resampled
    };
  }

  // Path B: Non-AAC Transcode to AAC (Opus, PCM, MP3, Vorbis, FLAC)
  if (!canDecode) {
    if (allowVideoOnlyFallback) {
      return {
        route: 'VIDEO_ONLY',
        reason: `Audio decoder unavailable for '${codec}'. Falling back to video-only export per user opt-in.`
      };
    }
    return {
      route: 'UNSUPPORTED',
      reason: `Audio decoder unavailable for codec '${codec}'. The browser cannot decode this audio format.`
    };
  }

  if (!hasAudioEncoder) {
    if (allowVideoOnlyFallback) {
      return {
        route: 'VIDEO_ONLY',
        reason: 'WebCodecs AudioEncoder is not available in this browser. Falling back to video-only export.'
      };
    }
    return {
      route: 'UNSUPPORTED',
      reason: `WebCodecs AudioEncoder is not available in this browser. Transcoding '${codec}' audio to AAC requires AudioEncoder.`
    };
  }

  if (!aacEncoderSupported) {
    if (allowVideoOnlyFallback) {
      return {
        route: 'VIDEO_ONLY',
        reason: `AAC AudioEncoder does not support ${targetChannels} ch @ ${targetSampleRate} Hz. Falling back to video-only export.`
      };
    }
    return {
      route: 'UNSUPPORTED',
      reason: `Browser AudioEncoder does not support the required AAC configuration (${targetChannels} channels, ${targetSampleRate} Hz).`
    };
  }

  return {
    route: 'TRANSCODE_AAC',
    reason: `Transcoding '${codec}' audio to AAC (${targetChannels} ch, ${targetSampleRate} Hz).`,
    targetChannels,
    targetSampleRate,
    downmixed,
    resampled
  };
}

interface RegistryNode {
  timestamp: number;
  duration: number;
  prev: RegistryNode | null;
  next: RegistryNode | null;
}

/**
 * Timestamp-keyed duration registry with global FIFO eviction.
 * Maps VideoFrame presentation timestamps (in microseconds) to their calculated durations (in microseconds).
 * Protects against WebCodecs hardware encoder quirks where chunk.duration is emitted as null or 0.
 *
 * Ordering & Association Guarantees:
 * - Distinct timestamps (T1 != T2): Exact 1:1 duration association is guaranteed regardless of
 *   encoder output callback arrival order because lookups are keyed by presentation timestamp.
 * - Duplicate timestamps (T1 == T2): Multiple durations registered for the identical timestamp
 *   are queued and consumed in FIFO order. If an underlying hardware encoder reorders chunks
 *   sharing identical timestamps, exact 1:1 frame-to-chunk association cannot be guaranteed.
 * - Global FIFO Eviction: Eviction strictly follows global registration order across all timestamps
 *   using an internal doubly-linked list, ensuring true oldest-record eviction even when duplicate
 *   timestamps are interleaved.
 * - Capacity: Enforces a hard ceiling of maxCapacity (default 1,000) total pending duration records.
 */
export class FrameDurationRegistry {
  private registry = new Map<number, RegistryNode[]>();
  private head: RegistryNode | null = null;
  private tail: RegistryNode | null = null;
  private totalPending = 0;
  private readonly maxCapacity: number;

  constructor(maxCapacity = 1000) {
    this.maxCapacity = maxCapacity;
  }

  public register(timestamp: number, duration: number): void {
    if (!Number.isFinite(timestamp) || !Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const node: RegistryNode = {
      timestamp,
      duration,
      prev: this.tail,
      next: null
    };

    if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }

    const list = this.registry.get(timestamp);
    if (list) {
      list.push(node);
    } else {
      this.registry.set(timestamp, [node]);
    }
    this.totalPending++;

    // Enforce hard maximum of total pending duration records via global FIFO eviction
    while (this.totalPending > this.maxCapacity) {
      this.evictOldest();
    }
  }

  private unlink(node: RegistryNode): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.prev = null;
    node.next = null;
  }

  private evictOldest(): void {
    if (!this.head) {
      this.totalPending = 0;
      return;
    }

    const oldestNode = this.head;
    this.unlink(oldestNode);

    const list = this.registry.get(oldestNode.timestamp);
    if (list) {
      const idx = list.indexOf(oldestNode);
      if (idx !== -1) {
        list.splice(idx, 1);
      }
      if (list.length === 0) {
        this.registry.delete(oldestNode.timestamp);
      }
    }

    this.totalPending--;
  }

  public consume(timestamp: number): number | null {
    const list = this.registry.get(timestamp);
    if (!list || list.length === 0) {
      this.registry.delete(timestamp);
      return null;
    }

    const node = list.shift()!;
    this.unlink(node);
    this.totalPending--;

    if (list.length === 0) {
      this.registry.delete(timestamp);
    }

    return node.duration;
  }

  /**
   * Rolls back the most recently registered duration for a given timestamp.
   * Invoked on synchronous encoder.encode() exceptions to undo the registration
   * without consuming older pending records for that timestamp.
   */
  public rollback(timestamp: number): boolean {
    const list = this.registry.get(timestamp);
    if (!list || list.length === 0) {
      this.registry.delete(timestamp);
      return false;
    }

    const node = list.pop()!;
    this.unlink(node);
    this.totalPending--;

    if (list.length === 0) {
      this.registry.delete(timestamp);
    }

    return true;
  }

  public clear(): void {
    this.registry.clear();
    this.head = null;
    this.tail = null;
    this.totalPending = 0;
  }

  /** Total pending duration records across all timestamp keys */
  public get pendingCount(): number {
    return this.totalPending;
  }

  /** Number of distinct timestamp keys currently registered */
  public get size(): number {
    return this.registry.size;
  }
}

/**
 * Resolves output chunk duration in microseconds according to the strict 4-tier recovery hierarchy:
 * 1. chunk.duration if finite and strictly positive.
 * 2. Original VideoFrame calculated duration mapped to chunk.timestamp.
 * 3. Validated encoder frame-rate fallback (1_000_000 / fps).
 * 4. Safe default 30 FPS fallback (1_000_000 / 30).
 */
export function resolveChunkDuration(
  chunkDuration: number | null | undefined,
  registeredDuration: number | null | undefined,
  configuredFramerate: number | null | undefined
): number {
  // 1. Use chunk.duration if finite and strictly positive
  if (typeof chunkDuration === 'number' && Number.isFinite(chunkDuration) && chunkDuration > 0) {
    return chunkDuration;
  }

  // 2. Recover original VideoFrame duration associated with chunk.timestamp
  if (typeof registeredDuration === 'number' && Number.isFinite(registeredDuration) && registeredDuration > 0) {
    return registeredDuration;
  }

  // 3. Validated frame-rate fallback
  if (typeof configuredFramerate === 'number' && Number.isFinite(configuredFramerate) && configuredFramerate > 0) {
    return Math.round(1_000_000 / configuredFramerate);
  }

  // 4. Default 30 FPS fallback
  return Math.round(1_000_000 / 30);
}

/**
 * Normalizes a video dimension to a valid, positive, even integer required by H.264 encoders.
 * WebCodecs H.264 (YUV420) strictly rejects odd dimensions with NotSupportedError.
 *
 * Behavior:
 * - If value is non-finite, null, undefined, or <= 0, uses fallback (itself normalized to even).
 * - Truncates fractional values via Math.floor.
 * - Forces even integer by rounding down to nearest multiple of 2: Math.floor(v / 2) * 2.
 * - Clamps to minimum of 2.
 */
export function toEvenDimension(dim: number | null | undefined, fallback = 1920): number {
  const safeFallback = (typeof fallback === 'number' && Number.isFinite(fallback) && fallback > 0)
    ? Math.max(2, Math.floor(fallback / 2) * 2)
    : 1920;
  if (typeof dim !== 'number' || !Number.isFinite(dim) || dim <= 0) {
    return safeFallback;
  }
  const intVal = Math.floor(dim);
  const evenVal = Math.floor(intVal / 2) * 2;
  return Math.max(2, evenVal);
}

/**
 * Renders a VideoFrame or canvas image source to the OffscreenCanvas context,
 * handling rotation (0, 90, 180, 270 degrees clockwise) and horizontal flip.
 *
 * Baking orientation directly into the canvas ensures that the exported video
 * is physically upright in square pixels, exactly matching the user's preview in Caption Studio.
 */
export function drawVideoFrameWithOrientation(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  frame: VideoFrame | CanvasImageSource,
  targetWidth: number,
  targetHeight: number,
  rotation: number = 0,
  flip: boolean = false
): void {
  ctx.clearRect(0, 0, targetWidth, targetHeight);

  if (rotation === 0 && !flip) {
    ctx.drawImage(frame as CanvasImageSource, 0, 0, targetWidth, targetHeight);
    return;
  }

  ctx.save();
  if (flip) {
    ctx.translate(targetWidth, 0);
    ctx.scale(-1, 1);
  }

  const isSwap = rotation === 90 || rotation === 270;
  const drawW = isSwap ? targetHeight : targetWidth;
  const drawH = isSwap ? targetWidth : targetHeight;

  switch (rotation) {
    case 90:
      ctx.translate(targetWidth, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 180:
      ctx.translate(targetWidth, targetHeight);
      ctx.rotate(Math.PI);
      break;
    case 270:
      ctx.translate(0, targetHeight);
      ctx.rotate(1.5 * Math.PI);
      break;
  }

  ctx.drawImage(frame as CanvasImageSource, 0, 0, drawW, drawH);
  ctx.restore();
}

function reportProgress(progress: ExportProgress) {
  if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
    self.postMessage({ type: 'PROGRESS', progress } as ExportWorkerResponse);
  }
}

let lastExportDiagnostics: any = null;
let currentStage = 'INIT';

if (typeof self !== 'undefined') {
  self.onmessage = async (e: MessageEvent<ExportWorkerRequest>) => {
    const req = e.data;
    if (req.type === 'START_EXPORT') {
      try {
        lastExportDiagnostics = null;
        currentStage = 'WORKER_START';

        if (!req.file || !req.captions) throw new Error('Missing file or captions');

        // Load fonts if provided
        if (req.fonts && req.fonts.length > 0) {
          currentStage = 'FONT_LOAD_START';
          for (const f of req.fonts) {
            const font = new FontFace(f.name, f.buffer);
            await font.load();
            (self as any).fonts.add(font);
          }
        }

        if (!req.globalStyle || !req.globalPosition) {
          throw new Error('Missing globalStyle or globalPosition in START_EXPORT payload. Silent fallback prevented.');
        }

        await runExport(req.file, req.captions, req.globalStyle, req.globalPosition, req.allowVideoOnlyFallback || false);
      } catch (err: any) {
        console.error(err);
        const message = err instanceof Error ? err.message : String(err);
        const isUnsupported =
          err instanceof UnsupportedInputFormatError ||
          err?.name === 'UnsupportedInputFormatError' ||
          (typeof message === 'string' && message.includes('UnsupportedInputFormatError'));

        const userErrorMessage = isUnsupported
          ? 'The uploaded video format is unsupported or corrupted. Please provide an MP4, QuickTime (MOV), or WebM video file.'
          : `Export failed [Stage: ${currentStage}]: ${message}`;

        const diagnosticText = lastExportDiagnostics
          ? JSON.stringify(lastExportDiagnostics, null, 2)
          : "No video packet diagnostics were captured.";

        self.postMessage({
          type: 'ERROR',
          error: `${userErrorMessage}\n\nExport diagnostics:\n${diagnosticText}`
        } as ExportWorkerResponse);
      }
    }
  };
}

async function runExport(file: File, captions: CaptionChunk[], style: StyleSettings, position: PositionSettings, allowVideoOnlyFallback: boolean = false) {
  reportProgress({ status: 'PREPARING' });

  const input = new Input({
    formats: [
      new Mp4InputFormat(),
      new QuickTimeInputFormat(),
      new WebMInputFormat(),
    ],
    source: new BlobSource(file)
  });
  currentStage = 'INPUT_CREATED';

  const videoTracks = await input.getVideoTracks();
  const videoTrack = videoTracks[0];
  const audioTracks = await input.getAudioTracks();
  const audioTrack = audioTracks[0] || null;
  const additionalAudioTracksCount = audioTracks.length > 1 ? audioTracks.length - 1 : 0;
  const exportWarnings: string[] = [];

  if (additionalAudioTracksCount > 0) {
    const warningMsg = `Notice: Video contains ${audioTracks.length} audio tracks. Track 1 was preserved; ${additionalAudioTracksCount} additional track(s) were omitted in MP4 export.`;
    exportWarnings.push(warningMsg);
    reportProgress({
      status: 'PREPARING',
      stage: 'AUDIO_MULTI_TRACK_NOTICE',
      message: warningMsg
    });
  }

  if (!videoTrack) throw new Error('No video track found in the uploaded file. Please ensure the file contains a valid video stream.');
  currentStage = 'VIDEO_TRACK_FOUND';

  const videoCodec = await videoTrack.getCodec();
  const videoDecoderConfig = await videoTrack.getDecoderConfig();
  if (!videoDecoderConfig) throw new Error('Could not get video decoder config');
  currentStage = 'DECODER_CONFIG_LOADED';

  // Read display metrics and orientation from video track
  const [
    rawDisplayWidth,
    rawDisplayHeight,
    rotation,
    flip
  ] = await Promise.all([
    videoTrack.getDisplayWidth().catch(() => null),
    videoTrack.getDisplayHeight().catch(() => null),
    videoTrack.getRotation().catch(() => 0 as Rotation),
    videoTrack.getFlip().catch(() => false)
  ]);

  const codedWidthFallback = videoDecoderConfig.codedWidth || 1920;
  const codedHeightFallback = videoDecoderConfig.codedHeight || 1080;

  // Determine target canvas dimensions according to orientation:
  // If rotation is 90 or 270 degrees, display dimensions are swapped relative to coded dimensions.
  const isSwap = rotation === 90 || rotation === 270;
  const fallbackTargetW = isSwap ? codedHeightFallback : codedWidthFallback;
  const fallbackTargetH = isSwap ? codedWidthFallback : codedHeightFallback;

  const width = toEvenDimension(rawDisplayWidth, fallbackTargetW);
  const height = toEvenDimension(rawDisplayHeight, fallbackTargetH);

  // Verify WebCodecs Encoder Support with normalized even dimensions
  const encoderConfig: VideoEncoderConfig = {
    codec: 'avc1.4d002a', // H.264 Main Profile, Level 4.2
    width,
    height,
    framerate: 30, // fallback
    bitrate: 5_000_000,
  };

  let support = await VideoEncoder.isConfigSupported(encoderConfig);
  if (!support.supported) {
    const softwareConfig: VideoEncoderConfig = {
      ...encoderConfig,
      hardwareAcceleration: 'prefer-software'
    };
    const softwareSupport = await VideoEncoder.isConfigSupported(softwareConfig).catch(() => null);
    if (softwareSupport?.supported) {
      encoderConfig.hardwareAcceleration = 'prefer-software';
      support = softwareSupport;
    } else {
      throw new Error(`VideoEncoder config not supported for ${width}x${height} (${encoderConfig.codec})`);
    }
  }
  currentStage = 'ENCODER_CREATED';

  const outputBuffer = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat(),
    target: outputBuffer
  });

  const videoSource = new EncodedVideoPacketSource(videoCodec as VideoCodec || 'avc');
  lastExportDiagnostics = {
    width: Number.isFinite(width) ? width : null,
    height: Number.isFinite(height) ? height : null,
    codedWidth: Number.isFinite(encoderConfig.width) ? encoderConfig.width : null,
    codedHeight: Number.isFinite(encoderConfig.height) ? encoderConfig.height : null,
    codec: encoderConfig.codec ?? null,
    rotation: rotation ?? 0,
    flip: flip ?? false,
    stage: currentStage
  };

  // Rotation and flip are baked directly into the canvas frames so the video is physically upright.
  // Explicitly set rotation: 0 and flip: false so players do not rotate or flip the video a second time.
  output.addVideoTrack(videoSource, {
    rotation: 0,
    flip: false
  });

  // Prepare Audio Preservation / Transcoding
  let audioSource: EncodedAudioPacketSource | AudioSampleSource | null = null;
  let audioTask: Promise<void> | null = null;
  let audioError: Error | null = null;
  let decodeError: Error | null = null;
  let encodeError: Error | null = null;
  let exportFailed = false;

  if (audioTrack) {
    currentStage = 'AUDIO_INSPECT_START';
    let audioCodec: AudioCodec | null = null;
    let audioDecoderConfig: AudioDecoderConfig | null = null;
    let audioSampleRate = 48000;
    let audioChannels = 2;
    let canDecode = false;

    try { audioCodec = await audioTrack.getCodec(); } catch {}
    try { audioDecoderConfig = await audioTrack.getDecoderConfig(); } catch {}
    try { audioSampleRate = (await audioTrack.getSampleRate()) || 48000; } catch {}
    try { audioChannels = (await audioTrack.getNumberOfChannels()) || 2; } catch {}
    try { canDecode = await audioTrack.canDecode(); } catch {}

    const hasAudioEncoder = typeof AudioEncoder !== 'undefined';
    const targetConfig = calculateTargetAudioConfig(audioSampleRate, audioChannels);

    let aacEncoderSupported = false;
    if (hasAudioEncoder) {
      try {
        aacEncoderSupported = await canEncodeAudio('aac', {
          numberOfChannels: targetConfig.targetChannels,
          sampleRate: targetConfig.targetSampleRate,
          quality: QUALITY_HIGH
        });
      } catch {
        aacEncoderSupported = false;
      }
      // If mono AAC is not directly supported by browser AudioEncoder, probe stereo fallback
      if (!aacEncoderSupported && targetConfig.targetChannels === 1) {
        try {
          const stereoSupported = await canEncodeAudio('aac', {
            numberOfChannels: 2,
            sampleRate: targetConfig.targetSampleRate,
            quality: QUALITY_HIGH
          });
          if (stereoSupported) {
            targetConfig.targetChannels = 2;
            aacEncoderSupported = true;
          }
        } catch {}
      }
    }

    const decision = determineAudioExportRoute({
      codec: audioCodec,
      decoderConfig: audioDecoderConfig,
      sampleRate: audioSampleRate,
      numberOfChannels: audioChannels,
      targetChannels: targetConfig.targetChannels,
      targetSampleRate: targetConfig.targetSampleRate,
      canDecode,
      hasAudioEncoder,
      aacEncoderSupported,
      allowVideoOnlyFallback
    });

    lastExportDiagnostics = {
      ...lastExportDiagnostics,
      audioTrackCount: audioTracks.length,
      omittedAudioTrackCount: additionalAudioTracksCount,
      inputAudioCodec: audioCodec ?? null,
      audioExportRoute: decision.route,
      audioChannels,
      audioSampleRate,
      targetChannels: decision.targetChannels ?? null,
      targetSampleRate: decision.targetSampleRate ?? null,
      audioDownmixed: decision.downmixed ?? false,
      audioResampled: decision.resampled ?? false
    };

    if (decision.route === 'UNSUPPORTED') {
      throw new Error(`Audio processing cannot proceed: ${decision.reason}`);
    }

    if (decision.downmixed) {
      const downmixMsg = `Multichannel audio (${audioChannels} channels) was downmixed to stereo for broad MP4 compatibility.`;
      exportWarnings.push(downmixMsg);
      reportProgress({ status: 'PREPARING', stage: 'AUDIO_DOWNMIX_NOTICE', message: downmixMsg });
    }

    if (decision.resampled) {
      const resampleMsg = `Audio sample rate was adjusted from ${audioSampleRate} Hz to ${decision.targetSampleRate} Hz for AAC encoding compatibility.`;
      exportWarnings.push(resampleMsg);
      reportProgress({ status: 'PREPARING', stage: 'AUDIO_RESAMPLE_NOTICE', message: resampleMsg });
    }

    if (decision.route === 'DIRECT_COPY') {
      currentStage = 'AUDIO_DIRECT_COPY_INIT';
      const directSource = new EncodedAudioPacketSource('aac');
      audioSource = directSource;
      output.addAudioTrack(directSource, {
        decoderConfig: audioDecoderConfig as any
      });

      audioTask = (async () => {
        try {
          const audioSink = new EncodedPacketSink(audioTrack);
          let first = true;
          for await (const packet of audioSink.packets()) {
            if (exportFailed || decodeError || encodeError) {
              break;
            }
            if (first) {
              await directSource.add(packet, { decoderConfig: audioDecoderConfig as any });
              first = false;
            } else {
              await directSource.add(packet);
            }
          }
        } catch (err: any) {
          audioError = err instanceof Error ? err : new Error(String(err));
        }
      })();
    } else if (decision.route === 'TRANSCODE_AAC') {
      currentStage = 'AUDIO_TRANSCODE_INIT';
      const sampleSource = new AudioSampleSource({
        codec: 'aac',
        quality: QUALITY_HIGH,
        transform: {
          numberOfChannels: decision.targetChannels,
          sampleRate: decision.targetSampleRate
        }
      });
      audioSource = sampleSource;
      output.addAudioTrack(sampleSource);

      audioTask = (async () => {
        try {
          const sampleSink = new AudioSampleSink(audioTrack);
          for await (const sample of sampleSink.samples()) {
            if (exportFailed || decodeError || encodeError) {
              sample.close();
              break;
            }
            try {
              await sampleSource.add(sample);
            } finally {
              // Crucial: immediately close the AudioSample to maintain memory hygiene!
              sample.close();
            }
          }
        } catch (err: any) {
          audioError = err instanceof Error ? err : new Error(String(err));
        }
      })();
    } else if (decision.route === 'VIDEO_ONLY') {
      const videoOnlyMsg = `Notice: Audio was excluded from export (${decision.reason}). Video-only MP4 generated.`;
      exportWarnings.push(videoOnlyMsg);
      reportProgress({ status: 'PREPARING', stage: 'AUDIO_EXCLUDED_NOTICE', message: videoOnlyMsg });
    }
  }

  await output.start();
  reportProgress({ status: 'DECODING' });

  // Prepare Canvas & Shared Renderer
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;

  let firstEncode = true;

  let pendingFrame: VideoFrame | null = null;
  let decoder: VideoDecoder | null = null;
  let encoder: VideoEncoder | null = null;
  let watchdog: any = null;
  const durationRegistry = new FrameDurationRegistry();

  try {
    const processFrame = (frameToRender: VideoFrame, calculatedDuration: number) => {
    currentStage = 'CANVAS_RENDER';
    drawVideoFrameWithOrientation(ctx, frameToRender, width, height, rotation, flip);

    const timestampSec = frameToRender.timestamp / 1_000_000;
    const activeCaption = captions.find(c => timestampSec >= c.start && timestampSec <= c.end);
    if (activeCaption) {
      renderCaptionToCanvas(ctx, activeCaption, width, height, style, position);
    }

    if (!Number.isFinite(frameToRender.timestamp)) {
      throw new Error(`Invalid timestamp ${frameToRender.timestamp}`);
    }
    if (calculatedDuration === null || calculatedDuration === undefined || calculatedDuration <= 0 || !Number.isFinite(calculatedDuration)) {
      throw new Error(`Invalid duration ${calculatedDuration} for timestamp ${frameToRender.timestamp}`);
    }

    const newFrame = new VideoFrame(canvas, {
      timestamp: frameToRender.timestamp,
      duration: calculatedDuration
    });

    currentStage = 'ENCODE_CALL';
    durationRegistry.register(frameToRender.timestamp, calculatedDuration);
    try {
      if (encoder) encoder.encode(newFrame);
    } catch (encodeErr) {
      durationRegistry.rollback(frameToRender.timestamp);
      throw encodeErr;
    } finally {
      newFrame.close();
    }
  };

  currentStage = 'VIDEO_DECODER_CREATED';
  encoder = new VideoEncoder({
    output: async (chunk: EncodedVideoChunk, metadata: EncodedVideoChunkMetadata | undefined) => {
      currentStage = 'ENCODE_OUTPUT';
      try {
        if (!Number.isFinite(chunk.timestamp)) throw new Error("Chunk timestamp is non-finite");
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);

        // Recover duration according to the 4-tier hierarchy:
        // 1. chunk.duration if finite and strictly positive
        // 2. registered duration from VideoFrame timestamp mapping
        // 3. validated framerate fallback
        // 4. default 30 FPS fallback
        const registeredDuration = durationRegistry.consume(chunk.timestamp);
        const resolvedDurationMicros = resolveChunkDuration(
          chunk.duration,
          registeredDuration,
          encoderConfig.framerate
        );

        // Convert microseconds to seconds exactly once for Mediabunny packet
        const packetDuration = resolvedDurationMicros / 1_000_000;
        
        if (!Number.isFinite(packetDuration) || packetDuration <= 0) {
            throw new Error(`Encoded packet has zero/invalid duration: ${packetDuration}`);
        }

        const packet = new EncodedPacket(
          data,
          chunk.type === 'key' ? 'key' : 'delta',
          chunk.timestamp / 1_000_000,
          packetDuration
        );
        
        if (firstEncode) {
          const outputDecoderConfig: VideoDecoderConfig = {
            codec: encoderConfig.codec,
            codedWidth: encoderConfig.width,
            codedHeight: encoderConfig.height,
            ...(metadata?.decoderConfig?.description ? { description: metadata.decoderConfig.description } : {}),
            ...(metadata?.decoderConfig?.colorSpace ? { colorSpace: metadata.decoderConfig.colorSpace } : {})
          };
          
          if (
            !outputDecoderConfig.codedWidth ||
            !Number.isInteger(outputDecoderConfig.codedWidth) ||
            outputDecoderConfig.codedWidth <= 0 ||
            !outputDecoderConfig.codedHeight ||
            !Number.isInteger(outputDecoderConfig.codedHeight) ||
            outputDecoderConfig.codedHeight <= 0
          ) {
            throw new Error(`Invalid encoder dimensions: ${outputDecoderConfig.codedWidth}x${outputDecoderConfig.codedHeight}`);
          }

          try {
            currentStage = 'VIDEO_PACKET_ADD';
            await videoSource.add(packet, { decoderConfig: outputDecoderConfig });
          } catch (addErr: any) {
            throw addErr;
          }
          firstEncode = false;
        } else {
          currentStage = 'VIDEO_PACKET_ADD';
          await videoSource.add(packet);
        }
      } catch (err: any) {
        encodeError = err;
      }
    },
    error: (err) => {
      durationRegistry.clear();
      encodeError = new Error(`VIDEO_ENCODER_ERROR [${currentStage}]: ${err?.name} - ${err?.message} - ${err?.toString()}`);
    }
  });

  currentStage = 'ENCODER_CONFIGURED';
  encoder.configure(encoderConfig);

  let fallbackAttempted = false;
  let fallbackPromise: Promise<void> | null = null;
  
  let currentFrame = 0;
  let totalFrames = 1000;
  try {
    const durationSec = (await input.getDurationFromMetadata()) || (captions.length > 0 ? captions[captions.length - 1].end : 0);
    if (durationSec > 0) {
      totalFrames = Math.max(1, Math.round(durationSec * (encoderConfig.framerate || 30)));
    }
  } catch {}

  const onDecoderOutput = (frame: VideoFrame) => {
    currentStage = 'FIRST_FRAME_RECEIVED';
    try {
      if (encodeError) {
        frame.close();
        return;
      }

      currentFrame++;
      if (currentFrame % 5 === 0 || currentFrame === totalFrames) {
        reportProgress({
          status: 'RENDERING',
          progress: Math.min(100, Math.round((currentFrame / Math.max(1, totalFrames)) * 100)),
          currentFrame,
          totalFrames,
          stage: 'Rendering captions...'
        });
      }

      if (pendingFrame) {
          let duration = frame.timestamp - pendingFrame.timestamp;
          if (duration <= 0) {
              duration = pendingFrame.duration && pendingFrame.duration > 0 ? pendingFrame.duration : Math.round(1_000_000 / (encoderConfig.framerate || 30));
          }
          processFrame(pendingFrame, duration);
          pendingFrame.close();
      }
      pendingFrame = frame;
    } catch (err: any) {
      decodeError = new Error(`Frame handling Error [${currentStage}]: ${err?.message}`);
      frame.close();
    }
  };

  const onDecoderError = (err: any) => { 
    if (!fallbackAttempted && (err?.name === 'EncodingError' || err?.message?.includes('Decoding err'))) {
      fallbackAttempted = true;
      console.warn("Decoding error detected. Re-instantiating decoder with prefer-software fallback.");
      
      if (decoder && decoder.state !== 'closed') {
          try { decoder.close(); } catch {}
      }
      
      decoder = new VideoDecoder({
          output: onDecoderOutput,
          error: onDecoderError
      });
      
      videoDecoderConfig.hardwareAcceleration = 'prefer-software';
      fallbackPromise = VideoDecoder.isConfigSupported(videoDecoderConfig).then(async support => {
          if (support.supported) {
              decoder!.configure(videoDecoderConfig);
              if (typeof (videoTrack as any).seek === 'function') {
                  await (videoTrack as any).seek(0);
              } else if (typeof (input as any).seek === 'function') {
                  await (input as any).seek(0);
              } else {
                  console.warn("Could not find seek() method to reset demuxer");
              }
          } else {
              decodeError = new Error("Software decoding fallback config not supported");
          }
      }).catch(e => {
          decodeError = new Error("Software fallback failed: " + e.message);
      }).finally(() => {
          fallbackPromise = null;
      });
      return;
    }
    decodeError = new Error(`VIDEO_DECODER_ERROR [${currentStage}]: ${err?.name} - ${err?.message} - ${err?.toString()}`); 
  };

  decoder = new VideoDecoder({
    output: onDecoderOutput,
    error: onDecoderError
  });

  currentStage = 'DECODER_CONFIGURED';
  decoder.configure(videoDecoderConfig);

  reportProgress({ status: 'RENDERING' });

  const videoSink = new EncodedPacketSink(videoTrack);
  for await (const packet of videoSink.packets()) {
    if (fallbackPromise) await fallbackPromise;
    if (currentStage !== 'FIRST_DECODE_CALL') {
       currentStage = 'FIRST_PACKET_READ';
    }
    if (decodeError) throw decodeError;
    if (encodeError) throw encodeError;

    const waitStart = Date.now();
    while (decoder && encoder && (decoder.decodeQueueSize > 8 || encoder.encodeQueueSize > 8)) {
      if (decodeError) throw decodeError;
      if (encodeError) throw encodeError;
      if (Date.now() - waitStart > 15000) {
        throw new Error("Export stalled: no progress for 15 seconds.");
      }
      await new Promise(resolve => {
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            if (decoder && (decoder as any).removeEventListener) (decoder as any).removeEventListener('dequeue', finish);
            if (encoder && (encoder as any).removeEventListener) (encoder as any).removeEventListener('dequeue', finish);
            clearTimeout(timeout);
            resolve(null);
          }
        };
        if (decoder && (decoder as any).addEventListener) (decoder as any).addEventListener('dequeue', finish);
        if (encoder && (encoder as any).addEventListener) (encoder as any).addEventListener('dequeue', finish);
        const timeout = setTimeout(finish, 100);
      });
    }

    if (currentStage === 'FIRST_PACKET_READ') {
       currentStage = 'FIRST_DECODE_CALL';
    }

    if (decoder) {
      decoder.decode(new EncodedVideoChunk({
        type: packet.type === 'key' ? 'key' : 'delta',
        timestamp: packet.timestamp * 1_000_000, // Mediabunny seconds to WebCodecs microseconds
        duration: (packet.duration || 0) * 1_000_000,
        data: packet.data
      }));
    }
  }

  reportProgress({ status: 'FINALIZING' });

  watchdog = setTimeout(() => {
    self.postMessage({
      type: 'ERROR',
      error: `Export failed [Stage: ${currentStage}]: FINALIZATION_TIMEOUT (60s exceeded)`
    } as ExportWorkerResponse);
  }, 60000);

  currentStage = 'ENCODER_FLUSH_START';
  if (decoder) await decoder.flush();
  if (pendingFrame) {
       const pf = pendingFrame as any;
       const duration = pf.duration && pf.duration > 0 ? pf.duration : Math.round(1_000_000 / (encoderConfig.framerate || 30));
       processFrame(pendingFrame, duration);
       pf.close();
       pendingFrame = null;
    }
    if (encoder) await encoder.flush();
    currentStage = 'ENCODER_FLUSH_DONE';
    durationRegistry.clear();
    
    currentStage = 'VIDEO_SOURCE_CLOSE_START';
    videoSource.close();
    currentStage = 'VIDEO_SOURCE_CLOSE_DONE';
    
    if (audioTask) {
      currentStage = 'AUDIO_PACKET_WRITE_START';
      await audioTask;
      if (audioError) {
        throw new Error(`Audio processing failed [Stage: ${currentStage}]: ${(audioError as any).message || audioError}`);
      }
      currentStage = 'AUDIO_PACKET_WRITE_DONE';
      
      currentStage = 'AUDIO_SOURCE_CLOSE_START';
      if (audioSource) {
        audioSource.close();
      }
      currentStage = 'AUDIO_SOURCE_CLOSE_DONE';
    }

    currentStage = 'OUTPUT_FINALIZE_START';
    await output.finalize();
    currentStage = 'OUTPUT_FINALIZE_DONE';
    
    currentStage = 'BUFFER_READY';
    const finalBlob = new Blob([outputBuffer.buffer as ArrayBuffer], { type: 'video/mp4' });
    currentStage = 'BLOB_CREATED';
    
    self.postMessage({
      type: 'DONE',
      blob: finalBlob,
      warnings: exportWarnings.length > 0 ? exportWarnings : undefined
    } as ExportWorkerResponse);
    currentStage = 'DONE_MESSAGE_SENT';
    
    reportProgress({ status: 'DONE', progress: 100 });
  } catch (err) {
    exportFailed = true;
    throw err;
  } finally {
    if (watchdog) clearTimeout(watchdog);
    durationRegistry.clear();
    if (pendingFrame) {
      try { (pendingFrame as any).close(); } catch {}
      pendingFrame = null;
    }
    if (decoder && decoder.state !== 'closed') {
      try { decoder.close(); } catch {}
    }
    if (encoder && encoder.state !== 'closed') {
      try { encoder.close(); } catch {}
    }
    if (audioSource && (audioSource as any)._closed !== true) {
      try { audioSource.close(); } catch {}
    }
  }
}
