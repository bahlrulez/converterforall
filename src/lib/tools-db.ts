export const toolsDatabase = {
  "image": {
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
  }
};
