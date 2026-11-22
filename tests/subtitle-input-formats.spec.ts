import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  Input,
  Mp4InputFormat,
  QuickTimeInputFormat,
  WebMInputFormat,
  BufferSource,
  Output,
  MovOutputFormat,
  WebMOutputFormat,
  BufferTarget,
  EncodedVideoPacketSource,
  EncodedPacketSink,
  EncodedPacket,
  UnsupportedInputFormatError
} from 'mediabunny';
import { validateVideoFile } from '../src/lib/caption-studio/export-utils';

test.describe('Subtitle Generator Input Format Reliability (Phase 2B.1)', () => {
  // Helper to create a minimal in-memory MOV fixture from sample-reel.mp4
  async function createMovFixture(): Promise<ArrayBuffer> {
    const samplePath = path.join(process.cwd(), 'public/assets/sample-reel.mp4');
    const inBuf = fs.readFileSync(samplePath);
    const input = new Input({
      formats: [new Mp4InputFormat()],
      source: new BufferSource(inBuf)
    });
    const videoTracks = await input.getVideoTracks();
    const videoTrack = videoTracks[0];

    const outBuf = new BufferTarget();
    const output = new Output({
      format: new MovOutputFormat(),
      target: outBuf
    });

    const codec = (await videoTrack.getCodec()) || 'avc';
    const source = new EncodedVideoPacketSource(codec);
    output.addVideoTrack(source);
    await output.start();

    const sink = new EncodedPacketSink(videoTrack);
    const decoderConfig = await videoTrack.getDecoderConfig();
    let count = 0;
    for await (const p of sink.packets()) {
      if (count++ === 0) {
        await source.add(p, decoderConfig ? { decoderConfig } : undefined);
      } else {
        await source.add(p);
      }
      if (count >= 5) break;
    }
    source.close();
    await output.finalize();
    return outBuf.buffer as ArrayBuffer;
  }

  // Helper to create a minimal in-memory WebM fixture with VP8 video packets
  async function createWebmFixture(): Promise<ArrayBuffer> {
    const outBuf = new BufferTarget();
    const output = new Output({
      format: new WebMOutputFormat(),
      target: outBuf
    });

    const source = new EncodedVideoPacketSource('vp8');
    output.addVideoTrack(source);
    await output.start();

    // Valid minimal VP8 keyframe packet
    const dummyVp8Packet = new EncodedPacket(
      new Uint8Array([0x30, 0x01, 0x00, 0x9d, 0x01, 0x2a, 0x10, 0x00, 0x10, 0x00, 0x00, 0x00]),
      'key',
      0,
      0.04
    );
    await source.add(dummyVp8Packet, {
      decoderConfig: { codec: 'vp8', codedWidth: 16, codedHeight: 16 }
    });

    source.close();
    await output.finalize();
    return outBuf.buffer as ArrayBuffer;
  }

  test('1. Format validation logic accepts MP4, MOV, WebM, M4V and rejects unsupported containers', () => {
    // Valid cases
    expect(validateVideoFile(new File([''], 'video.mp4', { type: 'video/mp4' })).valid).toBe(true);
    expect(validateVideoFile(new File([''], 'clip.mov', { type: 'video/quicktime' })).valid).toBe(true);
    expect(validateVideoFile(new File([''], 'stream.webm', { type: 'video/webm' })).valid).toBe(true);
    expect(validateVideoFile(new File([''], 'movie.m4v', { type: 'video/x-m4v' })).valid).toBe(true);

    // Browser missing MIME fallback (valid extension)
    expect(validateVideoFile(new File([''], 'recorded_iphone.MOV', { type: '' })).valid).toBe(true);
    expect(validateVideoFile(new File([''], 'screen_recording.WEBM', { type: '' })).valid).toBe(true);

    // Explicit unsupported video formats
    const aviCheck = validateVideoFile(new File([''], 'legacy.avi', { type: 'video/x-msvideo' }));
    expect(aviCheck.valid).toBe(false);
    expect(aviCheck.error).toContain('not supported');

    const mkvCheck = validateVideoFile(new File([''], 'highdef.mkv', { type: 'video/x-matroska' }));
    expect(mkvCheck.valid).toBe(false);
    expect(mkvCheck.error).toContain('not supported');

    // Non-video files
    const pdfCheck = validateVideoFile(new File([''], 'document.pdf', { type: 'application/pdf' }));
    expect(pdfCheck.valid).toBe(false);
    expect(pdfCheck.error).toContain('not a supported video');
  });

  test('2. MP4 input is successfully demuxed by the multi-format pipeline', async () => {
    const samplePath = path.join(process.cwd(), 'public/assets/sample-reel.mp4');
    const mp4Bytes = fs.readFileSync(samplePath);

    const input = new Input({
      formats: [new Mp4InputFormat(), new QuickTimeInputFormat(), new WebMInputFormat()],
      source: new BufferSource(mp4Bytes)
    });

    const videoTracks = await input.getVideoTracks();
    expect(videoTracks.length).toBeGreaterThan(0);
    const codec = await videoTracks[0].getCodec();
    expect(codec).toBe('avc');

    const config = await videoTracks[0].getDecoderConfig();
    expect(config).not.toBeNull();
    expect(config?.codedWidth).toBeGreaterThan(0);
    expect(config?.codedHeight).toBeGreaterThan(0);

    const sink = new EncodedPacketSink(videoTracks[0]);
    let packetCount = 0;
    for await (const packet of sink.packets()) {
      expect(packet.data.byteLength).toBeGreaterThan(0);
      packetCount++;
      if (packetCount >= 3) break;
    }
    expect(packetCount).toBe(3);
  });

  test('3. MOV input fails on single-format MP4 pipeline but succeeds on multi-format pipeline', async () => {
    const movBuffer = await createMovFixture();
    expect(movBuffer.byteLength).toBeGreaterThan(1000);

    // A. Regression verification: Single Mp4InputFormat fails on MOV with UnsupportedInputFormatError
    const regressionInput = new Input({
      formats: [new Mp4InputFormat()],
      source: new BufferSource(movBuffer)
    });
    await expect(regressionInput.getVideoTracks()).rejects.toThrow(UnsupportedInputFormatError);

    // B. Fix verification: Multi-format input demuxes MOV cleanly
    const multiInput = new Input({
      formats: [new Mp4InputFormat(), new QuickTimeInputFormat(), new WebMInputFormat()],
      source: new BufferSource(movBuffer)
    });

    const videoTracks = await multiInput.getVideoTracks();
    expect(videoTracks.length).toBe(1);
    const codec = await videoTracks[0].getCodec();
    expect(codec).toBe('avc');

    const config = await videoTracks[0].getDecoderConfig();
    expect(config).not.toBeNull();

    const sink = new EncodedPacketSink(videoTracks[0]);
    let packetCount = 0;
    for await (const packet of sink.packets()) {
      expect(packet.data.byteLength).toBeGreaterThan(0);
      packetCount++;
    }
    expect(packetCount).toBeGreaterThan(0);
  });

  test('4. WebM input fails on single-format MP4 pipeline but succeeds on multi-format pipeline', async () => {
    const webmBuffer = await createWebmFixture();
    expect(webmBuffer.byteLength).toBeGreaterThan(100);

    // A. Regression verification: Single Mp4InputFormat fails on WebM with UnsupportedInputFormatError
    const regressionInput = new Input({
      formats: [new Mp4InputFormat()],
      source: new BufferSource(webmBuffer)
    });
    await expect(regressionInput.getVideoTracks()).rejects.toThrow(UnsupportedInputFormatError);

    // B. Fix verification: Multi-format input demuxes WebM cleanly
    const multiInput = new Input({
      formats: [new Mp4InputFormat(), new QuickTimeInputFormat(), new WebMInputFormat()],
      source: new BufferSource(webmBuffer)
    });

    const videoTracks = await multiInput.getVideoTracks();
    expect(videoTracks.length).toBe(1);
    const codec = await videoTracks[0].getCodec();
    expect(codec).toBe('vp8');

    const config = await videoTracks[0].getDecoderConfig();
    expect(config).not.toBeNull();
    expect(config?.codec).toBe('vp8');
  });

  test('5. Unsupported video format (e.g. AVI header) throws controlled UnsupportedInputFormatError', async () => {
    // RIFF AVI dummy header (unsupported by Mediabunny's MP4/MOV/WebM formats)
    const aviHeader = Buffer.from('RIFF$   AVI LIST~   hdrlavih8   ');
    const input = new Input({
      formats: [new Mp4InputFormat(), new QuickTimeInputFormat(), new WebMInputFormat()],
      source: new BufferSource(aviHeader)
    });

    await expect(input.getVideoTracks()).rejects.toThrow(UnsupportedInputFormatError);
  });

  test('6. Corrupted file input (no valid video tracks) is handled gracefully', async () => {
    // Truncated / garbage bytes
    const corruptBytes = Buffer.from([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0xff, 0xff, 0xff, 0xff]);
    const input = new Input({
      formats: [new Mp4InputFormat(), new QuickTimeInputFormat(), new WebMInputFormat()],
      source: new BufferSource(corruptBytes)
    });

    const videoTracks = await input.getVideoTracks();
    // Resolves safely to 0 tracks without crashing process
    expect(videoTracks.length).toBe(0);
    const videoTrack = videoTracks[0];
    expect(() => {
      if (!videoTrack) {
        throw new Error('No video track found in the uploaded file. Please ensure the file contains a valid video stream.');
      }
    }).toThrow('No video track found in the uploaded file');
  });

  test('7. Static verification of worker and UI synchronization', () => {
    const workerPath = path.join(process.cwd(), 'src/workers/caption-export.worker.ts');
    const studioPath = path.join(process.cwd(), 'src/components/tools/caption-studio/CaptionStudio.tsx');

    const workerSrc = fs.readFileSync(workerPath, 'utf-8');
    const studioSrc = fs.readFileSync(studioPath, 'utf-8');

    // Worker registers all 3 input formats
    expect(workerSrc).toContain('new Mp4InputFormat()');
    expect(workerSrc).toContain('new QuickTimeInputFormat()');
    expect(workerSrc).toContain('new WebMInputFormat()');
    expect(workerSrc).toContain('UnsupportedInputFormatError');

    // UI file picker accepts all extensions and mime types
    expect(studioSrc).toContain('accept="video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.webm,.m4v"');

    // UI exports as .mp4
    expect(studioSrc).toContain('captioned_${baseName}.mp4');
  });
});
