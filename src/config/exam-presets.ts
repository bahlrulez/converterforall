export interface ExamPresetSpec {
  id: string;
  name: string;
  shortName: string;
  category: "central" | "banking" | "state" | "railway" | "academic";
  description: string;
  photo: {
    minKB: number;
    maxKB: number;
    aspect: number; // width / height
    dimensionsLabel: string;
    targetWidthPx?: number;
    targetHeightPx?: number;
    minWidthPx: number;
    format: "jpeg" | "jpg" | "png";
    background: "white" | "light" | "any";
    rules: string[];
  };
  signature: {
    minKB: number;
    maxKB: number;
    aspect: number; // width / height
    dimensionsLabel: string;
    targetWidthPx?: number;
    targetHeightPx?: number;
    minWidthPx: number;
    format: "jpeg" | "jpg" | "png";
    inkColor: "black" | "blue" | "either";
    rules: string[];
  };
}

export const EXAM_PRESETS: Record<string, ExamPresetSpec> = {
  ssc: {
    id: "ssc",
    name: "SSC-style starting point (not official)",
    shortName: "SSC-style starting point",
    category: "central",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 20,
      maxKB: 50,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 200,
      format: "jpeg",
      background: "light",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 10,
      maxKB: 20,
      aspect: 140 / 60, // 2.33:1 (4.0cm x 2.0cm approx)
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  },
  upsc: {
    id: "upsc",
    name: "UPSC-style starting point (not official)",
    shortName: "UPSC-style starting point",
    category: "central",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 20,
      maxKB: 300,
      aspect: 1.0, // UPSC OTR mandates 1:1 square
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 350,
      format: "jpeg",
      background: "white",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 20,
      maxKB: 300,
      aspect: 1.0,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 350,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  },
  ibps: {
    id: "ibps",
    name: "Banking-style starting point (not official)",
    shortName: "IBPS / SBI-style starting point",
    category: "banking",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 20,
      maxKB: 50,
      aspect: 200 / 230, // approx 4.5cm x 3.5cm
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 200,
      format: "jpeg",
      background: "white",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 10,
      maxKB: 20,
      aspect: 140 / 60,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  },
  state_police: {
    id: "state_police",
    name: "State Police / PSC-style starting point (not official)",
    shortName: "State Police / PSC-style starting point",
    category: "state",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 20,
      maxKB: 50,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 200,
      format: "jpeg",
      background: "light",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 10,
      maxKB: 20,
      aspect: 140 / 60,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  },
  rrb: {
    id: "rrb",
    name: "RRB-style starting point (not official)",
    shortName: "RRB-style starting point",
    category: "railway",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 30,
      maxKB: 70,
      aspect: 35 / 45,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 220,
      format: "jpeg",
      background: "white",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 30,
      maxKB: 70,
      aspect: 50 / 20, // 2.5:1
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 160,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  },
  nta: {
    id: "nta",
    name: "NTA-style starting point (not official)",
    shortName: "NTA-style starting point",
    category: "academic",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 10,
      maxKB: 200,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 240,
      format: "jpeg",
      background: "white",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 4,
      maxKB: 30,
      aspect: 140 / 60,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  },
  gate: {
    id: "gate",
    name: "GATE-style starting point (not official)",
    shortName: "GATE-style starting point",
    category: "academic",
    description: "Stored crop-ratio and file-size starting values. They are not live or verified portal requirements.",
    photo: {
      minKB: 20,
      maxKB: 200,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 240,
      format: "jpeg",
      background: "white",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check live capture, face position, background, identity or portal acceptance"]
    },
    signature: {
      minKB: 10,
      maxKB: 200,
      aspect: 7 / 2, // 3.5:1
      dimensionsLabel: "Crop ratio and minimum width only; no fixed output dimensions.",
      minWidthPx: 200,
      format: "jpeg",
      inkColor: "black",
      rules: ["Applies this preset's crop ratio and minimum crop width only.", "Attempts the stored file-size range; the exported image may remain outside it.", "Does not check ink colour, handwriting, signature count, identity or portal acceptance"]
    }
  }
};

export const PDF_DOCUMENT_PRESETS = [
  {
    id: "100",
    name: "100 KB target",
    targetKb: 100,
    internalCeilingKb: 85,
    tag: "Small-size target",
    suitableFor: "Try when the receiving form specifies a 100 KB maximum.",
    description: "Attempts a small output size by reducing page-image resolution and JPEG quality. The result may remain above the target or become harder to read."
  },
  {
    id: "200",
    name: "200 KB target",
    targetKb: 200,
    internalCeilingKb: 175,
    tag: "Medium-size target",
    suitableFor: "Try when the receiving form specifies a 200 KB maximum.",
    description: "A larger size target may retain more detail than a smaller one, but final size and legibility depend on the source PDF and page count."
  },
  {
    id: "300",
    name: "300 KB target",
    targetKb: 300,
    internalCeilingKb: 275,
    tag: "Larger-file target",
    suitableFor: "Try when the receiving form specifies a 300 KB maximum.",
    description: "The compressor still rasterizes pages. Fine text and line detail can be lost as the tool reduces image size or quality."
  },
  {
    id: "500",
    name: "500 KB target",
    targetKb: 500,
    internalCeilingKb: 470,
    tag: "Larger target",
    suitableFor: "Try when the receiving form specifies a 500 KB maximum.",
    description: "A larger target can allow more image detail, but does not guarantee legibility or portal acceptance."
  }
];

