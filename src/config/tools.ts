export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  path: string;
  category: 'sarkari' | 'typography';
}

export const TOOLS: Record<string, ToolConfig> = {
  // Sarkari Exam Suite
  'exam-photo-resizer': {
    id: 'exam-photo-resizer',
    name: 'Exam Photo Resizer',
    description: 'Resize passport photo to exact dimensions and KB size for exam portals.',
    path: '/exam-photo-resizer',
    category: 'sarkari',
  },
  'photo-name-date-stamper': {
    id: 'photo-name-date-stamper',
    name: 'Photo Name & Date Stamper',
    description: 'Add name and date on passport photos for SSC, IBPS, and Railway forms.',
    path: '/photo-name-date-stamper',
    category: 'sarkari',
  },
  'exam-signature-resizer': {
    id: 'exam-signature-resizer',
    name: 'Exam Signature Resizer',
    description: 'Compress and resize official signatures to under 20KB/50KB.',
    path: '/exam-signature-resizer',
    category: 'sarkari',
  },
  'compress-pdf-100kb': {
    id: 'compress-pdf-100kb',
    name: 'Compress PDF to 100KB',
    description: 'Compress official certificates and PDFs without quality loss.',
    path: '/compress-pdf-100kb',
    category: 'sarkari',
  },
  'image-dpi-converter': {
    id: 'image-dpi-converter',
    name: 'Image DPI Converter',
    description: 'Change image DPI to 200 DPI or 300 DPI instantly for Sarkari exam photos and documents.',
    path: '/image-dpi-converter',
    category: 'sarkari',
  },

  // Indian Typography Suite
  'asees-to-unicode': {
    id: 'asees-to-unicode',
    name: 'Asees to Unicode Converter',
    description: 'Convert legacy Asees Punjabi text into standard Unicode (Raavi) font.',
    path: '/asees-to-unicode',
    category: 'typography',
  },
  'krutidev-to-unicode': {
    id: 'krutidev-to-unicode',
    name: 'Kruti Dev to Unicode Converter',
    description: 'Convert Kruti Dev Hindi text to Unicode Mangal font accurately.',
    path: '/krutidev-to-unicode',
    category: 'typography',
  },
  'chanakya-to-unicode': {
    id: 'chanakya-to-unicode',
    name: 'Chanakya to Unicode Converter',
    description: 'Convert Chanakya layout Hindi text into standard Unicode.',
    path: '/chanakya-to-unicode',
    category: 'typography',
  },
  'font-text-fixer': {
    id: 'font-text-fixer',
    name: 'Font & Text Fixer',
    description: 'Fix broken Punjabi and Hindi glyphs, matras, and formatting issues.',
    path: '/font-text-fixer',
    category: 'typography',
  },
  'webp-to-jpg': {
    id: 'webp-to-jpg',
    name: 'WEBP to JPG / PNG Converter',
    description: 'Convert WEBP images to JPG or PNG format instantly in your browser with adjustable compression quality.',
    path: '/webp-to-jpg',
    category: 'sarkari',
  },
};
