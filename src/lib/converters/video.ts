import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const loadFfmpeg = async (onProgress: (p: { progress: number }) => void) => {
  if (ffmpeg) {
    // If it's already loaded, just update the progress listener
    ffmpeg.off('progress', () => {}); // Remove previous listeners
    ffmpeg.on('progress', onProgress);
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();
  ffmpeg.on('progress', onProgress);
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};

export const convertVideo = async (
  file: File, 
  targetFormat: string, 
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const ffmpegInstance = await loadFfmpeg((p) => {
    // p.progress goes from 0 to 1
    let pct = Math.round(p.progress * 100);
    // Sometimes ffmpeg emits slightly over 100 or negative depending on estimation
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    onProgress(pct);
  });

  const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${targetFormat}`;

  // Write the file to ffmpeg's virtual file system
  await ffmpegInstance.writeFile(inputName, await fetchFile(file));

  // Determine ffmpeg command
  if (targetFormat === 'mp3') {
    // Extract audio with high quality
    await ffmpegInstance.exec(['-i', inputName, '-q:a', '0', '-map', 'a', outputName]);
  } else {
    // Standard conversion to mp4 (e.g. from MOV)
    await ffmpegInstance.exec(['-i', inputName, outputName]);
  }

  // Read the result
  const data = await ffmpegInstance.readFile(outputName);
  
  // Clean up virtual file system
  await ffmpegInstance.deleteFile(inputName);
  await ffmpegInstance.deleteFile(outputName);

  return new Blob([data as any], { type: targetFormat === 'mp3' ? 'audio/mpeg' : 'video/mp4' });
};
