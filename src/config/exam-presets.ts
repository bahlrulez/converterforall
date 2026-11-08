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
    name: "Staff Selection Commission (SSC)",
    shortName: "SSC (CGL, CHSL, MTS, GD)",
    category: "central",
    description: "Standard specifications for SSC CGL, CHSL, MTS, Stenographer, and GD Constable online portals.",
    photo: {
      minKB: 20,
      maxKB: 50,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "3.5 cm × 4.5 cm (approx 200 × 250 px)",
      minWidthPx: 200,
      format: "jpeg",
      background: "light",
      rules: [
        "File size strictly between 20 KB and 50 KB",
        "Dimensions: 3.5 cm width × 4.5 cm height",
        "Plain white or light-coloured background",
        "Both ears must be clearly visible, no caps or dark glasses"
      ]
    },
    signature: {
      minKB: 10,
      maxKB: 20,
      aspect: 140 / 60, // 2.33:1 (4.0cm x 2.0cm approx)
      dimensionsLabel: "140 × 60 px (approx 4.0 cm × 2.0 cm)",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size strictly between 10 KB and 20 KB",
        "Dimensions: approx 140 width × 60 height px (horizontal)",
        "Must be signed on white paper with black/dark ink",
        "Signatures in capital letters are strictly rejected"
      ]
    }
  },
  upsc: {
    id: "upsc",
    name: "Union Public Service Commission (UPSC)",
    shortName: "UPSC (Civil Services, NDA, CDS)",
    category: "central",
    description: "Specifications for UPSC Civil Services (IAS/IPS), NDA, CDS, and Central Engineering examinations.",
    photo: {
      minKB: 20,
      maxKB: 300,
      aspect: 1.0, // UPSC OTR mandates 1:1 square
      dimensionsLabel: "350 × 350 to 1000 × 1000 px (1:1 Square)",
      minWidthPx: 350,
      format: "jpeg",
      background: "white",
      rules: [
        "File size strictly between 20 KB and 300 KB",
        "Aspect ratio 1:1 (min 350 × 350 px, max 1000 × 1000 px)",
        "White background with 3/4th face visibility",
        "UPSC requires candidate name & date of photo at the bottom"
      ]
    },
    signature: {
      minKB: 20,
      maxKB: 300,
      aspect: 1.0,
      dimensionsLabel: "350 × 350 to 1000 × 1000 px (1:1 Square)",
      minWidthPx: 350,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size strictly between 20 KB and 300 KB",
        "Aspect ratio 1:1 square canvas",
        "Clear black ink signature on spotless white background",
        "Do not upload blurred or pixelated scans"
      ]
    }
  },
  ibps: {
    id: "ibps",
    name: "Banking (IBPS, SBI PO & Clerk, RRB)",
    shortName: "IBPS / SBI (PO, Clerk, SO)",
    category: "banking",
    description: "Standard parameters required across SBI, IBPS, RBI, and regional rural bank portals.",
    photo: {
      minKB: 20,
      maxKB: 50,
      aspect: 200 / 230, // approx 4.5cm x 3.5cm
      dimensionsLabel: "200 × 230 px (approx 4.5 cm × 3.5 cm)",
      minWidthPx: 200,
      format: "jpeg",
      background: "white",
      rules: [
        "File size between 20 KB and 50 KB",
        "Dimensions: 200 × 230 pixels",
        "White background with natural face expression",
        "Red-eye reflections must be removed"
      ]
    },
    signature: {
      minKB: 10,
      maxKB: 20,
      aspect: 140 / 60,
      dimensionsLabel: "140 × 60 px (approx 3.5 cm × 1.5 cm)",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size between 10 KB and 20 KB",
        "Dimensions: 140 × 60 pixels",
        "Must be signed with black ink on white paper",
        "Capital letter signatures are not accepted"
      ]
    }
  },
  state_police: {
    id: "state_police",
    name: "State Police & PSC (UP, Bihar, Punjab, Raj, MP)",
    shortName: "State Police & PSC",
    category: "state",
    description: "Common requirements for UP Police, Bihar BPSC/BSSC, MP ESB, Rajasthan RSMSSB, and Punjab PSSSB.",
    photo: {
      minKB: 20,
      maxKB: 50,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "3.5 cm × 4.5 cm (20–50 KB)",
      minWidthPx: 200,
      format: "jpeg",
      background: "light",
      rules: [
        "File size strictly between 20 KB and 50 KB (some states allow up to 100 KB)",
        "Dimensions: 3.5 cm × 4.5 cm passport ratio",
        "Plain light grey or white background",
        "Clear facial visibility with neutral look"
      ]
    },
    signature: {
      minKB: 10,
      maxKB: 20,
      aspect: 140 / 60,
      dimensionsLabel: "140 × 60 px (10–20 KB)",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size strictly between 10 KB and 20 KB",
        "Dimensions: approx 3.5 cm width × 1.5 cm height",
        "High contrast signature on white paper"
      ]
    }
  },
  rrb: {
    id: "rrb",
    name: "Railway Recruitment Boards (RRB)",
    shortName: "Railway RRB (ALP, NTPC, Group D)",
    category: "railway",
    description: "Prescribed specifications for RRB Assistant Loco Pilot, Technician, NTPC, and Group D applications.",
    photo: {
      minKB: 30,
      maxKB: 70,
      aspect: 35 / 45,
      dimensionsLabel: "35 mm × 45 mm (30–70 KB)",
      minWidthPx: 220,
      format: "jpeg",
      background: "white",
      rules: [
        "File size between 30 KB and 70 KB",
        "Dimensions: 35 mm × 45 mm colour passport photo",
        "Clear white background without shadows",
        "Must be taken within the last 6 months"
      ]
    },
    signature: {
      minKB: 30,
      maxKB: 70,
      aspect: 50 / 20, // 2.5:1
      dimensionsLabel: "50 mm × 20 mm (30–70 KB)",
      minWidthPx: 160,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size strictly between 30 KB and 70 KB",
        "Dimensions: 50 mm × 20 mm running handwriting",
        "Signed in black ink on white paper",
        "Signatures in block/capital letters will lead to rejection"
      ]
    }
  },
  nta: {
    id: "nta",
    name: "National Testing Agency (NEET, JEE Main, CUET)",
    shortName: "NTA (NEET, JEE, CUET)",
    category: "academic",
    description: "Guidelines for NTA portals including NEET UG, JEE Main, and CUET registrations.",
    photo: {
      minKB: 10,
      maxKB: 200,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "Passport Size (10–200 KB)",
      minWidthPx: 240,
      format: "jpeg",
      background: "white",
      rules: [
        "File size between 10 KB and 200 KB",
        "80% face coverage showing ears clearly against white background",
        "Spectacles are permitted only if used regularly (no tint or glare)",
        "Polaroid and computer-generated photos are not accepted"
      ]
    },
    signature: {
      minKB: 4,
      maxKB: 30,
      aspect: 140 / 60,
      dimensionsLabel: "140 × 60 px (4–30 KB)",
      minWidthPx: 140,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size strictly between 4 KB and 30 KB",
        "Signed on white paper with black ballpoint pen",
        "Clear scan without background shadows"
      ]
    }
  },
  gate: {
    id: "gate",
    name: "GATE & IIT Admissions",
    shortName: "GATE / IIT",
    category: "academic",
    description: "Photo and signature upload specs for Graduate Aptitude Test in Engineering (GATE).",
    photo: {
      minKB: 20,
      maxKB: 200,
      aspect: 3.5 / 4.5,
      dimensionsLabel: "3.5 cm × 4.5 cm (20–200 KB)",
      minWidthPx: 240,
      format: "jpeg",
      background: "white",
      rules: [
        "File size between 20 KB and 200 KB",
        "Aspect ratio 3.5 cm width × 4.5 cm height",
        "White or very light background",
        "Face must occupy 60% to 70% of the image"
      ]
    },
    signature: {
      minKB: 10,
      maxKB: 200,
      aspect: 7 / 2, // 3.5:1
      dimensionsLabel: "7.0 cm × 2.0 cm (10–200 KB)",
      minWidthPx: 200,
      format: "jpeg",
      inkColor: "black",
      rules: [
        "File size between 10 KB and 200 KB",
        "Dimensions: 7.0 cm width × 2.0 cm height (horizontal strip)",
        "Signed with dark blue or black ink"
      ]
    }
  }
};

export const PDF_DOCUMENT_PRESETS = [
  {
    id: "100",
    name: "Under 100 KB (Strict)",
    targetKb: 100,
    internalCeilingKb: 85,
    tag: "Most Popular",
    suitableFor: "SSC CGL/CHSL Marksheets, State Police & PSC Certificates, Domicile/Caste Forms",
    description: "Aggressive multi-pass downscaling tuned to guarantee your document stays safely below the rigid 100 KB upload ceiling without failing portal verification."
  },
  {
    id: "200",
    name: "Under 200 KB",
    targetKb: 200,
    internalCeilingKb: 175,
    tag: "UPSC & Central",
    suitableFor: "UPSC Civil Services Degrees, Central Govt ID Proofs, SSC Experience Certificates",
    description: "Optimal balance of document clarity and compressed file size, keeping standard single or double-page documents safely below 200 KB."
  },
  {
    id: "300",
    name: "Under 300 KB",
    targetKb: 300,
    internalCeilingKb: 275,
    tag: "State Portals",
    suitableFor: "State Subordinate Services, University Admission Portals, Detailed Marksheets",
    description: "Ideal for 2 to 4-page certificates and semester transcripts that need crisp text while meeting state portal file size caps."
  },
  {
    id: "500",
    name: "Under 500 KB",
    targetKb: 500,
    internalCeilingKb: 470,
    tag: "Multi-Page",
    suitableFor: "NTA Registration Portals, Complete Degree Certificates, Multi-Page Scans",
    description: "Designed for multi-page educational dossiers and detailed application attachments."
  }
];

