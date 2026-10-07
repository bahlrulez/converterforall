type Worker = any;

let sharedWorker: Worker | null = null;
let currentLanguage = '';

export async function processImageToText(
  file: File | Blob,
  language: string,
  onProgress?: (msg: string, progress: number) => void
): Promise<string> {
  onProgress?.('Reading Image...', 5);
  
  // Downscale image if too large
  let imageUrl = '';
  let processedImageUrl: string | File | Blob = file;

  if (typeof file !== 'string') {
    imageUrl = URL.createObjectURL(file);
    processedImageUrl = await processImageSize(imageUrl, 3500); // Max dimension 3500
  }


  onProgress?.('Initializing OCR Engine...', 15);

  try {
    if (!sharedWorker || currentLanguage !== language) {
      if (sharedWorker) {
        await sharedWorker.terminate();
      }
      
      const Tesseract = (window as any).Tesseract;
      if (!Tesseract) {
        throw new Error("Tesseract.js failed to load. Please refresh the page.");
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const langPath = `${origin}/tesseract/lang-data`;

      const options = {
        workerPath: `${origin}/tesseract/worker.min.js`,
        corePath: `${origin}/tesseract`,
        langPath: langPath,
        workerBlobURL: false,
        errorHandler: (e: any) => console.error('Tesseract Error:', e),
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            const pageProgress = m.progress * 80;
            onProgress?.(`Extracting text...`, Math.min(95, 15 + pageProgress));
          } else if (m.status.includes('loading')) {
            onProgress?.(`Loading OCR data...`, 10);
          } else if (m.status.includes('initializing')) {
            onProgress?.(`Initializing OCR...`, 20);
          }
        }
      };
      
      sharedWorker = await Tesseract.createWorker(language, 1, options);
      
      currentLanguage = language;
    }

    onProgress?.('Extracting text...', 15);
    const result = await sharedWorker.recognize(processedImageUrl);
    
    onProgress?.('Complete!', 100);
    return result.data.text;
  } catch (err: any) {
    if (sharedWorker) {
      await sharedWorker.terminate();
      sharedWorker = null;
    }
    throw new Error(err.message || 'Unknown error occurred during OCR processing.');
  } finally {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  }
}

export async function cleanupOcrWorker() {
  if (sharedWorker) {
    await sharedWorker.terminate();
    sharedWorker = null;
    currentLanguage = '';
  }
}

/**
 * Resize image if it exceeds max dimension, maintaining aspect ratio.
 */
async function processImageSize(imageUrl: string, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const { width, height } = img;
      const largest = Math.max(width, height);
      
      if (largest <= maxDim) {
        resolve(imageUrl);
        return;
      }
      
      const scale = maxDim / largest;
      const targetWidth = width * scale;
      const targetHeight = height * scale;
      
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageUrl); // Fallback
        return;
      }
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => reject(new Error('Failed to load image for processing'));
    img.src = imageUrl;
  });
}
