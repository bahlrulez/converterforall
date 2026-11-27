import { imageToolsContent } from "./content/image-tools";
import { pdfOrganizeContent } from "./content/pdf-organize";
import { pdfOptimizeContent } from "./content/pdf-optimize";
import { pdfConvertContent } from "./content/pdf-convert";
import { videoToolsContent } from "./content/video-tools";
import { utilitiesToolsContent } from "./content/utilities-tools";
import { fontToolsContent } from "./content/font-tools";
import { audioToolsContent } from "./content/audio-tools";
import { lengthToolsContent } from "./content/length-tools";
import { automotiveToolsContent } from "./content/automotive-tools";
import { devTextToolsContent } from "./content/dev-text-tools";
import { devSerializationToolsContent } from "./content/dev-serialization-tools";
import { examToolsContent } from "./content/exam-tools";


export const toolContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  ...imageToolsContent,
  ...pdfOrganizeContent,
  ...pdfOptimizeContent,
  ...pdfConvertContent,
  ...videoToolsContent,
  ...utilitiesToolsContent,
  ...fontToolsContent,
  ...audioToolsContent,
  ...lengthToolsContent,
  ...automotiveToolsContent,
  ...devTextToolsContent,
  ...devSerializationToolsContent,
  ...examToolsContent,
};

// Helper for length conversion factors to base (meters) to generate accurate tables
const lengthFactors: Record<string, number> = {
  'Inches': 0.0254,
  'Feet': 0.3048,
  'Yards': 0.9144,
  'Miles': 1609.344,
  'Millimeters': 0.001,
  'Centimeters': 0.01,
  'Meters': 1,
  'Kilometers': 1000,
  'Nautical miles': 1852,
  'Nanometers': 0.000000001,
  'Micrometers': 0.000001,
  'Leagues': 4828.032,
  'Light years': 9460730472580800,
  'Parsecs': 30856775814913670
};


function enrichContentIfShort(
  sections: { title: string; content: string }[],
  toolSlug: string,
  toolTitle: string
): { title: string; content: string }[] {
  const totalWords = sections
    .map((s) => (s.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);

  if (totalWords >= 300) {
    return sections;
  }

  const enriched = [...sections];

  // Specific classification sets to avoid ambiguous substring matching
  const FONT_TEXT_TOOL_SLUGS = new Set([
    "unicode-to-krutidev",
    "krutidev-to-unicode",
    "unicode-to-chanakya",
    "chanakya-to-unicode",
    "unicode-to-anmollipi",
    "anmollipi-to-unicode",
    "unicode-to-asees",
    "asees-to-unicode",
    "unicode-to-joy",
    "joy-to-unicode",
    "unicode-to-satluj",
    "satluj-to-unicode",
    "gurbani-akhar-to-unicode",
    "unicode-to-raavi",
    "preeti-to-unicode",
    "unicode-to-preeti",
    "bijoy-to-unicode",
    "unicode-to-bijoy",
    "inpage-to-unicode",
    "unicode-to-inpage",
    "zawgyi-to-unicode",
    "unicode-to-zawgyi",
    "font-detector",
    "font-text-fixer",
    "unicode-normalizer",
    "remove-hidden-characters",
    "fix-copy-paste-text",
    "unicode-text-cleaner",
    "raavi-to-asees",
    "sutonnymj-to-unicode",
    "unicode-to-sutonnymj"
  ]);

  const WEB_FONT_FILE_SLUGS = new Set([
    "web-font-converter",
    "ttf-to-woff2",
    "otf-to-woff2",
    "woff2-to-ttf"
  ]);

  const IMAGE_TO_PDF_SLUGS = new Set([
    "png-to-pdf",
    "jpg-to-pdf",
    "scan-to-pdf"
  ]);

  const PDF_PAGE_MANAGEMENT_SLUGS = new Set([
    "remove-pages",
    "extract-pages",
    "organize-pdf",
    "rotate-pdf",
    "split-pdf",
    "merge-pdf"
  ]);

  const OFFICE_DOCUMENT_SLUGS = new Set([
    "word-to-pdf",
    "powerpoint-to-pdf",
    "excel-to-pdf",
    "pdf-to-word",
    "html-to-pdf"
  ]);

  const PDF_TO_IMAGE_SLUGS = new Set([
    "pdf-to-jpg",
    "pdf-to-png"
  ]);

  const isUrduInPage = toolSlug === "unicode-to-inpage" || toolSlug === "inpage-to-unicode";

  const isFontTextTool =
    !isUrduInPage &&
    (FONT_TEXT_TOOL_SLUGS.has(toolSlug) ||
      toolSlug.includes("kruti") ||
      toolSlug.includes("preeti") ||
      toolSlug.includes("bijoy") ||
      toolSlug.includes("zawgyi") ||
      toolSlug.includes("anmol") ||
      toolSlug.includes("asees") ||
      toolSlug.includes("satluj") ||
      toolSlug.includes("chanakya") ||
      toolSlug.includes("mangal") ||
      (toolSlug.includes("unicode") && !toolSlug.includes("pdf")));

  const isWebFontFile =
    WEB_FONT_FILE_SLUGS.has(toolSlug) ||
    (!isFontTextTool && !isUrduInPage && (toolSlug.includes("woff") || toolSlug.includes("ttf") || toolSlug.includes("otf")));

  const isImageToPdf = IMAGE_TO_PDF_SLUGS.has(toolSlug);
  const isPdfPageManagement = PDF_PAGE_MANAGEMENT_SLUGS.has(toolSlug);
  const isOfficeDoc = OFFICE_DOCUMENT_SLUGS.has(toolSlug);
  const isPdfToImage = PDF_TO_IMAGE_SLUGS.has(toolSlug);
  const isGeneralPdf = !isFontTextTool && !isUrduInPage && !isWebFontFile && !isImageToPdf && !isPdfPageManagement && !isOfficeDoc && !isPdfToImage && toolSlug.includes("pdf");

  // Prevent duplicate step-by-step guides when an authored guide already exists
  const hasAuthoredGuide = sections.some((s) =>
    /step|guide|how to use|how it works|instruction/i.test(s.title)
  );

  if (totalWords < 200 && !hasAuthoredGuide) {
    if (isUrduInPage || isFontTextTool) {
      enriched.push({
        title: "Step-by-step usage guide",
        content: `
          <ol>
            <li><strong>Paste your source text:</strong> Paste or type your text into the input editor.</li>
            <li><strong>Browser conversion:</strong> Characters map inside your browser memory without uploading text to a server.</li>
            <li><strong>Copy your result:</strong> Click copy to paste the converted text into your target software or document.</li>
          </ol>
        `
      });
    } else {
      enriched.push({
        title: "Step-by-step usage guide",
        content: `
          <ol>
            <li><strong>Select your file:</strong> Drag your file into the upload zone or choose it from your device.</li>
            <li><strong>Browser processing:</strong> Most of our tools run directly inside your browser using local memory.</li>
            <li><strong>Download your result:</strong> Save your finalized file straight to your device with 1 click.</li>
          </ol>
        `
      });
    }
  }

  let extraFaq = "";
  let tipsTitle = "Tips for best results";
  let tipsContent = "";

  if (isUrduInPage) {
    tipsTitle = "Urdu Unicode and InPage compatibility notes";
    tipsContent = `
      <p>Important considerations when moving Urdu text between modern applications and InPage desktop software:</p>
      <ul>
        <li><strong>InPage Phonetic Layout Compatibility:</strong> The converter translates standard Urdu Unicode into keystroke-accurate phonetic sequences matching the built-in InPage Phonetic keyboard layout (InPage 2.40 and 3.x).</li>
        <li><strong>Full Urdu Alphabet Support:</strong> Correctly maps Urdu letters including Alif Madda (آ), Bay (ب), Pay (پ), Te (ت), Tte (ٹ), Che (چ), Daal (د), Ddaal (ڈ), Ray (ر), Rray (ڑ), Seen (س), Sheen (ش), Gaaf (گ), Noon Ghunna (ں), Gol Heh (ہ), Do-chashmi He (ھ), Choti Yeh (ی), and Badi Yeh (ے).</li>
        <li><strong>Hamza &amp; Aerab Handling:</strong> Preserves standalone Hamza (ء), Yeh with Hamza (ئ), Waw with Hamza (ؤ), Heh Goal with Hamza (ۂ), as well as Zabar, Zer, Pesh, Khari Zabar, and Tashdeed diacritics.</li>
        <li><strong>Punctuation &amp; Links:</strong> Correctly converts Urdu Khatma (۔), Urdu commas (،), and question marks (؟), while automatically isolating and protecting web URLs, email addresses, and numbers from corruption.</li>
        <li><strong>In-Browser Processing:</strong> All text conversion runs in your browser memory rather than sending pasted drafts to remote servers.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Why does Unicode Urdu turn into random characters or question marks in InPage?</strong><br>A: Traditional InPage desktop releases use proprietary non-Unicode font encoding tables. Pasting standard Unicode creates character code mismatches. This converter maps modern Unicode characters to InPage's expected character codes so text renders cleanly in InPage text frames.</p>
      <p><strong>Q: Does this converter preserve web URLs and numbers?</strong><br>A: Yes. URLs, email addresses, and decimal numbers are recognized and preserved untouched without character corruption.</p>
    `;
  } else if (isFontTextTool) {
    const isHindiFont =
      toolSlug.includes("kruti") ||
      toolSlug.includes("devlys") ||
      toolSlug.includes("chanakya") ||
      toolSlug.includes("mangal");

    if (isHindiFont) {
      tipsTitle = "Hindi typing & font conversion recommendations";
      tipsContent = `
        <p>Practical advice when converting legacy Hindi typing fonts to standard Unicode:</p>
        <ul>
          <li><strong>Verify in Word or Docs:</strong> After converting legacy text (such as Kruti Dev or DevLys) to standard Unicode, paste it into MS Word or Google Docs to verify that all Devanagari vowel matras, halants, and conjuncts render accurately.</li>
          <li><strong>Official Exams &amp; Portals:</strong> Modern government exams (including CPCT, SSC, High Court, and State Police typing tests) mandate standard Mangal Unicode font. Use this converter to standardize your typing passages.</li>
          <li><strong>WhatsApp &amp; Mobile:</strong> Unicode Devanagari text displays correctly on modern Android, iPhone, Mac, and Windows devices without installing custom font files.</li>
          <li><strong>In-Browser Processing:</strong> All text conversions run in browser memory rather than sending pasted drafts to remote servers.</li>
        </ul>
      `;
      extraFaq = `
        <p><strong>Q: Why does my converted text look different in older software?</strong><br>A: Software created before 2005 often lacks modern Unicode rendering engines. Modern browsers, smartphones, and word processors display Unicode Devanagari accurately.</p>
        <p><strong>Q: Is my typed text uploaded or logged?</strong><br>A: No. Text conversions run inside browser memory without sending pasted text to a server.</p>
      `;
    } else {
      tipsTitle = "Typing & font conversion recommendations";
      tipsContent = `
        <p>Practical advice when converting legacy typing fonts to modern Unicode:</p>
        <ul>
          <li><strong>Verify in Word or Docs:</strong> After converting legacy text to standard Unicode, paste it into MS Word or Google Docs to verify that all vowel matras, accents, and conjuncts display accurately.</li>
          <li><strong>Official Exams &amp; Portals:</strong> Modern government portals, court typist tests, and educational boards mandate Unicode. Use this converter to standardize your typing.</li>
          <li><strong>WhatsApp &amp; Mobile:</strong> Unicode text displays correctly on modern smartphones without installing custom font files.</li>
          <li><strong>In-Browser Processing:</strong> Text conversions run inside browser memory rather than sending typed text to a backend server.</li>
        </ul>
      `;
      extraFaq = `
        <p><strong>Q: Why does my converted text look different in older software?</strong><br>A: Software created before 2005 often lacks modern Unicode rendering engines. Modern browsers, smartphones, and word processors display Unicode accurately.</p>
        <p><strong>Q: Is my typed text uploaded or logged?</strong><br>A: No. Text conversions execute inside browser memory without backend logging.</p>
      `;
    }
  } else if (isWebFontFile) {
    tipsTitle = "Web font optimization & @font-face tips";
    tipsContent = `
      <p>Converting desktop font files (TTF/OTF) into modern web fonts (WOFF2) reduces stylesheet font payload size:</p>
      <ul>
        <li><strong>Brotli compression:</strong> WOFF2 uses built-in Brotli compression algorithms to achieve 30% to 50% smaller file sizes than standard TrueType (TTF) or OpenType (OTF) fonts.</li>
        <li><strong>Browser compatibility:</strong> Modern browsers (Chrome, Edge, Safari, Firefox) natively support WOFF2.</li>
        <li><strong>CSS Implementation:</strong> Define your converted font using <code>@font-face</code> with <code>font-display: swap;</code> to prevent layout shifts.</li>
        <li><strong>Browser security:</strong> Font binaries process in browser memory using WebAssembly without sending font files to third-party servers.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Why is WOFF2 better for websites than TTF or OTF?</strong><br>A: WOFF2 files are significantly smaller, reducing page download times and preventing invisible text flashes (FOIT) on mobile networks.</p>
      <p><strong>Q: Can I convert commercial fonts safely?</strong><br>A: Processing executes inside your browser's memory rather than uploading font binaries remotely; also review your font foundry's web embedding license.</p>
      <p><strong>Q: How do I load the converted WOFF2 file in CSS?</strong><br>A: Use <code>@font-face { font-family: 'MyFont'; src: url('myfont.woff2') format('woff2'); font-display: swap; }</code>.</p>
    `;
  } else if (isImageToPdf) {
    tipsTitle = "Image to PDF conversion recommendations";
    tipsContent = `
      <p>To ensure your images convert into clean PDF documents:</p>
      <ul>
        <li><strong>Preserve Image Resolution:</strong> Image bytes are embedded into the PDF canvas without lossy recompression so graphics and scans stay clear.</li>
        <li><strong>Transparent Backgrounds:</strong> Transparent PNG graphics are placed on a clean white background so text and dark logos stay legible when printed.</li>
        <li><strong>1:1 Point Dimension Mapping:</strong> In PDF, page dimensions are measured in user-space points (1/72 inch). This tool maps each image pixel 1:1 to one PDF point.</li>
        <li><strong>Browser Processing:</strong> Encoding runs inside your web browser without sending files to a conversion server.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Does converting an image to PDF degrade image quality or downsample pixels?</strong><br>A: No. Image bytes embed directly onto the PDF page at native resolution via in-browser encoding.</p>
      <p><strong>Q: Are my uploaded images sent to an external server?</strong><br>A: No. Embedding runs inside browser memory without sending images to a remote server.</p>
    `;
  } else if (isPdfPageManagement) {
    tipsTitle = "Document best practices & privacy notes";
    tipsContent = `
      <p>When working with contracts, resumes, or financial filings, keep originals safe and verify page sequences:</p>
      <ul>
        <li><strong>Keep backups:</strong> Retain a copy of your original document before removing or reordering pages.</li>
        <li><strong>Page orientation:</strong> Fix any sideways scans before emailing or submitting.</li>
        <li><strong>Font preservation:</strong> Structural PDF tools preserve embedded vector fonts cleanly via <code>pdf-lib</code>.</li>
        <li><strong>Processing note:</strong> Most of our tools run directly inside your browser so your documents remain in local memory; complex cloud conversions (like Cloudmersive Word-to-PDF or PowerPoint-to-PDF when enabled) process files in temporary memory.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Will modifying or converting pages degrade document quality?</strong><br>A: Structural operations copy existing text layers and images rather than rasterizing pages.</p>
      <p><strong>Q: Can I process large PDF files on my phone?</strong><br>A: Small-to-medium PDFs run smoothly in modern mobile browsers, constrained mainly by available device RAM.</p>
      <p><strong>Q: Are my confidential files stored on remote servers?</strong><br>A: No. Structural PDF utilities run directly in browser memory without sending your file to a remote server.</p>
    `;
  } else if (toolSlug === "excel-to-pdf") {
    tipsTitle = "Excel XLSX to PDF: scope and limitations";
    tipsContent = `
      <p>This converter reads the first worksheet in an XLSX workbook and renders the available cell values as a simple PDF table.</p>
      <ul>
        <li><strong>Input format:</strong> Use a modern .xlsx workbook. Legacy .xls files are not supported by this converter.</li>
        <li><strong>Worksheet scope:</strong> Only the first worksheet is read. Other worksheets are not included in the PDF.</li>
        <li><strong>Formatting:</strong> The output is a basic table; workbook styling, charts, merged-cell layout, and full Excel page formatting are not reproduced.</li>
        <li><strong>Review:</strong> Check the PDF before sharing or submitting it, especially when the workbook contains important calculations or layout-dependent information.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Can I convert an old .xls file?</strong><br>A: No. Save it as .xlsx in spreadsheet software first, then upload the .xlsx file.</p>
      <p><strong>Q: Does the PDF include every worksheet?</strong><br>A: No. This version reads only the first worksheet.</p>
      <p><strong>Q: Will it preserve charts, formulas, and the original Excel styling?</strong><br>A: No. It renders available cell values as a simple table and does not reproduce the full workbook layout or chart formatting. Review the output before relying on it.</p>
    `;
  } else if (isOfficeDoc) {
    tipsTitle = "Office document conversion tips";
    tipsContent = `
      <p>Conversion fidelity depends on the Office file type and the selected conversion engine. Review the generated PDF before using it as a final copy.</p>
      <ul>
        <li><strong>Browser-first processing:</strong> Word (.docx) and PowerPoint (.pptx) conversion start in your browser. Cloud Engine is an optional user-selected route for those tools and required for legacy .doc/.ppt formats.</li>
        <li><strong>Layout checks:</strong> Complex fonts, diagrams, charts, tables, and page breaks may render differently between engines. Compare the result with the source file.</li>
        <li><strong>Document privacy:</strong> Files remain in browser memory for the default local conversion path. When you opt into a cloud engine, the selected file is sent to the conversion service for processing.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Will converting to PDF preserve every font and layout detail?</strong><br>A: Not in every case. Results depend on the source document and conversion engine, so check the PDF before sharing it.</p>
      <p><strong>Q: Are my Office files sent to a remote service?</strong><br>A: Word and PowerPoint tools use browser conversion by default. Their optional Cloud Engine sends the selected file to a third-party conversion service only when you enable it.</p>
    `;
  } else if (isPdfToImage) {
    tipsTitle = "PDF to image export tips";
    tipsContent = `
      <p>To get sharp image exports from your PDF documents:</p>
      <ul>
        <li><strong>2.0× Canvas Rendering:</strong> Pages render cleanly at 2.0× scale for clear diagrams and text.</li>
        <li><strong>Format Selection:</strong> Choose PNG for diagram sharpness or alpha transparency, or JPG for smaller photo-oriented files.</li>
        <li><strong>Browser Processing:</strong> Page rendering executes in your browser without sending documents to a remote server.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Will extracted images be sharp?</strong><br>A: Yes. The tool renders each PDF page at 2.0× scale so text and diagrams remain clear.</p>
      <p><strong>Q: Are my confidential PDFs uploaded to external servers?</strong><br>A: No. Page rendering runs inside browser memory without sending PDFs remotely.</p>
    `;
  } else if (isGeneralPdf) {
    tipsTitle = "PDF optimization & formatting recommendations";
    tipsContent = `
      <p>To keep your PDF documents compact and readable:</p>
      <ul>
        <li><strong>Inspect output quality:</strong> Review text sharpness and page sizing before submitting official forms.</li>
        <li><strong>Browser Processing:</strong> Document processing runs inside browser memory rather than sending files to remote conversion servers.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Does processing keep original layout readable?</strong><br>A: Check your saved PDF after processing to verify legibility and page formatting.</p>
      <p><strong>Q: Are my PDF files stored on external servers?</strong><br>A: No. Browser PDF processing does not upload files to external servers.</p>
    `;
  } else if (toolSlug.includes("video") || toolSlug.includes("mp4") || toolSlug.includes("mov") || toolSlug.includes("mkv") || toolSlug.includes("avi") || toolSlug.includes("webm") || toolSlug.includes("flv") || toolSlug.includes("wmv")) {
    tipsTitle = "Video conversion & playback tips";
    tipsContent = `
      <p>To achieve reliable playback and balanced file size:</p>
      <ul>
        <li><strong>Universal compatibility:</strong> MP4 format with H.264 video and AAC audio plays broadly across phones, computers, smart TVs, and browsers.</li>
        <li><strong>Target resolution:</strong> Scaling to 1080p, 720p, or 480p helps keep file size and browser encoding time reasonable.</li>
        <li><strong>Browser processing:</strong> Video conversion runs in browser WebAssembly memory without remote conversion queues.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Will my audio stay in sync after conversion?</strong><br>A: FFmpeg WebAssembly preserves audio timestamps alongside video streams cleanly when re-encoding supported containers.</p>
      <p><strong>Q: Does this tool add any watermark?</strong><br>A: No. Exported video files are clean and watermark-free.</p>
      <p><strong>Q: Are my personal videos uploaded to a cloud server?</strong><br>A: No. Video conversion executes in browser memory without sending clips to a conversion server.</p>
    `;
  } else if (toolSlug.includes("image") || toolSlug.includes("jpg") || toolSlug.includes("png") || toolSlug.includes("webp") || toolSlug.includes("svg") || toolSlug.includes("heic") || toolSlug.includes("avif") || toolSlug.includes("compress")) {
    tipsTitle = "Image quality & formatting recommendations";
    tipsContent = `
      <p>To keep your images sharp across websites, apps, and portals:</p>
      <ul>
        <li><strong>Transparency:</strong> Choose PNG or SVG when keeping an alpha background; JPEG outputs an opaque raster bitmap.</li>
        <li><strong>Check final pixel size &amp; KB limits:</strong> Verify exported dimensions and file size against application form specifications.</li>
        <li><strong>Browser processing:</strong> Images decode and encode inside your browser without uploading files to external servers.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Does image format conversion change visual sharpness?</strong><br>A: Lossless PNG exports keep pixel values unchanged, whereas lossy JPG re-encoding trades small amounts of detail for smaller KB sizes.</p>
      <p><strong>Q: Are my personal photos sent to a server?</strong><br>A: No. Processing executes in browser memory without uploading photos to a conversion API.</p>
    `;
  } else if (toolSlug.includes("audio") || toolSlug.includes("voice") || toolSlug.includes("mp3") || toolSlug.includes("wav") || toolSlug.includes("ogg")) {
    tipsTitle = "Audio optimization & voice note playback tips";
    tipsContent = `
      <p>When sharing voice notes or converting tracks between audio formats:</p>
      <ul>
        <li><strong>Voice note compatibility:</strong> Messaging apps like WhatsApp record Opus audio inside <code>.ogg</code> containers, which fail on older car stereos and editors. Converting to MP3 resolves playback compatibility.</li>
        <li><strong>Browser processing:</strong> Decoding and re-encoding run in browser memory without sending recordings to a backend server.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Why won't my WhatsApp voice note play in my video editor or car player?</strong><br>A: WhatsApp voice notes use the Opus codec inside an OGG container, which older players may not decode; converting to MP3 fixes playback broadly.</p>
      <p><strong>Q: Are my voice recordings uploaded to a remote server?</strong><br>A: No. Audio processing executes inside browser memory without sending recordings remotely.</p>
    `;
  } else {
    tipsTitle = `Helpful tips for using ${toolTitle}`;
    tipsContent = `
      <p>To get the best results from this utility:</p>
      <ul>
        <li><strong>No software required:</strong> Runs directly inside modern desktop and mobile web browsers.</li>
        <li><strong>Free to use:</strong> No subscriptions, sign-ups, or account gates required.</li>
        <li><strong>Browser processing:</strong> Operations run inside browser memory rather than sending files to a remote queue.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Do I need an account to use this utility?</strong><br>A: No. ConverterForAll utilities are free with no sign-up or email required.</p>
      <p><strong>Q: Can I use this tool on a smartphone?</strong><br>A: Yes. The interface adapts cleanly for modern mobile and desktop browsers.</p>
    `;
  }

  enriched.push({
    title: tipsTitle,
    content: tipsContent
  });

  const faqIndex = enriched.findIndex(s => s.title.toLowerCase().includes("faq") || s.title.toLowerCase().includes("question"));
  if (faqIndex !== -1) {
    enriched[faqIndex] = {
      ...enriched[faqIndex],
      content: enriched[faqIndex].content + extraFaq
    };
  } else {
    enriched.push({
      title: "Frequently Asked Questions",
      content: extraFaq
    });
  }

  return enriched;
}

// Fallback generator for tools that haven't been manually written yet
export function getToolContent(toolSlug: string, toolTitle: string, toolDescription: string) {
  // If manual content exists, enrich if short (unless disabled) and return
  if (toolContent[toolSlug]) {
    if (toolContent[toolSlug].disableAutoEnrich) {
      return toolContent[toolSlug].sections;
    }
    return enrichContentIfShort(toolContent[toolSlug].sections, toolSlug, toolTitle);
  }

  // 1. Length & Measurement Unit Conversion Tools
  if (toolSlug.includes("-to-") && (toolSlug.includes("inches") || toolSlug.includes("meters") || toolSlug.includes("feet") || toolSlug.includes("miles") || toolSlug.includes("yards") || toolSlug.includes("millimeter") || toolSlug.includes("centimeter") || toolSlug.includes("kilometer") || toolSlug.includes("furlong") || toolSlug.includes("chain") || toolSlug.includes("rod") || toolSlug.includes("league") || toolSlug.includes("parsec"))) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    const fromUnit = formatName(parts[0]);
    const toUnit = formatName(parts[1]);

    let tableHtml = "";
    let formulaHtml = "";
    if (lengthFactors[fromUnit] && lengthFactors[toUnit]) {
      const ratio = lengthFactors[fromUnit] / lengthFactors[toUnit];
      const formatNum = (num: number) => Number.isInteger(num) ? num.toString() : num.toPrecision(6).replace(/\.?0+$/, '');

      formulaHtml = `
      <div class="bg-muted p-4 rounded-xl my-4 border border-border">
        <h3 class="text-base font-bold mt-0 mb-2">The Exact Conversion Formula</h3>
        <p class="mb-2 text-sm text-muted-foreground">To convert ${fromUnit} to ${toUnit}, multiply your starting value by <strong>${formatNum(ratio)}</strong>:</p>
        <code class="block bg-background p-2.5 rounded-lg text-sm font-mono border border-border">${toUnit} = ${fromUnit} × ${formatNum(ratio)}</code>
      </div>`;

      tableHtml = `
      <h3 class="text-lg font-bold mt-6 mb-3">${fromUnit} to ${toUnit} Quick Reference Chart</h3>
      <div class="overflow-x-auto my-3">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-muted/60">
              <th class="border-b border-border py-2.5 px-4 font-semibold">${fromUnit}</th>
              <th class="border-b border-border py-2.5 px-4 font-semibold">${toUnit}</th>
            </tr>
          </thead>
          <tbody>
            ${[1, 2, 5, 10, 20, 50, 100, 250, 500, 1000].map(val => `
            <tr class="hover:bg-muted/40 transition-colors border-b border-border/60">
              <td class="py-2 px-4 font-medium">${val}</td>
              <td class="py-2 px-4">${formatNum(val * ratio)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
    }

    let introText = `<p>Converting between ${fromUnit} and ${toUnit} is an everyday task in home improvement, carpentry, architectural drafting, 3D printing, travel planning, and school projects. Keeping track of decimal conversion factors manually can introduce rounding mistakes.</p>`;
    let situationsHtml = `<ul>
            <li><strong>DIY and Home Renovations:</strong> Measuring furniture dimensions, lumber sizes, curtains, or flooring spaces where packaging lists measurements in ${fromUnit} while your tape measure uses ${toUnit}.</li>
            <li><strong>Online Shopping and Sizing:</strong> Checking size charts or hardware accessories sold by international retailers.</li>
            <li><strong>Architecture and Blueprints:</strong> Reviewing building plans or engineering schematics formatted in alternative measurement units.</li>
            <li><strong>Science and Education:</strong> Solving physics, geometry, or geography problems requiring clear metric or customary conversions.</li>
          </ul>`;

    if (toolSlug === "nanometers-to-micrometers" || toolSlug === "micrometers-to-nanometers") {
      introText = `<p>Nanometers (nm) and micrometers (µm) are microscopic units of length primarily used in scientific research, semiconductor manufacturing, optics, and microbiology. They describe wavelengths of light, cellular structures, and microchip dimensions.</p>`;
      situationsHtml = `<ul>
            <li><strong>Scientific Research:</strong> Measuring cellular structures, bacteria, and microscopic organisms in biology.</li>
            <li><strong>Semiconductor Engineering:</strong> Calculating the scale of transistors and microchip fabrication processes.</li>
            <li><strong>Optics and Photonics:</strong> Describing wavelengths of the visible light spectrum and other electromagnetic waves.</li>
            <li><strong>Materials Science:</strong> Working with nanotechnology and molecular-scale structures.</li>
          </ul>`;
    } else if (toolSlug === "nautical-miles-to-miles" || toolSlug === "miles-to-nautical-miles") {
      introText = `<p>Nautical miles and standard statute miles are distinct units of distance encountered in aviation and marine navigation. While a statute mile is land-based (5,280 feet), a nautical mile equals one minute of latitude along any Earth meridian (1,852 meters).</p>`;
      situationsHtml = `<ul>
            <li><strong>Marine Navigation:</strong> Calculating shipping distances and sailing legs from maritime charts.</li>
            <li><strong>Aviation:</strong> Flight planning and comparing leg distances between airports.</li>
            <li><strong>Geography and Mapping:</strong> Translating maritime boundaries into familiar land distances.</li>
          </ul>`;
    } else if (toolSlug === "light-years-to-parsecs" || toolSlug === "parsecs-to-light-years") {
      introText = `<p>Light years and parsecs are astronomical units of distance across deep space. A light year is the distance light travels in one Julian year, while a parsec (parallax of one arcsecond) comes from Earth's orbital geometry in astrophysics.</p>`;
      situationsHtml = `<ul>
            <li><strong>Astronomy and Astrophysics:</strong> Measuring distances to stars, nebulae, and galaxies.</li>
            <li><strong>Space Exploration:</strong> Estimating deep-space travel scales.</li>
            <li><strong>Science Reference:</strong> Translating research papers using parsecs into light years.</li>
          </ul>`;
    } else if (toolSlug === "leagues-to-miles" || toolSlug === "miles-to-leagues") {
      introText = `<p>The league is an old historical unit of length roughly reflecting an hour's walk, appearing across classic books, old maps, and tabletop gaming rather than modern engineering.</p>`;
      situationsHtml = `<ul>
            <li><strong>Literature and History:</strong> Contextualizing distances in classic books.</li>
            <li><strong>Historical Geography:</strong> Reading older charts and travel logs.</li>
            <li><strong>Tabletop RPGs:</strong> Mapping fantasy travel distances.</li>
          </ul>`;
    }

    return [
      {
        title: `How to convert ${fromUnit} to ${toUnit}`,
        content: `
          ${introText}
          <p>This unit converter runs directly inside your web browser—type a starting value above and see the converted value update live without refreshing the page or sending inputs to a server.</p>
          ${formulaHtml}
        `
      },
      {
        title: "Everyday situations where this conversion matters",
        content: `
          ${situationsHtml}
        `
      },
      {
        title: "Step-by-step conversion instructions",
        content: `
          <ol>
            <li><strong>Enter your number:</strong> Type the value in ${fromUnit} you want to convert into the input box above.</li>
            <li><strong>Live Calculation:</strong> The unit converter multiplies your number by the standard conversion factor in browser JavaScript.</li>
            <li><strong>Copy or inspect chart:</strong> Copy the decimal output or reference the quick conversion chart below.</li>
          </ol>
          ${tableHtml}
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is this ${fromUnit} to ${toUnit} calculation exact?</strong><br>A: Yes. The calculator uses standard international unit definitions (such as 1 inch = 25.4 mm and 1 yard = 0.9144 m) with clear multi-digit precision.</p>
          <p><strong>Q: Does this converter run in my browser or on a backend server?</strong><br>A: All unit conversion arithmetic runs directly inside your browser's JavaScript engine without sending your inputs across the network.</p>
          <p><strong>Q: Can I convert decimal or fractional numbers?</strong><br>A: Yes. Enter any decimal value (such as 3.75 or 0.125) to compute the converted number right away.</p>
          <p><strong>Q: Does this tool log or save numbers I enter?</strong><br>A: No. Inputs remain inside your open browser tab without server logging.</p>
        `
      }
    ];
  }

  // 2. Punjabi Gurmukhi Font Converters (Clean, strictly isolated Punjabi branch)
  const PUNJABI_FONT_SLUGS = new Set([
    "unicode-to-anmollipi",
    "anmollipi-to-unicode",
    "unicode-to-asees",
    "asees-to-unicode",
    "unicode-to-joy",
    "joy-to-unicode",
    "unicode-to-satluj",
    "satluj-to-unicode",
    "gurbani-akhar-to-unicode",
    "unicode-to-raavi",
    "gurmukhi-to-shahmukhi",
    "shahmukhi-to-gurmukhi"
  ]);

  if (toolSlug.includes("-to-") && PUNJABI_FONT_SLUGS.has(toolSlug)) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    const fromFont = formatName(parts[0]);
    const toFont = formatName(parts[1]);

    return [
      {
        title: `Why convert between ${fromFont} and ${toFont}?`,
        content: `
          <p>Before Unicode became universal for digital publishing, Punjabi and Gurmukhi documents relied on ASCII-mapped legacy fonts like ${fromFont}, where Gurmukhi letters sat on English keyboard keys. Copying that text to phones or websites without the font installed shows raw English letters instead of readable Punjabi.</p>
          <p>Converting between ${fromFont} and ${toFont} translates those character codes accurately for websites, mobile messaging, print DTP files, and Punjab exam preparation.</p>
        `
      },
      {
        title: "How Punjabi font conversion works",
        content: `
          <p>Gurmukhi typography requires careful character reordering. In legacy fonts, Sihari (ਿ) appears before the consonant in keystrokes, whereas Unicode stores Sihari after the consonant. Conjunct sub-forms like Pairi Rara, Pairi Haha, and Pairi Vava plus Bindi, Tippi, and Addak are reordered cleanly in browser memory.</p>
        `
      },
      {
        title: "Step-by-step instructions for conversion",
        content: `
          <ol>
            <li><strong>Paste your text:</strong> Copy your Punjabi text from Word, PageMaker, or web forms into the left input box.</li>
            <li><strong>Live browser conversion:</strong> Characters map inside your browser memory using client-side Gurmukhi tables.</li>
            <li><strong>Copy and use:</strong> Click Copy to paste converted text into documents, messages, or print templates.</li>
          </ol>
        `
      },
      {
        title: "Compatibility & tips for Punjabi typists",
        content: `
          <ul>
            <li><strong>Text displays as English letters:</strong> Pasted text showing random English characters comes from a legacy ASCII font—convert it to Unicode to read Gurmukhi anywhere.</li>
            <li><strong>Punjab Government Exams (PSSSB):</strong> Typing exams typically require standard Unicode Gurmukhi (displayed in Raavi font).</li>
            <li><strong>Desktop Publishing (PageMaker &amp; CorelDraw):</strong> When converting from Unicode back to a legacy font for printing, select that font name from your editor's font list afterward.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my Punjabi text uploaded to a remote server?</strong><br>A: No. Gurmukhi font conversion executes inside your browser memory without uploading pasted text to external servers.</p>
          <p><strong>Q: Will bold styling or Word tables remain intact?</strong><br>A: Font conversion translates character encoding on plain text; apply bold or table formatting after pasting back into Word or Docs.</p>
          <p><strong>Q: Can I use converted Unicode text on mobile phones?</strong><br>A: Yes. Standard Unicode Gurmukhi renders reliably on modern Android, iOS, Windows, and macOS devices without extra font installs.</p>
          <p><strong>Q: Which font displays Gurmukhi Unicode in Microsoft Word?</strong><br>A: Windows typically uses Raavi or Nirmala UI for Gurmukhi Unicode display.</p>
        `
      }
    ];
  }

  // 3. Regional Indic & Asian Font Conversion Tools (Hindi, Nepali, Bengali, etc.)
  if (toolSlug.includes("-to-") && (toolSlug.includes("krutidev") || toolSlug.includes("chanakya") || toolSlug.includes("devlys") || toolSlug.includes("preeti") || toolSlug.includes("bijoy") || toolSlug.includes("inpage") || toolSlug.includes("shusha") || toolSlug.includes("aps") || toolSlug.includes("shreelipi"))) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    const fromFont = formatName(parts[0]);
    const toFont = formatName(parts[1]);

    return [
      {
        title: `Why convert between ${fromFont} and ${toFont}?`,
        content: `
          <p>Before Unicode became standard, regional documents mapped Devanagari, Bengali, Nepali, or Urdu glyphs onto standard QWERTY keystrokes. Without the original font file installed, copied passages show scrambled English characters on phones and websites. Converting between ${fromFont} and ${toFont} restores readable encoding.</p>
        `
      },
      {
        title: "How legacy font conversion works",
        content: `
          <p>Visual matras such as short i (ि) and reph (र्), half letters, and conjunct ligatures sit at different positions in ASCII fonts than in logical Unicode order. Dedicated browser mapping rules reorder these clusters directly in your browser memory.</p>
        `
      },
      {
        title: "Step-by-step instructions for conversion",
        content: `
          <ol>
            <li><strong>Paste your text:</strong> Copy text from Word, PageMaker, or web forms into the left input editor.</li>
            <li><strong>Browser processing:</strong> Characters translate live into ${toFont} text inside browser memory.</li>
            <li><strong>Verify &amp; copy:</strong> Inspect vowel matras and click Copy to use in your target software.</li>
          </ol>
        `
      },
      {
        title: "Common issues and troubleshooting tips",
        content: `
          <ul>
            <li><strong>Scrambled English letters:</strong> Legacy ASCII encoding converts cleanly to standard Unicode so every device reads it.</li>
            <li><strong>Official typing tests:</strong> Modern portals specify standard Unicode (e.g., Mangal for Devanagari); verify requirements before submitting.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my text uploaded to a remote server during conversion?</strong><br>A: No. Character mapping runs inside browser memory without sending pasted text to external servers.</p>
          <p><strong>Q: Will bold, italics, or Word tables remain formatted?</strong><br>A: Conversion operates on plain character codes; reapply rich styling in your word processor afterward.</p>
          <p><strong>Q: Can I share Unicode output on WhatsApp and smartphones?</strong><br>A: Yes. Standard Unicode renders cleanly across modern phones and browsers without installing extra font packages.</p>
        `
      }
    ];
  }

  // 3. Video Conversion & Compression Tools
  if (toolSlug.includes("video") || toolSlug.includes("mp4") || toolSlug.includes("mov") || toolSlug.includes("avi") || toolSlug.includes("mkv") || toolSlug.includes("webm") || toolSlug.includes("flv") || toolSlug.includes("wmv")) {
    const parts = toolSlug.split("-to-");
    const fromFormat = parts.length === 2 ? parts[0].toUpperCase() : "video";
    const toFormat = parts.length === 2 ? parts[1].toUpperCase() : "MP4";
    const isConversion = parts.length === 2;

    return [
      {
        title: isConversion ? `Why convert ${fromFormat} to ${toFormat}?` : `What does ${toolTitle} do?`,
        content: `
          <p>${toolDescription} Video files package codecs like H.264 or VP9 inside containers such as .mp4, .mov, .webm, .mkv, or .avi. This browser utility converts or optimizes footage using FFmpeg WebAssembly without waiting in server queues or adding watermarks.</p>
        `
      },
      {
        title: "Understanding containers, codecs, and FFmpeg WebAssembly",
        content: `
          <p>Choosing standard H.264 (<code>libx264</code>) video with AAC audio inside an <code>.mp4</code> container provides broad playback compatibility across phones, computers, and web browsers. Encoding runs via FFmpeg WebAssembly inside browser memory.</p>
        `
      },
      {
        title: "How to use this video utility",
        content: `
          <ol>
            <li><strong>Select your video:</strong> Drag and drop your clip into the upload box above.</li>
            <li><strong>Adjust settings (optional):</strong> Pick output format, resolution scaling, CRF quality, or trim timestamps.</li>
            <li><strong>Process and Download:</strong> Start encoding and save your watermark-free <code>.${toFormat.toLowerCase()}</code> video file.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will exported videos have watermarks?</strong><br>A: No. Videos exported from ConverterForAll carry zero watermarks.</p>
          <p><strong>Q: Are my video files uploaded to a remote server?</strong><br>A: No. FFmpeg WebAssembly executes inside your browser memory without uploading video footage to a conversion server.</p>
          <p><strong>Q: Can I run video conversions on mobile browsers?</strong><br>A: Modern desktop and mobile browsers work cleanly for short-to-medium clips, limited mainly by available tab RAM.</p>
        `
      }
    ];
  }

  // 4. Audio Tools (MP3, WAV, OGG, Audio Trimmer)
  if (toolSlug.includes("audio") || toolSlug.includes("mp3") || toolSlug.includes("wav") || toolSlug.includes("ogg") || toolSlug.includes("voice")) {
    const parts = toolSlug.split("-to-");
    const fromFormat = parts.length === 2 ? parts[0].toUpperCase() : "audio";
    const toFormat = parts.length === 2 ? parts[1].toUpperCase() : "MP3";
    const isConversion = parts.length === 2;

    return [
      {
        title: isConversion ? `Why convert ${fromFormat} to ${toFormat}?` : `Why use ${toolTitle}?`,
        content: `
          <p>${toolDescription} Convert or trim recordings inside your browser using FFmpeg WebAssembly or Web Audio PCM processing without installing desktop software or waiting in server queues.</p>
        `
      },
      {
        title: "Understanding audio codecs and bitrates",
        content: `
          <p>Standard MP3 and OGG compress speech and music efficiently for phones and car stereos, whereas uncompressed WAV preserves raw PCM samples for audio editors.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} instructions`,
        content: `
          <ol>
            <li><strong>Load your audio:</strong> Drop an audio or video track (.mp3, .wav, .ogg, .m4a, or .mp4) from your device.</li>
            <li><strong>Configure output:</strong> ${isConversion ? `Confirm ${toFormat} target format` : 'Adjust trim region markers and preview playback'}.</li>
            <li><strong>Export audio:</strong> Download the converted audio file from browser memory.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my voice memos and audio recordings sent to external servers?</strong><br>A: No. Audio decoding and encoding run inside your browser without uploading files to a conversion server.</p>
          <p><strong>Q: Does re-encoding into MP3 or OGG preserve lossless quality?</strong><br>A: Exporting to MP3 or OGG uses lossy compression to shrink files cleanly for broad playback, while converting compressed MP3 into WAV keeps existing compression artifacts.</p>
          <p><strong>Q: Is an account required?</strong><br>A: No sign-up, account, or email is required.</p>
        `
      }
    ];
  }

  // 5. Image Tools (Compressors, Format Converters, Cropper, Resizer, SVG)
  if (toolSlug.includes("image") || toolSlug.includes("jpg") || toolSlug.includes("png") || toolSlug.includes("webp") || toolSlug.includes("heic") || toolSlug.includes("avif") || toolSlug.includes("gif") || toolSlug.includes("svg") || toolSlug.includes("compress") || toolSlug.includes("passport")) {
    const parts = toolSlug.split("-to-");
    const fromFormat = parts.length === 2 ? parts[0].toUpperCase() : "image";
    const toFormat = parts.length === 2 ? parts[1].toUpperCase() : "image";
    const isConversion = parts.length === 2;

    return [
      {
        title: isConversion ? `How to convert ${fromFormat} to ${toFormat} online` : `What does ${toolTitle} do?`,
        content: `
          <p>${toolDescription} Rather than uploading photos to a remote server, this utility decodes and exports images via browser HTML5 Canvas and client-side WebAssembly codecs so formats meet portal and editor requirements.</p>
        `
      },
      {
        title: "How in-browser image processing works",
        content: `
          <p>Your browser decodes source pixels inside memory, renders onto an HTML5 Canvas or Web Worker, and produces the target image download without waiting in server upload queues.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} guide`,
        content: `
          <ol>
            <li><strong>Select your picture:</strong> Drag your image into the drop zone or pick a file from your device.</li>
            <li><strong>Process in browser:</strong> ${isConversion ? `Convert pixels to ${toFormat} format` : 'Apply your chosen settings cleanly'}.</li>
            <li><strong>Save your image:</strong> Download the exported image to your computer or phone.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does ${toFormat === 'PNG' ? 'PNG' : 'JPEG'} support transparent backgrounds?</strong><br>A: ${toFormat === 'PNG' ? 'Yes. PNG supports an alpha channel for transparent regions.' : 'No. JPEG does not support alpha transparency; choose PNG when keeping transparent layers.'}</p>
          <p><strong>Q: Are my photos sent to external conversion servers?</strong><br>A: No. Canvas rendering executes inside browser memory without uploading photos remotely.</p>
        `
      }
    ];
  }

  // 6. PDF & Document Tools (Organize, Merge, Split, Rotate, Clean Metadata, Repair)
  if (toolSlug.includes("pdf") || toolSlug.includes("word") || toolSlug.includes("powerpoint") || toolSlug.includes("excel") || toolSlug.includes("pages") || toolSlug.includes("metadata")) {
    const isPdfTool = toolSlug.includes("pdf");

    return [
      {
        title: `Why use ${toolTitle}?`,
        content: `
          <p>${toolDescription} Document processing runs inside your browser using client-side libraries like <code>pdf-lib</code> and <code>pdfjs-dist</code> without forcing software subscriptions.</p>
        `
      },
      {
        title: "How browser document processing works",
        content: `
          <p>Your browser reads the document bytes in memory, updates the requested ${isPdfTool ? '.pdf' : 'document'} structure or pages, and saves a fresh output file directly. For tools offering optional third-party Cloud Engine support (such as legacy Word .doc or PowerPoint .ppt), files go to Cloudmersive only when explicitly enabled.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} guide`,
        content: `
          <ol>
            <li><strong>Select your document:</strong> Drag and drop your ${isPdfTool ? '.pdf' : 'document'} into the upload box.</li>
            <li><strong>Apply document actions:</strong> Configure page selection or conversion options cleanly.</li>
            <li><strong>Download result:</strong> Save the newly generated file and inspect pages before submitting.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does structural PDF manipulation preserve text selectability?</strong><br>A: Structural operations using <code>pdf-lib</code> preserve vector text and images, whereas OCR, redaction flattening, or JPEG compression presets render pages cleanly to bitmaps.</p>
          <p><strong>Q: Are my confidential documents stored on remote servers?</strong><br>A: Browser PDF utilities execute locally in memory without sending your file to an external backend.</p>
        `
      }
    ];
  }

  // 7. Developer, Data & Code Utilities (JWT, JSON, CSV, Base64, UUID, Timestamps)
  if (toolSlug.includes("jwt") || toolSlug.includes("json") || toolSlug.includes("csv") || toolSlug.includes("base64") || toolSlug.includes("uuid") || toolSlug.includes("timestamp")) {
    const parts = toolSlug.split("-to-");
    const isConversion = parts.length === 2;
    const fromType = isConversion ? parts[0].toUpperCase() : toolTitle.split(" ")[0];

    return [
      {
        title: `What is ${toolTitle}?`,
        content: `
          <p>${toolDescription} Parsing, encoding, and serialization execute inside your browser's JavaScript runtime without sending queries, tokens, or payloads to an external API server.</p>
        `
      },
      {
        title: "Why browser execution matters for developer workflows",
        content: `
          <p>When inspecting JSON Web Tokens, Base64 strings, or CSV dumps containing proprietary fields, keeping parsing inside your local browser tab avoids transmitting payloads over the network.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} guide`,
        content: `
          <ol>
            <li><strong>Paste your input:</strong> Paste your raw ${fromType} string, token, or data into the editor.</li>
            <li><strong>Live parsing:</strong> The tool validates, formats, or translates your input right inside the browser.</li>
            <li><strong>Copy output:</strong> Click Copy to paste the formatted result cleanly back into your editor.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does ${toolTitle} send my tokens or payloads to an external API?</strong><br>A: No. Parsing and formatting execute inside your browser's JavaScript runtime without network API calls.</p>
          <p><strong>Q: Is this utility free for developers?</strong><br>A: Yes. It is free with no daily limits or account required.</p>
        `
      }
    ];
  }

  // 8. General & Utility Tools Fallback (Calculators, Generators, Cleaners)
  return [
    {
      title: `What is ${toolTitle}?`,
      content: `
        <p>${toolDescription} ConverterForAll builds practical everyday utilities that run directly inside your web browser with no software install, paywall, or sign-up required.</p>
      `
    },
    {
      title: `How ${toolTitle} works`,
      content: `
        <p>Calculations and formatting run inside your browser's JavaScript engine without sending inputs to external backend servers.</p>
      `
    },
    {
      title: `Step-by-step instructions for ${toolTitle}`,
      content: `
        <ol>
          <li><strong>Provide your input:</strong> Enter your values or text into the utility above.</li>
          <li><strong>Run calculation:</strong> The tool computes or formats the output right inside the browser.</li>
          <li><strong>Copy or download:</strong> Save or copy the result cleanly.</li>
        </ol>
      `
    },
    {
      title: "Frequently Asked Questions",
      content: `
        <p><strong>Q: Do I need an account or paid plan?</strong><br>A: No. Everyday utilities are free with no sign-up required.</p>
        <p><strong>Q: Are my inputs saved on remote servers?</strong><br>A: No. Inputs execute in browser memory inside your open tab without backend storage.</p>
      `
    }
  ];
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export function extractToolFaqs(sections: { title: string; content: string }[]): ToolFaqItem[] {
  const faqSection = sections.find(s =>
    s.title.toLowerCase().includes("frequently asked questions") ||
    s.title.toLowerCase().includes("faq")
  );
  if (!faqSection) return [];

  const faqs: ToolFaqItem[] = [];
  const regex = /<strong>Q:\s*([\s\S]*?)\s*<\/strong>\s*(?:<br\s*\/?>|\n)\s*A:\s*([\s\S]*?)(?=<\/p>|$)/gi;
  let match;
  while ((match = regex.exec(faqSection.content)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, "").trim();
    const answer = match[2].replace(/<[^>]+>/g, "").trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  if (faqs.length === 0) {
    const simpleRegex = /Q:\s*([\s\S]*?)(?:<br\s*\/?>|\n)\s*A:\s*([\s\S]*?)(?=<\/p>|<p>|$)/gi;
    while ((match = simpleRegex.exec(faqSection.content)) !== null) {
      const question = match[1].replace(/<[^>]+>/g, "").trim();
      const answer = match[2].replace(/<[^>]+>/g, "").trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

