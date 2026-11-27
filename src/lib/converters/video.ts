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
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
      
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
          zip.generateAsync({ type: 'blob', compression: "STORE" }).then(resolve).catch(reject);
          URL.revokeObjectURL(video.src);
          return;
        }
        
        const time = currentFrame / fps;
        video.currentTime = time;
      };
      
      video.onseeked = async () => {
        try {
          // Hardware-accelerated GPU frame grab
          if (typeof createImageBitmap !== 'undefined') {
            try {
              const bitmap = await createImageBitmap(video);
              ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
              bitmap.close();
            } catch {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
          } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }

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

export interface VideoCompressionOptions {
  crf?: number; // 18 to 36
  resolution?: "original" | "1080p" | "720p" | "480p" | "360p";
  muteAudio?: boolean;
  audioBitrate?: "128k" | "96k" | "64k";
  fpsLimit?: number;
}

export const compressVideoAdvanced = async (
  file: File,
  options: VideoCompressionOptions,
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const ffmpegInstance = await loadFfmpeg((p) => {
    let pct = Math.round(p.progress * 100);
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    onProgress(pct);
  });

  const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const inputName = `input_${Date.now()}.${inputExt}`;
  const outputName = `compressed_${Date.now()}.mp4`;

  await ffmpegInstance.writeFile(inputName, await fetchFile(file));

  const args: string[] = ['-i', inputName];

  // Video Codec & Quality
  args.push('-vcodec', 'libx264');
  args.push('-crf', (options.crf || 26).toString());
  args.push('-preset', 'fast');

  // Video Filter (Scaling)
  const filters: string[] = [];
  if (options.resolution === "1080p") {
    filters.push("scale='min(1920,iw)':-2");
  } else if (options.resolution === "720p") {
    filters.push("scale='min(1280,iw)':-2");
  } else if (options.resolution === "480p") {
    filters.push("scale='min(854,iw)':-2");
  } else if (options.resolution === "360p") {
    filters.push("scale='min(640,iw)':-2");
  }

  if (options.fpsLimit) {
    filters.push(`fps=${options.fpsLimit}`);
  }

  if (filters.length > 0) {
    args.push('-vf', filters.join(','));
  }

  // Audio Handling
  if (options.muteAudio) {
    args.push('-an');
  } else {
    args.push('-c:a', 'aac');
    args.push('-b:a', options.audioBitrate || '128k');
  }

  // Fast start for web streaming
  args.push('-movflags', '+faststart');
  args.push(outputName);

  const exitCode = await ffmpegInstance.exec(args);

  if (exitCode !== 0) {
    throw new Error(`Video compression failed with FFmpeg exit code ${exitCode}.`);
  }

  const data = await ffmpegInstance.readFile(outputName);

  await ffmpegInstance.deleteFile(inputName);
  await ffmpegInstance.deleteFile(outputName);

  return new Blob([data as any], { type: 'video/mp4' });
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

export interface AdvancedVideoConvertOptions {
  targetFormat: string; // "mp4", "webm", "mov", "mkv", "avi", "wmv", "flv", "gif", "mp3", "wav"
  preset?: "ultrafast" | "veryfast" | "fast" | "medium";
  crf?: number;
  resolution?: "original" | "1080p" | "720p" | "480p" | "360p";
  startTime?: number;
  endTime?: number;
  muteAudio?: boolean;
  audioBitrate?: "128k" | "192k" | "320k";
  fps?: number;
}

export const convertVideoAdvanced = async (
  file: File,
  options: AdvancedVideoConvertOptions,
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const targetFormat = (options.targetFormat || 'mp4').toLowerCase();
  
  if (targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'zip') {
    return extractFramesWithCanvas(file, options.fps || 1, onProgress);
  }

  const ffmpegInstance = await loadFfmpeg((p) => {
    let pct = Math.round(p.progress * 100);
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    onProgress(pct);
  });

  const inputExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const inputName = `input_${Date.now()}.${inputExt}`;
  const outputName = `converted_${Date.now()}.${targetFormat}`;

  await ffmpegInstance.writeFile(inputName, await fetchFile(file));

  const args: string[] = [];

  // Trimming parameters before input for fast seek
  if (options.startTime !== undefined && options.startTime > 0) {
    args.push('-ss', options.startTime.toString());
  }

  args.push('-i', inputName);

  if (options.endTime !== undefined && options.endTime > 0 && options.startTime !== undefined && options.endTime > options.startTime) {
    args.push('-t', (options.endTime - options.startTime).toString());
  } else if (options.endTime !== undefined && options.endTime > 0 && (!options.startTime || options.startTime === 0)) {
    args.push('-t', options.endTime.toString());
  }

  // Multi-threaded local decoding/encoding
  args.push('-threads', '0');

  // Format-specific codec and filter optimization
  if (targetFormat === 'mp3' || targetFormat === 'wav' || targetFormat === 'ogg') {
    // Audio extraction
    args.push('-vn');
    if (targetFormat === 'mp3') {
      args.push('-c:a', 'libmp3lame', '-b:a', options.audioBitrate || '192k');
    }
  } else if (targetFormat === 'gif') {
    // High quality animated GIF
    const scaleFilter = options.resolution === '480p' ? "scale=480:-1:flags=lanczos" : "scale=640:-1:flags=lanczos";
    args.push('-vf', `fps=${options.fps || 15},${scaleFilter}`);
  } else {
    // Video Encoding
    const filters: string[] = [];
    if (options.resolution === "1080p") {
      filters.push("scale='min(1920,iw)':-2");
    } else if (options.resolution === "720p") {
      filters.push("scale='min(1280,iw)':-2");
    } else if (options.resolution === "480p") {
      filters.push("scale='min(854,iw)':-2");
    } else if (options.resolution === "360p") {
      filters.push("scale='min(640,iw)':-2");
    }

    if (options.fps) {
      filters.push(`fps=${options.fps}`);
    }

    if (filters.length > 0) {
      args.push('-vf', filters.join(','));
    }

    if (targetFormat === 'mp4') {
      args.push('-vcodec', 'libx264');
      args.push('-preset', options.preset || 'ultrafast');
      args.push('-crf', (options.crf || 23).toString());
      args.push('-pix_fmt', 'yuv420p');
      args.push('-movflags', '+faststart');

      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'aac', '-b:a', options.audioBitrate || '128k');
      }
    } else if (targetFormat === 'webm') {
      args.push('-vcodec', 'libvpx');
      args.push('-crf', (options.crf || 24).toString());
      args.push('-b:v', '1M');
      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'libvorbis');
      }
    } else if (targetFormat === 'avi') {
      args.push('-vcodec', 'mpeg4');
      args.push('-qscale:v', '3');
      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'libmp3lame');
      }
    } else if (targetFormat === 'mov') {
      args.push('-vcodec', 'libx264', '-preset', options.preset || 'ultrafast', '-crf', (options.crf || 22).toString());
      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'aac');
      }
    } else if (targetFormat === 'mkv') {
      args.push('-vcodec', 'libx264', '-preset', options.preset || 'ultrafast', '-crf', (options.crf || 22).toString());
      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'aac');
      }
    } else if (targetFormat === 'wmv') {
      const qVal = Math.max(2, Math.min(8, Math.round((options.crf || 23) / 4)));
      args.push('-vcodec', 'wmv2', '-q:v', qVal.toString());
      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'wmav2', '-ar', '44100', '-ac', '2', '-b:a', options.audioBitrate || '128k');
      }
    } else if (targetFormat === 'flv') {
      const qVal = Math.max(2, Math.min(8, Math.round((options.crf || 23) / 4)));
      args.push('-vcodec', 'flv1', '-q:v', qVal.toString());
      if (options.muteAudio) {
        args.push('-an');
      } else {
        args.push('-c:a', 'libmp3lame', '-ar', '44100', '-b:a', options.audioBitrate || '128k');
      }
    }
  }

  args.push(outputName);

  const exitCode = await ffmpegInstance.exec(args);

  if (exitCode !== 0) {
    throw new Error(`Video conversion failed with FFmpeg exit code ${exitCode}. Please try a different preset or video.`);
  }

  const data = await ffmpegInstance.readFile(outputName);

  await ffmpegInstance.deleteFile(inputName);
  await ffmpegInstance.deleteFile(outputName);

  let mimeType = 'video/mp4';
  if (targetFormat === 'mp3') mimeType = 'audio/mpeg';
  if (targetFormat === 'wav') mimeType = 'audio/wav';
  if (targetFormat === 'gif') mimeType = 'image/gif';
  if (targetFormat === 'webm') mimeType = 'video/webm';
  if (targetFormat === 'avi') mimeType = 'video/x-msvideo';
  if (targetFormat === 'mkv') mimeType = 'video/x-matroska';
  if (targetFormat === 'mov') mimeType = 'video/quicktime';
  if (targetFormat === 'wmv') mimeType = 'video/x-ms-wmv';
  if (targetFormat === 'flv') mimeType = 'video/x-flv';

  return new Blob([data as any], { type: mimeType });
};

export interface AnimatedGifOptions {
  delayMs: number;
  width: number; // 0 = auto from first frame (capped safely)
  loopCount: number; // 0 = forever, -1 = play once
  backgroundColor: string;
}

/** Normalize uploaded raster frames via HTML5 Canvas and encode an animated GIF using FFmpeg WASM. */
export const createAnimatedGifFromImages = async (
  files: File[],
  options: AnimatedGifOptions,
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; width: number; height: number }> => {
  if (files.length === 0) {
    throw new Error("Select at least one image frame to generate a GIF.");
  }

  const { loadImageElement } = await import("./image-edit");

  const loadedImages: { img: HTMLImageElement; url: string }[] = [];
  try {
    for (const f of files) {
      const url = URL.createObjectURL(f);
      const img = await loadImageElement(url);
      loadedImages.push({ img, url });
    }

    const firstImg = loadedImages[0].img;
    const baseW = firstImg.naturalWidth || firstImg.width;
    const baseH = firstImg.naturalHeight || firstImg.height;
    const targetW =
      options.width > 0
        ? Math.min(1000, Math.max(64, Math.round(options.width)))
        : Math.min(800, Math.max(64, baseW));
    const targetH = Math.max(64, Math.round((targetW * baseH) / Math.max(1, baseW)));
    const evenW = targetW % 2 === 0 ? targetW : targetW + 1;
    const evenH = targetH % 2 === 0 ? targetH : targetH + 1;

    const canvas = document.createElement("canvas");
    canvas.width = evenW;
    canvas.height = evenH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context is not available in this browser.");
    }

    const frameBlobs: Uint8Array[] = [];
    for (let i = 0; i < loadedImages.length; i++) {
      const { img } = loadedImages[i];
      ctx.fillStyle = options.backgroundColor || "#ffffff";
      ctx.fillRect(0, 0, evenW, evenH);

      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = Math.min(evenW / Math.max(1, iw), evenH / Math.max(1, ih));
      const drawW = Math.round(iw * scale);
      const drawH = Math.round(ih * scale);
      const dx = Math.round((evenW - drawW) / 2);
      const dy = Math.round((evenH - drawH) / 2);
      ctx.drawImage(img, dx, dy, drawW, drawH);

      const pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!pngBlob) throw new Error(`Failed to render frame ${i + 1}.`);
      frameBlobs.push(new Uint8Array(await pngBlob.arrayBuffer()));
      onProgress(Math.round(((i + 1) / loadedImages.length) * 30));
    }

    const ffmpegInstance = await loadFfmpeg((p) => {
      const pct = 30 + Math.round(Math.max(0, Math.min(1, p.progress)) * 70);
      onProgress(pct);
    });

    const writtenNames: string[] = [];
    const outputName = `animated_${Date.now()}.gif`;

    try {
      for (let i = 0; i < frameBlobs.length; i++) {
        const frameName = `gif_frame_${String(i).padStart(4, "0")}.png`;
        await ffmpegInstance.writeFile(frameName, frameBlobs[i]);
        writtenNames.push(frameName);
      }

      const fps = Math.max(0.5, Math.min(20, 1000 / Math.max(50, options.delayMs)));
      const exitCode = await ffmpegInstance.exec([
        "-framerate",
        fps.toFixed(2),
        "-i",
        "gif_frame_%04d.png",
        "-vf",
        "split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5",
        "-loop",
        options.loopCount.toString(),
        outputName,
      ]);

      if (exitCode !== 0) {
        throw new Error(`FFmpeg GIF encoding failed (exit code ${exitCode}).`);
      }

      const data = await ffmpegInstance.readFile(outputName);
      onProgress(100);
      return {
        blob: new Blob([data as any], { type: "image/gif" }),
        width: evenW,
        height: evenH,
      };
    } finally {
      for (const name of writtenNames) {
        await ffmpegInstance.deleteFile(name).catch(() => {});
      }
      await ffmpegInstance.deleteFile(outputName).catch(() => {});
    }
  } finally {
    for (const item of loadedImages) {
      URL.revokeObjectURL(item.url);
    }
  }
};
