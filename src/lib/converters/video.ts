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

export const extractFramesWithCanvas = async (file: File, fps: number, onProgress: (p: number) => void): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    
    video.onloadedmetadata = async () => {
      const duration = video.duration;
      // Safety net for broken video durations
      if (!duration || !isFinite(duration)) {
        reject(new Error("Could not determine video duration."));
        return;
      }
      
      const totalFrames = Math.floor(duration * fps);
      if (totalFrames === 0) {
        reject(new Error("Video is too short for the selected FPS."));
        return;
      }

      const zip = new JSZip();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("Could not create canvas context."));
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      let currentFrame = 0;
      let hasError = false;
      
      const processNextFrame = () => {
        if (hasError) return;
        
        if (currentFrame >= totalFrames) {
          onProgress(100); // 100%
          zip.generateAsync({ type: 'blob' }).then(resolve).catch(reject);
          URL.revokeObjectURL(video.src);
          return;
        }
        
        const time = currentFrame / fps;
        video.currentTime = time;
      };
      
      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              // 1-indexed frame numbers for standard sequences
              const frameNumber = (currentFrame + 1).toString().padStart(4, '0');
              zip.file(`frame_${frameNumber}.jpg`, blob);
            }
            currentFrame++;
            onProgress(Math.round((currentFrame / totalFrames) * 100));
            processNextFrame();
          }, 'image/jpeg', 0.9); // Use 0.9 for high quality
        } catch (err) {
          hasError = true;
          reject(new Error("Failed to extract frame. The video might be corrupted or in an unsupported codec."));
        }
      };
      
      video.onerror = (e) => {
        hasError = true;
        reject(new Error("Video playback error in browser."));
      };
      
      // Start the loop
      processNextFrame();
    };
    
    // Trigger metadata load
    video.load();
  });
};

export const convertVideo = async (
  file: File, 
  targetFormat: string, 
  toolSlug: string,
  onProgress: (progress: number) => void,
  options?: { fps?: number }
): Promise<Blob> => {
  if (toolSlug === 'video-to-jpg') {
    // Delegate to native HTML5 Canvas implementation
    return extractFramesWithCanvas(file, options?.fps || 1, onProgress);
  }

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
    } else if (targetFormat === 'mp3' || targetFormat === 'wav' || targetFormat === 'ogg') {
      // Default to best audio stream instead of mapping all audio streams
      exitCode = await ffmpegInstance.exec(['-i', inputName, '-q:a', '0', outputName]);
    } else {
      exitCode = await ffmpegInstance.exec(['-i', inputName, outputName]);
    }

    if (exitCode !== 0) {
      throw new Error(`Conversion failed with FFmpeg exit code ${exitCode}. Please try a different file.`);
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
