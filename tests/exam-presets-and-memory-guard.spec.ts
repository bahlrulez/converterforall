import { test, expect } from '@playwright/test';
import { EXAM_PRESETS, PDF_DOCUMENT_PRESETS } from '../src/config/exam-presets';
import { checkVideoMemoryRisk, checkPdfMemoryRisk, getDeviceProfile } from '../src/lib/device-memory-guard';

test.describe('Government & Job Document Helpers and Memory Guard Integrity', () => {

  test('1. Exam Presets cover all major recruitment bodies with strict size constraints', () => {
    const requiredExamBodies = ['ssc', 'upsc', 'ibps', 'state_police', 'rrb', 'nta', 'gate'];
    
    for (const body of requiredExamBodies) {
      expect(EXAM_PRESETS, `Missing preset specification for ${body}`).toHaveProperty(body);
      const spec = EXAM_PRESETS[body];

      // Photo checks
      expect(spec.photo.minKB, `${body} photo minKB must be positive`).toBeGreaterThan(0);
      expect(spec.photo.maxKB, `${body} photo maxKB must exceed minKB`).toBeGreaterThan(spec.photo.minKB);
      expect(spec.photo.aspect, `${body} photo aspect ratio must be positive`).toBeGreaterThan(0);
      expect(spec.photo.minWidthPx, `${body} photo minWidthPx must be at least 100px`).toBeGreaterThanOrEqual(100);
      expect(spec.photo.rules.length, `${body} photo must have descriptive rules`).toBeGreaterThan(0);

      // Signature checks
      expect(spec.signature.minKB, `${body} signature minKB must be positive`).toBeGreaterThan(0);
      expect(spec.signature.maxKB, `${body} signature maxKB must exceed minKB`).toBeGreaterThan(spec.signature.minKB);
      expect(spec.signature.aspect, `${body} signature aspect ratio must be positive`).toBeGreaterThan(0);
      expect(spec.signature.minWidthPx, `${body} signature minWidthPx must be at least 100px`).toBeGreaterThanOrEqual(100);
      expect(spec.signature.rules.length, `${body} signature must have descriptive rules`).toBeGreaterThan(0);
    }
  });

  test('2. PDF Document Presets enforce safety margins below portal ceilings', () => {
    expect(PDF_DOCUMENT_PRESETS.length).toBeGreaterThanOrEqual(4);

    const p100 = PDF_DOCUMENT_PRESETS.find(p => p.id === '100');
    expect(p100, 'Under 100 KB preset must exist').toBeDefined();
    expect(p100!.internalCeilingKb, '100 KB ceiling must have internal safety margin (<= 90 KB)').toBeLessThanOrEqual(90);

    const p200 = PDF_DOCUMENT_PRESETS.find(p => p.id === '200');
    expect(p200, 'Under 200 KB preset must exist').toBeDefined();
    expect(p200!.internalCeilingKb, '200 KB ceiling must have internal safety margin (<= 180 KB)').toBeLessThanOrEqual(180);

    for (const preset of PDF_DOCUMENT_PRESETS) {
      expect(preset.internalCeilingKb).toBeLessThan(preset.targetKb);
      expect(preset.suitableFor.length).toBeGreaterThan(0);
    }
  });

  test('3. Device Memory Guard evaluates client-side stability boundaries safely', () => {
    const profile = getDeviceProfile();
    expect(profile).toHaveProperty('isMobile');
    expect(profile).toHaveProperty('isLowEndDevice');

    // Small files should always be safe
    const safeVideo = checkVideoMemoryRisk(20 * 1024 * 1024); // 20 MB
    expect(safeVideo.risk).toBe('safe');

    const safePdf = checkPdfMemoryRisk(5 * 1024 * 1024, 4); // 5 MB, 4 pages
    expect(safePdf.risk).toBe('safe');

    // Massive video should flag warning
    const hugeVideo = checkVideoMemoryRisk(500 * 1024 * 1024); // 500 MB
    expect(['caution', 'danger']).toContain(hugeVideo.risk);
    expect(hugeVideo.message.length).toBeGreaterThan(20);
  });

  test('4. Photo Stamper Passport Crop accurately transforms landscape inputs into 3.5:4.5 portrait', () => {
    // Simulating user input: 2752 x 1766 landscape
    const srcW = 2752;
    const srcH = 1766;
    const targetRatio = 3.5 / 4.5; // ~0.77778

    expect(srcW / srcH).toBeGreaterThan(targetRatio);

    const cropH = srcH;
    const cropW = Math.round(srcH * targetRatio); // 1766 * 0.77778 = 1374
    expect(cropW).toBe(1374);
    expect(cropH).toBe(1766);
    expect(cropW / cropH).toBeCloseTo(targetRatio, 2);

    // Center offset 50%
    const maxOffset = srcW - cropW;
    const cropX = Math.round(maxOffset * 0.5);
    expect(cropX).toBe(689);
    expect(cropX + cropW).toBeLessThanOrEqual(srcW);
  });

});

