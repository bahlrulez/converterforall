import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import JSZip from 'jszip';

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
  toolSlug: string,
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

    let exitCode = 0;
    
    if (toolSlug === 'compress-video') {
      // Compress video
      exitCode = await ffmpegInstance.exec([
        '-i', inputName, 
        '-vcodec', 'libx264', 
        '-crf', '28', 
        '-preset', 'fast', 
        '-c:a', 'aac', 
        '-b:a', '128k', 
        outputName
      ]);
    } else if (toolSlug === 'video-to-jpg') {
      // Extract frames at 1 fps
      // We will create a directory first to store frames
      await ffmpegInstance.createDir('frames');
      exitCode = await ffmpegInstance.exec([
        '-i', inputName,
        '-r', '1',
        '-q:v', '5', 
        '-vf', 'scale=854:-2', // Limit to 480p width to prevent WASM memory crashes
        'frames/frame_%04d.jpg'
      ]);
    } else if (targetFormat === 'mp3' || targetFormat === 'wav' || targetFormat === 'ogg') {
      // Default to best audio stream instead of mapping all audio streams
      exitCode = await ffmpegInstance.exec(['-i', inputName, '-q:a', '0', outputName]);
    } else {
      exitCode = await ffmpegInstance.exec(['-i', inputName, outputName]);
    }

    if (exitCode !== 0) {
      throw new Error(`Conversion failed with FFmpeg exit code ${exitCode}. Please try a different file.`);
    }

    if (toolSlug === 'video-to-jpg') {
      const zip = new JSZip();
      // list files in frames directory
      const files = await ffmpegInstance.listDir('frames');
      let imageCount = 0;
      for (const f of files) {
        if (!f.isDir) {
          const frameData = await ffmpegInstance.readFile(`frames/${f.name}`);
          zip.file(f.name, frameData as Uint8Array);
          imageCount++;
          await ffmpegInstance.deleteFile(`frames/${f.name}`);
        }
      }
      await ffmpegInstance.deleteDir('frames');
      
      if (imageCount === 0) {
         throw new Error("No frames were extracted from the video.");
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      await ffmpegInstance.deleteFile(inputName);
      return zipBlob;
    }

    const data = await ffmpegInstance.readFile(outputName);
    
    await ffmpegInstance.deleteFile(inputName);
    await ffmpegInstance.deleteFile(outputName);

    let mimeType = 'video/mp4';
    if (targetFormat === 'mp3') mimeType = 'audio/mpeg';
    if (targetFormat === 'wav') mimeType = 'audio/wav';
    if (targetFormat === 'ogg') mimeType = 'audio/ogg';
    if (targetFormat === 'avi') mimeType = 'video/x-msvideo';
    if (targetFormat === 'mkv') mimeType = 'video/x-matroska';
    if (targetFormat === 'wmv') mimeType = 'video/x-ms-wmv';
    if (targetFormat === 'mov') mimeType = 'video/quicktime';
    if (targetFormat === 'flv') mimeType = 'video/x-flv';

    return new Blob([data as any], { type: mimeType });
  } catch (err: any) {
    if (typeof SharedArrayBuffer === 'undefined') {
      throw new Error("Your browser is blocking the video engine due to missing security headers. Please refresh the page (F5) directly on this URL to enable video conversion.");
    }
    throw new Error(`FFmpeg error: ${err.message || String(err)}`);
  }
};
