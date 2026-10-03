import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, CURATED_PRESET_NAMES, applyPreset } from '../src/lib/caption-studio/presets';
import { DEFAULT_STYLE } from '../src/lib/caption-studio/caption-renderer';
import { 
  SUPPORTED_LANGUAGES, 
  normalizeLanguageCode, 
  isSupportedLanguage, 
  getWhisperLanguageOptions 
} from '../src/lib/caption-studio/language';
import { CaptionChunk } from '../src/lib/caption-studio/types';

test('Presets: Curated presets exist with required visual properties', () => {
  assert.equal(CURATED_PRESET_NAMES.length, 6);
  for (const name of CURATED_PRESET_NAMES) {
    const preset = PRESETS[name];
    assert.ok(preset, `Preset ${name} must exist in PRESETS`);
    assert.ok(preset.fontFamily, `${name} must define fontFamily`);
    assert.ok(typeof preset.fontSize === 'number', `${name} must define numeric fontSize`);
    assert.ok(preset.textColor, `${name} must define textColor`);
    assert.ok(typeof preset.lineHeight === 'number', `${name} must define lineHeight`);
    assert.ok(preset.activeWordColor, `${name} must define activeWordColor`);
  }
});

test('applyPreset: Deterministic style application', () => {
  const result1 = applyPreset(DEFAULT_STYLE, 'Bold Social');
  const result2 = applyPreset(DEFAULT_STYLE, 'Bold Social');
  assert.deepEqual(result1, result2);
  assert.equal(result1.fontFamily, PRESETS['Bold Social'].fontFamily);
  assert.equal(result1.fontSize, PRESETS['Bold Social'].fontSize);
  assert.equal(result1.textColor, PRESETS['Bold Social'].textColor);
  assert.equal(result1.outlineColor, PRESETS['Bold Social'].outlineColor);
});

test('applyPreset: Preserves active-word toggle state across preset switches', () => {
  // 1. User turned ON active-word highlighting
  const customStyleOn = {
    ...DEFAULT_STYLE,
    activeWordHighlight: true
  };
  const switchedOn = applyPreset(customStyleOn, 'Cinematic');
  assert.equal(switchedOn.activeWordHighlight, true);
  assert.equal(switchedOn.activeWordColor, PRESETS['Cinematic'].activeWordColor);

  // 2. User turned OFF active-word highlighting
  const customStyleOff = {
    ...DEFAULT_STYLE,
    activeWordHighlight: false
  };
  const switchedOff = applyPreset(customStyleOff, 'Box Highlight');
  assert.equal(switchedOff.activeWordHighlight, false);
  // Preserves curated box background color
  assert.equal(switchedOff.activeWordBackgroundColor, PRESETS['Box Highlight'].activeWordBackgroundColor);
});

test('applyPreset: Does not mutate input style object or captions', () => {
  const originalStyle = { ...DEFAULT_STYLE };
  const styleJsonBefore = JSON.stringify(originalStyle);
  
  const sampleCaptions: CaptionChunk[] = [
    {
      id: 'cap_1',
      text: 'नमस्ते दुनिया यह एक परीक्षण है',
      start: 0.5,
      end: 3.0,
      words: [
        { word: 'नमस्ते', start: 0.5, end: 1.0 },
        { word: 'दुनिया', start: 1.0, end: 1.5 }
      ]
    }
  ];
  const captionsJsonBefore = JSON.stringify(sampleCaptions);

  const newStyle = applyPreset(originalStyle, 'Neon Glow');

  assert.equal(JSON.stringify(originalStyle), styleJsonBefore);
  assert.equal(JSON.stringify(sampleCaptions), captionsJsonBefore);
  assert.notEqual(newStyle, originalStyle);
});

test('applyPreset: Safely handles unknown preset name', () => {
  const original = { ...DEFAULT_STYLE };
  const fallback = applyPreset(original, 'NonExistentPreset');
  assert.deepEqual(fallback, original);
});

test('Language: Supported languages list contains honest choices', () => {
  const codes = SUPPORTED_LANGUAGES.map(l => l.code);
  assert.deepEqual(codes, ['auto', 'hindi', 'english']);
});

test('Language: normalizeLanguageCode normalizes supported inputs correctly', () => {
  assert.equal(normalizeLanguageCode('auto'), 'auto');
  assert.equal(normalizeLanguageCode('Auto'), 'auto');
  assert.equal(normalizeLanguageCode('detect'), 'auto');
  
  assert.equal(normalizeLanguageCode('hindi'), 'hindi');
  assert.equal(normalizeLanguageCode('Hindi'), 'hindi');
  assert.equal(normalizeLanguageCode('hi'), 'hindi');
  assert.equal(normalizeLanguageCode('HI'), 'hindi');

  assert.equal(normalizeLanguageCode('english'), 'english');
  assert.equal(normalizeLanguageCode('English'), 'english');
  assert.equal(normalizeLanguageCode('en'), 'english');
  assert.equal(normalizeLanguageCode('EN'), 'english');
});

test('Language: normalizeLanguageCode safely falls back to auto for invalid/unsupported values', () => {
  assert.equal(normalizeLanguageCode(undefined), 'auto');
  assert.equal(normalizeLanguageCode(null), 'auto');
  assert.equal(normalizeLanguageCode(''), 'auto');
  assert.equal(normalizeLanguageCode('   '), 'auto');
  assert.equal(normalizeLanguageCode('spanish'), 'auto');
  assert.equal(normalizeLanguageCode('klingon'), 'auto');
  assert.equal(normalizeLanguageCode('123'), 'auto');
});

test('Language: isSupportedLanguage validates genuine options', () => {
  assert.equal(isSupportedLanguage('auto'), true);
  assert.equal(isSupportedLanguage('hindi'), true);
  assert.equal(isSupportedLanguage('hi'), true);
  assert.equal(isSupportedLanguage('english'), true);
  assert.equal(isSupportedLanguage('en'), true);

  assert.equal(isSupportedLanguage('french'), false);
  assert.equal(isSupportedLanguage('german'), false);
  assert.equal(isSupportedLanguage(null), false);
  assert.equal(isSupportedLanguage(''), false);
});

test('Language: getWhisperLanguageOptions correctly prepares Whisper processor config', () => {
  // 1. Auto Detect: MUST NOT specify language, so Whisper runs native language detection head
  const autoOptions = getWhisperLanguageOptions('auto');
  assert.equal(autoOptions.task, 'transcribe');
  assert.equal(autoOptions.return_timestamps, 'word');
  assert.equal('language' in autoOptions, false, 'Auto Detect must not specify language');

  // 2. Hindi: MUST specify language as 'hindi'
  const hindiOptions = getWhisperLanguageOptions('hindi');
  assert.equal(hindiOptions.task, 'transcribe');
  assert.equal(hindiOptions.return_timestamps, 'word');
  assert.equal(hindiOptions.language, 'hindi');

  // 3. English: MUST specify language as 'english'
  const englishOptions = getWhisperLanguageOptions('english');
  assert.equal(englishOptions.task, 'transcribe');
  assert.equal(englishOptions.return_timestamps, 'word');
  assert.equal(englishOptions.language, 'english');

  // 4. Invalid input safely defaults to auto options
  const fallbackOptions = getWhisperLanguageOptions('unsupported_language');
  assert.equal('language' in fallbackOptions, false);
});
