import {
  Input,
  Mp4InputFormat,
  BlobSource,
  Output,
  Mp4OutputFormat,
  BufferTarget,
  EncodedAudioPacketSource,
  EncodedVideoPacketSource,
  EncodedPacketSink,
  EncodedPacket,
  VideoCodec
} from 'mediabunny';

import { ExportWorkerRequest, ExportWorkerResponse, ExportProgress } from '../lib/caption-studio/export-utils';
import { renderCaptionToCanvas, DEFAULT_STYLE, DEFAULT_POSITION } from '../lib/caption-studio/caption-renderer';
import { CaptionChunk } from '../lib/caption-studio/types';
import { StyleSettings, PositionSettings, FontPayload } from '../lib/caption-studio/style-types';

function reportProgress(progress: ExportProgress) {
  self.postMessage({ type: 'PROGRESS', progress } as ExportWorkerResponse);
}

let lastExportDiagnostics: any = null;
let currentStage = 'INIT';

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

      await runExport(req.file, req.captions, req.globalStyle, req.globalPosition);
    } catch (err: any) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      const diagnosticText = lastExportDiagnostics
        ? JSON.stringify(lastExportDiagnostics, null, 2)
        : "No video packet diagnostics were captured.";

      self.postMessage({
        type: 'ERROR',
        error: `Export failed [Stage: ${currentStage}]: ${message}\n\nExport diagnostics:\n${diagnosticText}`
      } as ExportWorkerResponse);
    }
  }
};

async function runExport(file: File, captions: CaptionChunk[], style: StyleSettings, position: PositionSettings) {
  reportProgress({ status: 'PREPARING' });

  const input = new Input({
    formats: [new Mp4InputFormat()],
    source: new BlobSource(file)
  });
  currentStage = 'INPUT_CREATED';

  const videoTracks = await input.getVideoTracks();
  const videoTrack = videoTracks[0];
  const audioTracks = await input.getAudioTracks();
  const audioTrack = audioTracks[0];

  if (!videoTrack) throw new Error('No video track found');
  currentStage = 'VIDEO_TRACK_FOUND';

  const videoCodec = await videoTrack.getCodec();
  const videoDecoderConfig = await videoTrack.getDecoderConfig();
  if (!videoDecoderConfig) throw new Error('Could not get video decoder config');
  currentStage = 'DECODER_CONFIG_LOADED';

  const width = videoDecoderConfig.codedWidth || 1920;
  const height = videoDecoderConfig.codedHeight || 1080;

  // Verify WebCodecs Encoder Support
  const encoderConfig: VideoEncoderConfig = {
    codec: 'avc1.4d002a', // H.264 Main Profile, Level 4.2
    width,
    height,
    framerate: 30, // fallback
    bitrate: 5_000_000,
  };
  

  const support = await VideoEncoder.isConfigSupported(encoderConfig);
  if (!support.supported) {
    throw new Error(`VideoEncoder config not supported for ${width}x${height}`);
  }
  currentStage = 'ENCODER_CREATED';

  const outputBuffer = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat(),
    target: outputBuffer
  });

  const videoSource = new EncodedVideoPacketSource(videoCodec as VideoCodec || 'avc1');
  lastExportDiagnostics = {
    width: Number.isFinite(width) ? width : null,
    height: Number.isFinite(height) ? height : null,
    codedWidth: Number.isFinite(encoderConfig.width) ? encoderConfig.width : null,
    codedHeight: Number.isFinite(encoderConfig.height) ? encoderConfig.height : null,
    codec: encoderConfig.codec ?? null,
    stage: currentStage
  };

  const outVideo = output.addVideoTrack(videoSource);

  // Prepare Audio Preservation
  let audioSource: EncodedAudioPacketSource | null = null;
  let audioTask: Promise<void> | null = null;
  if (audioTrack) {
    const audioCodec = await audioTrack.getCodec();
    const audioDecoderConfig = await audioTrack.getDecoderConfig();
    if (audioCodec && audioDecoderConfig) {
      audioSource = new EncodedAudioPacketSource(audioCodec);
      const outAudio = output.addAudioTrack(audioSource, {
        decoderConfig: audioDecoderConfig as any
      });
      
      audioTask = (async () => {
        const audioSink = new EncodedPacketSink(audioTrack);
        let first = true;
        for await (const packet of audioSink.packets()) {
          if (first) {
            await audioSource!.add(packet, { decoderConfig: audioDecoderConfig as any });
            first = false;
          } else {
            await audioSource!.add(packet);
          }
        }
      })();
    } else {
      console.warn("Could not retrieve audio codec/config. Audio preservation failed.");
    }
  }

  await output.start();
  reportProgress({ status: 'DECODING' });

  // Prepare Canvas & Shared Renderer
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;

  let decodeError: Error | null = null;
  let encodeError: Error | null = null;
  let firstEncode = true;

  let pendingFrame: VideoFrame | null = null;
  let decoder: VideoDecoder | null = null;
  let encoder: VideoEncoder | null = null;
  let watchdog: any = null;

  try {
    const processFrame = (frameToRender: VideoFrame, calculatedDuration: number) => {
    currentStage = 'CANVAS_RENDER';
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(frameToRender, 0, 0, width, height);

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
    if (encoder) encoder.encode(newFrame);
    newFrame.close();
  };

  currentStage = 'VIDEO_DECODER_CREATED';
  encoder = new VideoEncoder({
    output: async (chunk: EncodedVideoChunk, metadata: EncodedVideoChunkMetadata | undefined) => {
      currentStage = 'ENCODE_OUTPUT';
      try {
        if (!Number.isFinite(chunk.timestamp)) throw new Error("Chunk timestamp is non-finite");
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        const packetDuration = chunk.duration ? chunk.duration / 1_000_000 : 0;
        
        if (packetDuration <= 0) {
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
    error: (err) => { encodeError = new Error(`VIDEO_ENCODER_ERROR [${currentStage}]: ${err?.name} - ${err?.message} - ${err?.toString()}`); }
  });

  currentStage = 'ENCODER_CONFIGURED';
  encoder.configure(encoderConfig);

  decoder = new VideoDecoder({
    output: (frame: VideoFrame) => {
      currentStage = 'FIRST_FRAME_RECEIVED';
      try {
        if (encodeError) {
          frame.close();
          return;
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
    },
    error: (err) => { 
      decodeError = new Error(`VIDEO_DECODER_ERROR [${currentStage}]: ${err?.name} - ${err?.message} - ${err?.toString()}`); 
    }
  });

  currentStage = 'DECODER_CONFIGURED';
  decoder.configure(videoDecoderConfig);

  reportProgress({ status: 'RENDERING' });

  const videoSink = new EncodedPacketSink(videoTrack);
  for await (const packet of videoSink.packets()) {
    if (currentStage !== 'FIRST_DECODE_CALL') {
       currentStage = 'FIRST_PACKET_READ';
    }
    if (decodeError) throw decodeError;
    if (encodeError) throw encodeError;

    let waitStart = Date.now();
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
       let duration = pf.duration && pf.duration > 0 ? pf.duration : Math.round(1_000_000 / (encoderConfig.framerate || 30));
       processFrame(pendingFrame, duration);
       pf.close();
       pendingFrame = null;
    }
    if (encoder) await encoder.flush();
    currentStage = 'ENCODER_FLUSH_DONE';
    
    currentStage = 'VIDEO_SOURCE_CLOSE_START';
    videoSource.close();
    currentStage = 'VIDEO_SOURCE_CLOSE_DONE';
    
    if (audioTask) {
      currentStage = 'AUDIO_PACKET_WRITE_START';
      await audioTask;
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
      blob: finalBlob
    } as ExportWorkerResponse);
    currentStage = 'DONE_MESSAGE_SENT';
    
    reportProgress({ status: 'DONE', progress: 100 });
  } finally {
    if (watchdog) clearTimeout(watchdog);
    if (pendingFrame) {
      try { (pendingFrame as any).close(); } catch (e) {}
      pendingFrame = null;
    }
    if (decoder && decoder.state !== 'closed') {
      try { decoder.close(); } catch (e) {}
    }
    if (encoder && encoder.state !== 'closed') {
      try { encoder.close(); } catch (e) {}
    }
  }
}
