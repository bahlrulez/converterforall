import { CaptionChunk } from './types';
import { StyleSettings, PositionSettings, FontPayload } from './style-types';

export type ExportStatus = 'PREPARING' | 'DECODING' | 'RENDERING' | 'ENCODING' | 'FINALIZING' | 'DONE' | 'ERROR' | 'CANCELLED';

export interface ExportProgress {
  status: ExportStatus;
  progress?: number; // Optional numeric progress (0 to 100)
  currentFrame?: number;
  totalFrames?: number;
  stage?: string;
  message?: string;
  error?: string;
}

export interface ExportWorkerRequest {
  type: 'START_EXPORT' | 'CANCEL_EXPORT';
  file?: File;
  captions?: CaptionChunk[];
  fonts?: FontPayload[];
  globalStyle?: StyleSettings;
  globalPosition?: PositionSettings;
}

export interface ExportWorkerResponse {
  type: 'PROGRESS' | 'DONE' | 'ERROR';
  progress?: ExportProgress;
  blob?: Blob;
  error?: string;
}

export async function checkEncoderSupport(codec: string, width: number, height: number, fps: number): Promise<boolean> {
  if (typeof window === 'undefined' || !('VideoEncoder' in window)) return false;
  try {
    const support = await VideoEncoder.isConfigSupported({
      codec,
      width,
      height,
      framerate: fps,
      bitrate: 5_000_000 // 5 Mbps default check
    });
    return Boolean(support.supported);
  } catch {
    return false;
  }
}

export interface VideoFileValidation {
  valid: boolean;
  error?: string;
  detectedFormat?: 'mp4' | 'mov' | 'webm' | 'm4v' | 'unknown';
}

export function validateVideoFile(file: File): VideoFileValidation {
  if (!file) {
    return { valid: false, error: 'No video file provided.' };
  }

  const name = file.name || '';
  const extMatch = name.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '';
  const rawType = (file.type || '').toLowerCase().trim();

  const supportedExtensions = ['mp4', 'mov', 'webm', 'm4v'];
  const supportedMimes = [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-m4v',
  ];

  const hasSupportedExt = supportedExtensions.includes(ext);
  const hasSupportedMime = supportedMimes.some(m => rawType === m || rawType.startsWith(`${m};`));

  // Explicit non-video MIME
  if (rawType && !rawType.startsWith('video/') && !hasSupportedExt) {
    return {
      valid: false,
      error: 'The selected file is not a supported video. Please choose an MP4, QuickTime (MOV), or WebM video file.'
    };
  }

  // Explicit unsupported video containers
  const unsupportedContainers = ['avi', 'mkv', 'flv', 'wmv', '3gp', 'asf', 'ts', 'ogv'];
  if (unsupportedContainers.includes(ext) || rawType.includes('matroska') || rawType.includes('avi') || rawType.includes('x-msvideo')) {
    return {
      valid: false,
      error: `Video format (.${ext || 'unsupported'}) is not supported. Subtitle Generator supports MP4, QuickTime (MOV), and WebM.`
    };
  }

  if (!hasSupportedExt && !hasSupportedMime) {
    return {
      valid: false,
      error: 'Please select a supported video format: MP4, QuickTime (MOV), or WebM.'
    };
  }

  const detectedFormat = (ext === 'mov' ? 'mov' : ext === 'webm' ? 'webm' : ext === 'm4v' ? 'm4v' : 'mp4');

  return { valid: true, detectedFormat };
}
