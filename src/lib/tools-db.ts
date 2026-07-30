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
      acceptedTypes: { "image/heic": [".heic"] } // Note: sharp might need libvips with heif support for this to work perfectly, but we'll list it.
    }
  }
};
