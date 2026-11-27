export const pdfOptimizeContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "compress-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Compress PDF tool shrinks oversized PDF documents directly in your web browser so they fit email attachment limits and portal caps. You can pick between <strong>Extreme</strong>, <strong>Recommended</strong>, and <strong>High Quality</strong> presets, or toggle an exact custom target size in KB.</p>"
      },
      {
        title: "How compression affects text and file structure",
        content: "<p>Depending on the chosen preset, the compressor uses two strategies in your browser memory without uploading your PDF to a conversion server: on <strong>High Quality</strong>, it first attempts structural optimization via <code>pdf-lib</code> (object streams and metadata cleanup), keeping selectable vector text intact if the file shrinks by more than 15%. On <strong>Recommended</strong>, <strong>Extreme</strong>, custom KB targets, or when structural optimization yields minimal reduction, it renders each PDF page onto an HTML canvas via <code>pdfjs-dist</code> and re-encodes pages as compressed JPEG images inside a new PDF.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have a 30MB report or image-heavy portfolio that exceeds a 25MB email attachment cap, running it with Recommended or Extreme compression brings the file size down into a shareable range.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drag and drop your PDF file into the upload box.</li><li><strong>Choose compression preset or KB target:</strong> Pick <em>Recommended</em>, <em>Extreme</em>, or <em>High Quality</em>, or switch on custom target KB sizing.</li><li><strong>Download and inspect:</strong> Save your compressed PDF and check text sharpness before submitting it.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Email Attachments:</strong> Shrinking PDFs under 20MB–25MB email limits.</li><li><strong>Portal Submissions:</strong> Reducing multi-page PDFs toward upload caps.</li><li><strong>Saving Storage:</strong> Reducing disk space used by heavy image scans.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does compressing a PDF always keep text vector-sharp and selectable?</strong><br>A: No. On Recommended, Extreme, and custom target-KB modes (and on High Quality when structural optimization alone does not reduce file size by at least 15%), each page is rasterized to a JPEG canvas image inside the PDF. That turns text into pixels, so extreme presets can soften small text and make it non-selectable.</p>
          <p><strong>Q: Are my PDFs uploaded to external servers?</strong><br>A: No. Both structural optimization and canvas page rasterization run inside your web browser without sending your document to a file-conversion server.</p>
          <p><strong>Q: What is the difference between Extreme, Recommended, and High Quality?</strong><br>A: High Quality prefers lossless structural optimization or high-DPI rendering; Recommended balances resolution and JPEG quality; Extreme reduces scale and JPEG quality more aggressively for smaller files.</p>
        `
      }
    ]
  },
  "repair-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Repair PDF tool attempts to recover readable pages from damaged or corrupted Portable Document Format (<code>.pdf</code>) files. If a <code>.pdf</code> was interrupted during download or failed to save cleanly and refuses to open in strict viewers, this tool scans and rewrites the page structure in browser memory.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool loads your damaged <code>.pdf</code> bytes in your browser, runs tolerant parsing and cross-reference reconstruction using in-browser PDF libraries, copies recoverable pages into a fresh PDF container, and skips broken trailing garbage without uploading the file to a server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If a <code>.pdf</code> download was cut short by a dropped internet connection or a poorly generated bank/invoice export shows a damaged root trailer error, running it through this repair tool can often rebuild a readable document containing the intact pages.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select Damaged File:</strong> Drag and drop the corrupted <code>.pdf</code> into the upload box.</li><li><strong>Scan &amp; Rebuild:</strong> Let your browser parse intact objects and rewrite a clean cross-reference table.</li><li><strong>Download &amp; Verify:</strong> Save the recovered PDF file and check every page in your PDF reader.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Interrupted Downloads:</strong> Recovering partial PDFs downloaded over unstable mobile connections.</li><li><strong>Malformed Headers &amp; Trailers:</strong> Fixing non-standard exports from legacy billing or government portals.</li><li><strong>Old Scans:</strong> Resaving older <code>.pdf</code> archives that trigger structure warnings in modern viewers.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can every broken PDF be repaired?</strong><br>A: Not always. If crucial page streams were truncated before downloading finished, encrypted with an unknown password, or overwritten with zeroes, missing data cannot be invented. The tool recovers whichever structural objects remain intact.</p>
          <p><strong>Q: Are my files uploaded anywhere?</strong><br>A: No. Structural scanning and rebuilding happen directly in your web browser without sending your document to a backend conversion server.</p>
        `
      }
    ]
  },
  "ocr-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The OCR PDF tool runs Optical Character Recognition inside your browser using Tesseract.js to convert scanned image Portable Document Format (<code>.pdf</code>) pages into a searchable PDF and optional editable Word (<code>.docx</code>) download. After running OCR, you can search with <code>Ctrl+F</code> or copy text out of scanned pages.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your browser renders each <code>.pdf</code> page onto a canvas up to roughly 2,500 px JPEG via <code>pdfjs-dist</code>, runs Tesseract.js recognition in your chosen language (English, Hindi with Mangal export, or Punjabi with Raavi export), embeds an invisible selectable text layer per page, and merges pages back into a searchable PDF without uploading your document to a conversion server.</p>"
      },
      {
        title: "Page limits and recognition accuracy",
        content: "<p>Because rendering high-resolution pages and running WebAssembly OCR happens inside browser memory, input files are limited to <strong>50 pages</strong> maximum per run. Printed typography scans cleanly, whereas skewed camera photos or messy handwriting may yield recognition errors.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select language &amp; PDF:</strong> Pick your document's printed language and upload a scanned <code>.pdf</code> (up to 50 pages).</li><li><strong>Run browser OCR:</strong> Wait while each page renders and Tesseract extracts text and builds a searchable layer.</li><li><strong>Download PDF or DOCX:</strong> Save the searchable PDF document or click to export extracted text as a Word <code>.docx</code> file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why is there a 50-page limit on PDF files?</strong><br>A: Rendering every page as a high-resolution image and running WebAssembly OCR inside a browser tab uses substantial RAM; capping files at 50 pages helps avoid browser tab crashes.</p>
          <p><strong>Q: Does OCR work well on handwriting?</strong><br>A: OCR is designed primarily for clear printed fonts from books, forms, and typed letters; handwritten notes usually have lower accuracy.</p>
          <p><strong>Q: Are my scanned documents uploaded to external servers?</strong><br>A: No. PDF rendering and Tesseract recognition run inside your browser without sending your paperwork to a backend conversion API.</p>
        `
      }
    ]
  }
};
