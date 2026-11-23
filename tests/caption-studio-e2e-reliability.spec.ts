import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Input, Mp4InputFormat, QuickTimeInputFormat, WebMInputFormat, BufferSource, EncodedPacketSink } from 'mediabunny';
import { DEFAULT_STYLE, DEFAULT_POSITION } from '../src/lib/caption-studio/caption-renderer';

const execFileAsync = promisify(execFile);
const ffmpegPath = require('ffmpeg-static') as string | null;
const samplePath = path.join(process.cwd(), 'sample.mp4');

type WorkerExportResult = {
  bytesBase64: string;
  duration: number;
  seeked: boolean;
  seekTime: number;
  greenPixelsAdded: number;
  warnings: string[];
  progressStates: string[];
};

type Mp4Inspection = {
  duration: number;
  videoTrackCount: number;
  audioTrackCount: number;
  videoCodec: string | null;
  videoWidth: number;
  videoHeight: number;
  videoPacketCount: number;
  videoTimelineValid: boolean; // finite PTS and positive packet durations; permits valid B-frame reordering
  audioCodec: string | null;
  audioProfile: string | null;
  audioSampleRate: number | null;
  audioChannels: number | null;
  audioPacketCount: number;
  audioTimelineValid: boolean;
  firstVideoTimestamp: number | null;
  firstAudioTimestamp: number | null;
};

let fixtureDir = '';
let movPcmPath = '';
let webmOpusPath = '';
let videoOnlyPath = '';

async function runFfmpeg(args: string[]): Promise<void> {
  if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
    throw new Error('The existing ffmpeg-static development dependency is unavailable on this machine.');
  }

  await execFileAsync(ffmpegPath, [
    '-hide_banner',
    '-loglevel', 'error',
    '-y',
    '-i', samplePath,
    ...args
  ], {
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024
  });
}

async function openMedia(bytes: Buffer | Uint8Array): Promise<Input> {
  return new Input({
    formats: [new Mp4InputFormat(), new QuickTimeInputFormat(), new WebMInputFormat()],
    source: new BufferSource(bytes)
  });
}

async function inspectMedia(bytes: Buffer | Uint8Array): Promise<Mp4Inspection> {
  const input = await openMedia(bytes);
  const videoTracks = await input.getVideoTracks();
  const audioTracks = await input.getAudioTracks();
  const duration = (await input.getDurationFromMetadata()) || 0;

  let videoCodec: string | null = null;
  let videoWidth = 0;
  let videoHeight = 0;
  let videoPacketCount = 0;
  let videoTimelineValid = true;
  let firstVideoTimestamp: number | null = null;

  if (videoTracks[0]) {
    videoCodec = await videoTracks[0].getCodec();
    videoWidth = await videoTracks[0].getDisplayWidth();
    videoHeight = await videoTracks[0].getDisplayHeight();
    const sink = new EncodedPacketSink(videoTracks[0]);

    for await (const packet of sink.packets()) {
      if (firstVideoTimestamp === null) firstVideoTimestamp = packet.timestamp;
      // Encoded video packet iteration can follow decode order; B-frame PTS values may be non-monotonic.
      // Validate finite timestamps and positive durations without incorrectly rejecting valid reordering.
      if (!Number.isFinite(packet.timestamp)) videoTimelineValid = false;
      if (!Number.isFinite(packet.duration) || packet.duration <= 0) {
        videoTimelineValid = false;
      }
      videoPacketCount++;
    }
  }

  let audioCodec: string | null = null;
  let audioProfile: string | null = null;
  let audioSampleRate: number | null = null;
  let audioChannels: number | null = null;
  let audioPacketCount = 0;
  let audioTimelineValid = true;
  let firstAudioTimestamp: number | null = null;
  let previousAudioTimestamp = Number.NEGATIVE_INFINITY;

  if (audioTracks[0]) {
    audioCodec = await audioTracks[0].getCodec();
    const decoderConfig = await audioTracks[0].getDecoderConfig();
    audioProfile = decoderConfig?.codec || null;
    audioSampleRate = await audioTracks[0].getSampleRate();
    audioChannels = await audioTracks[0].getNumberOfChannels();
    const sink = new EncodedPacketSink(audioTracks[0]);

    for await (const packet of sink.packets()) {
      if (firstAudioTimestamp === null) firstAudioTimestamp = packet.timestamp;
      if (!Number.isFinite(packet.timestamp) || packet.timestamp < previousAudioTimestamp) {
        audioTimelineValid = false;
      }
      if (!Number.isFinite(packet.duration) || packet.duration <= 0) {
        audioTimelineValid = false;
      }
      previousAudioTimestamp = packet.timestamp;
      audioPacketCount++;
    }
  }

  return {
    duration,
    videoTrackCount: videoTracks.length,
    audioTrackCount: audioTracks.length,
    videoCodec,
    videoWidth,
    videoHeight,
    videoPacketCount,
    videoTimelineValid,
    audioCodec,
    audioProfile,
    audioSampleRate,
    audioChannels,
    audioPacketCount,
    audioTimelineValid,
    firstVideoTimestamp,
    firstAudioTimestamp
  };
}


function expectAvStartOffsetPreserved(source: Mp4Inspection, output: Mp4Inspection, toleranceSeconds = 0.15): void {
  expect(source.firstVideoTimestamp).not.toBeNull();
  expect(source.firstAudioTimestamp).not.toBeNull();
  expect(output.firstVideoTimestamp).not.toBeNull();
  expect(output.firstAudioTimestamp).not.toBeNull();

  const sourceOffset = source.firstAudioTimestamp! - source.firstVideoTimestamp!;
  const outputOffset = output.firstAudioTimestamp! - output.firstVideoTimestamp!;
  expect(Math.abs(outputOffset - sourceOffset)).toBeLessThan(toleranceSeconds);
}

async function exportWithActualWorker(
  page: Page,
  fixturePath: string,
  fileName: string,
  mimeType: string
): Promise<WorkerExportResult> {
  await page.goto('/video-caption-generator');
  await expect(page.getByRole('heading', { name: 'Choose a video to caption' })).toBeVisible();

  const workerResponse = await page.request.get('/workers/caption-export.worker.js');
  expect(workerResponse.status()).toBe(200);
  expect(workerResponse.headers()['content-type']).toContain('javascript');

  const base64 = fs.readFileSync(fixturePath).toString('base64');
  const style = {
    ...DEFAULT_STYLE,
    fontFamily: 'Arial, sans-serif',
    fontSize: 0.075,
    textColor: '#FFFFFF',
    outlineWidth: 0.003,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    backgroundColor: '#00FF00',
    backgroundOpacity: 1,
    backgroundPadding: 0.025
  };

  return page.evaluate(async ({ encodedFile, name, type, captionStyle, position }) => {
    const raw = atob(encodedFile);
    const fileBytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) fileBytes[i] = raw.charCodeAt(i);

    const file = new File([fileBytes], name, { type });
    const worker = new Worker(`/workers/caption-export.worker.js?audit=${Date.now()}`, { type: 'module' });
    const progressStates: string[] = [];

    const waitForMetadata = (video: HTMLVideoElement) => new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('Timed out loading exported video metadata.')), 15_000);
      video.addEventListener('loadedmetadata', () => {
        window.clearTimeout(timeout);
        resolve();
      }, { once: true });
      video.addEventListener('error', () => {
        window.clearTimeout(timeout);
        reject(new Error(`HTML5 video could not load export: ${video.error?.message || 'unknown media error'}`));
      }, { once: true });
      video.load();
    });

    const seekVideo = (video: HTMLVideoElement, time: number) => new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('Timed out seeking exported MP4.')), 10_000);
      video.addEventListener('seeked', () => {
        window.clearTimeout(timeout);
        resolve();
      }, { once: true });
      video.currentTime = time;
    });

    try {
      const response = await new Promise<{ blob: Blob; warnings: string[] }>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          worker.terminate();
          reject(new Error(`Caption export worker exceeded the 120-second audit timeout. Progress: ${progressStates.join(', ')}`));
        }, 120_000);

        worker.onerror = (event) => {
          window.clearTimeout(timeout);
          reject(new Error(`Caption export worker runtime error: ${event.message}`));
        };

        worker.onmessage = (event: MessageEvent) => {
          const data = event.data;
          if (data?.type === 'PROGRESS') {
            if (data.progress?.status) progressStates.push(data.progress.status);
            return;
          }
          if (data?.type === 'ERROR') {
            window.clearTimeout(timeout);
            reject(new Error(data.error || 'Caption export worker returned an unspecified error.'));
            return;
          }
          if (data?.type === 'DONE') {
            window.clearTimeout(timeout);
            if (!(data.blob instanceof Blob)) {
              reject(new Error('Caption export worker returned DONE without a Blob.'));
              return;
            }
            resolve({ blob: data.blob, warnings: data.warnings || [] });
          }
        };

        worker.postMessage({
          type: 'START_EXPORT',
          file,
          captions: [{
            id: 'reliability-audit-caption',
            text: 'CAPTION AUDIT',
            start: 0,
            end: 999
          }],
          fonts: [],
          globalStyle: captionStyle,
          globalPosition: position
        });
      });

      if (response.blob.type !== 'video/mp4') {
        throw new Error(`Expected video/mp4 output, received ${response.blob.type || 'no MIME type'}.`);
      }

      const outputUrl = URL.createObjectURL(response.blob);
      const inputUrl = URL.createObjectURL(file);
      const outputVideo = document.createElement('video');
      const inputVideo = document.createElement('video');
      outputVideo.muted = true;
      inputVideo.muted = true;
      outputVideo.preload = 'auto';
      inputVideo.preload = 'auto';
      outputVideo.src = outputUrl;
      inputVideo.src = inputUrl;

      try {
        await Promise.all([waitForMetadata(outputVideo), waitForMetadata(inputVideo)]);
        if (!Number.isFinite(outputVideo.duration) || outputVideo.duration <= 0) {
          throw new Error('Exported MP4 reports an invalid duration.');
        }

        const seekTime = Math.min(0.5, outputVideo.duration / 2);
        await Promise.all([seekVideo(outputVideo, seekTime), seekVideo(inputVideo, seekTime)]);

        const width = outputVideo.videoWidth;
        const height = outputVideo.videoHeight;
        if (!width || !height) throw new Error('Exported MP4 has invalid display dimensions.');

        const sourceCanvas = document.createElement('canvas');
        const outputCanvas = document.createElement('canvas');
        sourceCanvas.width = outputCanvas.width = width;
        sourceCanvas.height = outputCanvas.height = height;
        const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
        const outputContext = outputCanvas.getContext('2d', { willReadFrequently: true });
        if (!sourceContext || !outputContext) throw new Error('Could not create canvas contexts for caption burn-in verification.');

        sourceContext.drawImage(inputVideo, 0, 0, width, height);
        outputContext.drawImage(outputVideo, 0, 0, width, height);
        const sourcePixels = sourceContext.getImageData(0, 0, width, height).data;
        const outputPixels = outputContext.getImageData(0, 0, width, height).data;

        // The test caption uses an opaque green background. Count newly introduced green pixels
        // in the expected caption zone to verify that the worker burned the caption into frames.
        const x0 = Math.floor(width * 0.15);
        const x1 = Math.ceil(width * 0.85);
        const y0 = Math.floor(height * 0.48);
        const y1 = Math.ceil(height * 0.82);
        let greenPixelsAdded = 0;
        const isStrongGreen = (r: number, g: number, b: number) => g > 145 && g > r * 1.3 && g > b * 1.3;

        for (let y = y0; y < y1; y += 1) {
          for (let x = x0; x < x1; x += 1) {
            const offset = (y * width + x) * 4;
            const sourceGreen = isStrongGreen(sourcePixels[offset], sourcePixels[offset + 1], sourcePixels[offset + 2]);
            const outputGreen = isStrongGreen(outputPixels[offset], outputPixels[offset + 1], outputPixels[offset + 2]);
            if (outputGreen && !sourceGreen) greenPixelsAdded++;
          }
        }

        const bytes = new Uint8Array(await response.blob.arrayBuffer());
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
        }
        return {
          bytesBase64: btoa(binary),
          duration: outputVideo.duration,
          seeked: outputVideo.currentTime > 0 && Math.abs(outputVideo.currentTime - seekTime) < 0.05,
          seekTime: outputVideo.currentTime,
          greenPixelsAdded,
          warnings: response.warnings,
          progressStates
        };
      } finally {
        outputVideo.pause();
        inputVideo.pause();
        outputVideo.removeAttribute('src');
        inputVideo.removeAttribute('src');
        outputVideo.load();
        inputVideo.load();
        URL.revokeObjectURL(outputUrl);
        URL.revokeObjectURL(inputUrl);
      }
    } finally {
      worker.terminate();
    }
  }, {
    encodedFile: base64,
    name: fileName,
    type: mimeType,
    captionStyle: style,
    position: { ...DEFAULT_POSITION, y: 0.65 }
  });
}

test.describe.serial('Caption Studio End-to-End Reliability Audit', () => {
  test.beforeEach(() => {
    test.setTimeout(180_000);
  });

  test.beforeAll(async () => {
    test.setTimeout(180_000);
    if (!fs.existsSync(samplePath)) throw new Error('Required repository fixture sample.mp4 was not found.');

    fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'caption-studio-e2e-'));
    movPcmPath = path.join(fixtureDir, 'input-pcm-16khz.mov');
    webmOpusPath = path.join(fixtureDir, 'input-opus.webm');
    videoOnlyPath = path.join(fixtureDir, 'input-video-only.mp4');

    await runFfmpeg([
      '-map', '0:v:0', '-map', '0:a:0',
      '-t', '3',
      '-c:v', 'copy',
      '-c:a', 'pcm_s16le',
      '-ar', '16000',
      '-ac', '2',
      '-f', 'mov',
      movPcmPath
    ]);

    await runFfmpeg([
      '-map', '0:v:0', '-map', '0:a:0',
      '-t', '3',
      '-c:v', 'libvpx',
      '-deadline', 'realtime',
      '-cpu-used', '8',
      '-b:v', '400k',
      '-c:a', 'libopus',
      '-ar', '44100',
      '-ac', '2',
      '-f', 'webm',
      webmOpusPath
    ]);

    await runFfmpeg([
      '-map', '0:v:0',
      '-an',
      '-c:v', 'copy',
      '-movflags', '+faststart',
      videoOnlyPath
    ]);

    for (const fixture of [movPcmPath, webmOpusPath, videoOnlyPath]) {
      expect(fs.existsSync(fixture)).toBe(true);
      expect(fs.statSync(fixture).size).toBeGreaterThan(1_000);
    }
  }, 180_000);

  test.afterAll(() => {
    if (fixtureDir && fs.existsSync(fixtureDir)) {
      fs.rmSync(fixtureDir, { recursive: true, force: true });
    }
  });

  test('Caption Studio route loads and exposes the supported upload formats', async ({ page }) => {
    await page.goto('/video-caption-generator');
    await expect(page).toHaveTitle(/Video Subtitle Generator/i);
    await expect(page.getByRole('heading', { name: 'Choose a video to caption' })).toBeVisible();

    const fileInput = page.locator('#video-upload');
    await expect(fileInput).toHaveAttribute('accept', /video\/mp4/);
    await expect(fileInput).toHaveAttribute('accept', /video\/quicktime/);
    await expect(fileInput).toHaveAttribute('accept', /video\/webm/);
    await expect(page.getByText('Up to 60 seconds')).toBeVisible();
  });

  test('Actual worker exports MP4 + AAC, preserves AAC-LC and warns about additional audio tracks', async ({ page }) => {
    const sourceBytes = fs.readFileSync(samplePath);
    const source = await inspectMedia(sourceBytes);
    expect(source.videoTrackCount).toBe(1);
    expect(source.audioTrackCount).toBeGreaterThan(0);
    expect(source.audioCodec).toBe('aac');
    expect(source.audioProfile).toMatch(/^mp4a\.40\.0?2$/);

    const result = await exportWithActualWorker(page, samplePath, 'audit-aac.mp4', 'video/mp4');
    const output = await inspectMedia(Buffer.from(result.bytesBase64, 'base64'));

    expect(output.videoTrackCount).toBe(1);
    expect(output.audioTrackCount).toBe(1);
    expect(output.audioCodec).toBe('aac');
    expect(output.audioProfile).toMatch(/^mp4a\.40\.0?2$/);
    expect(output.audioSampleRate).toBe(source.audioSampleRate);
    expectAvStartOffsetPreserved(source, output, 0.05);
    expect(output.audioPacketCount).toBeGreaterThan(0);
    expect(output.videoPacketCount).toBeGreaterThan(1);
    expect(output.videoTimelineValid).toBe(true);
    expect(output.audioTimelineValid).toBe(true);
    expect(output.duration).toBeGreaterThan(0.5);
    expect(result.seeked).toBe(true);
    expect(result.greenPixelsAdded).toBeGreaterThan(0);
    expect(result.progressStates).toContain('FINALIZING');

    if (source.audioTrackCount > 1) {
      expect(result.warnings.join(' ')).toContain('additional track(s) were omitted');
    }
  });

  test('Actual worker transcodes MOV + 16 kHz PCM to 48 kHz AAC-LC', async ({ page }) => {
    const source = await inspectMedia(fs.readFileSync(movPcmPath));
    expect(source.duration).toBeGreaterThan(0.5);
    expect(source.audioTrackCount).toBe(1);
    expect(source.audioSampleRate).toBe(16_000);

    const result = await exportWithActualWorker(page, movPcmPath, 'audit-pcm.mov', 'video/quicktime');
    const output = await inspectMedia(Buffer.from(result.bytesBase64, 'base64'));

    expectAvStartOffsetPreserved(source, output);
    expect(Math.abs(output.duration - source.duration)).toBeLessThan(0.5);
    expect(output.videoTrackCount).toBe(1);
    expect(output.audioTrackCount).toBe(1);
    expect(output.audioCodec).toBe('aac');
    expect(output.audioProfile).toMatch(/^mp4a\.40\.0?2$/);
    expect(output.audioSampleRate).toBe(48_000);
    expect(output.audioChannels).toBeGreaterThanOrEqual(1);
    expect(output.audioChannels).toBeLessThanOrEqual(2);
    expect(output.audioPacketCount).toBeGreaterThan(0);
    expect(output.audioTimelineValid).toBe(true);
    expect(output.videoTimelineValid).toBe(true);
    expect(output.duration).toBeGreaterThan(0.5);
    expect(result.seeked).toBe(true);
    expect(result.greenPixelsAdded).toBeGreaterThan(0);
    expect(result.progressStates).toContain('FINALIZING');
  });

  test('Actual worker transcodes WebM + Opus to 48 kHz AAC-LC', async ({ page }) => {
    const source = await inspectMedia(fs.readFileSync(webmOpusPath));
    expect(source.audioTrackCount).toBe(1);
    expect(source.audioCodec).toBe('opus');
    expect(source.audioSampleRate).toBe(44_100);

    const result = await exportWithActualWorker(page, webmOpusPath, 'audit-opus.webm', 'video/webm');
    const output = await inspectMedia(Buffer.from(result.bytesBase64, 'base64'));

    expectAvStartOffsetPreserved(source, output);
    expect(Math.abs(output.duration - source.duration)).toBeLessThan(0.5);
    expect(output.videoTrackCount).toBe(1);
    expect(output.audioTrackCount).toBe(1);
    expect(output.audioCodec).toBe('aac');
    expect(output.audioProfile).toMatch(/^mp4a\.40\.0?2$/);
    expect(output.audioSampleRate).toBe(48_000);
    expect(output.audioPacketCount).toBeGreaterThan(0);
    expect(output.audioTimelineValid).toBe(true);
    expect(output.videoTimelineValid).toBe(true);
    expect(output.duration).toBeGreaterThan(0.5);
    expect(result.seeked).toBe(true);
    expect(result.greenPixelsAdded).toBeGreaterThan(0);
    expect(result.progressStates).toContain('FINALIZING');
  });

  test('Actual worker exports MP4 without an audio track as a valid video-only MP4', async ({ page }) => {
    const input = await inspectMedia(fs.readFileSync(videoOnlyPath));
    expect(input.videoTrackCount).toBe(1);
    expect(input.audioTrackCount).toBe(0);

    const result = await exportWithActualWorker(page, videoOnlyPath, 'audit-no-audio.mp4', 'video/mp4');
    const output = await inspectMedia(Buffer.from(result.bytesBase64, 'base64'));

    expect(output.videoTrackCount).toBe(1);
    expect(output.audioTrackCount).toBe(0);
    expect(output.videoPacketCount).toBeGreaterThan(1);
    expect(output.videoTimelineValid).toBe(true);
    expect(output.duration).toBeGreaterThan(0.5);
    expect(result.seeked).toBe(true);
    expect(result.greenPixelsAdded).toBeGreaterThan(0);
    expect(result.progressStates).toContain('FINALIZING');
  });
});
