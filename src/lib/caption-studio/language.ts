/**
 * Language options and validation for Caption Studio ASR transcription.
 * 
 * Supported models: Whisper Large v3 Turbo timestamped (multilingual).
 * Curated honest choices: Auto Detect, Hindi, English.
 */

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel?: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'english', label: 'English', nativeLabel: 'English' }
] as const;

export const VALID_LANGUAGE_CODES = new Set(['auto', 'hindi', 'english']);

/**
 * Normalizes input language string to a verified Whisper language code.
 * Falls back safely to 'auto' if given null, undefined, or unsupported string.
 */
export function normalizeLanguageCode(code: string | undefined | null): string {
  if (!code || typeof code !== 'string') return 'auto';
  const clean = code.trim().toLowerCase();
  if (clean === 'hi' || clean === 'hindi') return 'hindi';
  if (clean === 'en' || clean === 'english') return 'english';
  if (clean === 'auto' || clean === 'detect') return 'auto';
  return 'auto'; // safe fallback
}

/**
 * Checks if a language code is genuinely supported.
 */
export function isSupportedLanguage(code: string | undefined | null): boolean {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim().toLowerCase();
  return clean === 'auto' || clean === 'hindi' || clean === 'english' || clean === 'hi' || clean === 'en';
}

/**
 * Prepares the Whisper pipeline options object for ASR worker.
 * If language is 'auto', language is omitted to let Whisper run built-in language identification.
 */
export function getWhisperLanguageOptions(languageCode: string | undefined | null): { language?: string; task: 'transcribe'; return_timestamps: 'word' } {
  const norm = normalizeLanguageCode(languageCode);
  const options: { language?: string; task: 'transcribe'; return_timestamps: 'word' } = {
    task: 'transcribe',
    return_timestamps: 'word'
  };
  if (norm !== 'auto') {
    options.language = norm;
  }
  return options;
}
