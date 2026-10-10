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
  if (typeof (window as any).VideoEncoder === 'undefined') return false;
  try {
    const support = await (window as any).VideoEncoder.isConfigSupported({
      codec,
      width,
      height,
      framerate: fps,
      bitrate: 5_000_000 // 5 Mbps default check
    });
    return support.supported;
  } catch (e) {
    return false;
  }
}
