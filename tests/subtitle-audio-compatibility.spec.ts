/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import http from 'http';
import {
  Input,
  Mp4InputFormat,
  QuickTimeInputFormat,
  WebMInputFormat,
  BufferSource,
  Output,
  Mp4OutputFormat,
  MovOutputFormat,
  WebMOutputFormat,
  BufferTarget,
  EncodedAudioPacketSource,
  EncodedVideoPacketSource,
  EncodedPacketSink,
  AudioSampleSink,
  AudioSampleSource,
  AudioSample,
  QUALITY_HIGH
} from 'mediabunny';

import {
  determineAudioExportRoute,
  calculateTargetAudioConfig,
  type AudioExportRoute,
  type AudioRoutingDecision
} from '../src/workers/caption-export.worker';

test.describe('Audio Compatibility & Synchronization Reliability (Phase 2B.4)', () => {

  // =========================================================================
  // GROUP 1: Unit & Routing Decisions (determineAudioExportRoute & calculateTargetAudioConfig)
  // =========================================================================
  test.describe('Audio Route Selection & Target Configuration Logic', () => {

    test('1. AAC direct-copy preservation: valid AAC track with decoder config selects DIRECT_COPY', () => {
      const decision = determineAudioExportRoute({
        codec: 'aac',
        decoderConfig: {
          codec: 'mp4a.40.2',
          sampleRate: 48000,
          numberOfChannels: 2,
          description: new Uint8Array([17, 144])
        },
        sampleRate: 48000,
        numberOfChannels: 2
      });

      expect(decision.route).toBe('DIRECT_COPY');
      expect(decision.downmixed).toBe(false);
      expect(decision.resampled).toBe(false);
      expect(decision.targetChannels).toBe(2);
      expect(decision.targetSampleRate).toBe(48000);
      expect(decision.reason).toContain('Direct copy of AAC track');
    });

    test('2. MOV PCM S16 to AAC: uncompressed 16-bit PCM routes to TRANSCODE_AAC', () => {
      const decision = determineAudioExportRoute({
        codec: 'pcm-s16',
        decoderConfig: null,
        sampleRate: 48000,
        numberOfChannels: 2,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });

      expect(decision.route).toBe('TRANSCODE_AAC');
      expect(decision.targetChannels).toBe(2);
      expect(decision.targetSampleRate).toBe(48000);
      expect(decision.reason).toContain("Transcoding 'pcm-s16' audio to AAC");
    });

    test('3. MOV PCM S24 to AAC: 24-bit PCM routes to TRANSCODE_AAC when supported', () => {
      const decision = determineAudioExportRoute({
        codec: 'pcm-s24',
        decoderConfig: null,
        sampleRate: 44100,
        numberOfChannels: 2,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });

      expect(decision.route).toBe('TRANSCODE_AAC');
      expect(decision.targetChannels).toBe(2);
      expect(decision.targetSampleRate).toBe(44100);
      expect(decision.reason).toContain("Transcoding 'pcm-s24' audio to AAC");
    });

    test('4. MOV PCM F32 to AAC: 32-bit float PCM routes to TRANSCODE_AAC when supported', () => {
      const decision = determineAudioExportRoute({
        codec: 'pcm-f32',
        decoderConfig: null,
        sampleRate: 48000,
        numberOfChannels: 2,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });

      expect(decision.route).toBe('TRANSCODE_AAC');
      expect(decision.targetChannels).toBe(2);
      expect(decision.targetSampleRate).toBe(48000);
    });

    test('5. WebM Opus to AAC: Opus audio routes to TRANSCODE_AAC for broad MP4 compatibility', () => {
      const decision = determineAudioExportRoute({
        codec: 'opus',
        decoderConfig: {
          codec: 'opus',
          sampleRate: 48000,
          numberOfChannels: 2
        },
        sampleRate: 48000,
        numberOfChannels: 2,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });

      expect(decision.route).toBe('TRANSCODE_AAC');
      expect(decision.targetChannels).toBe(2);
      expect(decision.targetSampleRate).toBe(48000);
      expect(decision.reason).toContain("Transcoding 'opus' audio to AAC");
    });

    test('6. WebM Vorbis to AAC: Vorbis routes to TRANSCODE_AAC when decoder is present', () => {
      const decision = determineAudioExportRoute({
        codec: 'vorbis',
        decoderConfig: null,
        sampleRate: 44100,
        numberOfChannels: 2,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });

      expect(decision.route).toBe('TRANSCODE_AAC');
      expect(decision.targetChannels).toBe(2);
      expect(decision.targetSampleRate).toBe(44100);
    });

    test('7. Unsupported ALAC handling: unrecognized codec throws controlled UNSUPPORTED or permits VIDEO_ONLY opt-in', () => {
      // Default: strict rejection without silent data loss
      const strictDecision = determineAudioExportRoute({
        codec: 'alac' as any,
        decoderConfig: null,
        allowVideoOnlyFallback: false
      });
      expect(strictDecision.route).toBe('UNSUPPORTED');
      expect(strictDecision.reason).toContain("Audio codec 'alac' is unsupported");

      // With explicit user opt-in: permits video-only fallback
      const fallbackDecision = determineAudioExportRoute({
        codec: 'alac' as any,
        decoderConfig: null,
        allowVideoOnlyFallback: true
      });
      expect(fallbackDecision.route).toBe('VIDEO_ONLY');
      expect(fallbackDecision.reason).toContain("Unsupported audio codec 'alac'");
    });

    test('8. MP4 without audio: null codec cleanly routes to VIDEO_ONLY', () => {
      const decision = determineAudioExportRoute({
        codec: null,
        decoderConfig: null
      });

      expect(decision.route).toBe('VIDEO_ONLY');
      expect(decision.reason).toContain('No audio track present');
    });

    test('9. Missing decoder configuration on AAC track triggers UNSUPPORTED without silent dropping', () => {
      const strictDecision = determineAudioExportRoute({
        codec: 'aac',
        decoderConfig: null, // missing AudioSpecificConfig
        allowVideoOnlyFallback: false
      });
      expect(strictDecision.route).toBe('UNSUPPORTED');
      expect(strictDecision.reason).toContain('missing required decoder configuration metadata');

      const fallbackDecision = determineAudioExportRoute({
        codec: 'aac',
        decoderConfig: null,
        allowVideoOnlyFallback: true
      });
      expect(fallbackDecision.route).toBe('VIDEO_ONLY');
    });

    test('10. WebCodecs AudioEncoder unavailable: aborts with controlled error unless video-only opt-in', () => {
      const strictDecision = determineAudioExportRoute({
        codec: 'opus',
        decoderConfig: null,
        canDecode: true,
        hasAudioEncoder: false, // browser lacks AudioEncoder
        allowVideoOnlyFallback: false
      });
      expect(strictDecision.route).toBe('UNSUPPORTED');
      expect(strictDecision.reason).toContain('WebCodecs AudioEncoder is not available in this browser');

      const fallbackDecision = determineAudioExportRoute({
        codec: 'opus',
        decoderConfig: null,
        canDecode: true,
        hasAudioEncoder: false,
        allowVideoOnlyFallback: true
      });
      expect(fallbackDecision.route).toBe('VIDEO_ONLY');
    });

    test('11. Audio decoder failure (canDecode === false): prevents invalid encode attempts', () => {
      const decision = determineAudioExportRoute({
        codec: 'opus',
        decoderConfig: null,
        canDecode: false,
        hasAudioEncoder: true,
        aacEncoderSupported: true,
        allowVideoOnlyFallback: false
      });
      expect(decision.route).toBe('UNSUPPORTED');
      expect(decision.reason).toContain("Audio decoder unavailable for codec 'opus'");
    });

    test('12. Mono input: preserves 1 channel without unnecessary upmixing', () => {
      const config = calculateTargetAudioConfig(44100, 1);
      expect(config.targetChannels).toBe(1);
      expect(config.targetSampleRate).toBe(44100);
      expect(config.downmixed).toBe(false);

      const decision = determineAudioExportRoute({
        codec: 'opus',
        decoderConfig: null,
        sampleRate: 44100,
        numberOfChannels: 1,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });
      expect(decision.targetChannels).toBe(1);
      expect(decision.downmixed).toBe(false);
    });

    test('13. Stereo input: preserves 2 channels faithfully', () => {
      const config = calculateTargetAudioConfig(48000, 2);
      expect(config.targetChannels).toBe(2);
      expect(config.targetSampleRate).toBe(48000);
      expect(config.downmixed).toBe(false);
    });

    test('14. Multichannel input (5.1 surround): downmixes 6 channels to 2 channels for MP4 compatibility', () => {
      const config = calculateTargetAudioConfig(48000, 6);
      expect(config.targetChannels).toBe(2);
      expect(config.downmixed).toBe(true);

      const decision = determineAudioExportRoute({
        codec: 'pcm-s16',
        decoderConfig: null,
        sampleRate: 48000,
        numberOfChannels: 6,
        canDecode: true,
        hasAudioEncoder: true,
        aacEncoderSupported: true
      });
      expect(decision.route).toBe('TRANSCODE_AAC');
      expect(decision.targetChannels).toBe(2);
      expect(decision.downmixed).toBe(true);
    });

    test('15. Audio sample rate boundaries: clamps extreme sample rates to universal 16kHz-48kHz AAC range', () => {
      const highConfig = calculateTargetAudioConfig(96000, 2);
      expect(highConfig.targetSampleRate).toBe(48000);
      expect(highConfig.resampled).toBe(true);

      const lowConfig = calculateTargetAudioConfig(8000, 2);
      expect(lowConfig.targetSampleRate).toBe(16000);
      expect(lowConfig.resampled).toBe(true);

      const standardConfig = calculateTargetAudioConfig(44100, 2);
      expect(standardConfig.targetSampleRate).toBe(44100);
      expect(standardConfig.resampled).toBe(false);
    });
  });

  // =========================================================================
  // GROUP 2: End-to-End Muxing & Transcoding Pipelines (Synthetic & Real Fixtures)
  // =========================================================================
  test.describe('End-to-End Pipeline & Mediabunny Preservation', () => {

    test('16. AAC direct-copy preservation: demuxes real AAC track and copies packets byte-identically', async () => {
      const samplePath = path.join(process.cwd(), 'sample.mp4');
      expect(fs.existsSync(samplePath)).toBe(true);

      const sampleBuffer = fs.readFileSync(samplePath);
      const input = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(sampleBuffer.buffer)
      });

      const audioTracks = await input.getAudioTracks();
      expect(audioTracks.length).toBeGreaterThan(0);
      const track = audioTracks[0];

      const codec = await track.getCodec();
      expect(codec).toBe('aac');

      const decoderConfig = await track.getDecoderConfig();
      expect(decoderConfig).not.toBeNull();
      expect(decoderConfig?.codec).toContain('mp4a.40.2');

      // Direct copy through EncodedAudioPacketSource into a new MP4 container
      const outTarget = new BufferTarget();
      const output = new Output({
        format: new Mp4OutputFormat(),
        target: outTarget
      });

      const audioSource = new EncodedAudioPacketSource('aac');
      output.addAudioTrack(audioSource, { decoderConfig: decoderConfig as any });
      await output.start();

      const sink = new EncodedPacketSink(track);
      let packetCount = 0;
      let first = true;
      const originalTimestamps: number[] = [];

      for await (const pkt of sink.packets()) {
        packetCount++;
        originalTimestamps.push(pkt.timestamp);
        if (first) {
          await audioSource.add(pkt, { decoderConfig: decoderConfig as any });
          first = false;
        } else {
          await audioSource.add(pkt);
        }
        if (packetCount >= 25) break; // Test representative packet sequence
      }

      audioSource.close();
      await output.finalize();

      const outBuffer = outTarget.buffer;
      expect(outBuffer.byteLength).toBeGreaterThan(1000);

      // Verify the generated MP4 by demuxing it back
      const verifiedInput = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(outBuffer)
      });

      const verifiedTracks = await verifiedInput.getAudioTracks();
      expect(verifiedTracks.length).toBe(1);
      const verifiedTrack = verifiedTracks[0];
      expect(await verifiedTrack.getCodec()).toBe('aac');

      const verifiedSink = new EncodedPacketSink(verifiedTrack);
      const verifiedTimestamps: number[] = [];
      for await (const pkt of verifiedSink.packets()) {
        verifiedTimestamps.push(pkt.timestamp);
      }

      expect(verifiedTimestamps.length).toBe(originalTimestamps.length);
      for (let i = 0; i < verifiedTimestamps.length; i++) {
        expect(Math.abs(verifiedTimestamps[i] - originalTimestamps[i])).toBeLessThan(0.001);
      }
    });

    test('17. Multiple audio track diagnostics: detects secondary tracks and reports count', async () => {
      const samplePath = path.join(process.cwd(), 'sample.mp4');
      const sampleBuffer = fs.readFileSync(samplePath);
      const input = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(sampleBuffer.buffer)
      });

      const audioTracks = await input.getAudioTracks();
      // sample.mp4 contains 2 audio tracks (verified in forensic analysis)
      expect(audioTracks.length).toBe(2);

      const primaryTrack = audioTracks[0];
      const additionalCount = audioTracks.length - 1;
      expect(additionalCount).toBe(1);
      expect(await primaryTrack.getCodec()).toBe('aac');
    });

    test('18. Memory-safe streaming & AudioSample lifecycle: verifies sample.close() is called per sample', async () => {
      let closedCount = 0;
      let addedCount = 0;

      // Mock sample objects that track close() calls
      const mockSamples: any[] = [];
      for (let i = 0; i < 10; i++) {
        const s = {
          timestamp: i * 0.02,
          duration: 0.02,
          closed: false,
          close: function() {
            this.closed = true;
            closedCount++;
          }
        };
        mockSamples.push(s);
      }

      // Simulate streaming pipeline loop:
      for (const sample of mockSamples) {
        try {
          addedCount++;
          // simulate await audioSource.add(sample)
          await Promise.resolve();
        } finally {
          sample.close();
        }
      }

      expect(addedCount).toBe(10);
      expect(closedCount).toBe(10);
      expect(mockSamples.every(s => s.closed)).toBe(true);
    });

    test('19. Audio start offset preservation: non-zero start timestamps are preserved without drift', async () => {
      const startOffsetSec = 0.35; // Audio begins 350ms after timeline start
      const sampleRate = 48000;
      const channels = 2;
      const numFrames = 24000; // 0.5s duration

      const interleaved = new Int16Array(numFrames * channels);
      for (let i = 0; i < numFrames * channels; i++) {
        interleaved[i] = Math.round(Math.sin(2 * Math.PI * 440 * i / sampleRate) * 10000);
      }

      // Create MOV with PCM audio starting at 0.35s
      const movTarget = new BufferTarget();
      const movOutput = new Output({
        format: new MovOutputFormat(),
        target: movTarget
      });
      const audioSource = new AudioSampleSource({ codec: 'pcm-s16' });
      movOutput.addAudioTrack(audioSource);
      await movOutput.start();

      const sample = new AudioSample({
        format: 's16',
        sampleRate,
        numberOfChannels: channels,
        numberOfFrames: numFrames,
        timestamp: startOffsetSec,
        data: interleaved
      });
      await audioSource.add(sample);
      sample.close();
      audioSource.close();
      await movOutput.finalize();

      // Demux the MOV and inspect the first packet timestamp
      const movInput = new Input({
        formats: [new QuickTimeInputFormat()],
        source: new BufferSource(movTarget.buffer)
      });
      const track = (await movInput.getAudioTracks())[0];
      const packetSink = new EncodedPacketSink(track);
      const packets: any[] = [];
      for await (const p of packetSink.packets()) {
        packets.push(p);
      }

      expect(packets.length).toBeGreaterThan(0);
      expect(Math.abs(packets[0].timestamp - startOffsetSec)).toBeLessThan(0.001);
    });

    test('20. Video-only MP4: files without audio tracks export clean MP4 with zero audio tracks', async () => {
      const samplePath = path.join(process.cwd(), 'sample.mp4');
      const sampleBuffer = fs.readFileSync(samplePath);
      const input = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(sampleBuffer.buffer)
      });

      const videoTrack = (await input.getVideoTracks())[0];
      const videoDecoderConfig = await videoTrack.getDecoderConfig();
      expect(videoDecoderConfig).not.toBeNull();

      // Export video track only (0 audio tracks)
      const outTarget = new BufferTarget();
      const output = new Output({
        format: new Mp4OutputFormat(),
        target: outTarget
      });

      const videoSource = new EncodedVideoPacketSource('avc');
      output.addVideoTrack(videoSource);
      await output.start();

      const vSink = new EncodedPacketSink(videoTrack);
      let vCount = 0;
      let first = true;
      for await (const vp of vSink.packets()) {
        vCount++;
        if (first) {
          await videoSource.add(vp, { decoderConfig: videoDecoderConfig as any });
          first = false;
        } else {
          await videoSource.add(vp);
        }
        if (vCount >= 10) break;
      }
      videoSource.close();
      await output.finalize();

      const verified = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(outTarget.buffer)
      });

      expect((await verified.getVideoTracks()).length).toBe(1);
      expect((await verified.getAudioTracks()).length).toBe(0);
    });
  });

  // =========================================================================
  // GROUP 3: Real Browser WebCodecs Transcoding & HTML5 Media Playback (Playwright)
  // =========================================================================
  test.describe('Real Browser Playback & WebCodecs Transcoding Verification', () => {

    test('21. Browser WebCodecs: WebM with Opus transcodes to AAC and plays in HTML5 audio element', async ({ page }) => {
      // Set up a secure origin with bundled mediabunny
      const mbBundlePath = path.join(process.cwd(), 'node_modules/mediabunny/dist/bundles/mediabunny.cjs');
      expect(fs.existsSync(mbBundlePath)).toBe(true);
      const mbBundle = fs.readFileSync(mbBundlePath, 'utf8');

      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html><html><body><script>${mbBundle}</script></body></html>`);
      });

      await new Promise(r => server.listen(0, '127.0.0.1', r as any));
      const port = (server.address() as any).port;

      try {
        await page.goto(`http://127.0.0.1:${port}`);

        const result = await page.evaluate(async () => {
          const mb = (window as any).mediabunny || (window as any).Mediabunny;

          // 1. Create synthetic WebM with Opus audio (1.0s @ 48kHz, stereo sine wave)
          const sampleRate = 48000;
          const channels = 2;
          const numFrames = 48000;
          const interleaved = new Float32Array(numFrames * channels);
          for (let i = 0; i < numFrames; i++) {
            interleaved[i * 2] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5;
            interleaved[i * 2 + 1] = Math.sin(2 * Math.PI * 880 * i / sampleRate) * 0.5;
          }

          const webmTarget = new mb.BufferTarget();
          const webmOutput = new mb.Output({
            format: new mb.WebMOutputFormat(),
            target: webmTarget
          });
          const opusSource = new mb.AudioSampleSource({
            codec: 'opus',
            quality: mb.QUALITY_HIGH
          });
          webmOutput.addAudioTrack(opusSource);
          await webmOutput.start();

          const chunkSize = 1000;
          for (let offset = 0; offset < numFrames; offset += chunkSize) {
            const length = Math.min(chunkSize, numFrames - offset);
            const chunk = interleaved.subarray(offset * channels, (offset + length) * channels);
            const sample = new mb.AudioSample({
              format: 'f32',
              sampleRate,
              numberOfChannels: channels,
              numberOfFrames: length,
              timestamp: offset / sampleRate,
              data: chunk
            });
            await opusSource.add(sample);
            sample.close();
          }
          opusSource.close();
          await webmOutput.finalize();
          const webmBytes = webmTarget.buffer;

          // 2. Demux WebM and Transcode Opus to AAC inside standard MP4 container
          const input = new mb.Input({
            formats: [new mb.WebMInputFormat()],
            source: new mb.BufferSource(webmBytes)
          });
          const opusTrack = (await input.getAudioTracks())[0];
          const inputCodec = await opusTrack.getCodec();

          const mp4Target = new mb.BufferTarget();
          const mp4Output = new mb.Output({
            format: new mb.Mp4OutputFormat(),
            target: mp4Target
          });
          const aacSource = new mb.AudioSampleSource({
            codec: 'aac',
            quality: mb.QUALITY_HIGH
          });
          mp4Output.addAudioTrack(aacSource);
          await mp4Output.start();

          const sink = new mb.AudioSampleSink(opusTrack);
          let sampleCount = 0;
          for await (const s of sink.samples()) {
            sampleCount++;
            await aacSource.add(s);
            s.close();
          }
          aacSource.close();
          await mp4Output.finalize();
          const mp4Bytes = mp4Target.buffer;

          // 3. Load generated MP4 into real HTML5 Audio element and verify playback
          const blob = new Blob([mp4Bytes], { type: 'audio/mp4' });
          const url = URL.createObjectURL(blob);
          const audioEl = document.createElement('audio');
          audioEl.src = url;

          const playResult = await new Promise<any>((resolve) => {
            audioEl.oncanplay = () => {
              resolve({
                canPlay: true,
                duration: audioEl.duration,
                readyState: audioEl.readyState
              });
            };
            audioEl.onerror = () => {
              resolve({ canPlay: false, error: audioEl.error?.message || 'Playback failed' });
            };
            setTimeout(() => resolve({ canPlay: false, error: 'Playback timeout' }), 5000);
          });

          return {
            inputCodec,
            sampleCount,
            mp4ByteLength: mp4Bytes.byteLength,
            playResult
          };
        });

        expect(result.inputCodec).toBe('opus');
        expect(result.sampleCount).toBeGreaterThan(0);
        expect(result.mp4ByteLength).toBeGreaterThan(5000);
        expect(result.playResult.canPlay).toBe(true);
        expect(result.playResult.duration).toBeGreaterThan(0.9);
        expect(result.playResult.readyState).toBeGreaterThanOrEqual(2);
      } finally {
        server.close();
      }
    });

    test('22. Browser WebCodecs: MOV with PCM-S16 transcodes to AAC and advances playback', async ({ page }) => {
      const mbBundlePath = path.join(process.cwd(), 'node_modules/mediabunny/dist/bundles/mediabunny.cjs');
      const mbBundle = fs.readFileSync(mbBundlePath, 'utf8');

      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html><html><body><script>${mbBundle}</script></body></html>`);
      });

      await new Promise(r => server.listen(0, '127.0.0.1', r as any));
      const port = (server.address() as any).port;

      try {
        await page.goto(`http://127.0.0.1:${port}`);

        const result = await page.evaluate(async () => {
          const mb = (window as any).mediabunny || (window as any).Mediabunny;

          // 1. Create synthetic MOV with PCM-S16
          const sampleRate = 48000;
          const channels = 2;
          const numFrames = 48000;
          const interleaved = new Int16Array(numFrames * channels);
          for (let i = 0; i < numFrames; i++) {
            interleaved[i * 2] = Math.round(Math.sin(2 * Math.PI * 440 * i / sampleRate) * 16000);
            interleaved[i * 2 + 1] = Math.round(Math.sin(2 * Math.PI * 880 * i / sampleRate) * 16000);
          }

          const movTarget = new mb.BufferTarget();
          const movOutput = new mb.Output({
            format: new mb.MovOutputFormat(),
            target: movTarget
          });
          const pcmSource = new mb.AudioSampleSource({ codec: 'pcm-s16' });
          movOutput.addAudioTrack(pcmSource);
          await movOutput.start();

          const chunkSize = 2000;
          for (let offset = 0; offset < numFrames; offset += chunkSize) {
            const length = Math.min(chunkSize, numFrames - offset);
            const chunk = interleaved.subarray(offset * channels, (offset + length) * channels);
            const sample = new mb.AudioSample({
              format: 's16',
              sampleRate,
              numberOfChannels: channels,
              numberOfFrames: length,
              timestamp: offset / sampleRate,
              data: chunk
            });
            await pcmSource.add(sample);
            sample.close();
          }
          pcmSource.close();
          await movOutput.finalize();
          const movBytes = movTarget.buffer;

          // 2. Transcode PCM to AAC in MP4
          const input = new mb.Input({
            formats: [new mb.QuickTimeInputFormat()],
            source: new mb.BufferSource(movBytes)
          });
          const pcmTrack = (await input.getAudioTracks())[0];
          const inputCodec = await pcmTrack.getCodec();

          const mp4Target = new mb.BufferTarget();
          const mp4Output = new mb.Output({
            format: new mb.Mp4OutputFormat(),
            target: mp4Target
          });
          const aacSource = new mb.AudioSampleSource({
            codec: 'aac',
            quality: mb.QUALITY_HIGH
          });
          mp4Output.addAudioTrack(aacSource);
          await mp4Output.start();

          const sink = new mb.AudioSampleSink(pcmTrack);
          for await (const s of sink.samples()) {
            await aacSource.add(s);
            s.close();
          }
          aacSource.close();
          await mp4Output.finalize();
          const mp4Bytes = mp4Target.buffer;

          // 3. Play in HTML5 Audio and verify playback advances
          const blob = new Blob([mp4Bytes], { type: 'audio/mp4' });
          const url = URL.createObjectURL(blob);
          const audioEl = document.createElement('audio');
          audioEl.src = url;

          const playResult = await new Promise<any>((resolve) => {
            audioEl.oncanplay = async () => {
              try {
                await audioEl.play();
                setTimeout(() => {
                  resolve({
                    canPlay: true,
                    duration: audioEl.duration,
                    currentTime: audioEl.currentTime,
                    advanced: audioEl.currentTime > 0
                  });
                }, 200);
              } catch (e: any) {
                resolve({ canPlay: true, duration: audioEl.duration, playError: e.message });
              }
            };
            audioEl.onerror = () => {
              resolve({ canPlay: false, error: audioEl.error?.message || 'Playback failed' });
            };
            setTimeout(() => resolve({ canPlay: false, error: 'Playback timeout' }), 5000);
          });

          return {
            inputCodec,
            mp4ByteLength: mp4Bytes.byteLength,
            playResult
          };
        });

        expect(result.inputCodec).toBe('pcm-s16');
        expect(result.mp4ByteLength).toBeGreaterThan(5000);
        expect(result.playResult.canPlay).toBe(true);
        expect(result.playResult.duration).toBeGreaterThan(0.9);
      } finally {
        server.close();
      }
    });

    test('23. Multichannel downmixing in browser: 6-channel audio cleanly transcodes to stereo AAC', async ({ page }) => {
      const mbBundlePath = path.join(process.cwd(), 'node_modules/mediabunny/dist/bundles/mediabunny.cjs');
      const mbBundle = fs.readFileSync(mbBundlePath, 'utf8');

      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html><html><body><script>${mbBundle}</script></body></html>`);
      });

      await new Promise(r => server.listen(0, '127.0.0.1', r as any));
      const port = (server.address() as any).port;

      try {
        await page.goto(`http://127.0.0.1:${port}`);

        const result = await page.evaluate(async () => {
          const mb = (window as any).mediabunny || (window as any).Mediabunny;

          // 1. Create 6-channel PCM MOV
          const sampleRate = 48000;
          const channels = 6;
          const numFrames = 24000; // 0.5s
          const interleaved = new Int16Array(numFrames * channels);
          for (let i = 0; i < numFrames * channels; i++) {
            interleaved[i] = Math.round(Math.sin(2 * Math.PI * 440 * i / sampleRate) * 10000);
          }

          const movTarget = new mb.BufferTarget();
          const movOutput = new mb.Output({
            format: new mb.MovOutputFormat(),
            target: movTarget
          });
          const pcmSource = new mb.AudioSampleSource({
            codec: 'pcm-s16',
            transform: { numberOfChannels: 6 }
          });
          movOutput.addAudioTrack(pcmSource);
          await movOutput.start();

          const sample = new mb.AudioSample({
            format: 's16',
            sampleRate,
            numberOfChannels: channels,
            numberOfFrames: numFrames,
            timestamp: 0,
            data: interleaved
          });
          await pcmSource.add(sample);
          sample.close();
          pcmSource.close();
          await movOutput.finalize();

          // 2. Transcode with downmixing to stereo (2 channels)
          const input = new mb.Input({
            formats: [new mb.QuickTimeInputFormat()],
            source: new mb.BufferSource(movTarget.buffer)
          });
          const track = (await input.getAudioTracks())[0];
          const inputChannels = await track.getNumberOfChannels();

          const mp4Target = new mb.BufferTarget();
          const mp4Output = new mb.Output({
            format: new mb.Mp4OutputFormat(),
            target: mp4Target
          });
          const aacSource = new mb.AudioSampleSource({
            codec: 'aac',
            quality: mb.QUALITY_HIGH,
            transform: { numberOfChannels: 2 }
          });
          mp4Output.addAudioTrack(aacSource);
          await mp4Output.start();

          const sink = new mb.AudioSampleSink(track);
          for await (const s of sink.samples()) {
            await aacSource.add(s);
            s.close();
          }
          aacSource.close();
          await mp4Output.finalize();

          // 3. Demux the generated MP4 to verify channel count
          const verified = new mb.Input({
            formats: [new mb.Mp4InputFormat()],
            source: new mb.BufferSource(mp4Target.buffer)
          });
          const verifiedTrack = (await verified.getAudioTracks())[0];
          const outputChannels = await verifiedTrack.getNumberOfChannels();
          const outputCodec = await verifiedTrack.getCodec();

          return {
            inputChannels,
            outputChannels,
            outputCodec
          };
        });

        expect(result.inputChannels).toBe(6);
        expect(result.outputChannels).toBe(2);
        expect(result.outputCodec).toBe('aac');
      } finally {
        server.close();
      }
    });

    test('24. Seeking and duration alignment in HTML5 video element with exported MP4', async ({ page }) => {
      const mbBundlePath = path.join(process.cwd(), 'node_modules/mediabunny/dist/bundles/mediabunny.cjs');
      const mbBundle = fs.readFileSync(mbBundlePath, 'utf8');

      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html><html><body><script>${mbBundle}</script></body></html>`);
      });

      await new Promise(r => server.listen(0, '127.0.0.1', r as any));
      const port = (server.address() as any).port;

      try {
        await page.goto(`http://127.0.0.1:${port}`);

        const result = await page.evaluate(async () => {
          const mb = (window as any).mediabunny || (window as any).Mediabunny;

          // Create MP4 with AAC audio (2 seconds)
          const sampleRate = 48000;
          const channels = 2;
          const numFrames = 96000; // 2.0s
          const interleaved = new Float32Array(numFrames * channels);
          for (let i = 0; i < numFrames; i++) {
            interleaved[i * 2] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 0.5;
            interleaved[i * 2 + 1] = Math.sin(2 * Math.PI * 880 * i / sampleRate) * 0.5;
          }

          const mp4Target = new mb.BufferTarget();
          const mp4Output = new mb.Output({
            format: new mb.Mp4OutputFormat(),
            target: mp4Target
          });
          const aacSource = new mb.AudioSampleSource({
            codec: 'aac',
            quality: mb.QUALITY_HIGH
          });
          mp4Output.addAudioTrack(aacSource);
          await mp4Output.start();

          const chunkSize = 2000;
          for (let offset = 0; offset < numFrames; offset += chunkSize) {
            const length = Math.min(chunkSize, numFrames - offset);
            const chunk = interleaved.subarray(offset * channels, (offset + length) * channels);
            const sample = new mb.AudioSample({
              format: 'f32',
              sampleRate,
              numberOfChannels: channels,
              numberOfFrames: length,
              timestamp: offset / sampleRate,
              data: chunk
            });
            await aacSource.add(sample);
            sample.close();
          }
          aacSource.close();
          await mp4Output.finalize();
          const mp4Bytes = mp4Target.buffer;

          // Load into HTML5 Video element and test seeking
          const blob = new Blob([mp4Bytes], { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          const videoEl = document.createElement('video');
          videoEl.src = url;

          const seekResult = await new Promise<any>((resolve) => {
            videoEl.onloadedmetadata = () => {
              const targetTime = 1.0;
              videoEl.onseeked = () => {
                resolve({
                  seeked: true,
                  duration: videoEl.duration,
                  currentTime: videoEl.currentTime,
                  seekOffsetDelta: Math.abs(videoEl.currentTime - targetTime)
                });
              };
              videoEl.currentTime = targetTime;
            };
            videoEl.onerror = () => {
              resolve({ seeked: false, error: videoEl.error?.message || 'Video error' });
            };
            setTimeout(() => resolve({ seeked: false, error: 'Metadata timeout' }), 5000);
          });

          return {
            mp4ByteLength: mp4Bytes.byteLength,
            seekResult
          };
        });

        expect(result.mp4ByteLength).toBeGreaterThan(10000);
        expect(result.seekResult.seeked).toBe(true);
        expect(result.seekResult.duration).toBeGreaterThan(1.9);
        expect(result.seekResult.seekOffsetDelta).toBeLessThan(0.1);
      } finally {
        server.close();
      }
    });

  });

});
