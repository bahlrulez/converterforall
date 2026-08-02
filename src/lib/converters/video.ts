import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const loadFfmpeg = async (onProgress: (p: { progress: number }) => void) => {
  console.log("loadFfmpeg called");
  if (ffmpeg && ffmpeg.loaded) {
    console.log("Returning existing ffmpeg instance");
    // If it's already loaded, just update the progress listener
    ffmpeg.off('progress', () => {}); // Remove previous listeners
    ffmpeg.on('progress', onProgress);
    return ffmpeg;
  }

  console.log("Creating new FFmpeg instance");
  ffmpeg = new FFmpeg();
  ffmpeg.on('progress', onProgress);
  ffmpeg.on('log', ({ message }) => console.log("FFMPEG LOG:", message));
  
  console.log("Calling ffmpeg.load() with blob URLs...");
  const baseURL = window.location.origin;
  try {
    const coreURL = await toBlobURL("https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js", "text/javascript");
    const wasmURL = await toBlobURL("https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm", "application/wasm");
    const classWorkerURL = await toBlobURL(`${baseURL}/ffmpeg/814.ffmpeg.js`, "text/javascript");

    await ffmpeg.load({
      coreURL,
      wasmURL,
      classWorkerURL,
    });
    console.log("ffmpeg.load() finished");
  } catch (err) {
    console.error("FFmpeg load failed:", err);
    throw err;
  }
  
  return ffmpeg;
};

export const convertVideo = async (
  file: File, 
  targetFormat: string, 
  onProgress: (progress: number) => void
): Promise<Blob> => {
  try {
    const ffmpegInstance = await loadFfmpeg((p) => {
      let pct = Math.round(p.progress * 100);
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      onProgress(pct);
    });

    const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const inputName = `input.${inputExt}`;
    const outputName = `output.${targetFormat}`;

    await ffmpegInstance.writeFile(inputName, await fetchFile(file));

    if (targetFormat === 'mp3') {
      await ffmpegInstance.exec(['-i', inputName, '-q:a', '0', '-map', 'a', outputName]);
    } else {
      await ffmpegInstance.exec(['-i', inputName, outputName]);
    }

    const data = await ffmpegInstance.readFile(outputName);
    
    await ffmpegInstance.deleteFile(inputName);
    await ffmpegInstance.deleteFile(outputName);

    return new Blob([data as any], { type: targetFormat === 'mp3' ? 'audio/mpeg' : 'video/mp4' });
  } catch (err: any) {
    if (typeof SharedArrayBuffer === 'undefined') {
      throw new Error("Your browser is blocking the video engine due to missing security headers. Please refresh the page (F5) directly on this URL to enable video conversion.");
    }
    throw new Error(`FFmpeg error: ${err.message || String(err)}`);
  }
};
