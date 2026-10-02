import { CaptionCapabilities } from './types';

export function checkBrowserCapabilities(): CaptionCapabilities {
  // Safe checks for browser environment
  const isBrowser = typeof window !== 'undefined';
  
  return {
    webgpu: isBrowser && 'gpu' in navigator,
    worker: isBrowser && typeof Worker !== 'undefined',
    audioDecode: isBrowser && (typeof window.AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined'),
    videoDecode: isBrowser && typeof (window as any).VideoDecoder !== 'undefined',
    videoEncode: isBrowser && typeof (window as any).VideoEncoder !== 'undefined',
    crossOriginIsolated: isBrowser && window.crossOriginIsolated === true,
  };
}

export function isASRReady(capabilities: CaptionCapabilities): boolean {
  return capabilities.webgpu && capabilities.worker && capabilities.audioDecode;
}
