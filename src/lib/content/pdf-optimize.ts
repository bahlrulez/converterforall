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
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The OCR PDF tool uses Optical Character Recognition to make scanned paper PDFs searchable and selectable. When you scan a paper document, the PDF is essentially a photo. The OCR tool reads the text in the image and adds a searchable text layer so you can search (Ctrl+F) and copy text.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool runs an in-browser OCR engine on your device to analyze letters in scanned pages and inject a text layer into the PDF without sending your paperwork to third-party servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you scanned a 10-page printed agreement and need to find a specific clause, running it through OCR lets you search for keywords instantly in any PDF viewer.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload Scanned PDF:</strong> Add your scanned PDF document to the box.</li><li><strong>OCR Processing:</strong> The browser reads text on each page.</li><li><strong>Download Searchable PDF:</strong> Save your updated PDF with searchable, selectable text.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Searchable Records:</strong> Making scanned contracts and tax forms searchable.</li><li><strong>Copying Text:</strong> Extracting text from printed pages without typing manually.</li><li><strong>Accessibility:</strong> Enabling screen readers to read scanned documents out loud.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does OCR work on handwriting?</strong><br>A: OCR is optimized for printed fonts (like typed letters and books). Handwritten notes are harder to recognize accurately.</p>
          <p><strong>Q: Are my scanned documents uploaded to servers?</strong><br>A: No. The OCR recognition runs locally in your browser.</p>
        `
      }
    ]
  }
};
