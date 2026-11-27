export interface Tool {
  name?: string;
  theme?: string;
  iconName?: string;
  badge?: string;
  isPopular?: boolean;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  inputFormat?: string;
  outputFormat?: string;
  actionName?: string;
  acceptedTypes?: Record<string, string[]>;
  subCategory?: string;
  isInteractive?: boolean;
  converterType?: string;
  fontCategory?: string;
  relatedTools?: string[];
  toolType?: string;
}

export const toolsDatabase: Record<string, Record<string, Tool>> = {
  "image": {
    "remove-background": {
      theme: "purple", iconName: "Eraser", badge: "AI Magic", isPopular: true,
      title: "Remove Background",
      description: "Remove the background from any image directly inside your browser using on-device AI.",
      seoTitle: "Free AI Background Remover - Remove Backgrounds Online",
      seoDescription: "Remove image backgrounds directly in your browser using on-device AI. Extract subjects from photos to create transparent cutouts locally.",
      inputFormat: "image",
      outputFormat: "png",
      actionName: "Remove Background",
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "image-to-text": {
      theme: "emerald", iconName: "FileText", badge: "AI Magic", isPopular: true,
      title: "Image to Text (OCR)",
      description: "Extract text from images (JPG, PNG, WebP) directly inside your browser using client-side OCR.",
      seoTitle: "Image to Text Converter - Free Online OCR & Text Extractor",
      seoDescription: "Extract readable text from pictures and scanned images using in-browser OCR. Copy or download extracted text directly in your browser.",
      inputFormat: "image",
      outputFormat: "text",
      actionName: "Extract Text",
      isInteractive: true,
      relatedTools: ["ocr-pdf", "jpg-to-pdf", "image-resizer"],
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "webp-to-png": {
      theme: "emerald", iconName: "Image", badge: "Image", isPopular: true,
      title: "Convert WEBP to PNG",
      seoTitle: "WEBP to PNG Converter - Convert Web Images to PNG Free",
      description: "Fast, secure, and high-quality WEBP to PNG image conversion.",
      seoDescription: "Convert WEBP images to standard PNG format online. Keep transparency intact with fast, secure, and free client-side image conversion.",
      relatedTools: ["webp-to-jpg", "compress-png", "image-resizer", "png-to-jpg"],
      inputFormat: "webp",
      outputFormat: "png",
      isInteractive: true,
      actionName: "Convert to PNG",
      acceptedTypes: { "image/webp": [".webp"] }
    },
    "webp-to-jpg": {
      theme: "emerald", iconName: "Image", badge: "Image", isPopular: true,
      title: "Convert WEBP to JPG",
      seoTitle: "WEBP to JPG Converter - Convert Web Images to JPG Free",
      description: "Fast, secure, and high-quality WEBP to JPG image conversion.",
      seoDescription: "Convert WEBP images to standard JPG format online. Fast, secure, and free client-side image conversion.",
      inputFormat: "webp",
      outputFormat: "jpg",
      isInteractive: true,
      actionName: "Convert to JPG",
      acceptedTypes: { "image/webp": [".webp"] }
    },

    "jpg-to-png": {
      theme: "emerald", iconName: "Image", badge: "Image", isPopular: true,
      title: "Convert JPG to PNG",
      description: "Convert your JPG images to lossless PNG format directly in your browser.",
      inputFormat: "jpg",
      outputFormat: "png",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "png-to-jpg": {
      theme: "emerald", iconName: "Image", badge: "Image", isPopular: true,
      title: "Convert PNG to JPG",
      description: "Convert your PNG images to compact JPG format directly in your browser.",
      inputFormat: "png",
      outputFormat: "jpg",
      acceptedTypes: { "image/png": [".png"] }
    },
    "avif-to-jpeg": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "Convert AVIF to JPEG",
      seoTitle: "AVIF to JPEG Converter | Convert AVIF Images to JPG Online",
      description: "Convert AVIF next-gen images to standard JPEG.",
      seoDescription: "Convert next-gen AVIF images to standard JPEG format. Free, private, browser-based converter for fast AVIF to JPG conversion without uploading files.",
      inputFormat: "avif",
      outputFormat: "jpeg",
      acceptedTypes: { "image/avif": [".avif"] }
    },
    "avif-to-png": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "Convert AVIF to PNG",
      seoTitle: "AVIF to PNG Converter | Convert AVIF with Transparency",
      description: "Convert AVIF images to transparent PNG.",
      seoDescription: "Convert AVIF images to PNG format while preserving background transparency. Free, private online tool that runs entirely in your browser.",
      inputFormat: "avif",
      outputFormat: "png",
      acceptedTypes: { "image/avif": [".avif"] }
    },
    "heic-to-jpg": {
      theme: "amber", iconName: "Image", badge: "Apple Photo", isPopular: true,
      title: "Convert HEIC to JPG",
      description: "Convert Apple iPhone HEIC and HEIF photos to universal JPG online for free.",
      inputFormat: "heic",
      outputFormat: "jpg",
      actionName: "Convert to JPG",
      acceptedTypes: { "image/heic": [".heic"], "image/heif": [".heif"] }
    },
    "heic-to-png": {
      theme: "amber", iconName: "Image", badge: "Apple Photo", isPopular: true,
      title: "Convert HEIC to PNG",
      seoTitle: "HEIC to PNG Converter - Convert Apple Photos Online",
      description: "Convert Apple HEIC photos to high-quality transparent PNG format for free.",
      seoDescription: "Convert iPhone HEIC images to standard transparent PNG format. Fast, free, and secure online image conversion without uploading.",
      relatedTools: ["heic-to-jpg", "png-to-jpg", "compress-png", "image-resizer"],
      inputFormat: "heic",
      outputFormat: "png",
      actionName: "Convert to PNG",
      acceptedTypes: { "image/heic": [".heic"], "image/heif": [".heif"] }
    },
    "compress-jpg": {
      theme: "amber", iconName: "Zap", badge: "Optimize", isPopular: true,
      title: "Compress JPG",
      description: "Reduce JPG file size while preserving maximum visual quality using our in-browser compressor.",
      seoTitle: "Compress JPG - Reduce Image File Size Online",
      seoDescription: "Compress JPG and JPEG images online. Reduce file size for faster loading while maintaining visual quality securely in your browser.",
      inputFormat: "jpg",
      outputFormat: "jpg",
      actionName: "Compress JPG",
      isInteractive: true,
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "compress-png": {
      theme: "amber", iconName: "Zap", badge: "Optimize", isPopular: true,
      title: "Compress PNG",
      description: "Reduce PNG file size directly inside your browser using our client-side compression engine.",
      seoTitle: "Compress PNG - Reduce PNG File Size Online",
      seoDescription: "Compress your PNG images online. Reduce PNG file size while maintaining image quality with our free browser-based compression tool.",
      inputFormat: "png",
      outputFormat: "png",
      actionName: "Compress PNG",
      isInteractive: true,
      acceptedTypes: { "image/png": [".png"] }
    },
    "passport-photo-maker": {
      theme: "amber", iconName: "Camera", badge: "Popular", isPopular: true,
      title: "Passport Photo Maker",
      description: "Create and crop properly framed passport photos online. Supports standard US and International sizes.",
      seoTitle: "Passport Photo Converter - Convert Photo to Passport Size",
      seoDescription: "Convert a photo to passport-size photos online. Crop and resize portraits for supported US and international passport and visa photo sizes. Free AI background removal.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Make Passport Photo",
      isInteractive: true,
      relatedTools: ["exam-photo-resizer", "photo-name-date-stamper", "exam-signature-resizer", "image-dpi-converter"],
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
    },
    "gif-maker": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "GIF Maker",
      description: "Convert and create animated GIFs from images and photos online for free.",
      inputFormat: "image",
      outputFormat: "gif",
      actionName: "Make GIF",
      acceptedTypes: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".avif"] }
    },
    "image-cropper": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "Image Cropper",
      description: "Crop photos and images to exact dimensions and custom aspect ratios.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Crop Image",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
    },
    "image-resizer": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "Image Resizer",
      seoTitle: "Image Resizer - Resize Photos & Pictures Online Free",
      description: "Resize photos and graphics to custom pixel dimensions with high quality.",
      seoDescription: "Resize JPG, PNG, and WebP images to exact pixel dimensions. Fast, free, and private client-side image resizing without quality loss.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Resize Image",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
    },
    "svg-to-png": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "Convert SVG to PNG",
      seoTitle: "SVG to PNG Converter - Rasterize Vectors Online Free",
      description: "Convert SVG vector graphics to crisp, transparent PNG images directly inside your browser.",
      seoDescription: "Convert SVG vector graphics to high-resolution transparent PNG images online using client-side rasterization in your browser.",
      relatedTools: ["image-to-svg", "image-resizer", "compress-png", "webp-to-png"],
      inputFormat: "svg",
      outputFormat: "png",
      actionName: "Convert to PNG",
      acceptedTypes: { "image/svg+xml": [".svg"] }
    },
    "svg-to-jpg": {
      theme: "emerald", iconName: "Image", badge: "Image", isPopular: true,
      title: "Convert SVG to JPG",
      description: "Convert SVG vector files to standard JPG photos online for free.",
      inputFormat: "svg",
      outputFormat: "jpg",
      actionName: "Convert to JPG",
      acceptedTypes: { "image/svg+xml": [".svg"] }
    },
    "image-to-svg": {
      theme: "emerald", iconName: "Image", badge: "Image",
      title: "Image to SVG Vector Converter",
      description: "Convert pixel images (PNG, JPG, WEBP) to scalable vector graphics (SVG) directly inside your browser.",
      inputFormat: "image",
      outputFormat: "svg",
      actionName: "Convert to Vector",
      isInteractive: true,
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "merge-images-to-jpg": {
      theme: "blue", iconName: "Layers", badge: "New", isPopular: true,
      title: "Merge Two Images into One JPG",
      description: "Combine two JPEG or PNG images into a single high-quality JPG online. Place photos side by side or top and bottom with custom spacing, background, and no distortion.",
      seoTitle: "Merge Two Images into One JPG - Free Online Tool",
      seoDescription: "Combine two JPEG or PNG images into a single high-quality JPG online. Place photos side by side or top and bottom with custom spacing, background, and no distortion.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Merge Images",
      isInteractive: true,
      relatedTools: ["compress-jpg", "image-resizer", "jpg-to-png", "png-to-jpg", "exam-photo-resizer", "passport-photo-maker"],
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"]
      }
    }
  },
  "document": {
    // ORGANIZE PDF
    "merge-pdf": {
      theme: "orange", iconName: "FileStack", badge: "Popular", isPopular: true,
      title: "Merge PDF, Word (DOCX), JPG & PNG Online Free",
      description: "Combine multiple PDF documents, Microsoft Word files (DOCX/DOC), and images (JPG, PNG, WebP) into one unified PDF for free with in-browser merging.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Merge Files",
      isInteractive: true,
      acceptedTypes: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/msword": [".doc"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "presentation-maker": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Presentation Maker (PPTX)",
      seoTitle: "Online PowerPoint Presentation Maker - Free & No Signup",
      seoDescription: "Build and download editable .pptx presentations in your browser. Optional AI outline generation uses Google Gemini; PPTX export runs locally.",
      description: "Draft structured PowerPoint (.pptx) slide decks in your browser with optional Gemini AI outline assistance.",
      relatedTools: ["powerpoint-to-pdf", "word-to-pdf"],
      subCategory: "Create Document",
      inputFormat: "text",
      outputFormat: "pptx",
      actionName: "Make Presentation",
      isInteractive: true,
      acceptedTypes: {}
    },
    "split-pdf": {
      theme: "pink", iconName: "Scissors", badge: "Popular", isPopular: true,
      title: "Split PDF",
      description: "Extract pages from your PDF or save each page as a separate PDF.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Split PDF",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "remove-pages": {
      theme: "pink", iconName: "Scissors", badge: "Popular", isPopular: true,
      title: "Remove Pages",
      description: "Delete unnecessary pages from your PDF.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Remove Pages",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "extract-pages": {
      theme: "pink", iconName: "Scissors", badge: "Popular", isPopular: true,
      title: "Extract Pages",
      description: "Pull specific pages out of your PDF document.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Extract Pages",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "organize-pdf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Organize PDF",
      description: "Sort, rotate, duplicate, and delete PDF pages with visual drag-and-drop previews.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Organize PDF",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"], "image/*": [".jpg", ".jpeg", ".png", ".webp"] }
    },
    "rotate-pdf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Rotate PDF Pages",
      description: "Rotate specific pages or entire PDF documents 90, 180, or 270 degrees.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Rotate PDF",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "scan-to-pdf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Scan to PDF",
      seoTitle: "Scan to PDF - Free Mobile PDF Scanner Online",
      description: "Capture document scans and turn them into PDFs.",
      seoDescription: "Use your device camera or uploaded document photos to assemble printable PDF files directly inside your browser without installing extra apps.",
      relatedTools: ["merge-pdf", "compress-pdf", "jpg-to-pdf", "ocr-pdf"],
      subCategory: "Organize PDF",
      inputFormat: "image",
      outputFormat: "pdf",
      actionName: "Create PDF",
      acceptedTypes: { "image/*": [".jpg", ".png", ".jpeg"] }
    },
    "clean-pdf-metadata": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "PDF Metadata Cleaner (Private & In-Browser)",
      description: "Scrub hidden author names, creation dates, and software tracks from your PDF files directly in your browser.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Scrub Metadata",
      relatedTools: ["compress-pdf", "edit-pdf", "merge-pdf", "organize-pdf"],
      acceptedTypes: { "application/pdf": [".pdf"] }
    },

    // EDIT & ANNOTATE PDF
    "edit-pdf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Edit PDF Online",
      description: "Add text, shapes, freehand drawings, highlights, redactions, and digital signatures to your PDF for free in your browser.",
      subCategory: "Edit PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Edit PDF",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    },

    // OPTIMIZE PDF
    "compress-pdf": {
      theme: "amber", iconName: "Zap", badge: "Optimize", isPopular: true,
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal PDF quality.",
      seoTitle: "Compress PDF - Reduce PDF File Size Online",
      seoDescription: "Compress PDF documents online. Reduce PDF file size for easier sharing and uploading without losing readability.",
      subCategory: "Optimize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Compress PDF",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "repair-pdf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Repair PDF",
      description: "Fix a damaged or corrupted PDF document.",
      subCategory: "Optimize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Repair PDF",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "ocr-pdf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "OCR PDF",
      description: "Make text in scanned PDFs searchable and selectable.",
      subCategory: "Optimize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Run OCR",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    },

    // CONVERT TO PDF
    "jpg-to-pdf": {
      theme: "red", iconName: "FileText", badge: "Document", isPopular: true,
      title: "JPG to PDF",
      description: "Convert JPG images to high-quality PDF documents online for free.",
      subCategory: "Convert to PDF",
      inputFormat: "jpg",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "png-to-pdf": {
      theme: "red", iconName: "FileText", badge: "Document", isPopular: true,
      title: "PNG to PDF",
      description: "Convert PNG images with transparent backgrounds to PDF documents for free.",
      subCategory: "Convert to PDF",
      inputFormat: "png",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: { "image/png": [".png"] }
    },
    "word-to-pdf": {
      theme: "blue", iconName: "FileText", badge: "Popular", isPopular: true,
      title: "WORD to PDF",
      description: "Make DOC and DOCX files easy to read by converting them to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "word",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      isInteractive: true,
      acceptedTypes: { "application/msword": [".doc", ".docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }
    },
    "powerpoint-to-pdf": {
      theme: "red", iconName: "Presentation", badge: "Office",
      title: "POWERPOINT to PDF",
      description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "ppt",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: {
        "application/vnd.ms-powerpoint": [".ppt"],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"]
      }
    },
    "excel-to-pdf": {
      theme: "emerald", iconName: "FileSpreadsheet", badge: "Office",
      title: "EXCEL to PDF",
      seoTitle: "Excel to PDF Converter - Convert XLS/XLSX to PDF Free",
      description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
      seoDescription: "Convert Microsoft Excel spreadsheets (XLS, XLSX) to PDF documents online for free. Preserve table formatting and layout securely.",
      relatedTools: ["word-to-pdf", "powerpoint-to-pdf", "merge-pdf", "compress-pdf"],
      subCategory: "Convert to PDF",
      inputFormat: "excel",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: {
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
      }
    },
    "html-to-pdf": {
      theme: "orange", iconName: "FileCode", badge: "Web",
      title: "HTML to PDF",
      description: "Convert HTML files and web pages to high-quality PDF documents online for free.",
      subCategory: "Convert to PDF",
      inputFormat: "html",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: { "text/html": [".html", ".htm"] }
    },
    "web-font-converter": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Web Font Converter",
      description: "Convert TTF, OTF, WOFF, and WOFF2 fonts directly in your browser without server uploads.",
      subCategory: "Convert Fonts",
      inputFormat: "font",
      outputFormat: "font",
      actionName: "Convert Font",
      acceptedTypes: { "font/*": [".ttf", ".otf", ".woff", ".woff2"] }
    },
    "ttf-to-woff2": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Convert TTF to WOFF2",
      description: "Compress your desktop TTF fonts into web-optimized WOFF2 format without losing quality.",
      subCategory: "Convert Fonts",
      inputFormat: "ttf",
      outputFormat: "woff2",
      actionName: "Convert to WOFF2",
      acceptedTypes: { "font/ttf": [".ttf"] }
    },
    "otf-to-woff2": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Convert OTF to WOFF2",
      description: "Compress your OTF fonts into web-optimized WOFF2 format completely client-side.",
      subCategory: "Convert Fonts",
      inputFormat: "otf",
      outputFormat: "woff2",
      actionName: "Convert to WOFF2",
      acceptedTypes: { "font/otf": [".otf"] }
    },
    "woff2-to-ttf": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Convert WOFF2 to TTF",
      description: "Extract desktop-compatible TTF fonts from web WOFF2 files safely in your browser.",
      subCategory: "Convert Fonts",
      inputFormat: "woff2",
      outputFormat: "ttf",
      actionName: "Convert to TTF",
      acceptedTypes: { "font/woff2": [".woff2"] }
    },

    // CONVERT FROM PDF
    "pdf-to-jpg": {
      theme: "red", iconName: "FileText", badge: "Document", isPopular: true,
      title: "Convert PDF to JPG",
      description: "Convert PDF document pages to high-quality JPG images.",
      seoTitle: "PDF to JPG Converter - Convert PDF Pages to JPG Images Online",
      seoDescription: "Convert PDF document pages to high-quality JPG images directly inside your browser without uploading files to a conversion server.",
      subCategory: "Convert from PDF",
      relatedTools: ["pdf-to-png", "pdf-to-word", "split-pdf", "compress-pdf"],
      inputFormat: "pdf",
      outputFormat: "jpg",
      actionName: "Convert to JPG",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "pdf-to-png": {
      theme: "red", iconName: "FileText", badge: "Document",
      title: "Convert PDF to PNG",
      seoTitle: "PDF to PNG Converter - Extract PDF Pages as Images",
      description: "Convert PDF document pages to clear PNG images.",
      seoDescription: "Convert PDF documents into high-quality transparent PNG images online. Extract every page of your PDF as a separate picture securely.",
      subCategory: "Convert from PDF",
      relatedTools: ["png-to-pdf", "pdf-to-jpg", "split-pdf", "merge-pdf"],
      inputFormat: "pdf",
      outputFormat: "png",
      actionName: "Convert to PNG",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "pdf-to-word": {
      theme: "blue", iconName: "FileText", badge: "Popular", isPopular: true,
      title: "PDF to WORD",
      description: "Easily convert your PDF files into editable DOCX Word documents.",
      subCategory: "Convert from PDF",
      inputFormat: "pdf",
      outputFormat: "word",
      actionName: "Convert to Word",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    }
  },
  "audio": {
    "mp4-to-mp3": {
      theme: "sky", iconName: "Music", badge: "Audio", isPopular: true,
      title: "Convert MP4 to MP3",
      description: "Extract high-quality audio from your MP4 videos.",
      inputFormat: "mp4",
      outputFormat: "mp3",
      actionName: "Extract Audio",
      relatedTools: ["trim-audio", "video-to-mp4", "video-compressor", "mp3-to-wav"],
      acceptedTypes: { "video/mp4": [".mp4"] }
    },
    "mp3-to-wav": {
      theme: "sky", iconName: "Music", badge: "Audio", isPopular: true,
      title: "Convert MP3 to WAV",
      description: "Convert compressed MP3 audio to lossless WAV format.",
      inputFormat: "mp3",
      outputFormat: "wav",
      actionName: "Convert to WAV",
      relatedTools: ["wav-to-mp3", "mp3-to-ogg", "trim-audio", "mp4-to-mp3"],
      acceptedTypes: { "audio/mpeg": [".mp3"] }
    },
    "wav-to-mp3": {
      theme: "sky", iconName: "Music", badge: "Audio", isPopular: true,
      title: "Convert WAV to MP3",
      description: "Compress lossless WAV audio into MP3 format.",
      inputFormat: "wav",
      outputFormat: "mp3",
      actionName: "Convert to MP3",
      relatedTools: ["mp3-to-wav", "ogg-to-mp3", "trim-audio", "mp4-to-mp3"],
      acceptedTypes: { "audio/wav": [".wav", ".wave"] }
    },
    "ogg-to-mp3": {
      theme: "sky", iconName: "Music", badge: "Audio", isPopular: true,
      title: "Convert OGG to MP3",
      description: "Convert OGG Vorbis audio files to standard MP3.",
      inputFormat: "ogg",
      outputFormat: "mp3",
      actionName: "Convert to MP3",
      relatedTools: ["mp3-to-ogg", "wav-to-mp3", "trim-audio"],
      acceptedTypes: { "audio/ogg": [".ogg"] }
    },
    "mp3-to-ogg": {
      theme: "sky", iconName: "Music", badge: "Audio", isPopular: true,
      title: "Convert MP3 to OGG",
      description: "Convert standard MP3 audio files to OGG format.",
      inputFormat: "mp3",
      outputFormat: "ogg",
      actionName: "Convert to OGG",
      relatedTools: ["ogg-to-mp3", "mp3-to-wav", "trim-audio"],
      acceptedTypes: { "audio/mpeg": [".mp3"] }
    },
    "trim-audio": {
      theme: "sky", iconName: "Music", badge: "Audio", isPopular: true,
      title: "Audio Trimmer & Cutter (MP3, WAV, OGG)",
      description: "Trim, cut, and split audio files directly in your browser. Most formats run locally without uploads.",
      inputFormat: "audio",
      outputFormat: "mp3",
      actionName: "Trim Audio",
      relatedTools: ["video-caption-generator", "subtitle-converter", "video-compressor"],
      isInteractive: true,
      acceptedTypes: { "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac"] }
    }
  },
  "video": {
    "video-caption-generator": {
      theme: "red", iconName: "Type", badge: "AI Magic", isPopular: true,
      title: "AI Caption Studio - Auto Generate Video Subtitles",
      description: "Automatically transcribe and generate styled video captions right in your browser using local AI.",
      seoTitle: "AI Caption Studio - Auto Generate Subtitles Online for Free",
      seoDescription: "Automatically generate, edit, and burn stylized captions into your video in your browser.",
      relatedTools: ["subtitle-converter", "video-compressor", "trim-audio"],
      inputFormat: "video",
      outputFormat: "mp4",
      actionName: "Generate Captions",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm", ".avi"] }
    },
    "video-compressor": {
      theme: "amber", iconName: "Zap", badge: "Optimize", isPopular: true,
      title: "Free Online Video Compressor - Reduce Video Size",
      description: "Compress MP4, MOV, MKV, WebM, and AVI videos in your browser. Outputs lightweight, universally compatible MP4 files without server uploads.",
      seoTitle: "Free Video Compressor - Reduce Video File Size Online",
      seoDescription: "Compress MP4, MOV, MKV, WebM, and AVI videos online for free. In-browser compression that outputs web-ready MP4 files with no watermark or file upload.",
      relatedTools: [
        "video-caption-generator",
        "subtitle-converter",
        "trim-audio"
      ],
      inputFormat: "video",
      outputFormat: "mp4",
      actionName: "Compress Video",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm", ".avi"] }
    },
    "video-to-gif": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Video to GIF Converter",
      description: "Convert video clips and movies to lightweight animated GIFs.",
      inputFormat: "video",
      outputFormat: "gif",
      actionName: "Convert to GIF",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] }
    },
    "video-to-jpg": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Video to JPG Sequence",
      description: "Extract frames from your video into a sequence of JPG images.",
      inputFormat: "video",
      outputFormat: "zip",
      actionName: "Extract to JPGs",
      isInteractive: true,
      seoTitle: "Video to JPG Converter: Extract Image Frames as ZIP",
      seoDescription: "Extract JPG image frames from video and download them as a ZIP file. Choose frame extraction settings and process your video directly in your browser.",
      relatedTools: ["compress-jpg", "video-to-mp4", "video-compressor", "image-to-svg"],
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] }
    },
    "mp4-to-mp3": {
      theme: "purple", iconName: "Video", badge: "Video", isPopular: true,
      title: "Convert MP4 to MP3",
      description: "Extract high-quality audio from your MP4 videos.",
      inputFormat: "mp4",
      outputFormat: "mp3",
      actionName: "Extract Audio",
      isInteractive: true,
      acceptedTypes: { "video/mp4": [".mp4"] }
    },
    "video-to-mp4": {
      theme: "purple", iconName: "Video", badge: "Video", isPopular: true,
      title: "Convert to MP4",
      description: "Convert any video format to standard MP4 format.",
      inputFormat: "video",
      outputFormat: "mp4",
      actionName: "Convert to MP4",
      isInteractive: true,
      seoTitle: "Convert Video to MP4 Online (Free & Private)",
      seoDescription: "Convert AVI, MKV, MOV, and WebM videos to standard MP4 format in your browser. Free online video conversion with local processing.",
      relatedTools: ["video-to-mov", "video-to-mkv", "video-compressor", "video-to-avi"],
      acceptedTypes: { "video/*": [".avi", ".mkv", ".wmv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-avi": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Convert to AVI",
      description: "Convert any video format to AVI format.",
      inputFormat: "video",
      outputFormat: "avi",
      actionName: "Convert to AVI",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".mkv", ".wmv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-mkv": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Convert to MKV",
      description: "Convert any video format to MKV format.",
      inputFormat: "video",
      outputFormat: "mkv",
      actionName: "Convert to MKV",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".avi", ".wmv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "screen-recorder": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Online Screen Recorder",
      description: "Record your desktop, application window, or browser tab with audio for free inside your browser.",
      inputFormat: "none",
      outputFormat: "mp4",
      actionName: "Start Recording",
      isInteractive: true,
      acceptedTypes: {}
    },
    "video-to-wmv": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Convert to WMV",
      description: "Convert any video format to WMV format.",
      inputFormat: "video",
      outputFormat: "wmv",
      actionName: "Convert to WMV",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".avi", ".mkv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-mov": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Convert to MOV",
      description: "Convert any video format to Apple MOV format.",
      inputFormat: "video",
      outputFormat: "mov",
      actionName: "Convert to MOV",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".avi", ".mkv", ".wmv", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-flv": {
      theme: "purple", iconName: "Video", badge: "Video",
      title: "Convert to FLV",
      description: "Convert any video format to FLV format.",
      inputFormat: "video",
      outputFormat: "flv",
      actionName: "Convert to FLV",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".avi", ".mkv", ".wmv", ".mov", ".webm", ".m4v", ".mpeg"] }
    }
  },
  "utilities": {
    "subtitle-converter": {
      theme: "cyan", iconName: "Type", badge: "Text & Code", isPopular: true,
      title: "Subtitle Converter & Toolkit",
      seoTitle: "Subtitle Converter - Convert, Shift & Cleanup SRT/VTT Files Free",
      description: "Free client-side subtitle toolkit. Convert SRT, VTT, SBV, and ASS formats. Fix subtitle timing, shift sync, renumber cues, and clean tags securely in your browser.",
      relatedTools: ["video-caption-generator", "video-compressor", "trim-audio"],
      inputFormat: "txt",
      outputFormat: "txt",
      isInteractive: true,
      acceptedTypes: { "text/plain": [".srt", ".vtt", ".sbv", ".ass", ".ssa", ".txt"] }
    },
    "qr-scanner": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "QR Code Scanner Online",
      seoTitle: "QR Code Scanner Online - Scan Codes using Camera",
      seoDescription: "Scan QR codes in your browser using your mobile camera, webcam, or by uploading an image. Browser-side decoding without remote server uploads.",
      description: "Scan QR codes using your mobile camera, webcam, or an uploaded image directly inside your browser.",
      relatedTools: ["qr-generator", "barcode-generator"],
      inputFormat: "image",
      outputFormat: "none",
      actionName: "Scan QR Code",
      isInteractive: true,
      acceptedTypes: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp"]
      }
    },
    "live-ruler": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Live CM Ruler",
      description: "Measure real-world objects using your screen. Automatic calibration for CM and Inches.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      relatedTools: ["camera-measure", "inches-to-centimeters", "feet-to-meters", "feet-to-yards"],
      acceptedTypes: {}
    },
    "camera-measure": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Camera Measurement Tool",
      description: "Estimate object dimensions and distances using your device's camera.",
      seoTitle: "Camera Measurement Tool - Measure Distance with Phone Online",
      seoDescription: "Estimate physical dimensions and distances of objects online using optical reference scaling with your phone or web camera.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      relatedTools: ["live-ruler", "passport-photo-maker", "nanometers-to-micrometers", "feet-to-yards"],
      acceptedTypes: {}
    },
    "age-calculator": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Age Calculator",
      description: "Calculate your exact age in years, months, and days from your date of birth.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "qr-generator": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "QR Code Generator",
      seoTitle: "Free QR Code Generator Online - Create Custom QR Codes",
      seoDescription: "Generate high-quality custom QR codes for URLs and text directly in your browser. Download your static QR code as a PNG file for free.",
      description: "Generate and download custom QR codes for URLs, text, and more in your browser.",
      relatedTools: ["qr-scanner", "barcode-generator"],
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "barcode-generator": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Barcode Generator",
      seoTitle: "Free Barcode Generator Online - Create CODE128 Barcodes",
      seoDescription: "Create standard 1D CODE128 barcodes directly in your browser. Turn any text or number into a high-resolution scannable barcode graphic for free.",
      description: "Create standard 1D barcodes in your browser and download them in high quality.",
      relatedTools: ["qr-generator", "qr-scanner"],
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "password-generator": {
      theme: "blue", iconName: "FileText", badge: "Popular", isPopular: true,
      title: "Password Generator",
      seoTitle: "Random Password Generator - Secure Local Utility",
      description: "Generate randomized passwords with custom length and character sets directly in your browser.",
      seoDescription: "Generate strong, randomized passwords directly in your browser. Customize length up to 64 characters and select symbols, numbers, and case.",
      relatedTools: ["uuid-generator"],
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "fuel-calculator": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Fuel Cost Calculator",
      seoTitle: "Trip Fuel Cost Calculator - Calculate Gas Cost Online",
      description: "Calculate your estimated fuel cost and required fuel volume for a trip.",
      seoDescription: "Calculate the exact fuel cost and gas volume required for your trip based on distance and fuel efficiency directly in your browser.",
      relatedTools: ["mileage-calculator", "feet-to-meters", "inches-to-centimeters"],
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "mileage-calculator": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Mileage Calculator",
      description: "Calculate your vehicle's exact fuel efficiency and mileage.",
      seoTitle: "Mileage Calculator - Calculate MPG & km/L Online",
      seoDescription: "Calculate your vehicle's exact MPG, L/100km, or km/L based on distance traveled and fuel consumed directly in your browser.",
      relatedTools: ["fuel-calculator", "feet-to-meters", "inches-to-centimeters"],
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "inches-to-centimeters": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Inches to Centimeters",
      description: "Convert Inches to Centimeters directly in your browser with our free length converter.",
      seoTitle: "Inches to Centimeters Converter (in to cm)",
      seoDescription: "Convert inches (in) to centimeters (cm) directly in your browser. Free online length converter for accurate measurements.",
      relatedTools: ["camera-measure", "live-ruler"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "inches-to-millimeters": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Inches to Millimeters",
      description: "Convert Inches to Millimeters directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "inches-to-feet": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Inches to Feet",
      description: "Convert Inches to Feet directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "feet-to-meters": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Feet to Meters",
      description: "Convert Feet to Meters directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "feet-to-yards": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Feet to Yards",
      description: "Convert Feet to Yards directly in your browser with our free length converter.",
      seoTitle: "Feet to Yards Converter (ft to yd)",
      seoDescription: "Convert feet (ft) to yards (yd) directly in your browser. Free online length converter for accurate metric and imperial calculations.",
      relatedTools: ["yards-to-meters", "feet-to-meters", "feet-to-inches"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "feet-to-inches": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Feet to Inches",
      description: "Convert Feet to Inches directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "miles-to-nautical-miles": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Miles to Nautical Miles",
      description: "Convert Miles to Nautical Miles directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "yards-to-meters": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Yards to Meters",
      description: "Convert Yards to Meters directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "millimeters-to-inches": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Millimeters to Inches",
      description: "Convert Millimeters to Inches directly in your browser with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "nanometers-to-micrometers": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Nanometers to Micrometers",
      description: "Convert Nanometers to Micrometers directly in your browser with our free length converter.",
      seoTitle: "Nanometers to Micrometers Converter (nm to µm)",
      seoDescription: "Convert nanometers (nm) to micrometers (µm) directly in your browser. Free online length converter for scientific and engineering calculations.",
      relatedTools: ["light-years-to-parsecs"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "light-years-to-parsecs": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Light Years to Parsecs",
      description: "Convert Light Years to Parsecs directly in your browser with our free length converter.",
      seoTitle: "Light Years to Parsecs Converter (ly to pc)",
      seoDescription: "Convert light years (ly) to parsecs (pc) directly in your browser. Free astronomical distance converter for astrophysics calculations.",
      relatedTools: ["nanometers-to-micrometers"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "nautical-miles-to-miles": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Nautical Miles to Miles",
      description: "Convert Nautical Miles to Miles directly in your browser with our free length converter.",
      seoTitle: "Nautical Miles to Miles Converter (nmi to mi)",
      seoDescription: "Convert nautical miles to standard statute miles directly in your browser. Free online length converter for aviation and marine navigation.",
      relatedTools: ["miles-to-nautical-miles", "furlongs-to-miles", "leagues-to-miles"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "furlongs-to-miles": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Furlongs to Miles",
      description: "Convert Furlongs to Miles directly in your browser with our free length converter.",
      seoTitle: "Furlongs to Miles Converter",
      seoDescription: "Convert furlongs to miles directly in your browser. Free online distance converter for horse racing and historical measurements.",
      relatedTools: ["miles-to-nautical-miles", "leagues-to-miles"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "leagues-to-miles": {
      theme: "slate", iconName: "Wrench", badge: "Tool",
      title: "Leagues to Miles",
      description: "Convert Leagues to Miles directly in your browser with our free length converter.",
      seoTitle: "Leagues to Miles Converter",
      seoDescription: "Convert historical leagues to standard miles directly in your browser. Free online distance converter.",
      relatedTools: ["furlongs-to-miles", "nautical-miles-to-miles"],
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    }
  },
  "fonts": {
    "unicode-to-krutidev": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Kruti Dev Converter", description: "Convert standard Unicode Hindi text (Mangal font) to legacy Kruti Dev 010 font format for PageMaker and printing presses.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "krutidev-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Kruti Dev to Unicode Converter", description: "Convert legacy Kruti Dev 010 font text to standard Unicode (Mangal font) Hindi for Word documents, web forms, and mobile devices.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-chanakya": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Chanakya", seoTitle: "Unicode to Chanakya Converter", seoDescription: "Convert Unicode Hindi to legacy Chanakya font. Experimental tool undergoing verification.", description: "Convert Unicode Hindi text to legacy Chanakya font. Experimental tool: verification in progress.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "chanakya-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Chanakya to Unicode Converter", seoTitle: "Chanakya to Unicode Converter", seoDescription: "Convert legacy Walkman-Chanakya Hindi font text into Unicode. Experimental tool undergoing verification.", description: "Convert legacy Walkman-Chanakya Hindi text into Unicode. Experimental tool: verification in progress.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-anmollipi": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to AnmolLipi Converter", seoTitle: "Unicode to AnmolLipi Converter | Punjabi Legacy Font Text", seoDescription: "Convert pasted Gurmukhi Unicode text into AnmolLipi legacy-font characters. Apply the AnmolLipi font in your document editor to view the output as Punjabi.", description: "Convert pasted Unicode Punjabi text into character codes for the AnmolLipi legacy font mapping.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "anmollipi-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "AnmolLipi to Unicode Converter", seoTitle: "AnmolLipi to Unicode Converter | Gurmukhi Text", seoDescription: "Convert pasted text encoded with the AnmolLipi legacy font mapping into standard Gurmukhi Unicode. Review uncommon glyphs and complex sequences against the source.", description: "Convert AnmolLipi-encoded Punjabi text into Gurmukhi Unicode.", relatedTools: ["asees-to-unicode", "satluj-to-unicode", "joy-to-unicode"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-asees": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Asees Converter", seoTitle: "Unicode to Asees Converter | Punjabi Legacy Font Text", seoDescription: "Convert pasted Gurmukhi Unicode text into character codes for the Asees legacy font. Apply Asees in the destination application to display the output as Punjabi.", description: "Convert pasted Unicode Punjabi text into character codes for the Asees legacy font mapping.", relatedTools: ["asees-to-unicode", "unicode-to-satluj", "unicode-to-joy"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "asees-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Asees to Unicode Converter", seoTitle: "Asees to Unicode Converter | Gurmukhi Text", seoDescription: "Convert pasted text encoded with the Asees legacy font mapping into standard Gurmukhi Unicode. This text converter does not validate official typing-test requirements.", description: "Convert Asees-encoded Punjabi text into Gurmukhi Unicode.", relatedTools: ["unicode-to-asees", "satluj-to-unicode", "anmollipi-to-unicode"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-joy": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Joy Converter", seoTitle: "Unicode to Joy Converter | Punjabi Legacy Font Text", seoDescription: "Convert pasted Gurmukhi Unicode text into character codes for the Joy legacy font. Apply Joy in the destination application to display the output as Punjabi.", description: "Convert pasted Unicode Punjabi text into character codes for the Joy legacy font mapping.", relatedTools: ["joy-to-unicode", "unicode-to-asees", "unicode-to-satluj"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "joy-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Joy to Unicode Converter", seoTitle: "Joy to Unicode Converter | Gurmukhi Text", seoDescription: "Convert pasted text encoded with the Joy legacy font mapping into standard Gurmukhi Unicode. Check less-common characters and sequences against the original.", description: "Convert Joy-encoded Punjabi text into Gurmukhi Unicode.", relatedTools: ["unicode-to-joy", "satluj-to-unicode", "asees-to-unicode"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-satluj": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Satluj Converter", seoTitle: "Unicode to Satluj Converter | Punjabi Legacy Font Text", seoDescription: "Convert pasted Gurmukhi Unicode text into character codes for the Satluj legacy font. Apply Satluj in the destination application and review numbers and punctuation.", description: "Convert pasted Unicode Punjabi text into character codes for the Satluj legacy font mapping.", relatedTools: ["satluj-to-unicode", "unicode-to-asees", "unicode-to-joy"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "satluj-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Satluj to Unicode Converter", seoTitle: "Satluj to Unicode Converter | Gurmukhi Text", seoDescription: "Convert pasted text encoded with the supported Satluj legacy character mapping into Gurmukhi Unicode. Review numbers, punctuation and uncommon glyphs against the original.", description: "Convert Satluj-encoded Punjabi text into Gurmukhi Unicode.", relatedTools: ["unicode-to-satluj", "asees-to-unicode", "joy-to-unicode"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "gurbani-akhar-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Gurbani Akhar to Unicode Converter", seoTitle: "Gurbani Akhar to Unicode | Gurmukhi Text Converter", seoDescription: "Convert pasted text intended for the Gurbani Akhar/GurbaniLipi mapping into Gurmukhi Unicode. The current mapping reuses an AnmolLipi base table; verify font-specific symbols and passages.", description: "Convert pasted text intended for the current GurbaniLipi mapping profile into Gurmukhi Unicode.", relatedTools: ["asees-to-unicode", "anmollipi-to-unicode", "satluj-to-unicode"], inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-raavi": { theme: "cyan", iconName: "Type", badge: "Guide", title: "Raavi Font Guide", seoTitle: "Raavi Font Guide | Display Punjabi Unicode Text", seoDescription: "Learn how to display Punjabi Gurmukhi Unicode text using the Raavi font. No character conversion is needed; Raavi must be installed and available in your document editor.", description: "Use the Raavi Gurmukhi font to display existing Punjabi Unicode text. No character conversion is needed; the font must be installed and available in your document editor.", inputFormat: "none", outputFormat: "none", isInteractive: false, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },

    // NEPALI FONT CONVERTERS
    "preeti-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Preeti to Unicode Converter", description: "Convert Nepali Preeti legacy font text to standard universal Unicode in your browser.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "nepali", acceptedTypes: {} },
    "unicode-to-preeti": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Preeti Converter", description: "Convert standard Nepali Unicode text to traditional Preeti font format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "nepali", acceptedTypes: {} },

    // BENGALI FONT CONVERTERS (BIJOY / SUTONNYMJ)
    "bijoy-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "Bijoy to Unicode Converter (SutonnyMJ)", description: "Convert legacy Bijoy SutonnyMJ Bengali text to standard Unicode in your browser.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "bengali", acceptedTypes: {} },
    "unicode-to-bijoy": { theme: "cyan", iconName: "Type", badge: "Font", title: "Unicode to Bijoy Converter (SutonnyMJ)", description: "Convert Unicode Bengali text to legacy Bijoy SutonnyMJ format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "bengali", acceptedTypes: {} },

    // URDU FONT CONVERTERS (INPAGE & URDU UNICODE)
    "inpage-to-unicode": { theme: "cyan", iconName: "Type", badge: "Font", title: "InPage to Urdu Unicode Converter", description: "Convert Pakistani Urdu InPage (.inp/ASCII) text to standard universal Urdu Unicode in your browser.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "urdu", acceptedTypes: {} },
    "unicode-to-inpage": { theme: "cyan", iconName: "Type", badge: "Font", title: "Urdu Unicode to InPage Converter", description: "Convert standard Urdu Unicode text to InPage editor format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "urdu", acceptedTypes: {} },

    "font-detector": {
      theme: "cyan", iconName: "Type", badge: "Font",
      title: "Online Font Detector - Kruti Dev, AnmolLipi & Unicode Identifier",
      description: "Identify legacy Kruti Dev 010, Walkman-Chanakya, Asees, AnmolLipi, and Unicode Hindi or Punjabi text in your browser and open the right converter.",
      seoDescription: "Identify legacy Kruti Dev 010, Walkman-Chanakya, Asees, AnmolLipi, and Unicode Hindi or Punjabi text in your browser and find the matching converter.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      converterType: "font-detector",
      acceptedTypes: {}
    },
    "font-text-fixer": {
      theme: "cyan", iconName: "Wand2", badge: "AI Magic", isPopular: true,
      title: "Font Text Fixer - Auto-Detect & Repair Garbled Text",
      seoTitle: "Font Text Fixer - Auto-Detect & Repair Garbled Hindi & Punjabi Fonts",
      description: "Detect and repair garbled legacy Hindi and Punjabi text (such as çÝæÌðÕ) into readable Unicode in your browser, with manual overrides for Kruti Dev, DevLys, Chanakya, Asees, Joy, and AnmolLipi.",
      seoDescription: "Fix garbled Hindi and Punjabi text without knowing the original font. Font Text Fixer auto-detects Kruti Dev, Chanakya, Asees, and AnmolLipi or lets you pick 6 manual overrides.",
      relatedTools: ["font-detector", "krutidev-to-unicode", "asees-to-unicode"],
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      converterType: "font-text-fixer",
      acceptedTypes: {}
    },
  },

  "developer": {
    "jwt-decoder": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code", isPopular: true,
      title: "Browser-Based JWT Decoder & Parser",
      seoTitle: "Browser-Based JWT Decoder & Parser - Inspect Tokens Securely",
      description: "Safely decode and inspect JSON Web Tokens directly in your browser. View algorithm headers, payload claims, and token expiration. Does not verify the cryptographic signature.",
      seoDescription: "Client-side JWT decoder and parser. View JWT header and payload claims securely in your browser. Decoding only; cryptographic signatures are not verified.",
      relatedTools: ["base64-encoder-decoder", "json-formatter"],
      subCategory: "Tokens & Security",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Decode JWT",
      isInteractive: true,
      acceptedTypes: {}
    },
    "json-formatter": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code", isPopular: true,
      title: "JSON Formatter & Validator",
      seoTitle: "JSON Formatter, Validator & Minifier - Client-Side Auto Repair",
      description: "Prettify, format, validate, minify, and auto-repair broken JSON syntax with real-time error detection and 1-click copy.",
      seoDescription: "Format, validate, prettify, and minify JSON data directly in your browser. Features auto-repair for trailing commas and single quotes. Runs in your browser without cloud uploads.",
      relatedTools: ["json-to-csv", "base64-encoder-decoder"],
      subCategory: "Data Formatting",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Format JSON",
      isInteractive: true,
      acceptedTypes: {}
    },
    "json-to-csv": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code", isPopular: true,
      title: "JSON to CSV Converter",
      seoTitle: "JSON to CSV Converter - Free Client-Side Data Tool",
      description: "Convert JSON arrays and files to CSV format in your browser with live tabular data preview and custom delimiter settings.",
      seoDescription: "Convert JSON arrays to CSV or parse CSV text back to JSON in your browser. Features live table previews and browser-side execution.",
      relatedTools: ["json-formatter", "base64-encoder-decoder"],
      subCategory: "Data Conversion",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Convert to CSV",
      isInteractive: true,
      acceptedTypes: {}
    },
    "csv-to-json": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code", isPopular: true,
      title: "CSV to JSON Converter",
      description: "Convert CSV spreadsheets and text into structured JSON arrays and objects directly inside your browser.",
      subCategory: "Data Conversion",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Convert to JSON",
      isInteractive: true,
      acceptedTypes: {}
    },
    "base64-encoder-decoder": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code",
      title: "Base64 Encoder & Decoder",
      seoTitle: "Base64 Encoder & Decoder - Fast Local Processing",
      description: "Encode text and files (images, audio, PDF) to Base64 Data URLs, or decode Base64 strings back to readable text and downloadable files.",
      seoDescription: "Encode text, files, and images to Base64 or decode strings back to plain text securely in your browser. Supports UTF-8 and URL-safe encoding.",
      relatedTools: ["jwt-decoder", "json-formatter"],
      subCategory: "Encoding & Data",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Base64 Convert",
      isInteractive: true,
      acceptedTypes: {}
    },
    "unix-timestamp-converter": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code",
      title: "Unix Timestamp Converter (Epoch to Date)",
      description: "Convert Unix epoch timestamps in seconds and milliseconds to human-readable dates and vice versa with live epoch clock.",
      subCategory: "Time & Date",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Convert Timestamp",
      isInteractive: true,
      acceptedTypes: {}
    },
    "uuid-generator": {
      theme: "cyan", iconName: "Code2", badge: "Data & Code",
      title: "UUID Generator & Validator (v4 GUID)",
      seoTitle: "UUID v4 Generator & Validator - Cryptographically Secure",
      description: "Generate bulk RFC 4122 v4 UUIDs / GUIDs directly in your browser with uppercase, hyphens, and braces options, plus UUID syntax validator.",
      seoDescription: "Generate random, cryptographically secure v4 UUIDs directly in your browser. Includes a UUID syntax validator to inspect versions and variants.",
      relatedTools: ["password-generator"],
      subCategory: "Tokens & Security",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Generate UUID",
      isInteractive: true,
      acceptedTypes: {}
    }
  },
  "exam": {
    "photo-name-date-stamper": {
      theme: "blue", iconName: "Camera", badge: "New", isPopular: true,
      title: "Name and Date of Photo Stamper for Sarkari Exams",
      description: "Quickly stamp your Name and Date of Photograph (DOP) on passport photos for SSC, Police, and Defense exams.",
      seoTitle: "Name and Date of Photo Stamper - Free Tool for Sarkari Exams",
      seoDescription: "Stamp candidate name and date of photo (DOP) on passport photos for SSC, State Police, and Defense exams online for free.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Stamp Photo",
      isInteractive: true,
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "exam-photo-resizer": {
      theme: "blue", iconName: "Scan", badge: "New", isPopular: true,
      title: "Exam Photo & Signature Resizer",
      description: "Crop and compress photos and signatures exactly to SSC, UPSC, and IBPS portal requirements.",
      seoTitle: "Exam Photo & Signature Resizer - Crop for SSC, UPSC, IBPS",
      seoDescription: "Easily crop and compress your passport photo and signature to exact KB sizes and dimensions required by SSC, UPSC, IBPS, and other Indian government exams.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Resize Photo",
      isInteractive: true,
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "exam-signature-resizer": {
      theme: "blue", iconName: "Eraser", badge: "New", isPopular: true,
      title: "Signature Whitener & Resizer",
      description: "Remove grey paper shadows from phone photos and compress signatures to strict 10KB–20KB bounds.",
      seoTitle: "Signature Whitener & Resizer - Convert Phone Photo to Clean Signature",
      seoDescription: "Clean up grey paper shadows from signature photos and compress strictly under 10KB-20KB for SSC, UPSC, and IBPS portal uploads.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Clean Signature",
      isInteractive: true,
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
    },
    "compress-pdf-100kb": {
      theme: "blue", iconName: "FileArchive", badge: "New", isPopular: true,
      title: "Compress PDF below 100KB",
      description: "Strictly compress educational certificates and marksheets under 100KB or 200KB for government job portals.",
      seoTitle: "Compress PDF under 100KB - Free Marksheet Compressor",
      seoDescription: "Easily compress your educational certificates, marksheets, and PDFs below 100KB or 200KB for SSC, UPSC, and State PSC online application forms.",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Compress PDF",
      isInteractive: true,
      acceptedTypes: {
        "application/pdf": [".pdf"]
      }
    },
    "image-dpi-converter": {
      theme: "emerald", iconName: "Image", badge: "Sarkari", isPopular: true,
      title: "Image DPI Converter",
      description: "Update JPG and PNG DPI metadata headers (72, 96, 200, or 300 DPI) in your browser without resizing pixels.",
      seoTitle: "Image DPI Converter (200 / 300 DPI) - Free Online Tool",
      seoDescription: "Update JPG and PNG DPI metadata headers (72, 96, 200, or 300 DPI) in your browser without resampling pixels.",
      inputFormat: "image",
      outputFormat: "image",
      actionName: "Change DPI",
      isInteractive: true,
      acceptedTypes: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"]
      }
    }
  }
};

// SEO & Routing Slug Aliases (Resolves alternative URLs without duplicate cards in directories)
export const SLUG_ALIASES: Record<string, string> = {
  // Font Aliases
  "kruti-dev-010-to-unicode": "krutidev-to-unicode",
  "kruti-dev-to-unicode": "krutidev-to-unicode",
  "krutidev-to-mangal": "krutidev-to-unicode",
  "kruti-dev-to-mangal": "krutidev-to-unicode",
  "kruti-dev-010-to-mangal": "krutidev-to-unicode",
  "devlys-to-unicode": "krutidev-to-unicode",
  "devlys-to-mangal": "krutidev-to-unicode",
  "unicode-to-kruti-dev-010": "unicode-to-krutidev",
  "unicode-to-kruti-dev": "unicode-to-krutidev",
  "mangal-to-krutidev": "unicode-to-krutidev",
  "mangal-to-kruti-dev": "unicode-to-krutidev",
  "mangal-to-kruti-dev-010": "unicode-to-krutidev",
  "mangal-to-kruti": "unicode-to-krutidev",
  "unicode-to-devlys": "unicode-to-krutidev",
  "mangal-to-devlys": "unicode-to-krutidev",
  "sutonnymj-to-unicode": "bijoy-to-unicode",
  "unicode-to-sutonnymj": "unicode-to-bijoy",
  "inpage-to-urdu-unicode": "inpage-to-unicode",
  "inpage-urdu-to-unicode": "inpage-to-unicode",
  "urdu-unicode-to-inpage": "unicode-to-inpage",

  // Image & Utility Aliases
  "png-to-svg": "image-to-svg",
  "background-remover": "remove-background",
  "remove-bg": "remove-background",
  "webp-to-jpeg": "webp-to-jpg",
  "image-compressor": "compress-jpg",
  "screen-recording": "screen-recorder",
  "record-screen": "screen-recorder",
  "online-screen-recorder": "screen-recorder",
  "qr-code-generator": "qr-generator",
  "barcode-creator": "barcode-generator",
  "generate-qr": "qr-generator",
  "generate-barcode": "barcode-generator",

  // Video Compressor Aliases
  "compress-video": "video-compressor",
  "compress-video-size": "video-compressor",
  "reduce-video-size": "video-compressor",
  "shrink-video": "video-compressor",
  "compress-mov": "video-compressor",
  "compress-mkv": "video-compressor",
  "compress-avi": "video-compressor",
  "compress-webm": "video-compressor",
  "compress-wmv": "video-compressor",
  "compress-flv": "video-compressor",
  "compress-discord-video": "video-compressor",
  "compress-whatsapp-video": "video-compressor",
  "compress-email-video": "video-compressor",
  "compress-reels": "video-compressor",
  "compress-instagram-video": "video-compressor",
  "compress-facebook-video": "video-compressor",
  "compress-iphone-video": "video-compressor",
  "compress-android-video": "video-compressor",

  // Audio Aliases
  "cut-audio-free": "trim-audio",
  "private-audio-trimmer": "trim-audio",

  // PDF & Office Document Aliases
  "remove-pdf-properties": "clean-pdf-metadata",
  "pdf-privacy-scrubber": "clean-pdf-metadata",
  "pdf-merger": "merge-pdf",
  "combine-pdf": "merge-pdf",
  "merge-word-to-pdf": "merge-pdf",
  "merge-word-and-pdf": "merge-pdf",
  "combine-word-and-pdf": "merge-pdf",
  "merge-docx-pdf": "merge-pdf",
  "combine-pdf-word": "merge-pdf",
  "resize-pdf": "compress-pdf",
  "scale-pdf": "organize-pdf",
  "pdf-resize": "compress-pdf",
  "pdf-scale": "organize-pdf",
  "resize-pdf-pages": "organize-pdf",
  "scale-pdf-pages": "organize-pdf",
  "pdf-resizer": "compress-pdf",
  "pdf-compressor": "compress-pdf",
  "pdf-page-remover": "remove-pages",
  "remove-pdf-pages": "remove-pages",
  "pdf-page-extractor": "extract-pages",
  "extract-pdf-pages": "extract-pages",
  "pdf-rotator": "rotate-pdf",
  "rotate-pdf-pages": "rotate-pdf",
  "images-to-pdf": "jpg-to-pdf",
  "image-to-pdf": "jpg-to-pdf",
  "pdf-editor": "edit-pdf",
  "annotate-pdf": "edit-pdf",
  "sign-pdf": "edit-pdf",
  "online-pdf-editor": "edit-pdf",
  "ppt-to-pdf": "powerpoint-to-pdf",
  "pptx-to-pdf": "powerpoint-to-pdf",
  "convert-powerpoint-to-pdf": "powerpoint-to-pdf",
  "xls-to-pdf": "excel-to-pdf",
  "xlsx-to-pdf": "excel-to-pdf",
  "convert-excel-to-pdf": "excel-to-pdf",
  "htm-to-pdf": "html-to-pdf",

  // Developer / Data & Code Aliases
  "decode-jwt": "jwt-decoder",
  "jwt-parser": "jwt-decoder",
  "jwt-validator": "jwt-decoder",
  "json-validator": "json-formatter",
  "format-json": "json-formatter",
  "prettify-json": "json-formatter",
  "base64-encode": "base64-encoder-decoder",
  "base64-decode": "base64-encoder-decoder",
  "base64-converter": "base64-encoder-decoder",
  "timestamp-converter": "unix-timestamp-converter",
  "epoch-converter": "unix-timestamp-converter",
  "epoch-to-date": "unix-timestamp-converter",
  "uuid-validator": "uuid-generator",
  "guid-generator": "uuid-generator",
};

export function getToolBySlug(slug: string) {
  const targetSlug = SLUG_ALIASES[slug] || slug;

  for (const [categorySlug, categoryTools] of Object.entries(toolsDatabase)) {
    if (targetSlug in categoryTools) {
      return {
        categorySlug,
        toolSlug: targetSlug,
        tool: (categoryTools as Record<string, Tool>)[targetSlug]
      };
    }
  }
  return null;
}

export function getCanonicalToolSlugs() {
  const slugs: string[] = [];
  for (const categoryTools of Object.values(toolsDatabase)) {
    slugs.push(...Object.keys(categoryTools));
  }
  return Array.from(new Set(slugs));
}

export function getAllToolSlugs() {
  const slugs: string[] = [];
  for (const categoryTools of Object.values(toolsDatabase)) {
    slugs.push(...Object.keys(categoryTools));
  }
  slugs.push(...Object.keys(SLUG_ALIASES));
  return Array.from(new Set(slugs));
}
