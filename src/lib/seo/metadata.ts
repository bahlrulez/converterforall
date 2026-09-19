// Standardized SEO metadata generation for tool pages across ConverterForAll

const CUSTOM_TOOL_TITLES: Record<string, string> = {
  "merge-pdf": "Merge PDF Online - Combine PDF Files Free",
  "split-pdf": "Split PDF - Separate PDF Pages Online Free",
  "compress-pdf": "Compress PDF - Reduce PDF File Size Online",
  "edit-pdf": "Edit PDF Online - Annotate & Fill PDF Documents",
  "organize-pdf": "Organize PDF - Reorder, Rotate & Sort PDF Pages",
  "remove-pages": "Remove PDF Pages - Delete Pages Online Free",
  "extract-pages": "Extract PDF Pages - Save Specific Pages Online",
  "rotate-pdf": "Rotate PDF - Turn & Reorient PDF Pages Free",
  "word-to-pdf": "Word to PDF - Convert DOCX to PDF Online Free",
  "pdf-to-word": "PDF to Word - Convert PDF to Editable DOCX",
  "powerpoint-to-pdf": "PPT to PDF - Convert PowerPoint Presentations",
  "excel-to-pdf": "Excel to PDF - Convert Spreadsheets Online Free",
  "jpg-to-pdf": "JPG to PDF - Convert Images to PDF Online Free",
  "pdf-to-jpg": "PDF to JPG - Convert PDF Pages to JPG Images",
  "pdf-to-png": "PDF to PNG - Convert PDF Pages to PNG Images",
  "remove-background": "Remove Background - Free Image Background Remover",
  "passport-photo-maker": "Passport Photo Maker - Create Passport Size Photos",
  "image-resizer": "Resize Image - Change Photo Dimensions Online",
  "compress-jpg": "Compress JPG - Reduce Image File Size Online",
  "compress-png": "Compress PNG - Optimize PNG Images Online",
  "webp-to-png": "Convert WEBP to PNG - Free High Quality Converter",
  "webp-to-jpg": "Convert WEBP to JPG - Free Online Image Converter",
  "jpg-to-png": "Convert JPG to PNG - High Resolution Image Converter",
  "png-to-jpg": "Convert PNG to JPG - Fast Online Image Converter",
  "heic-to-jpg": "HEIC to JPG - Convert Apple iPhone Photos Online",
  "video-compressor": "Video Compressor - Reduce Video File Size Online",
  "compress-video-for-discord": "Discord Video Compressor - Shrink Under 10MB/25MB",
  "compress-mp4": "Compress MP4 - Reduce MP4 Video Size Online",
  "mp4-to-mp3": "MP4 to MP3 - Extract Audio from Video Online Free",
  "audio-trimmer": "Audio Trimmer - Cut & Edit Audio Files Online",
  "krutidev-to-unicode": "Kruti Dev to Unicode - Hindi Font Converter Online",
  "unicode-to-krutidev": "Unicode to Kruti Dev - Hindi Font Converter Online",
  "mangal-to-kruti": "Mangal to Kruti Dev - Hindi Font Converter Online",
  "chanakya-to-unicode": "Chanakya to Unicode - Hindi Font Converter Online",
  "unicode-to-chanakya": "Unicode to Chanakya - Hindi Font Converter Online",
  "unicode-to-bijoy": "Unicode to Bijoy - Bengali Font Converter Online",
  "bijoy-to-unicode": "Bijoy to Unicode - Bengali Font Converter Online",
  "unicode-to-satluj": "Unicode to Satluj - Punjabi Font Converter Online",
  "asees-to-unicode": "Asees to Unicode - Punjabi Font Converter Online",
  "raavi-to-asees": "Raavi to Asees - Punjabi Font Converter Online",
  "jwt-decoder": "JWT Decoder - Inspect JSON Web Tokens Securely",
  "json-formatter": "JSON Formatter & Validator - Pretty Print JSON Online",
  "json-to-csv": "JSON to CSV - Convert JSON Data to CSV Online",
  "csv-to-json": "CSV to JSON - Convert CSV Spreadsheets to JSON",
  "base64-encoder-decoder": "Base64 Encoder & Decoder - Encode & Decode Online",
  "unix-timestamp-converter": "Unix Timestamp Converter - Epoch to Human Date",
  "uuid-generator": "UUID Generator - Generate Random UUID v4 Online",
  "qr-generator": "QR Code Generator - Create Custom QR Codes Free",
  "gif-maker": "GIF Maker Online - Create Animated GIFs for Free",
  "repair-pdf": "Repair PDF - Fix Corrupted or Damaged PDF Online",
  "ocr-pdf": "OCR PDF - Convert Scanned PDF to Selectable Text",
  "png-to-pdf": "PNG to PDF - Convert PNG Images to PDF Online Free",
  "barcode-generator": "Barcode Generator - Create Custom Barcodes Online Free",
};

export function getOptimizedToolTitle(tool: any, toolSlug: string): string {
  if (tool.seoTitle) {
    return tool.seoTitle.replace(/\s*\|\s*ConverterForAll$/i, "").trim();
  }

  if (CUSTOM_TOOL_TITLES[toolSlug]) {
    return CUSTOM_TOOL_TITLES[toolSlug];
  }

  const rawTitle = tool.title || toolSlug;
  // If the title already has a hyphen/dash separator or is already long, preserve it without double-appending
  if (rawTitle.includes("–") || rawTitle.includes(" - ")) {
    return rawTitle.replace(/\s*\|\s*ConverterForAll$/i, "").trim();
  }

  const clean = rawTitle
    .replace(/Online\s+Free/gi, "")
    .replace(/,\s*Word.*$/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.toLowerCase().includes("converter") || clean.toLowerCase().includes("generator") || clean.toLowerCase().includes("maker")) {
    if (clean.length < 30) {
      return `${clean} Online - Free & Private Tool`;
    }
    return `${clean} Online Free`;
  }
  return `${clean} - Free Online Tool`;
}

export function getOptimizedToolDescription(tool: any, toolSlug: string, categorySlug: string): string {
  if (tool.seoDescription) return tool.seoDescription;

  const desc = (tool.description || "")
    .replace(/\s*100%\s*private[.,]?/gi, "")
    .replace(/\s*zero\s*uploads[.,]?/gi, "")
    .trim();
  const base = desc.endsWith(".") ? desc : `${desc}.`;

  let suffix = "Free, private, and runs directly in your browser with no registration or file size queues.";
  if (categorySlug === "fonts") {
    suffix = "Convert text accurately with no font distortion. Free and runs in your browser.";
  } else if (categorySlug === "document") {
    if (toolSlug === "word-to-pdf" || toolSlug === "powerpoint-to-pdf" || toolSlug === "excel-to-pdf") {
      suffix = "Fast conversion with original formatting preserved. Files are handled in memory.";
    } else {
      suffix = "Process documents securely in your browser with no watermarks or accounts.";
    }
  } else if (categorySlug === "image") {
    suffix = "High-resolution image processing on your device. Fast, free, and private.";
  } else if (categorySlug === "video" || categorySlug === "audio") {
    suffix = "Process media smoothly in your browser with zero compression queues or quality loss.";
  } else if (categorySlug === "developer") {
    suffix = "Runs locally in your browser. Confidential tokens are never sent across the network.";
  }

  let fullDesc = `${base} ${suffix}`;
  if (fullDesc.length > 165) {
    if (base.length >= 95 && base.length <= 165) {
      const shortNote = "Free and runs in your browser.";
      if (`${base} ${shortNote}`.length <= 165) {
        fullDesc = `${base} ${shortNote}`;
      } else {
        fullDesc = base;
      }
    } else if (fullDesc.length > 165) {
      const conciseNote = "Free, secure, and runs directly in your browser.";
      if (`${base} ${conciseNote}`.length <= 165) {
        fullDesc = `${base} ${conciseNote}`;
      } else {
        fullDesc = fullDesc.slice(0, 162).trim() + "...";
      }
    }
  }
  return fullDesc;
}
