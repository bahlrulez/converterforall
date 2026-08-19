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
    "webp-to-jpg": {
      title: "Convert WEBP to JPG",
      description: "Fast, secure, and high-quality WEBP to JPG image conversion.",
      inputFormat: "webp",
      outputFormat: "jpg",
      acceptedTypes: { "image/webp": [".webp"] }
    },
    "pdf-to-jpg": {
      title: "Convert PDF to JPG",
      description: "Convert PDF document pages to high-quality JPG images.",
      inputFormat: "pdf",
      outputFormat: "jpg",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "pdf-to-png": {
      title: "Convert PDF to PNG",
      description: "Convert PDF document pages to clear PNG images.",
      inputFormat: "pdf",
      outputFormat: "png",
      acceptedTypes: { "application/pdf": [".pdf"] }
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
      description: "Convert Apple iPhone HEIC and HEIF photos to universal JPG online for free.",
      inputFormat: "heic",
      outputFormat: "jpg",
      actionName: "Convert to JPG",
      acceptedTypes: { "image/heic": [".heic"], "image/heif": [".heif"] }
    },
    "heic-to-png": {
      title: "Convert HEIC to PNG",
      description: "Convert Apple HEIC photos to high-quality transparent PNG format for free.",
      inputFormat: "heic",
      outputFormat: "png",
      actionName: "Convert to PNG",
      acceptedTypes: { "image/heic": [".heic"], "image/heif": [".heif"] }
    },
    "compress-jpg": {
      title: "Compress JPG",
      description: "Reduce JPG file size while preserving maximum visual quality using our in-browser compressor.",
      inputFormat: "jpg",
      outputFormat: "jpg",
      actionName: "Compress JPG",
      isInteractive: true,
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "compress-png": {
      title: "Compress PNG",
      description: "Reduce PNG file size with our advanced browser-based compression engine.",
      inputFormat: "png",
      outputFormat: "png",
      actionName: "Compress PNG",
      isInteractive: true,
      acceptedTypes: { "image/png": [".png"] }
    },
    "passport-photo-maker": {
      title: "Passport Photo Maker",
      description: "Create and crop perfect passport photos online. Supports standard US and International sizes.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Make Passport Photo",
      isInteractive: true,
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
    },
    "gif-maker": {
      title: "GIF Maker",
      description: "Convert and create animated GIFs from images and photos online for free.",
      inputFormat: "image",
      outputFormat: "gif",
      actionName: "Make GIF",
      acceptedTypes: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".avif"] }
    },
    "image-cropper": {
      title: "Image Cropper",
      description: "Crop photos and images to exact dimensions and custom aspect ratios.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Crop Image",
      isInteractive: true,
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
    },
    "image-resizer": {
      title: "Image Resizer",
      description: "Resize photos and graphics to custom pixel dimensions with high quality.",
      inputFormat: "image",
      outputFormat: "jpg",
      actionName: "Resize Image",
      isInteractive: true,
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] }
    },
    "svg-to-png": {
      title: "Convert SVG to PNG",
      description: "Convert SVG vector graphics to crisp, transparent PNG images online with 100% privacy.",
      inputFormat: "svg",
      outputFormat: "png",
      actionName: "Convert to PNG",
      acceptedTypes: { "image/svg+xml": [".svg"] }
    },
    "svg-to-jpg": {
      title: "Convert SVG to JPG",
      description: "Convert SVG vector files to standard JPG photos online for free.",
      inputFormat: "svg",
      outputFormat: "jpg",
      actionName: "Convert to JPG",
      acceptedTypes: { "image/svg+xml": [".svg"] }
    }
  },
  "document": {
    // ORGANIZE PDF
    "merge-pdf": {
      title: "Merge PDF, JPG, and PNG",
      description: "Combine multiple PDFs, JPGs, and PNGs into one unified document for free.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Merge Files",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }
    },
    "presentation-maker": {
      title: "Presentation Maker (PPTX)",
      description: "Create beautiful PowerPoint presentations instantly in your browser. 100% free and private—no uploads required.",
      subCategory: "Create Document",
      inputFormat: "text",
      outputFormat: "pptx",
      actionName: "Make Presentation",
      isInteractive: true,
      acceptedTypes: {}
    },
    "split-pdf": {
      title: "Split PDF",
      description: "Extract pages from your PDF or save each page as a separate PDF.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Split PDF",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "remove-pages": {
      title: "Remove Pages",
      description: "Delete unnecessary pages from your PDF.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Remove Pages",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "extract-pages": {
      title: "Extract Pages",
      description: "Pull specific pages out of your PDF document.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Extract Pages",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "organize-pdf": {
      title: "Organize PDF",
      description: "Sort, add and delete PDF pages.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Organize PDF",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "rotate-pdf": {
      title: "Rotate PDF",
      description: "Rotate your PDF pages 90, 180, or 270 degrees clockwise.",
      subCategory: "Organize PDF",
      inputFormat: "pdf",
      outputFormat: "pdf",
      actionName: "Rotate PDF",
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "scan-to-pdf": {
      title: "Scan to PDF",
      description: "Capture document scans and turn them into PDFs.",
      subCategory: "Organize PDF",
      inputFormat: "image",
      outputFormat: "pdf",
      actionName: "Create PDF",
      acceptedTypes: { "image/*": [".jpg", ".png", ".jpeg"] }
    },

    // EDIT & ANNOTATE PDF
    "edit-pdf": {
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
      actionName: "Repair PDF",
      isInteractive: true,
      acceptedTypes: { "application/pdf": [".pdf"] }
    },
    "ocr-pdf": {
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
      title: "JPG to PDF",
      description: "Convert JPG images to high-quality PDF documents online for free.",
      subCategory: "Convert to PDF",
      inputFormat: "jpg",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: { "image/jpeg": [".jpg", ".jpeg"] }
    },
    "png-to-pdf": {
      title: "PNG to PDF",
      description: "Convert PNG images with transparent backgrounds to PDF documents for free.",
      subCategory: "Convert to PDF",
      inputFormat: "png",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: { "image/png": [".png"] }
    },
    "word-to-pdf": {
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
      title: "EXCEL to PDF",
      description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
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
      title: "HTML to PDF",
      description: "Convert webpages in HTML to PDF.",
      subCategory: "Convert to PDF",
      inputFormat: "html",
      outputFormat: "pdf",
      actionName: "Convert to PDF",
      acceptedTypes: { "text/html": [".html", ".htm"] }
    },

    // CONVERT FROM PDF
    "pdf-to-word": {
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
    "compress-video": {
      title: "Compress Video Size",
      description: "Reduce video file size while maintaining quality.",
      inputFormat: "video",
      outputFormat: "mp4",
      actionName: "Compress Video",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] }
    },
    "video-compressor": {
      title: "Video Compressor",
      description: "Reduce video file sizes while retaining crystal clear video quality.",
      inputFormat: "video",
      outputFormat: "mp4",
      actionName: "Compress Video",
      isInteractive: true,
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] }
    },
    "video-to-gif": {
      title: "Video to GIF Converter",
      description: "Convert video clips and movies to lightweight animated GIFs.",
      inputFormat: "video",
      outputFormat: "gif",
      actionName: "Convert to GIF",
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] }
    },
    "video-to-jpg": {
      title: "Video to JPG Sequence",
      description: "Extract frames from your video into a sequence of JPG images.",
      inputFormat: "video",
      outputFormat: "zip",
      actionName: "Extract to JPGs",
      acceptedTypes: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] }
    },
    "mp4-to-mp3": {
      title: "Convert MP4 to MP3",
      description: "Extract high-quality audio from your MP4 videos.",
      inputFormat: "mp4",
      outputFormat: "mp3",
      actionName: "Extract Audio",
      acceptedTypes: { "video/mp4": [".mp4"] }
    },
    "video-to-mp4": {
      title: "Convert to MP4",
      description: "Convert any video format to standard MP4 format.",
      inputFormat: "video",
      outputFormat: "mp4",
      actionName: "Convert to MP4",
      acceptedTypes: { "video/*": [".avi", ".mkv", ".wmv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-avi": {
      title: "Convert to AVI",
      description: "Convert any video format to AVI format.",
      inputFormat: "video",
      outputFormat: "avi",
      actionName: "Convert to AVI",
      acceptedTypes: { "video/*": [".mp4", ".mkv", ".wmv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-mkv": {
      title: "Convert to MKV",
      description: "Convert any video format to MKV format.",
      inputFormat: "video",
      outputFormat: "mkv",
      actionName: "Convert to MKV",
      acceptedTypes: { "video/*": [".mp4", ".avi", ".wmv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "screen-recorder": {
      title: "Online Screen Recorder",
      description: "Record your desktop, application window, or browser tab with audio for free. 100% private and in-browser.",
      inputFormat: "none",
      outputFormat: "mp4",
      actionName: "Start Recording",
      isInteractive: true,
      acceptedTypes: {}
    },
    "video-to-wmv": {
      title: "Convert to WMV",
      description: "Convert any video format to WMV format.",
      inputFormat: "video",
      outputFormat: "wmv",
      actionName: "Convert to WMV",
      acceptedTypes: { "video/*": [".mp4", ".avi", ".mkv", ".mov", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-mov": {
      title: "Convert to MOV",
      description: "Convert any video format to Apple MOV format.",
      inputFormat: "video",
      outputFormat: "mov",
      actionName: "Convert to MOV",
      acceptedTypes: { "video/*": [".mp4", ".avi", ".mkv", ".wmv", ".flv", ".webm", ".m4v", ".mpeg"] }
    },
    "video-to-flv": {
      title: "Convert to FLV",
      description: "Convert any video format to FLV format.",
      inputFormat: "video",
      outputFormat: "flv",
      actionName: "Convert to FLV",
      acceptedTypes: { "video/*": [".mp4", ".avi", ".mkv", ".wmv", ".mov", ".webm", ".m4v", ".mpeg"] }
    }
  },
  "utilities": {
    "qr-scanner": {
      title: "QR Code Scanner Online",
      description: "Scan QR codes instantly using your mobile camera, webcam, or by uploading an image. 100% private, fast, and completely secure client-side scanning.",
      inputFormat: "image",
      outputFormat: "none",
      actionName: "Scan QR Code",
      isInteractive: true,
      acceptedTypes: {
        "image/*": [".jpg", ".jpeg", ".png", ".webp"]
      }
    },
    "live-ruler": {
      title: "Live CM Ruler",
      description: "Measure real-world objects using your screen. Automatic calibration for CM and Inches.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "camera-measure": {
      title: "Camera Measurement Tool",
      description: "Estimate object dimensions and distances using your device's camera.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "age-calculator": {
      title: "Age Calculator",
      description: "Calculate your exact age in years, months, and days from your date of birth.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "qr-generator": {
      title: "QR Code Generator",
      description: "Generate and download custom QR codes for URLs, text, and more instantly.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "barcode-generator": {
      title: "Barcode Generator",
      description: "Create standard 1D barcodes instantly and download them in high quality.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "password-generator": {
      title: "Password Generator",
      description: "Generate secure, random, and strong passwords instantly.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "fuel-calculator": {
      title: "Fuel Cost Calculator",
      description: "Calculate your estimated fuel cost and required fuel volume for a trip.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "mileage-calculator": {
      title: "Mileage Calculator",
      description: "Calculate your vehicle's exact fuel efficiency and mileage.",
      inputFormat: "none",
      outputFormat: "none",
      isInteractive: true,
      acceptedTypes: {}
    },
    "inches-to-centimeters": {
      title: "Inches to Centimeters",
      description: "Convert Inches to Centimeters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "inches-to-millimeters": {
      title: "Inches to Millimeters",
      description: "Convert Inches to Millimeters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "inches-to-feet": {
      title: "Inches to Feet",
      description: "Convert Inches to Feet instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "feet-to-meters": {
      title: "Feet to Meters",
      description: "Convert Feet to Meters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "feet-to-yards": {
      title: "Feet to Yards",
      description: "Convert Feet to Yards instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "feet-to-inches": {
      title: "Feet to Inches",
      description: "Convert Feet to Inches instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "miles-to-kilometers": {
      title: "Miles to Kilometers",
      description: "Convert Miles to Kilometers instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "miles-to-nautical-miles": {
      title: "Miles to Nautical Miles",
      description: "Convert Miles to Nautical Miles instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "yards-to-meters": {
      title: "Yards to Meters",
      description: "Convert Yards to Meters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "meters-to-kilometers": {
      title: "Meters to Kilometers",
      description: "Convert Meters to Kilometers instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "centimeters-to-millimeters": {
      title: "Centimeters to Millimeters",
      description: "Convert Centimeters to Millimeters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "millimeters-to-inches": {
      title: "Millimeters to Inches",
      description: "Convert Millimeters to Inches instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "micrometers-to-millimeters": {
      title: "Micrometers to Millimeters",
      description: "Convert Micrometers to Millimeters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "nanometers-to-micrometers": {
      title: "Nanometers to Micrometers",
      description: "Convert Nanometers to Micrometers instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "light-years-to-parsecs": {
      title: "Light Years to Parsecs",
      description: "Convert Light Years to Parsecs instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "nautical-miles-to-miles": {
      title: "Nautical Miles to Miles",
      description: "Convert Nautical Miles to Miles instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "furlongs-to-miles": {
      title: "Furlongs to Miles",
      description: "Convert Furlongs to Miles instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "chains-to-meters": {
      title: "Chains to Meters",
      description: "Convert Chains to Meters instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "rods-to-yards": {
      title: "Rods to Yards",
      description: "Convert Rods to Yards instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    },
    "leagues-to-miles": {
      title: "Leagues to Miles",
      description: "Convert Leagues to Miles instantly with our free length converter.",
      inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "length", acceptedTypes: {}
    }
  },
  "fonts": {
    "unicode-to-krutidev": { title: "Unicode (Mangal) to Kruti Dev Converter", description: "Convert standard Unicode Hindi text (Mangal font) to legacy Kruti Dev 010 font format for typing tests, PageMaker, and printing.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "krutidev-to-unicode": { title: "Kruti Dev to Unicode / Mangal Font Converter", description: "Convert legacy Kruti Dev 010 font text to standard Unicode (Mangal font) Hindi instantly for government exams, CPCT, WhatsApp, and Word.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-devlys": { title: "Unicode to DevLys", description: "Convert Unicode Hindi text to DevLys font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "devlys-to-unicode": { title: "DevLys to Unicode", description: "Convert DevLys font to Unicode Hindi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-chanakya": { title: "Unicode to Chanakya", description: "Convert Unicode Hindi text to Chanakya font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "chanakya-to-unicode": { title: "Chanakya to Unicode", description: "Convert Chanakya font to Unicode Hindi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-shusha": { title: "Unicode to Shusha", description: "Convert Unicode Hindi text to Shusha font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "shusha-to-unicode": { title: "Shusha to Unicode", description: "Convert Shusha font to Unicode Hindi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-aps": { title: "Unicode to APS", description: "Convert Unicode Hindi text to APS font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "aps-to-unicode": { title: "APS to Unicode", description: "Convert APS font to Unicode Hindi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "unicode-to-shreelipi": { title: "Unicode to Shree Lipi", description: "Convert Unicode Hindi text to Shree Lipi font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    "shreelipi-to-unicode": { title: "Shree Lipi to Unicode", description: "Convert Shree Lipi font to Unicode Hindi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "hindi", acceptedTypes: {} },
    
    "unicode-to-anmollipi": { title: "Unicode to AnmolLipi", description: "Convert Unicode Punjabi text to AnmolLipi font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "anmollipi-to-unicode": { title: "AnmolLipi to Unicode", description: "Convert AnmolLipi font to Unicode Punjabi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-asees": { title: "Unicode to Asees", description: "Convert Unicode Punjabi text to Asees font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "asees-to-unicode": { title: "Asees to Unicode", description: "Convert Asees font to Unicode Punjabi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-joy": { title: "Unicode to Joy", description: "Convert Unicode Punjabi text to Joy font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "joy-to-unicode": { title: "Joy to Unicode", description: "Convert Joy font to Unicode Punjabi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-satluj": { title: "Unicode to Satluj", description: "Convert Unicode Punjabi text to Satluj font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "satluj-to-unicode": { title: "Satluj to Unicode", description: "Convert Satluj font to Unicode Punjabi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-gurbani-akhar": { title: "Unicode to Gurbani Akhar", description: "Convert Unicode Punjabi text to Gurbani Akhar font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "gurbani-akhar-to-unicode": { title: "Gurbani Akhar to Unicode", description: "Convert Gurbani Akhar font to Unicode Punjabi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "unicode-to-raavi": { title: "Unicode to Raavi", description: "Convert Unicode Punjabi text to Raavi font.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "raavi-to-unicode": { title: "Raavi to Unicode", description: "Convert Raavi font to Unicode Punjabi text.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "gurmukhi-to-shahmukhi": { title: "Gurmukhi to Shahmukhi", description: "Convert Gurmukhi script to Shahmukhi script.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },
    "shahmukhi-to-gurmukhi": { title: "Shahmukhi to Gurmukhi", description: "Convert Shahmukhi script to Gurmukhi script.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "punjabi", acceptedTypes: {} },

    // NEPALI FONT CONVERTERS
    "preeti-to-unicode": { title: "Preeti to Unicode Converter", description: "Convert Nepali Preeti legacy font text to standard universal Unicode instantly.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "nepali", acceptedTypes: {} },
    "unicode-to-preeti": { title: "Unicode to Preeti Converter", description: "Convert standard Nepali Unicode text to traditional Preeti font format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "nepali", acceptedTypes: {} },

    // BENGALI FONT CONVERTERS (BIJOY / SUTONNYMJ)
    "bijoy-to-unicode": { title: "Bijoy to Unicode Converter (SutonnyMJ)", description: "Convert legacy Bijoy SutonnyMJ Bengali text to standard Unicode instantly.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "bengali", acceptedTypes: {} },
    "unicode-to-bijoy": { title: "Unicode to Bijoy Converter (SutonnyMJ)", description: "Convert Unicode Bengali text to legacy Bijoy SutonnyMJ format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "bengali", acceptedTypes: {} },

    // URDU FONT CONVERTERS (INPAGE & URDU UNICODE)
    "inpage-to-unicode": { title: "InPage to Urdu Unicode Converter", description: "Convert Pakistani Urdu InPage (.inp/ASCII) text to standard universal Urdu Unicode instantly.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "urdu", acceptedTypes: {} },
    "unicode-to-inpage": { title: "Urdu Unicode to InPage Converter", description: "Convert standard Urdu Unicode text to InPage editor format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "urdu", acceptedTypes: {} },

    // BURMESE FONT CONVERTERS (ZAWGYI)
    "zawgyi-to-unicode": { title: "Zawgyi to Unicode Converter", description: "Convert legacy Myanmar Zawgyi font text to international standard Myanmar Unicode.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "burmese", acceptedTypes: {} },
    "unicode-to-zawgyi": { title: "Unicode to Zawgyi Converter", description: "Convert standard Myanmar Unicode text to legacy Zawgyi font format.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "font", fontCategory: "burmese", acceptedTypes: {} },

    "font-detector": { 
      title: "Online Font Detector - Kruti Dev, AnmolLipi & Unicode Identifier", 
      description: "Free online font detector to instantly identify Hindi (Kruti Dev, DevLys, Chanakya) and Punjabi (AnmolLipi, Asees) legacy fonts vs Unicode text with 1-click conversion.", 
      inputFormat: "none", 
      outputFormat: "none", 
      isInteractive: true, 
      converterType: "font-detector", 
      acceptedTypes: {} 
    },
    "unicode-normalizer": { title: "Unicode Normalizer", description: "Normalize Unicode text to its standard composed form (NFC).", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "unicode-tools", toolType: "normalizer", acceptedTypes: {} },
    "remove-hidden-characters": { title: "Remove Hidden Characters", description: "Strip out invisible Unicode characters like ZWJ, ZWNJ, and BOM.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "unicode-tools", toolType: "hidden-chars", acceptedTypes: {} },
    "fix-copy-paste-text": { title: "Fix Copy/Paste Text", description: "Fix broken line breaks and garbled characters from bad PDF copies.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "unicode-tools", toolType: "fix-copy-paste", acceptedTypes: {} },
    "unicode-text-cleaner": { title: "Unicode Text Cleaner", description: "Remove extra whitespace, zero-width spaces, and unwanted formatting.", inputFormat: "none", outputFormat: "none", isInteractive: true, converterType: "unicode-tools", toolType: "cleaner", acceptedTypes: {} },
  },

  "developer": {
    "jwt-decoder": {
      title: "JWT Decoder Online (JSON Web Token)",
      description: "Safely decode JWT tokens offline in your browser. View algorithm, headers, payload claims, and expiration dates with zero server transmission.",
      subCategory: "Tokens & Security",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Decode JWT",
      isInteractive: true,
      acceptedTypes: {}
    },
    "json-formatter": {
      title: "JSON Formatter & Validator",
      description: "Prettify, format, validate, minify, and auto-repair broken JSON syntax with real-time error detection and 1-click copy.",
      subCategory: "Data Formatting",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Format JSON",
      isInteractive: true,
      acceptedTypes: {}
    },
    "json-to-csv": {
      title: "JSON to CSV Converter",
      description: "Convert JSON arrays and files to CSV format in your browser with live tabular data preview and custom delimiter settings.",
      subCategory: "Data Conversion",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Convert to CSV",
      isInteractive: true,
      acceptedTypes: {}
    },
    "csv-to-json": {
      title: "CSV to JSON Converter",
      description: "Convert CSV spreadsheets and text into structured JSON arrays and objects instantly on your device with 100% privacy.",
      subCategory: "Data Conversion",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Convert to JSON",
      isInteractive: true,
      acceptedTypes: {}
    },
    "base64-encoder-decoder": {
      title: "Base64 Encoder & Decoder",
      description: "Encode text and files (images, audio, PDF) to Base64 Data URLs, or decode Base64 strings back to readable text and downloadable files.",
      subCategory: "Encoding & Data",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Base64 Convert",
      isInteractive: true,
      acceptedTypes: {}
    },
    "unix-timestamp-converter": {
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
      title: "UUID Generator & Validator (v4 GUID)",
      description: "Generate bulk RFC 4122 v4 UUIDs / GUIDs instantly in your browser with uppercase, hyphens, and braces options, plus UUID syntax validator.",
      subCategory: "Identifiers & Keys",
      inputFormat: "none",
      outputFormat: "none",
      actionName: "Generate UUID",
      isInteractive: true,
      acceptedTypes: {}
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
  "unicode-to-kruti-dev-010": "unicode-to-krutidev",
  "unicode-to-kruti-dev": "unicode-to-krutidev",
  "mangal-to-krutidev": "unicode-to-krutidev",
  "mangal-to-kruti-dev": "unicode-to-krutidev",
  "mangal-to-kruti-dev-010": "unicode-to-krutidev",
  "sutonnymj-to-unicode": "bijoy-to-unicode",
  "unicode-to-sutonnymj": "unicode-to-bijoy",
  "inpage-to-urdu-unicode": "inpage-to-unicode",
  "inpage-urdu-to-unicode": "inpage-to-unicode",
  "urdu-unicode-to-inpage": "unicode-to-inpage",

  // Image & Utility Aliases
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

  // PDF & Office Document Aliases
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
        tool: (categoryTools as any)[targetSlug]
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
