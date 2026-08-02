export const toolsDatabase = {
  "image": {
    "remove-background": {
      title: "Remove Background",
      description: "Instantly remove the background from any image using advanced on-device AI.",
      inputFormat: "image",
      outputFormat: "png",
      actionName: "Remove Background",
      acceptedTypes: { 
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "webp-to-png": {
      title: "Convert WEBP to PNG",
      description: "Fast, secure, and high-quality WEBP to PNG image conversion.",
      inputFormat: "webp",
      outputFormat: "png",
      acceptedTypes: { "image/webp": [".webp"] }
    },
    "jpg-to-png": {
      title: "Convert JPG to PNG",
      description: "Convert your JPG images to PNG format instantly.",
      inputFormat: "jpg",
      outputFormat: "png",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "png-to-jpg": {
      title: "Convert PNG to JPG",
      description: "Convert your PNG images to JPG format instantly.",
      inputFormat: "png",
      outputFormat: "jpg",
      acceptedTypes: { "image/png": [".png"] }
    },
    "avif-to-jpeg": {
      title: "Convert AVIF to JPEG",
      description: "Convert AVIF next-gen images to standard JPEG.",
      inputFormat: "avif",
      outputFormat: "jpeg",
      acceptedTypes: { "image/avif": [".avif"] }
    },
    "avif-to-png": {
      title: "Convert AVIF to PNG",
      description: "Convert AVIF images to transparent PNG.",
      inputFormat: "avif",
      outputFormat: "png",
      acceptedTypes: { "image/avif": [".avif"] }
    },
    "heic-to-jpg": {
      title: "Convert HEIC to JPG",
      description: "Convert Apple HEIC photos to standard JPG.",
      inputFormat: "heic",
      outputFormat: "jpg",
      acceptedTypes: { "image/heic": [".heic"] }
    }
  },
  "document": {
    // ORGANIZE PDF
    "merge-pdf": {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one unified document.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "split-pdf": {
      title: "Split PDF",
      description: "Extract pages from your PDF or save each page as a separate PDF.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "remove-pages": {
      title: "Remove Pages",
      description: "Delete unnecessary pages from your PDF.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "extract-pages": {
      title: "Extract Pages",
      description: "Pull specific pages out of your PDF document.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "organize-pdf": {
      title: "Organize PDF",
      description: "Sort, add and delete PDF pages.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "scan-to-pdf": {
      title: "Scan to PDF",
      description: "Capture document scans and turn them into PDFs.",
      subCategory: "Organize PDF",
      inputFormat: "image",
      outputFormat: "pdf",
      acceptedTypes: { "image/*": [".jpg", ".png", ".jpeg"] }
    },

    // OPTIMIZE PDF
    "compress-pdf": {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal PDF quality.",
      subCategory: "Optimize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Compress PDF",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "repair-pdf": {
      title: "Repair PDF",
      description: "Fix a damaged or corrupted PDF document.",
      subCategory: "Optimize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "ocr-pdf": {
      title: "OCR PDF",
      description: "Make text in scanned PDFs searchable and selectable.",
      subCategory: "Optimize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },

    // CONVERT TO PDF
    "jpg-to-pdf": {
      title: "JPG to PDF",
      description: "Convert JPG images to PDF in seconds.",
      subCategory: "Convert to PDF",
      inputFormat: "jpg",
      outputFormat: "pdf",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "word-to-pdf": {
      title: "WORD to PDF",
      description: "Make DOC and DOCX files easy to read by converting them to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "word",
      outputFormat: "pdf",
      acceptedTypes: { "application/msword": [".doc", ".docx"] }
    },
    "powerpoint-to-pdf": {
      title: "POWERPOINT to PDF",
      description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "ppt",
      outputFormat: "pdf",
      acceptedTypes: { "application/vnd.ms-powerpoint": [".ppt", ".pptx"] }
    },
    "excel-to-pdf": {
      title: "EXCEL to PDF",
      description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "excel",
      outputFormat: "pdf",
      acceptedTypes: { "application/vnd.ms-excel": [".xls", ".xlsx"] }
    },
    "html-to-pdf": {
      title: "HTML to PDF",
      description: "Convert webpages in HTML to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "html",
      outputFormat: "pdf",
      acceptedTypes: { "text/html": [".html"] }
    }
  },
  "audio": {
    "mp4-to-mp3": {
      title: "Convert MP4 to MP3",
      description: "Extract high-quality audio from your MP4 videos.",
      inputFormat: "mp4",
      outputFormat: "mp3",
      actionName: "Extract Audio",
      acceptedTypes: { "video/mp4": [".mp4"] }
    },
    "mp3-to-wav": {
      title: "Convert MP3 to WAV",
      description: "Convert compressed MP3 audio to lossless WAV format.",
      inputFormat: "mp3",
      outputFormat: "wav",
      actionName: "Convert to WAV",
      acceptedTypes: { "audio/mpeg": [".mp3"] }
    },
    "wav-to-mp3": {
      title: "Convert WAV to MP3",
      description: "Compress lossless WAV audio into MP3 format.",
      inputFormat: "wav",
      outputFormat: "mp3",
      actionName: "Convert to MP3",
      acceptedTypes: { "audio/wav": [".wav", ".wave"] }
    },
    "ogg-to-mp3": {
      title: "Convert OGG to MP3",
      description: "Convert OGG Vorbis audio files to standard MP3.",
      inputFormat: "ogg",
      outputFormat: "mp3",
      actionName: "Convert to MP3",
      acceptedTypes: { "audio/ogg": [".ogg"] }
    },
    "mp3-to-ogg": {
      title: "Convert MP3 to OGG",
      description: "Convert standard MP3 audio files to OGG format.",
      inputFormat: "mp3",
      outputFormat: "ogg",
      actionName: "Convert to OGG",
      acceptedTypes: { "audio/mpeg": [".mp3"] }
    }
  },
  "video": {
    "mp4-to-mp3": {
      title: "Convert MP4 to MP3",
      description: "Extract high-quality audio from your MP4 videos.",
      inputFormat: "mp4",
      outputFormat: "mp3",
      actionName: "Extract Audio",
      acceptedTypes: { "video/mp4": [".mp4"] }
    },
    "mov-to-mp4": {
      title: "Convert MOV to MP4",
      description: "Convert Apple MOV videos to standard MP4 format.",
      inputFormat: "mov",
      outputFormat: "mp4",
      actionName: "Convert to MP4",
      acceptedTypes: { "video/quicktime": [".mov"] }
    }
  }
};

export function getToolBySlug(slug: string) {
  for (const [categorySlug, categoryTools] of Object.entries(toolsDatabase)) {
    if (slug in categoryTools) {
      return {
        categorySlug,
        toolSlug: slug,
        tool: (categoryTools as any)[slug]
      };
    }
  }
  return null;
}

export function getAllToolSlugs() {
  const slugs: string[] = [];
  for (const categoryTools of Object.values(toolsDatabase)) {
    slugs.push(...Object.keys(categoryTools));
  }
  return Array.from(new Set(slugs));
}
