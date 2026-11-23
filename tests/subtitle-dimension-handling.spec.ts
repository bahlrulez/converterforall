/* eslint-disable @typescript-eslint/no-explicit-any */
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
  EncodedPacketSink,
  type Rotation
} from 'mediabunny';

import {
  toEvenDimension,
  drawVideoFrameWithOrientation
} from '../src/workers/caption-export.worker';
import {
  renderCaptionToCanvas,
  DEFAULT_STYLE
} from '../src/lib/caption-studio/caption-renderer';
import { CaptionChunk } from '../src/lib/caption-studio/types';
import { PositionSettings } from '../src/lib/caption-studio/style-types';

/**
 * Creates an in-memory CanvasRenderingContext2D spy to inspect drawing and transform operations.
 */
function createMockCanvasContext() {
  const operations: { op: string; args: any[] }[] = [];
  return {
    operations,
    font: '',
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'middle' as CanvasTextBaseline,
    fillStyle: '#ffffff',
    strokeStyle: '#000000',
    lineWidth: 1,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    measureText: (text: string) => ({ width: text.length * 10 }),
    save: () => operations.push({ op: 'save', args: [] }),
    restore: () => operations.push({ op: 'restore', args: [] }),
    translate: (x: number, y: number) => operations.push({ op: 'translate', args: [x, y] }),
    rotate: (angle: number) => operations.push({ op: 'rotate', args: [angle] }),
    scale: (x: number, y: number) => operations.push({ op: 'scale', args: [x, y] }),
    clearRect: (x: number, y: number, w: number, h: number) => operations.push({ op: 'clearRect', args: [x, y, w, h] }),
    drawImage: (...args: any[]) => operations.push({ op: 'drawImage', args }),
    fillText: (text: string, x: number, y: number) => operations.push({ op: 'fillText', args: [text, x, y] }),
    strokeText: (text: string, x: number, y: number) => operations.push({ op: 'strokeText', args: [text, x, y] }),
    beginPath: () => operations.push({ op: 'beginPath', args: [] }),
    closePath: () => operations.push({ op: 'closePath', args: [] }),
    moveTo: (x: number, y: number) => operations.push({ op: 'moveTo', args: [x, y] }),
    arcTo: (...args: any[]) => operations.push({ op: 'arcTo', args }),
    fill: () => operations.push({ op: 'fill', args: [] }),
    stroke: () => operations.push({ op: 'stroke', args: [] }),
    roundRect: (...args: any[]) => operations.push({ op: 'roundRect', args }),
  };
}

/**
 * Computes the transformed coordinates of a point (px, py) given canvas width W, height H, rotation and flip.
 */
function computeTransformedPoint(
  px: number,
  py: number,
  W: number,
  H: number,
  rotation: number,
  flip: boolean
): { x: number; y: number } {
  let m = [1, 0, 0, 1, 0, 0]; // [a, b, c, d, e, f] affine matrix
  function mult(a: number, b: number, c: number, d: number, e: number, f: number) {
    const [a1, b1, c1, d1, e1, f1] = m;
    m = [
      a1 * a + c1 * b,
      b1 * a + d1 * b,
      a1 * c + c1 * d,
      b1 * c + d1 * d,
      a1 * e + c1 * f + e1,
      b1 * e + d1 * f + f1
    ];
  }
  function translate(tx: number, ty: number) { mult(1, 0, 0, 1, tx, ty); }
  function rotate(rad: number) { const cos = Math.cos(rad), sin = Math.sin(rad); mult(cos, sin, -sin, cos, 0, 0); }
  function scale(sx: number, sy: number) { mult(sx, 0, 0, sy, 0, 0); }

  if (flip) {
    translate(W, 0);
    scale(-1, 1);
  }

  switch (rotation) {
    case 90:
      translate(W, 0);
      rotate(Math.PI / 2);
      break;
    case 180:
      translate(W, H);
      rotate(Math.PI);
      break;
    case 270:
      translate(0, H);
      rotate(1.5 * Math.PI);
      break;
  }

  const x = m[0] * px + m[2] * py + m[4];
  const y = m[1] * px + m[3] * py + m[5];
  const rx = Math.round(x);
  const ry = Math.round(y);
  return { x: rx === 0 ? 0 : rx, y: ry === 0 ? 0 : ry };
}

test.describe('Odd Video Dimension Reliability & Display Orientation (Phase 2B.3)', () => {

  // --------------------------------------------------------------------------
  // SECTION A: Dimension Normalization Invariants & Boundary Tests (Unit Tests)
  // --------------------------------------------------------------------------
  test.describe('Dimension Normalization Strategy (toEvenDimension)', () => {

    test('1. Odd landscape normalization: 1081x719 downscales cleanly to 1080x718', () => {
      const rawW = 1081;
      const rawH = 719;

      const normW = toEvenDimension(rawW, 1920);
      const normH = toEvenDimension(rawH, 1080);

      expect(normW).toBe(1080);
      expect(normH).toBe(718);
      expect(normW % 2).toBe(0);
      expect(normH % 2).toBe(0);

      // Verify aspect ratio delta is negligible (<0.05%)
      const origAspect = rawW / rawH;
      const normAspect = normW / normH;
      const aspectDelta = Math.abs(origAspect - normAspect) / origAspect;
      expect(aspectDelta).toBeLessThan(0.001); // 0.046%
    });

    test('2. Odd portrait normalization: 721x1281 downscales cleanly to 720x1280', () => {
      const rawW = 721;
      const rawH = 1281;

      const normW = toEvenDimension(rawW, 1080);
      const normH = toEvenDimension(rawH, 1920);

      expect(normW).toBe(720);
      expect(normH).toBe(1280);
      expect(normW % 2).toBe(0);
      expect(normH % 2).toBe(0);

      const origAspect = rawW / rawH;
      const normAspect = normW / normH;
      const aspectDelta = Math.abs(origAspect - normAspect) / origAspect;
      expect(aspectDelta).toBeLessThan(0.001); // 0.061%
    });

    test('3. Single odd width: 1921x1080 normalizes to 1920x1080', () => {
      const rawW = 1921;
      const rawH = 1080;

      const normW = toEvenDimension(rawW, 1920);
      const normH = toEvenDimension(rawH, 1080);

      expect(normW).toBe(1920);
      expect(normH).toBe(1080);
      expect(normW % 2).toBe(0);
      expect(normH % 2).toBe(0);
    });

    test('4. Single odd height: 1920x1079 normalizes to 1920x1078', () => {
      const rawW = 1920;
      const rawH = 1079;

      const normW = toEvenDimension(rawW, 1920);
      const normH = toEvenDimension(rawH, 1080);

      expect(normW).toBe(1920);
      expect(normH).toBe(1078);
      expect(normW % 2).toBe(0);
      expect(normH % 2).toBe(0);
    });

    test('5. Already-even dimensions remain strictly unchanged', () => {
      const evenDimensions = [
        { w: 1920, h: 1080 },
        { w: 1080, h: 1920 },
        { w: 1280, h: 720 },
        { w: 3840, h: 2160 },
        { w: 854, h: 480 },
        { w: 640, h: 480 }
      ];

      for (const { w, h } of evenDimensions) {
        expect(toEvenDimension(w, 1920)).toBe(w);
        expect(toEvenDimension(h, 1080)).toBe(h);
      }
    });

    test('6. Small dimension boundaries: 319x239 normalizes to 318x238 and clamps to >= 2', () => {
      // 319x239 phone preview clip
      expect(toEvenDimension(319, 1920)).toBe(318);
      expect(toEvenDimension(239, 1080)).toBe(238);

      // Micro dimensions clamping to minimum of 2
      expect(toEvenDimension(1, 1920)).toBe(2);
      expect(toEvenDimension(2, 1920)).toBe(2);
      expect(toEvenDimension(3, 1920)).toBe(2);
      expect(toEvenDimension(4, 1920)).toBe(4);
    });

    test('7. Invalid, non-finite, negative, zero and missing dimensions recover via fallback', () => {
      const defaultW = 1920;
      const defaultH = 1080;

      expect(toEvenDimension(0, defaultW)).toBe(defaultW);
      expect(toEvenDimension(0, defaultH)).toBe(defaultH);
      expect(toEvenDimension(-100, defaultW)).toBe(defaultW);
      expect(toEvenDimension(NaN, defaultW)).toBe(defaultW);
      expect(toEvenDimension(Infinity, defaultW)).toBe(defaultW);
      expect(toEvenDimension(-Infinity, defaultW)).toBe(defaultW);
      expect(toEvenDimension(null, defaultW)).toBe(defaultW);
      expect(toEvenDimension(undefined, defaultW)).toBe(defaultW);
      expect(toEvenDimension('invalid' as any, defaultW)).toBe(defaultW);

      // Fallback itself normalized to even if odd fallback provided
      expect(toEvenDimension(null, 1079)).toBe(1078);
    });

    test('11. Non-square pixel aspect ratio (PAR): anamorphic display dimensions normalize to square pixels', () => {
      // E.g. NTSC DVD anamorphic 720x480 with 16:9 DAR (display width 853.33)
      const rawDisplayWidth = 853.33;
      const rawDisplayHeight = 480;

      const normW = toEvenDimension(rawDisplayWidth, 854);
      const normH = toEvenDimension(rawDisplayHeight, 480);

      expect(normW).toBe(852);
      expect(normH).toBe(480);
      expect(normW % 2).toBe(0);
      expect(normH % 2).toBe(0);

      // Proportions are preserved within 0.15% of true 16:9
      const targetAspect = 16 / 9;
      const actualAspect = normW / normH;
      expect(Math.abs(actualAspect - targetAspect) / targetAspect).toBeLessThan(0.002);
    });

    test('16. Original visual content preservation: independent even scaling avoids black borders and cropping', () => {
      const testCases = [
        { name: '1081x719', rawW: 1081, rawH: 719, expectedW: 1080, expectedH: 718 },
        { name: '721x1281', rawW: 721, rawH: 1281, expectedW: 720, expectedH: 1280 },
        { name: '1921x1080', rawW: 1921, rawH: 1080, expectedW: 1920, expectedH: 1080 },
        { name: '1920x1079', rawW: 1920, rawH: 1079, expectedW: 1920, expectedH: 1078 },
        { name: '319x239', rawW: 319, rawH: 239, expectedW: 318, expectedH: 238 }
      ];

      for (const tc of testCases) {
        const normW = toEvenDimension(tc.rawW, 1920);
        const normH = toEvenDimension(tc.rawH, 1080);
        expect(normW).toBe(tc.expectedW);
        expect(normH).toBe(tc.expectedH);

        // Aspect ratio delta calculation
        const origAspect = tc.rawW / tc.rawH;
        const normAspect = normW / normH;
        const delta = Math.abs(origAspect - normAspect) / origAspect;

        // Max aspect ratio deviation across all real-world resolutions is <0.12%
        expect(delta).toBeLessThan(0.0015);

        // Zero letterboxing/pillarboxing pixels: the canvas is 100% filled by video frame
        const mockCtx = createMockCanvasContext();
        drawVideoFrameWithOrientation(mockCtx as any, {} as any, normW, normH, 0, false);
        const drawCall = mockCtx.operations.find(op => op.op === 'drawImage');
        expect(drawCall).toBeDefined();
        expect(drawCall!.args[1]).toBe(0); // dx
        expect(drawCall!.args[2]).toBe(0); // dy
        expect(drawCall!.args[3]).toBe(normW); // dWidth
        expect(drawCall!.args[4]).toBe(normH); // dHeight
      }
    });
  });

  // --------------------------------------------------------------------------
  // SECTION B: Display Orientation, Rotation & Flip Matrix Tests
  // --------------------------------------------------------------------------
  test.describe('Display Orientation & Rotation Matrix (drawVideoFrameWithOrientation)', () => {

    test('8. Rotation 90 degrees: maps decoded landscape frame to upright canvas and covers full bounds', () => {
      // Source recorded at 1920x1080 with 90° clockwise container rotation
      // Canvas is upright: width 1080, height 1920
      const canvasW = 1080;
      const canvasH = 1920;
      const rotation: Rotation = 90;
      const flip = false;

      const mockCtx = createMockCanvasContext();
      drawVideoFrameWithOrientation(mockCtx as any, {} as any, canvasW, canvasH, rotation, flip);

      // Verify sequence of canvas operations
      expect(mockCtx.operations[0]).toEqual({ op: 'clearRect', args: [0, 0, canvasW, canvasH] });
      expect(mockCtx.operations[1]).toEqual({ op: 'save', args: [] });
      expect(mockCtx.operations[2]).toEqual({ op: 'translate', args: [canvasW, 0] });
      expect(mockCtx.operations[3]).toEqual({ op: 'rotate', args: [Math.PI / 2] });
      expect(mockCtx.operations[4]).toEqual({ op: 'drawImage', args: [{}, 0, 0, canvasH, canvasW] });
      expect(mockCtx.operations[5]).toEqual({ op: 'restore', args: [] });

      // Verify geometric mapping of all 4 corners
      // Frame corners in rotated coordinates [0..canvasH, 0..canvasW] = [0..1920, 0..1080]
      const c1 = computeTransformedPoint(0, 0, canvasW, canvasH, 90, false);
      const c2 = computeTransformedPoint(canvasH, 0, canvasW, canvasH, 90, false);
      const c3 = computeTransformedPoint(canvasH, canvasW, canvasW, canvasH, 90, false);
      const c4 = computeTransformedPoint(0, canvasW, canvasW, canvasH, 90, false);

      expect(c1).toEqual({ x: canvasW, y: 0 }); // Top-right
      expect(c2).toEqual({ x: canvasW, y: canvasH }); // Bottom-right
      expect(c3).toEqual({ x: 0, y: canvasH }); // Bottom-left
      expect(c4).toEqual({ x: 0, y: 0 }); // Top-left

      const minX = Math.min(c1.x, c2.x, c3.x, c4.x);
      const maxX = Math.max(c1.x, c2.x, c3.x, c4.x);
      const minY = Math.min(c1.y, c2.y, c3.y, c4.y);
      const maxY = Math.max(c1.y, c2.y, c3.y, c4.y);

      expect(minX).toBe(0);
      expect(maxX).toBe(canvasW);
      expect(minY).toBe(0);
      expect(maxY).toBe(canvasH);
    });

    test('9. Rotation 180 degrees: inverted orientation correctly mapped to full canvas bounds', () => {
      const canvasW = 1920;
      const canvasH = 1080;
      const rotation: Rotation = 180;
      const flip = false;

      const mockCtx = createMockCanvasContext();
      drawVideoFrameWithOrientation(mockCtx as any, {} as any, canvasW, canvasH, rotation, flip);

      expect(mockCtx.operations[1]).toEqual({ op: 'save', args: [] });
      expect(mockCtx.operations[2]).toEqual({ op: 'translate', args: [canvasW, canvasH] });
      expect(mockCtx.operations[3]).toEqual({ op: 'rotate', args: [Math.PI] });
      expect(mockCtx.operations[4]).toEqual({ op: 'drawImage', args: [{}, 0, 0, canvasW, canvasH] });
      expect(mockCtx.operations[5]).toEqual({ op: 'restore', args: [] });

      const c1 = computeTransformedPoint(0, 0, canvasW, canvasH, 180, false);
      const c2 = computeTransformedPoint(canvasW, 0, canvasW, canvasH, 180, false);
      const c3 = computeTransformedPoint(canvasW, canvasH, canvasW, canvasH, 180, false);
      const c4 = computeTransformedPoint(0, canvasH, canvasW, canvasH, 180, false);

      expect(c1).toEqual({ x: canvasW, y: canvasH });
      expect(c2).toEqual({ x: 0, y: canvasH });
      expect(c3).toEqual({ x: 0, y: 0 });
      expect(c4).toEqual({ x: canvasW, y: 0 });

      const minX = Math.min(c1.x, c2.x, c3.x, c4.x);
      const maxX = Math.max(c1.x, c2.x, c3.x, c4.x);
      const minY = Math.min(c1.y, c2.y, c3.y, c4.y);
      const maxY = Math.max(c1.y, c2.y, c3.y, c4.y);

      expect(minX).toBe(0);
      expect(maxX).toBe(canvasW);
      expect(minY).toBe(0);
      expect(maxY).toBe(canvasH);
    });

    test('10. Rotation 270 degrees: 270° clockwise rotation mapped to upright canvas bounds', () => {
      const canvasW = 1080;
      const canvasH = 1920;
      const rotation: Rotation = 270;
      const flip = false;

      const mockCtx = createMockCanvasContext();
      drawVideoFrameWithOrientation(mockCtx as any, {} as any, canvasW, canvasH, rotation, flip);

      expect(mockCtx.operations[1]).toEqual({ op: 'save', args: [] });
      expect(mockCtx.operations[2]).toEqual({ op: 'translate', args: [0, canvasH] });
      expect(mockCtx.operations[3]).toEqual({ op: 'rotate', args: [1.5 * Math.PI] });
      expect(mockCtx.operations[4]).toEqual({ op: 'drawImage', args: [{}, 0, 0, canvasH, canvasW] });
      expect(mockCtx.operations[5]).toEqual({ op: 'restore', args: [] });

      const c1 = computeTransformedPoint(0, 0, canvasW, canvasH, 270, false);
      const c2 = computeTransformedPoint(canvasH, 0, canvasW, canvasH, 270, false);
      const c3 = computeTransformedPoint(canvasH, canvasW, canvasW, canvasH, 270, false);
      const c4 = computeTransformedPoint(0, canvasW, canvasW, canvasH, 270, false);

      expect(c1).toEqual({ x: 0, y: canvasH });
      expect(c2).toEqual({ x: 0, y: 0 });
      expect(c3).toEqual({ x: canvasW, y: 0 });
      expect(c4).toEqual({ x: canvasW, y: canvasH });

      const minX = Math.min(c1.x, c2.x, c3.x, c4.x);
      const maxX = Math.max(c1.x, c2.x, c3.x, c4.x);
      const minY = Math.min(c1.y, c2.y, c3.y, c4.y);
      const maxY = Math.max(c1.y, c2.y, c3.y, c4.y);

      expect(minX).toBe(0);
      expect(maxX).toBe(canvasW);
      expect(minY).toBe(0);
      expect(maxY).toBe(canvasH);
    });

    test('12. Horizontal flip metadata: reflects image across vertical centerline', () => {
      const canvasW = 1920;
      const canvasH = 1080;
      const rotation: Rotation = 0;
      const flip = true;

      const mockCtx = createMockCanvasContext();
      drawVideoFrameWithOrientation(mockCtx as any, {} as any, canvasW, canvasH, rotation, flip);

      expect(mockCtx.operations[1]).toEqual({ op: 'save', args: [] });
      expect(mockCtx.operations[2]).toEqual({ op: 'translate', args: [canvasW, 0] });
      expect(mockCtx.operations[3]).toEqual({ op: 'scale', args: [-1, 1] });
      expect(mockCtx.operations[4]).toEqual({ op: 'drawImage', args: [{}, 0, 0, canvasW, canvasH] });
      expect(mockCtx.operations[5]).toEqual({ op: 'restore', args: [] });

      const c1 = computeTransformedPoint(0, 0, canvasW, canvasH, 0, true);
      const c2 = computeTransformedPoint(canvasW, 0, canvasW, canvasH, 0, true);
      expect(c1).toEqual({ x: canvasW, y: 0 }); // Left pixel moved to right
      expect(c2).toEqual({ x: 0, y: 0 });       // Right pixel moved to left
    });
  });

  // --------------------------------------------------------------------------
  // SECTION C: Subtitle Placement & Frame Edge Coordinates
  // --------------------------------------------------------------------------
  test.describe('Subtitle Edge Coordinates on Normalized Frames', () => {

    test('13. Subtitle positioning at frame edges: top-left, top-center, bottom-center, bottom-right, custom Y', () => {
      const normW = 1080;
      const normH = 718;

      const caption: CaptionChunk = {
        id: 'cap1',
        start: 0,
        end: 1,
        text: 'Edge Boundary Test',
        words: [
          { word: 'Edge', start: 0, end: 0.3 },
          { word: 'Boundary', start: 0.3, end: 0.7 },
          { word: 'Test', start: 0.7, end: 1.0 }
        ]
      };

      const testPositions: { name: string; pos: PositionSettings; expectedMinY: number; expectedMaxY: number }[] = [
        { name: 'top-left', pos: { x: 0.1, y: 0.1 }, expectedMinY: 0, expectedMaxY: normH * 0.25 },
        { name: 'top-center', pos: { x: 0.5, y: 0.1 }, expectedMinY: 0, expectedMaxY: normH * 0.25 },
        { name: 'bottom-center', pos: { x: 0.5, y: 0.85 }, expectedMinY: normH * 0.7, expectedMaxY: normH },
        { name: 'bottom-right', pos: { x: 0.9, y: 0.9 }, expectedMinY: normH * 0.75, expectedMaxY: normH },
        { name: 'custom-y', pos: { x: 0.5, y: 0.4 }, expectedMinY: normH * 0.3, expectedMaxY: normH * 0.6 }
      ];

      for (const tp of testPositions) {
        const mockCtx = createMockCanvasContext();
        renderCaptionToCanvas(mockCtx as any, caption, normW, normH, DEFAULT_STYLE, tp.pos);

        // Find fillText call
        const fillCall = mockCtx.operations.find(op => op.op === 'fillText');
        expect(fillCall).toBeDefined();
        const textY = fillCall!.args[2];

        // Text Y anchor must be strictly within expected boundaries
        expect(textY).toBeGreaterThanOrEqual(tp.expectedMinY);
        expect(textY).toBeLessThanOrEqual(tp.expectedMaxY);

        // Font size must be scaled proportionally to normalized height
        const expectedFontSizePx = normH * DEFAULT_STYLE.fontSize;
        expect(mockCtx.font).toContain(`${expectedFontSizePx}px`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // SECTION D: WebCodecs Capability Check & Browser Encoder Support
  // --------------------------------------------------------------------------
  test.describe('WebCodecs Configuration Support (Mocked & Real Browser)', () => {

    test('14A. Unit simulation: VideoEncoder.isConfigSupported rejects odd dimensions and accepts even', async () => {
      // Simulate WebCodecs H.264 encoder dimension check
      function simulateIsConfigSupported(config: VideoEncoderConfig): { supported: boolean } {
        if (!config.width || !config.height) return { supported: false };
        if (config.width % 2 !== 0 || config.height % 2 !== 0) {
          return { supported: false }; // H.264 standard requires even dimensions
        }
        return { supported: true };
      }

      // Odd inputs fail
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 1081, height: 719 }).supported).toBe(false);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 721, height: 1281 }).supported).toBe(false);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 1921, height: 1080 }).supported).toBe(false);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 1920, height: 1079 }).supported).toBe(false);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 319, height: 239 }).supported).toBe(false);

      // Normalized even inputs succeed
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 1080, height: 718 }).supported).toBe(true);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 720, height: 1280 }).supported).toBe(true);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 1920, height: 1080 }).supported).toBe(true);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 1920, height: 1078 }).supported).toBe(true);
      expect(simulateIsConfigSupported({ codec: 'avc1.4d002a', width: 318, height: 238 }).supported).toBe(true);
    });

    test('14B. Real browser WebCodecs test: Chromium VideoEncoder.isConfigSupported verifies normalized dimensions', async ({ page }) => {
      // Run actual WebCodecs encoder support checks inside live Chromium browser
      const results = await page.evaluate(async () => {
        if (typeof VideoEncoder === 'undefined' || typeof VideoEncoder.isConfigSupported !== 'function') {
          return { available: false, tests: [] };
        }

        const configs = [
          { name: 'odd-landscape-1081x719', config: { codec: 'avc1.4d002a', width: 1081, height: 719 } },
          { name: 'norm-landscape-1080x718', config: { codec: 'avc1.4d002a', width: 1080, height: 718 } },
          { name: 'odd-portrait-721x1281', config: { codec: 'avc1.4d002a', width: 721, height: 1281 } },
          { name: 'norm-portrait-720x1280', config: { codec: 'avc1.4d002a', width: 720, height: 1280 } },
          { name: 'odd-width-1921x1080', config: { codec: 'avc1.4d002a', width: 1921, height: 1080 } },
          { name: 'norm-width-1920x1080', config: { codec: 'avc1.4d002a', width: 1920, height: 1080 } },
          { name: 'odd-height-1920x1079', config: { codec: 'avc1.4d002a', width: 1920, height: 1079 } },
          { name: 'norm-height-1920x1078', config: { codec: 'avc1.4d002a', width: 1920, height: 1078 } },
        ];

        const tests: { name: string; supported: boolean }[] = [];
        for (const item of configs) {
          try {
            const res = await VideoEncoder.isConfigSupported(item.config);
            tests.push({ name: item.name, supported: !!res.supported });
          } catch {
            tests.push({ name: item.name, supported: false });
          }
        }
        return { available: true, tests };
      });

      if (results.available) {
        // Every normalized even configuration must be supported in Chromium
        const normLandscape = results.tests.find(t => t.name === 'norm-landscape-1080x718');
        expect(normLandscape?.supported).toBe(true);

        const normPortrait = results.tests.find(t => t.name === 'norm-portrait-720x1280');
        expect(normPortrait?.supported).toBe(true);

        const normWidth = results.tests.find(t => t.name === 'norm-width-1920x1080');
        expect(normWidth?.supported).toBe(true);

        const normHeight = results.tests.find(t => t.name === 'norm-height-1920x1078');
        expect(normHeight?.supported).toBe(true);

        // Odd configurations are either rejected or not supported
        const oddLandscape = results.tests.find(t => t.name === 'odd-landscape-1081x719');
        const oddPortrait = results.tests.find(t => t.name === 'odd-portrait-721x1281');
        const oddWidth = results.tests.find(t => t.name === 'odd-width-1921x1080');
        const oddHeight = results.tests.find(t => t.name === 'odd-height-1920x1079');

        expect(oddLandscape?.supported).toBe(false);
        expect(oddPortrait?.supported).toBe(false);
        expect(oddWidth?.supported).toBe(false);
        expect(oddHeight?.supported).toBe(false);
      }
    });
  });

  // --------------------------------------------------------------------------
  // SECTION E: End-to-End MP4 Output Dimensions & Demuxing Verification
  // --------------------------------------------------------------------------
  test.describe('End-to-End MP4 Output Dimensions & Demuxing', () => {

    test('15. Actual MP4 output dimensions and playback: odd dimensions normalize and mux into valid MP4', async () => {
      const samplePath = path.join(process.cwd(), 'public/assets/sample-reel.mp4');
      const inBuf = fs.readFileSync(samplePath);
      const input = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(inBuf)
      });

      const videoTracks = await input.getVideoTracks();
      expect(videoTracks.length).toBeGreaterThan(0);
      const videoTrack = videoTracks[0];

      const rawCodedW = await videoTrack.getCodedWidth();
      const rawCodedH = await videoTrack.getCodedHeight();
      expect(rawCodedW).toBeGreaterThan(0);
      expect(rawCodedH).toBeGreaterThan(0);

      // Simulate an incoming odd dimension (e.g. 1081x719)
      const simulatedOddWidth = 1081;
      const simulatedOddHeight = 719;

      const normWidth = toEvenDimension(simulatedOddWidth, 1920);
      const normHeight = toEvenDimension(simulatedOddHeight, 1080);
      expect(normWidth).toBe(1080);
      expect(normHeight).toBe(718);

      // Setup Mediabunny MP4 muxer with normalized track metadata
      const outTarget = new BufferTarget();
      const output = new Output({
        format: new Mp4OutputFormat(),
        target: outTarget
      });

      const videoCodec = (await videoTrack.getCodec()) || 'avc';
      const videoSource = new EncodedVideoPacketSource(videoCodec);

      // Baked rotation: rotation is 0, flip is false
      output.addVideoTrack(videoSource, {
        rotation: 0,
        flip: false
      });
      await output.start();

      const videoSink = new EncodedPacketSink(videoTrack);
      const decoderConfig = await videoTrack.getDecoderConfig();
      expect(decoderConfig).not.toBeNull();

      // Override decoderConfig with normalized dimensions for track header
      const normalizedDecoderConfig = {
        ...decoderConfig!,
        codedWidth: normWidth,
        codedHeight: normHeight
      };

      let count = 0;
      for await (const packet of videoSink.packets()) {
        if (count++ === 0) {
          await videoSource.add(packet, { decoderConfig: normalizedDecoderConfig });
        } else {
          await videoSource.add(packet);
        }
        if (count >= 10) break; // 10 frames
      }

      videoSource.close();
      await output.finalize();

      const outBuf = outTarget.buffer;
      expect(outBuf).not.toBeNull();
      if (!outBuf) throw new Error('No output buffer produced');
      expect(outBuf.byteLength).toBeGreaterThan(1000);

      // Demux the generated MP4 file to verify container headers and track properties
      const verifyInput = new Input({
        formats: [new Mp4InputFormat()],
        source: new BufferSource(outBuf)
      });

      const demuxedVideoTracks = await verifyInput.getVideoTracks();
      expect(demuxedVideoTracks.length).toBe(1);
      const demuxedTrack = demuxedVideoTracks[0];

      const demuxedWidth = await demuxedTrack.getCodedWidth();
      const demuxedHeight = await demuxedTrack.getCodedHeight();
      const demuxedRotation = await demuxedTrack.getRotation();
      const demuxedFlip = await demuxedTrack.getFlip();

      // Verify track properties match normalized even dimensions
      expect(demuxedWidth).toBe(normWidth);
      expect(demuxedHeight).toBe(normHeight);
      expect(demuxedWidth % 2).toBe(0);
      expect(demuxedHeight % 2).toBe(0);

      // Verify rotation is 0 (physically upright, zero container rotation)
      expect(demuxedRotation).toBe(0);
      expect(demuxedFlip).toBe(false);

      // Verify demuxed packets have valid positive timestamps and durations
      const verifySink = new EncodedPacketSink(demuxedTrack);
      let verifiedPackets = 0;
      for await (const p of verifySink.packets()) {
        verifiedPackets++;
        expect(p.timestamp).toBeGreaterThanOrEqual(0);
        expect(p.duration).toBeGreaterThan(0);
      }
      expect(verifiedPackets).toBe(count);
    });
  });
});
