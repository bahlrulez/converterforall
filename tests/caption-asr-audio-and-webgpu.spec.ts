import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  mixChannelsToMono,
  resampleMonoPcm,
  normalizeMonoPcm,
  validateWhisperPcm,
  WHISPER_SAMPLE_RATE,
} from '../src/lib/caption-studio/audio-extractor';
import { detectDegenerateTranscription } from '../src/lib/caption-studio/asr-sanity';
import { CAPTION_LANGUAGES } from '../src/lib/caption-studio/types';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3005';

test.describe('Caption Studio Audio Extraction, WebGPU Decoding Guards & Language Controls', () => {
  test('1. Audio extractor mixes stereo to averaged mono, resamples 48kHz/44.1kHz to 16kHz, normalizes to [-1, 1], and rejects silence', () => {
    // 1.1 Stereo channel mixing
    const left = new Float32Array([0.8, 0.4, -0.6, 0.2]);
    const right = new Float32Array([0.2, 0.6, -0.2, 0.0]);
    const mono = mixChannelsToMono([left, right]);
    expect(mono.length).toBe(4);
    expect(mono[0]).toBeCloseTo(0.5, 5);
    expect(mono[1]).toBeCloseTo(0.5, 5);
    expect(mono[2]).toBeCloseTo(-0.4, 5);
    expect(mono[3]).toBeCloseTo(0.1, 5);

    // 1.2 Explicit resampling 48kHz -> 16kHz (1 second 440Hz tone)
    const srcRate48 = 48000;
    const tone48 = new Float32Array(srcRate48);
    for (let i = 0; i < srcRate48; i++) {
      tone48[i] = 0.5 * Math.sin((2 * Math.PI * 440 * i) / srcRate48);
    }
    const resampled16From48 = resampleMonoPcm(tone48, srcRate48, WHISPER_SAMPLE_RATE);
    expect(resampled16From48.length).toBe(16000);

    // 1.3 Explicit resampling 44.1kHz -> 16kHz (1 second 440Hz tone)
    const srcRate44 = 44100;
    const tone44 = new Float32Array(srcRate44);
    for (let i = 0; i < srcRate44; i++) {
      tone44[i] = 0.5 * Math.sin((2 * Math.PI * 440 * i) / srcRate44);
    }
    const resampled16From44 = resampleMonoPcm(tone44, srcRate44, WHISPER_SAMPLE_RATE);
    expect(resampled16From44.length).toBe(16000);

    // 1.4 Normalization strictly within [-1, 1] and scrubbing non-finite values
    const overdriven = new Float32Array([2.0, -4.0, Number.NaN, 1.0]);
    const { pcm, stats } = normalizeMonoPcm(overdriven);
    expect(stats.peak).toBeCloseTo(1.0, 5);
    for (let i = 0; i < pcm.length; i++) {
      expect(Number.isFinite(pcm[i])).toBe(true);
      expect(pcm[i]).toBeGreaterThanOrEqual(-1);
      expect(pcm[i]).toBeLessThanOrEqual(1);
    }

    const validStats = validateWhisperPcm(resampled16From48);
    expect(validStats.rms).toBeGreaterThan(0.1);

    // 1.5 Silence / empty audio rejection
    const silent = new Float32Array(16000);
    expect(() => validateWhisperPcm(silent)).toThrow(/silent|No audible speech signal/i);
    expect(() => validateWhisperPcm(new Float32Array(0))).toThrow();
  });

  test('2. Degenerate hallucination detector catches repetition loops & script mismatches without false positives', () => {
    expect(detectDegenerateTranscription('क्या क्या क्या क्या क्या', 'en').isDegenerate).toBe(true);
    expect(detectDegenerateTranscription('लिया लिया लिया लिया लिया लिया', 'en').isDegenerate).toBe(true);
    expect(detectDegenerateTranscription('क्या बात है आज क्या', 'en').isDegenerate).toBe(true);

    // Valid English and Hindi speech must NOT trigger false positives
    expect(
      detectDegenerateTranscription(
        'Welcome back everyone, today we are going to build a browser video caption generator step by step.',
        'en'
      ).isDegenerate
    ).toBe(false);
    expect(
      detectDegenerateTranscription(
        'नमस्ते दोस्तों आज हम एक नया वीडियो एडिट करना सीखेंगे और उसे एक्सपोर्ट करेंगे।',
        'hi'
      ).isDegenerate
    ).toBe(false);
  });

  test('3. ASR worker uses fp32 encoder / q4 decoder, repetition guards, WASM fallback, and zero hardcoded hindi', () => {
    const workerSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/workers/asr.worker.ts'),
      'utf8'
    );

    expect(workerSrc).toContain("encoder_model: 'fp32'");
    expect(workerSrc).toContain("decoder_model_merged: 'q4'");
    expect(workerSrc).not.toContain("encoder_model: 'q4f16'");
    expect(workerSrc).not.toContain("language: 'hindi'");
    expect(workerSrc).toContain("task: 'transcribe'");
    expect(workerSrc).toContain("return_timestamps: 'word'");
    expect(workerSrc).toContain('no_repeat_ngram_size: 3');
    expect(workerSrc).toContain('condition_on_previous_text: false');
    expect(workerSrc).toContain('compression_ratio_threshold: 2.4');
    expect(workerSrc).toContain('detectDegenerateTranscription');
    expect(workerSrc).toContain("device: 'wasm'");
  });

  test('4. /video-caption-generator renders Spoken Language selector with English default and all required options', async ({ page }) => {
    await page.goto(`${BASE_URL}/video-caption-generator`);

    const selector = page.getByLabel('Spoken language');
    await expect(selector).toBeVisible();
    await expect(selector).toHaveValue('en');

    const optionTexts = await selector.locator('option').allTextContents();
    for (const item of CAPTION_LANGUAGES) {
      expect(optionTexts).toContain(item.label);
    }

    await selector.selectOption('auto');
    await expect(selector).toHaveValue('auto');

    await selector.selectOption('hi');
    await expect(selector).toHaveValue('hi');
  });
});
