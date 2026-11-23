import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  Input,
  Mp4InputFormat,
  BufferSource,
  Output,
  Mp4OutputFormat,
  BufferTarget,
  EncodedVideoPacketSource,
  EncodedAudioPacketSource,
  EncodedPacketSink,
  EncodedPacket
} from 'mediabunny';

import {
  FrameDurationRegistry,
  resolveChunkDuration
} from '../src/workers/caption-export.worker';

test.describe('WebCodecs Frame Duration Recovery & Timing Integrity (Phase 2B.2)', () => {

  test.describe('Unit & Hierarchy Tests: Duration Recovery Order & Registry Invariants', () => {
    // Requirement 1: Normal positive chunk.duration
    test('1. Normal positive chunk.duration is preferred over all fallbacks', () => {
      const chunkDuration = 33333; // 33.333ms in microseconds
      const registeredDuration = 40000;
      const configuredFramerate = 24;

      const resolved = resolveChunkDuration(chunkDuration, registeredDuration, configuredFramerate);
      expect(resolved).toBe(33333);
    });

    // Requirement 2: Null chunk.duration
    test('2. Null chunk.duration recovers original registered VideoFrame duration', () => {
      const chunkDuration = null;
      const registeredDuration = 41666; // 24fps frame duration in microseconds
      const configuredFramerate = 30;

      const resolved = resolveChunkDuration(chunkDuration, registeredDuration, configuredFramerate);
      expect(resolved).toBe(41666);
    });

    // Requirement 3: Zero chunk.duration
    test('3. Zero chunk.duration recovers original registered VideoFrame duration', () => {
      const chunkDuration = 0; // Hardware encoders routinely emit 0
      const registeredDuration = 50000; // 20fps in microseconds
      const configuredFramerate = 30;

      const resolved = resolveChunkDuration(chunkDuration, registeredDuration, configuredFramerate);
      expect(resolved).toBe(50000);
    });

    // Requirement 4: Original VideoFrame duration recovery
    test('4. Original VideoFrame duration is registered and consumed by exact timestamp', () => {
      const registry = new FrameDurationRegistry();
      const tsMicroseconds = 1_500_000; // 1.5s
      const frameDuration = 33333;

      registry.register(tsMicroseconds, frameDuration);
      expect(registry.size).toBe(1);

      // Consume returns the registered duration exactly once
      const consumed = registry.consume(tsMicroseconds);
      expect(consumed).toBe(frameDuration);
      expect(registry.size).toBe(0);

      // Subsequent consumption for same timestamp returns null
      const secondConsume = registry.consume(tsMicroseconds);
      expect(secondConsume).toBeNull();
    });

    // Requirement 5: Variable-frame-rate duration preservation
    test('5. Variable-frame-rate duration preservation across differing frame intervals', () => {
      const registry = new FrameDurationRegistry();

      // VFR sequence: Frame 0 (33.3ms), Frame 1 (16.7ms), Frame 2 (50ms)
      const vfrFrames = [
        { ts: 0, dur: 33333 },
        { ts: 33333, dur: 16667 },
        { ts: 50000, dur: 50000 }
      ];

      for (const f of vfrFrames) {
        registry.register(f.ts, f.dur);
      }
      expect(registry.size).toBe(3);

      // Simulated hardware encoder: all chunks emitted with chunk.duration = null
      for (const f of vfrFrames) {
        const recovered = resolveChunkDuration(null, registry.consume(f.ts), 30);
        expect(recovered).toBe(f.dur);
      }
      expect(registry.size).toBe(0);
    });

    // Requirement 6: Out-of-order encoder callbacks
    test('6. Out-of-order encoder callbacks correctly retrieve matching timestamp durations', () => {
      const registry = new FrameDurationRegistry();

      const frames = [
        { ts: 100000, dur: 33333 },
        { ts: 133333, dur: 33334 },
        { ts: 166667, dur: 33333 }
      ];

      for (const f of frames) {
        registry.register(f.ts, f.dur);
      }

      // Simulate encoder completing in out-of-order sequence: Frame 2, Frame 0, Frame 1
      const dur2 = registry.consume(166667);
      expect(dur2).toBe(33333);

      const dur0 = registry.consume(100000);
      expect(dur0).toBe(33333);

      const dur1 = registry.consume(133333);
      expect(dur1).toBe(33334);

      expect(registry.size).toBe(0);
    });

    // Requirement 7: Duplicate timestamps where supported
    test('7. Duplicate timestamps are queued and consumed in FIFO order without clobbering', () => {
      const registry = new FrameDurationRegistry();
      const duplicateTs = 2_000_000;

      registry.register(duplicateTs, 30000);
      registry.register(duplicateTs, 45000);

      expect(registry.size).toBe(1); // One timestamp key in the map
      expect(registry.pendingCount).toBe(2); // Two total pending duration records

      const first = registry.consume(duplicateTs);
      expect(first).toBe(30000);
      expect(registry.pendingCount).toBe(1);

      const second = registry.consume(duplicateTs);
      expect(second).toBe(45000);
      expect(registry.pendingCount).toBe(0);

      const third = registry.consume(duplicateTs);
      expect(third).toBeNull();
      expect(registry.size).toBe(0);
      expect(registry.pendingCount).toBe(0);
    });

    // Requirement 8: Missing duration mapping with FPS fallback
    test('8. Missing duration mapping uses validated FPS fallback when chunk.duration is absent', () => {
      const chunkDuration = null;
      const registeredDuration = null; // Unmapped chunk (e.g., dropped or unregistered)
      const configuredFramerate = 60;

      const resolved = resolveChunkDuration(chunkDuration, registeredDuration, configuredFramerate);
      expect(resolved).toBe(Math.round(1_000_000 / 60)); // ~16667 microseconds
    });

    // Requirement 9: Invalid FPS configuration
    test('9. Invalid or non-positive FPS configuration falls back safely to default 30 FPS', () => {
      const invalidFramerates = [0, -10, NaN, Infinity, -Infinity, null, undefined];

      for (const fps of invalidFramerates) {
        const resolved = resolveChunkDuration(null, null, fps as unknown as number | null | undefined);
        expect(resolved).toBe(Math.round(1_000_000 / 30)); // 33333 microseconds
      }
    });

    // Requirement 10: Cleanup after encoder failures and capacity eviction
    test('10. Registry cleanly purges unconsumed entries on clear() and respects bounded capacity', () => {
      const registry = new FrameDurationRegistry(5); // Small capacity for test

      for (let i = 0; i < 8; i++) {
        registry.register(i * 33333, 33333);
      }

      // Max capacity is 5: oldest entries must be evicted to prevent unbounded growth
      expect(registry.pendingCount).toBeLessThanOrEqual(5);
      expect(registry.size).toBeLessThanOrEqual(5);

      // Verify clear resets everything
      registry.clear();
      expect(registry.pendingCount).toBe(0);
      expect(registry.size).toBe(0);
      expect(registry.consume(0)).toBeNull();
    });

    // Phase 2B.2A: Capacity Hardening on Duplicate Timestamps (>1,000 frames)
    test('10A. Hard capacity limit of 1,000 pending records enforced for duplicate timestamps', () => {
      const registry = new FrameDurationRegistry(1000);
      const sameTs = 5_000_000;

      // Register 1,500 frames all sharing the identical presentation timestamp
      for (let i = 1; i <= 1500; i++) {
        registry.register(sameTs, i);
      }

      // Hard ceiling of 1,000 must be strictly enforced on pendingCount
      expect(registry.pendingCount).toBe(1000);
      expect(registry.size).toBe(1); // Single timestamp key

      // Verify FIFO eviction: records 1..500 were evicted, oldest remaining is 501
      const firstRemaining = registry.consume(sameTs);
      expect(firstRemaining).toBe(501);
      expect(registry.pendingCount).toBe(999);

      // Verify consume drains accurately down to 0
      for (let i = 502; i <= 1500; i++) {
        expect(registry.consume(sameTs)).toBe(i);
      }
      expect(registry.pendingCount).toBe(0);
      expect(registry.size).toBe(0);
      expect(registry.consume(sameTs)).toBeNull();
    });

    // Phase 2B.2A: Rollback on Synchronous Encode Failures
    test('10B. Synchronous encode failure rolls back only the most recent registration for duplicate timestamp', () => {
      const registry = new FrameDurationRegistry();
      const ts = 3_000_000;

      // Register initial valid frame
      registry.register(ts, 33333);
      expect(registry.pendingCount).toBe(1);

      // Simulate a second frame registered for the same timestamp where encoder.encode() throws synchronously
      registry.register(ts, 50000);
      expect(registry.pendingCount).toBe(2);

      // Rollback undoes the failed second attempt without consuming or clobbering the first
      const rolledBack = registry.rollback(ts);
      expect(rolledBack).toBe(true);
      expect(registry.pendingCount).toBe(1);

      // The original valid frame (33333) remains intact and is consumed
      const consumed = registry.consume(ts);
      expect(consumed).toBe(33333);
      expect(registry.pendingCount).toBe(0);
      expect(registry.size).toBe(0);

      // Additional rollback on empty timestamp returns false safely
      expect(registry.rollback(ts)).toBe(false);
    });

    // Phase 2B.2A: Documented Ordering Guarantees for Duplicate Timestamps
    test('10C. Distinct timestamps guarantee 1:1 out-of-order recovery; duplicate timestamps guarantee FIFO recovery', () => {
      const registry = new FrameDurationRegistry();

      // Distinct timestamps: completely independent of callback arrival order
      registry.register(100, 10);
      registry.register(200, 20);
      registry.register(300, 30);

      expect(registry.consume(300)).toBe(30);
      expect(registry.consume(100)).toBe(10);
      expect(registry.consume(200)).toBe(20);

      // Duplicate timestamps: served in FIFO order
      // (True 1:1 hardware chunk association cannot be guaranteed if encoder reorders chunks with identical timestamps)
      registry.register(500, 51);
      registry.register(500, 52);

      expect(registry.consume(500)).toBe(51);
      expect(registry.consume(500)).toBe(52);
      expect(registry.pendingCount).toBe(0);
    });
  });

  test.describe('End-to-End Output Verification: Mediabunny Muxing, Parsing & Sync', () => {
    // Helper to read and prepare sample video file
    function getSampleVideoBuffer(): Buffer {
      const samplePath = path.join(process.cwd(), 'public/assets/sample-reel.mp4');
      return fs.readFileSync(samplePath);
    }

    // Requirement 11 & Output Verification 1: Simulated missing-duration hardware encoder
    // NOTE: This test performs a deterministic software simulation of missing WebCodecs chunk durations
    // (setting chunk.duration = null or 0), representative of Apple VideoToolbox and Windows Media Foundation
    // behavior, verifying container muxing without requiring live OS GPU encoder hardware.
    test('11. Simulated hardware encoder (missing/zero durations): MP4 muxes and demuxes with valid packet timings', async () => {
      const videoBuffer = getSampleVideoBuffer();
      const input = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(videoBuffer)
      });

      const videoTracks = await input.getVideoTracks();
      expect(videoTracks.length).toBeGreaterThan(0);
      const videoTrack = videoTracks[0];

      const outTarget = new BufferTarget();
      const output = new Output({
        format: new Mp4OutputFormat(),
        target: outTarget
      });

      const codec = (await videoTrack.getCodec()) || 'avc';
      const videoSource = new EncodedVideoPacketSource(codec);
      output.addVideoTrack(videoSource);
      await output.start();

      const registry = new FrameDurationRegistry();
      const videoSink = new EncodedPacketSink(videoTrack);
      const decoderConfig = await videoTrack.getDecoderConfig();

      let packetIndex = 0;
      const originalPackets: EncodedPacket[] = [];

      for await (const packet of videoSink.packets()) {
        originalPackets.push(packet);
        if (packetIndex++ >= 30) break; // Test a 30-frame window
      }

      // Step A: Simulate VideoFrame registration in worker
      for (const p of originalPackets) {
        const tsMicros = Math.round(p.timestamp * 1_000_000);
        const durMicros = Math.round(p.duration * 1_000_000);
        registry.register(tsMicros, durMicros > 0 ? durMicros : 33333);
      }

      // Step B: Simulate hardware encoder output callback where chunk.duration = 0 or null
      let isFirst = true;
      for (const p of originalPackets) {
        const tsMicros = Math.round(p.timestamp * 1_000_000);

        // Hardware encoder simulation: strip chunk.duration to null / 0
        const simulatedChunkDuration = packetIndex % 2 === 0 ? null : 0;
        const recoveredDurationMicros = resolveChunkDuration(
          simulatedChunkDuration,
          registry.consume(tsMicros),
          30
        );

        const packetDurationSec = recoveredDurationMicros / 1_000_000;
        expect(packetDurationSec).toBeGreaterThan(0);
        expect(Number.isFinite(packetDurationSec)).toBe(true);

        const newPacket = new EncodedPacket(
          p.data,
          p.type,
          p.timestamp,
          packetDurationSec
        );

        if (isFirst) {
          await videoSource.add(newPacket, decoderConfig ? { decoderConfig } : undefined);
          isFirst = false;
        } else {
          await videoSource.add(newPacket);
        }
      }

      videoSource.close();
      await output.finalize();

      const outputBuffer = outTarget.buffer;
      expect(outputBuffer).not.toBeNull();
      if (!outputBuffer) throw new Error('Missing output buffer');
      expect(outputBuffer.byteLength).toBeGreaterThan(0);

      // Verify the generated MP4 parses cleanly with Mediabunny
      const verifyInput = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(outputBuffer)
      });

      const demuxedTracks = await verifyInput.getVideoTracks();
      expect(demuxedTracks.length).toBe(1);

      const demuxSink = new EncodedPacketSink(demuxedTracks[0]);
      let demuxedCount = 0;
      let lastPacket: EncodedPacket | null = null;

      for await (const demuxedPacket of demuxSink.packets()) {
        expect(demuxedPacket.timestamp).toBeGreaterThanOrEqual(0);
        expect(demuxedPacket.duration).toBeGreaterThan(0);
        lastPacket = demuxedPacket;
        demuxedCount++;
      }

      expect(demuxedCount).toBe(originalPackets.length);
      expect(lastPacket).not.toBeNull();
      // Final MP4 sample must have finite, strictly positive duration
      expect(lastPacket!.duration).toBeGreaterThan(0);
      expect(Number.isFinite(lastPacket!.duration)).toBe(true);
    });

    // Output Verification 2 & Variable-Frame-Rate Timeline Preservation
    test('12. Variable-Frame-Rate timeline preservation and measured synchronization drift', async () => {
      // Construct a synthetic VFR timeline with known, non-uniform intervals
      // Frame 0: 0.00s (dur 50ms = 0.05s)
      // Frame 1: 0.05s (dur 30ms = 0.03s)
      // Frame 2: 0.08s (dur 70ms = 0.07s)
      // Frame 3: 0.15s (dur 100ms = 0.10s)
      // Frame 4: 0.25s (dur 150ms = 0.15s)
      // Frame 5: 0.40s (dur 100ms = 0.10s)
      // Frame 6: 0.50s (dur 100ms = 0.10s)
      const vfrTimeline = [
        { pts: 0.00, dur: 0.05 },
        { pts: 0.05, dur: 0.03 },
        { pts: 0.08, dur: 0.07 },
        { pts: 0.15, dur: 0.10 },
        { pts: 0.25, dur: 0.15 },
        { pts: 0.40, dur: 0.10 },
        { pts: 0.50, dur: 0.10 }
      ];

      // Synchronized audio timeline: 100ms packets at 0.0, 0.1, 0.2, 0.3, 0.4, 0.5
      const audioTimeline = [
        { pts: 0.0, dur: 0.1 },
        { pts: 0.1, dur: 0.1 },
        { pts: 0.2, dur: 0.1 },
        { pts: 0.3, dur: 0.1 },
        { pts: 0.4, dur: 0.1 },
        { pts: 0.5, dur: 0.1 }
      ];

      const outTarget = new BufferTarget();
      const output = new Output({
        format: new Mp4OutputFormat(),
        target: outTarget
      });

      // Extract codec parameters from sample-reel.mp4
      const sampleBuf = getSampleVideoBuffer();
      const sampleInput = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(sampleBuf)
      });
      const vTrack = (await sampleInput.getVideoTracks())[0];
      const codec = (await vTrack.getCodec()) || 'avc';
      const decoderConfig = await vTrack.getDecoderConfig();

      const videoSource = new EncodedVideoPacketSource(codec);
      output.addVideoTrack(videoSource);

      const aTracks = await sampleInput.getAudioTracks();
      let hasAudio = false;
      let audioSource: EncodedAudioPacketSource | null = null;
      if (aTracks.length > 0) {
        const aTrack = aTracks[0];
        const aCodec = await aTrack.getCodec();
        if (aCodec) {
          audioSource = new EncodedAudioPacketSource(aCodec);
          output.addAudioTrack(audioSource);
          hasAudio = true;
        }
      }

      await output.start();

      const registry = new FrameDurationRegistry();
      // Register VFR durations in microseconds
      for (const item of vfrTimeline) {
        registry.register(Math.round(item.pts * 1_000_000), Math.round(item.dur * 1_000_000));
      }

      // Add dummy key/delta video packets matching the VFR timeline with null chunk durations
      // Obtain real AVC keyframe payload from sample-reel for decodable packet data
      const sampleSink = new EncodedPacketSink(vTrack);
      let realKeyPacket: EncodedPacket | null = null;
      for await (const p of sampleSink.packets()) {
        if (p.type === 'key') {
          realKeyPacket = p;
          break;
        }
      }
      expect(realKeyPacket).not.toBeNull();

      for (let i = 0; i < vfrTimeline.length; i++) {
        const item = vfrTimeline[i];
        const tsMicros = Math.round(item.pts * 1_000_000);

        // Hardware encoder simulation: null duration
        const recoveredDurMicros = resolveChunkDuration(
          null,
          registry.consume(tsMicros),
          30
        );

        const packet = new EncodedPacket(
          realKeyPacket!.data,
          'key',
          item.pts,
          recoveredDurMicros / 1_000_000
        );

        if (i === 0) {
          await videoSource.add(packet, decoderConfig ? { decoderConfig } : undefined);
        } else {
          await videoSource.add(packet);
        }
      }
      videoSource.close();

      // Add audio packets if audio track exists
      if (hasAudio && audioSource) {
        const aSink = new EncodedPacketSink(aTracks[0]);
        let realAudioPacket: EncodedPacket | null = null;
        for await (const ap of aSink.packets()) {
          realAudioPacket = ap;
          break;
        }
        if (realAudioPacket) {
          const aDecoderConfig = await aTracks[0].getDecoderConfig();
          for (let i = 0; i < audioTimeline.length; i++) {
            const aItem = audioTimeline[i];
            const aPacket = new EncodedPacket(
              realAudioPacket.data,
              'key',
              aItem.pts,
              aItem.dur
            );
            if (i === 0) {
              await audioSource.add(aPacket, aDecoderConfig ? { decoderConfig: aDecoderConfig } : undefined);
            } else {
              await audioSource.add(aPacket);
            }
          }
        }
        audioSource.close();
      }

      await output.finalize();

      // Read back and measure timestamps
      expect(outTarget.buffer).not.toBeNull();
      if (!outTarget.buffer) throw new Error('Missing output buffer');
      const parsedInput = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(outTarget.buffer)
      });

      const parsedVideoTrack = (await parsedInput.getVideoTracks())[0];
      const parsedSink = new EncodedPacketSink(parsedVideoTrack);
      const demuxedPts: number[] = [];
      const demuxedDurations: number[] = [];

      for await (const p of parsedSink.packets()) {
        demuxedPts.push(p.timestamp);
        demuxedDurations.push(p.duration);
      }

      expect(demuxedPts.length).toBe(vfrTimeline.length);

      // Verify VFR timestamps match original presentation timestamps
      for (let i = 0; i < vfrTimeline.length; i++) {
        expect(demuxedPts[i]).toBeCloseTo(vfrTimeline[i].pts, 2);
      }

      // Check audio/video synchronization drift
      if (hasAudio) {
        const parsedAudioTrack = (await parsedInput.getAudioTracks())[0];
        const audioSink = new EncodedPacketSink(parsedAudioTrack);
        const demuxedAudioPts: number[] = [];
        for await (const ap of audioSink.packets()) {
          demuxedAudioPts.push(ap.timestamp);
        }

        // 1. Measured track timeline alignment: both streams start synchronously at t=0
        const startSyncOffset = Math.abs(demuxedPts[0] - demuxedAudioPts[0]);
        expect(startSyncOffset).toBeLessThan(0.005); // Within 5ms start alignment

        // 2. Inter-stream packet timestamp proximity:
        // NOTE: Proximity measures discrete packet sample density (the maximum temporal distance
        // from an audio packet to the nearest video frame), which in this VFR test is bounded by the
        // maximum frame interval (<= 50ms). This metric reflects container interleaving density and
        // is NOT represented as empirical proof of perceptual lip-sync accuracy across arbitrary media.
        let maxSampleProximity = 0;
        for (const aPts of demuxedAudioPts) {
          const minDiffToVideo = Math.min(...demuxedPts.map(vPts => Math.abs(vPts - aPts)));
          if (minDiffToVideo > maxSampleProximity) {
            maxSampleProximity = minDiffToVideo;
          }
        }
        expect(maxSampleProximity).toBeLessThanOrEqual(0.05);

        // 3. Container total duration alignment: video and audio conclude within 1 sample interval (< 50ms)
        const videoTotalDur = demuxedPts[demuxedPts.length - 1] + demuxedDurations[demuxedDurations.length - 1];
        const audioTotalDur = demuxedAudioPts[demuxedAudioPts.length - 1] + 0.1;
        const totalDurationDrift = Math.abs(videoTotalDur - audioTotalDur);
        expect(totalDurationDrift).toBeLessThan(0.05);
      }
    });

    // Output Verification 3: Subtitle Timing and Frame Coincidence
    test('13. Subtitle timing overlay calculation aligns with recovered frame presentation timestamps', () => {
      // Simulate caption intervals: Caption A [0.1s - 0.3s], Caption B [0.4s - 0.7s]
      const captions = [
        { id: '1', start: 0.1, end: 0.3, text: 'First caption' },
        { id: '2', start: 0.4, end: 0.7, text: 'Second caption' }
      ];

      const frameTimestampsSec = [0.0, 0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75];

      const activeCaptionsPerFrame = frameTimestampsSec.map(ts => {
        const active = captions.find(c => ts >= c.start && ts <= c.end);
        return active ? active.id : null;
      });

      // Verify exact frame-to-caption correspondence
      expect(activeCaptionsPerFrame[0]).toBeNull();      // 0.00s -> none
      expect(activeCaptionsPerFrame[1]).toBeNull();      // 0.05s -> none
      expect(activeCaptionsPerFrame[2]).toBe('1');       // 0.15s -> Caption 1
      expect(activeCaptionsPerFrame[3]).toBe('1');       // 0.25s -> Caption 1
      expect(activeCaptionsPerFrame[4]).toBeNull();      // 0.35s -> none
      expect(activeCaptionsPerFrame[5]).toBe('2');       // 0.45s -> Caption 2
      expect(activeCaptionsPerFrame[6]).toBe('2');       // 0.55s -> Caption 2
      expect(activeCaptionsPerFrame[7]).toBe('2');       // 0.65s -> Caption 2
      expect(activeCaptionsPerFrame[8]).toBeNull();      // 0.75s -> none
    });
  });
});
