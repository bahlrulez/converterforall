export interface ConversionOption {
  slug: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
  outputFormat?: string;
  isPopular?: boolean;
}

export interface DetectedFileInfo {
  file: File;
  name: string;
  sizeFormatted: string;
  rawSize: number;
  extension: string;
  mimeType: string;
  category: "image" | "document" | "video" | "audio" | "other";
  previewUrl: string | null;
  tools: ConversionOption[];
  defaultTool: ConversionOption;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function detectFileTools(file: File): DetectedFileInfo {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type.toLowerCase();
  const rawSize = file.size;
  const sizeFormatted = formatFileSize(rawSize);
  
  let previewUrl: string | null = null;
  let category: DetectedFileInfo["category"] = "other";
  const tools: ConversionOption[] = [];

  // 1. IMAGE FILES
  if (
    mime.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp", "avif", "heic", "gif", "bmp", "svg", "tiff"].includes(extension)
  ) {
    category = "image";
    if (typeof window !== "undefined") {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch {
        previewUrl = null;
      }
    }

    if (extension === "jpg" || extension === "jpeg") {
      tools.push(
        { slug: "jpg-to-png", title: "Convert to PNG", category: "image", badge: "Popular", description: "Convert JPG to transparent/lossless PNG", isPopular: true },
        { slug: "jpg-to-pdf", title: "Convert to PDF", category: "document", badge: "Document", description: "Convert JPG image to PDF document" },
        { slug: "compress-jpg", title: "Compress JPG Size", category: "image", badge: "Optimize", description: "Reduce JPG file size while preserving quality" },
        { slug: "remove-background", title: "Remove Background (AI)", category: "image", badge: "AI Magic", description: "Isolate subject and make background transparent" },
        { slug: "merge-pdf", title: "Merge into PDF", category: "document", badge: "Combine", description: "Combine this image with other PDFs/JPGs into one PDF" },
        { slug: "passport-photo-maker", title: "Passport Photo Maker", category: "image", description: "Crop & format for official passport/visa requirements" }
      );
    } else if (extension === "png") {
      tools.push(
        { slug: "png-to-jpg", title: "Convert to JPG", category: "image", badge: "Popular", description: "Convert PNG to compressed JPG image", isPopular: true },
        { slug: "png-to-pdf", title: "Convert to PDF", category: "document", badge: "Document", description: "Convert PNG image to standard PDF" },
        { slug: "compress-png", title: "Compress PNG Size", category: "image", badge: "Optimize", description: "Compress PNG image size in browser" },
        { slug: "remove-background", title: "Remove Background (AI)", category: "image", badge: "AI Magic", description: "Detect subject and cleanly remove background" },
        { slug: "merge-pdf", title: "Merge into PDF", category: "document", badge: "Combine", description: "Combine this image with other files into a PDF" },
        { slug: "passport-photo-maker", title: "Passport Photo Maker", category: "image", description: "Crop & format for official passport/visa standards" }
      );
    } else if (extension === "webp") {
      tools.push(
        { slug: "webp-to-png", title: "Convert WEBP to PNG", category: "image", badge: "Popular", description: "Convert next-gen WEBP to standard PNG", isPopular: true },
        { slug: "remove-background", title: "Remove Background (AI)", category: "image", badge: "AI Magic", description: "Isolate subject from background" },
        { slug: "jpg-to-pdf", title: "Convert to PDF", category: "document", description: "Convert WEBP image into PDF document" }
      );
    } else if (extension === "heic" || extension === "heif") {
      tools.push(
        { slug: "heic-to-jpg", title: "Convert to JPG", category: "image", badge: "Universal JPG", description: "Convert iPhone HEIC photo to universal JPG", isPopular: true },
        { slug: "heic-to-png", title: "Convert to PNG", category: "image", badge: "Lossless PNG", description: "Convert Apple HEIC photo to high-quality PNG" },
        { slug: "jpg-to-pdf", title: "Convert to PDF", category: "document", description: "Convert HEIC photo into PDF document" },
        { slug: "remove-background", title: "Remove Background", category: "image", badge: "AI Magic", description: "Isolate subject and remove background" }
      );
    } else if (extension === "avif") {
      tools.push(
        { slug: "avif-to-png", title: "Convert AVIF to PNG", category: "image", badge: "Popular", description: "Convert AVIF to standard PNG", isPopular: true },
        { slug: "avif-to-jpeg", title: "Convert AVIF to JPEG", category: "image", description: "Convert AVIF to standard JPEG" }
      );
    } else {
      // Generic image
      tools.push(
        { slug: "remove-background", title: "Remove Background (AI)", category: "image", badge: "AI Magic", description: "Remove image background automatically", isPopular: true },
        { slug: "jpg-to-pdf", title: "Convert to PDF", category: "document", description: "Convert image to PDF document" }
      );
    }
  }
  
  // 2. PDF FILES
  else if (mime === "application/pdf" || extension === "pdf") {
    category = "document";
    tools.push(
      { slug: "merge-pdf", title: "Merge PDF (with Images/PDFs)", category: "document", badge: "Popular", description: "Combine multiple PDFs, JPGs, and PNGs together for free", isPopular: true },
      { slug: "compress-pdf", title: "Compress PDF Size", category: "document", badge: "Optimize", description: "Reduce PDF file size while maintaining clarity" },
      { slug: "pdf-to-word", title: "Convert PDF to Word (DOCX)", category: "document", badge: "Editable", description: "Extract text and convert PDF to editable DOCX" },
      { slug: "ocr-pdf", title: "OCR PDF (Searchable Text)", category: "document", badge: "AI OCR", description: "Recognize text from scanned PDFs in browser" },
      { slug: "split-pdf", title: "Split PDF Pages", category: "document", description: "Extract each page into separate PDFs inside a ZIP" },
      { slug: "organize-pdf", title: "Organize & Reorder Pages", category: "document", description: "Rearrange or duplicate PDF page order" },
      { slug: "repair-pdf", title: "Repair Damaged PDF", category: "document", description: "Fix corrupted or unreadable PDF structures" },
      { slug: "extract-pages", title: "Extract Specific Pages", category: "document", description: "Pull only desired page numbers from PDF" },
      { slug: "remove-pages", title: "Remove Pages from PDF", category: "document", description: "Delete unwanted pages from PDF" }
    );
  }

  // 3. WORD / OFFICE DOCUMENTS
  else if (
    extension === "doc" ||
    extension === "docx" ||
    mime.includes("wordprocessingml") ||
    mime.includes("msword")
  ) {
    category = "document";
    tools.push(
      { slug: "word-to-pdf", title: "Convert Word to PDF", category: "document", badge: "Instant", description: "Convert DOC and DOCX files into universal PDF format", isPopular: true }
    );
  }

  // 4. POWERPOINT & EXCEL
  else if (extension === "ppt" || extension === "pptx") {
    category = "document";
    tools.push(
      { slug: "powerpoint-to-pdf", title: "Convert PowerPoint to PDF", category: "document", badge: "Slides", description: "Convert PPT/PPTX slideshows to PDF", isPopular: true }
    );
  } else if (extension === "xls" || extension === "xlsx") {
    category = "document";
    tools.push(
      { slug: "excel-to-pdf", title: "Convert Excel to PDF", category: "document", badge: "Sheets", description: "Convert XLS/XLSX spreadsheets to PDF", isPopular: true }
    );
  } else if (extension === "html" || extension === "htm") {
    category = "document";
    tools.push(
      { slug: "html-to-pdf", title: "Convert HTML to PDF", category: "document", badge: "Webpage", description: "Render HTML document to PDF", isPopular: true }
    );
  }

  // 5. VIDEO FILES
  else if (
    mime.startsWith("video/") ||
    ["mp4", "mov", "mkv", "webm", "avi", "wmv", "flv", "m4v", "mpeg"].includes(extension)
  ) {
    category = "video";
    tools.push(
      { slug: "mp4-to-mp3", title: "Extract Audio to MP3", category: "audio", badge: "Popular", description: "Extract high-quality MP3 audio from video", isPopular: true },
      { slug: "compress-video", title: "Compress Video Size", category: "video", badge: "Optimize", description: "Reduce video file size without server uploads" },
      { slug: "video-to-mp4", title: "Convert to MP4", category: "video", description: "Convert any video format to universal MP4" },
      { slug: "video-to-jpg", title: "Extract Frames to JPG Sequence", category: "video", description: "Extract frames into a sequence of JPG images" },
      { slug: "video-to-mkv", title: "Convert to MKV", category: "video", description: "Convert video to Matroska MKV container" },
      { slug: "video-to-mov", title: "Convert to MOV", category: "video", description: "Convert video to Apple QuickTime MOV" },
      { slug: "video-to-avi", title: "Convert to AVI", category: "video", description: "Convert video to standard AVI format" }
    );
  }

  // 6. AUDIO FILES
  else if (
    mime.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"].includes(extension)
  ) {
    category = "audio";
    if (extension === "mp3") {
      tools.push(
        { slug: "mp3-to-wav", title: "Convert MP3 to WAV", category: "audio", badge: "Lossless", description: "Convert MP3 to lossless WAV audio", isPopular: true },
        { slug: "mp3-to-ogg", title: "Convert MP3 to OGG", category: "audio", description: "Convert MP3 to open OGG Vorbis format" }
      );
    } else if (extension === "wav") {
      tools.push(
        { slug: "wav-to-mp3", title: "Convert WAV to MP3", category: "audio", badge: "Compressed", description: "Compress WAV into standard MP3", isPopular: true }
      );
    } else if (extension === "ogg") {
      tools.push(
        { slug: "ogg-to-mp3", title: "Convert OGG to MP3", category: "audio", badge: "Popular", description: "Convert OGG Vorbis audio to MP3", isPopular: true }
      );
    } else {
      tools.push(
        { slug: "wav-to-mp3", title: "Convert to MP3", category: "audio", badge: "Popular", description: "Convert audio file to standard MP3", isPopular: true },
        { slug: "mp3-to-wav", title: "Convert to WAV", category: "audio", description: "Convert audio to lossless WAV" }
      );
    }
  }

  // Fallback if no matching tools
  if (tools.length === 0) {
    tools.push(
      { slug: "merge-pdf", title: "Combine into PDF", category: "document", badge: "Document", description: "Convert or combine into a PDF document", isPopular: true },
      { slug: "compress-pdf", title: "Compress PDF", category: "document", description: "Compress PDF files" },
      { slug: "jpg-to-png", title: "Convert to PNG", category: "image", description: "Convert images to PNG" }
    );
  }

  const defaultTool = tools.find((t) => t.isPopular) || tools[0];

  return {
    file,
    name: file.name,
    sizeFormatted,
    rawSize,
    extension,
    mimeType: mime,
    category,
    previewUrl,
    tools,
    defaultTool,
  };
}
