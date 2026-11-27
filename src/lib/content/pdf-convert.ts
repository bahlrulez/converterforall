export const pdfConvertContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "pdf-to-word": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is the Free PDF to Word Converter?",
        content: "<p>The PDF to Word converter reads selectable text from Portable Document Format (<code>.pdf</code>) files inside your browser and builds an editable Microsoft Word document (<code>.docx</code>). Includes a document language font option—<strong>English (Arial)</strong>, <strong>Hindi (Mangal)</strong>, or <strong>Punjabi (Raavi)</strong>—using <code>pdfjs-dist</code> and <code>docx</code>.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your browser inspects text runs on each <code>.pdf</code> page, groups lines by vertical/horizontal spacing, maps paragraphs into a styled <code>.docx</code> package, and warns if fewer than 10 characters are detected (common on image-only scans where <a href='/ocr-pdf'>OCR PDF</a> is needed instead). Conversion executes in browser memory without sending documents to an external server.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose language font preset:</strong> Pick English, Hindi (Mangal), or Punjabi (Raavi) before selecting your file.</li><li><strong>Select your PDF:</strong> Drag and drop your text-based <code>.pdf</code> file into the drop zone.</li><li><strong>Download DOCX:</strong> Save your editable Word document and review multi-column or table formatting in Word, LibreOffice, or Google Docs.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Resumes:</strong> Extracting paragraph text from old resumes into editable Word files.</li><li><strong>Draft Reuse:</strong> Pulling clauses and passages from digital reports without retyping.</li><li><strong>Study &amp; Notes:</strong> Converting readable lecture PDFs into editable notes.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my PDF files sent to a conversion server?</strong><br>A: No. Text parsing and <code>.docx</code> packaging execute inside your browser without uploading the document to an external API.</p>
          <p><strong>Q: Will the Word file keep complex magazine tables and embedded photos?</strong><br>A: This converter extracts text lines into flowing Word paragraphs rather than reconstructing multi-column page layouts or embedded bitmap images.</p>
          <p><strong>Q: What happens if I upload a scanned image PDF?</strong><br>A: Image-only scans contain no selectable text runs; the converter appends a notice and recommends running <a href="/ocr-pdf">OCR PDF</a> instead.</p>
        `
      }
    ]
  },
  "jpg-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "JPG to PDF Converter - Convert Images to PDF Online",
        content: "<p>Convert JPG and JPEG photos into standard Portable Document Format (<code>.pdf</code>) files inside your browser. Useful for wrapping ID photos, invoices, or receipts into PDF attachments required by portal forms.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Using <code>pdf-lib</code> inside browser memory, each pixel in your JPG maps 1:1 to a PDF user-space point over an opaque white canvas rectangle before saving a PDF file directly without sending your photos to an external conversion server.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Image:</strong> Drag and drop your JPG photo into the box (or take a photo with camera mode).</li><li><strong>Browser embedding:</strong> The tool embeds original JPEG bytes onto a matching PDF page size.</li><li><strong>Download PDF:</strong> Save your generated <code>.pdf</code> file; to merge multiple photos into one PDF, use <a href='/merge-pdf'>Merge PDF</a>.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Applications &amp; Forms:</strong> Submitting ID scans to portals requiring <code>.pdf</code> documents.</li><li><strong>Receipts:</strong> Packaging bill photos as clean printable PDFs.</li><li><strong>Handwritten Notes:</strong> Converting notebook pictures into portable documents.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Does converting a JPG to PDF compress or downsample pixels?</strong><br>A: No. Original JPEG bytes embed directly onto a matching-dimension PDF page via <code>pdf-lib</code> without lossy re-rendering.</p>
          <p><strong>Q: Are my photos uploaded to external servers?</strong><br>A: No. Embedding runs inside your browser memory without uploading photos to a conversion API.</p>
          <p><strong>Q: Can I combine multiple JPG photos into one multi-page PDF?</strong><br>A: Yes. Use our <a href="/merge-pdf">Merge PDF</a> tool when bundling multiple photos or PDF files together.</p>
        `
      }
    ]
  },
  "png-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "PNG to PDF Converter - Convert PNG Images to PDF Online",
        content: "<p>Convert PNG graphics, high-resolution screenshots, diagrams, and scanned receipts into standard Portable Document Format (<code>.pdf</code>) files inside your browser while maintaining crisp dimensions across viewers and printers. PDF packaging prevents messaging apps and office portals from downscaling sharp interface captures.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your browser loads the PNG image with <code>pdf-lib</code>, draws an opaque white background layer, and embeds your full PNG resolution 1:1 in PDF points (1/72 inch) directly in browser memory without sending images to a backend conversion server.</p><p>Each uploaded PNG retains its native pixel geometry when placed inside a page scaled directly in PDF points. Unlike photo compressors that introduce compression noise around text edges, direct PNG embedding preserves line art, UI labels, tables, and charts cleanly for archiving or emailing.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PNG:</strong> Drag and drop your PNG image into the box.</li><li><strong>Conversion:</strong> The browser embeds the image onto a PDF canvas over solid white without recompression.</li><li><strong>Download:</strong> Click download to save your new PDF file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: What happens to transparent PNG backgrounds?</strong><br>A: Transparent backgrounds are composited onto a clean white PDF page background so dark logos and text remain legible when viewed or printed.</p>
          <p><strong>Q: Does this resize or blurry-compress my PNG screenshots?</strong><br>A: No. Original PNG bytes embed directly at 1 pixel per PDF point so sharp screenshots and UI text stay clear.</p>
          <p><strong>Q: When is PNG-to-PDF better than sharing loose image files?</strong><br>A: PDF documents lock layout dimensions across Windows, macOS, and mobile viewers, making them reliable for expense receipts, software documentation, and printed forms.</p>
          <p><strong>Q: Are my PNG files kept private?</strong><br>A: Yes. Embedding executes inside your browser without sending files to a remote server.</p>
          <p><strong>Q: Does this tool add watermarks?</strong><br>A: No. Converted PDFs export cleanly with zero watermarks.</p>
        `
      }
    ]
  },
  "powerpoint-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The PowerPoint to PDF converter turns slide decks into standard Portable Document Format (<code>.pdf</code>) documents. Modern <code>.pptx</code> slides run through our in-browser XML slide renderer by default. Older binary <code>.ppt</code> presentations cannot be parsed locally in the browser and require enabling the optional Cloud Engine checkbox (Cloudmersive API).</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When <em>Use Cloud Engine</em> stays unchecked, browser JavaScript reads <code>.pptx</code> slide XML shapes and pictures cleanly on your device. If you check the Cloud Engine option (or upload a legacy <code>.ppt</code> file), the presentation is sent via our route to the Cloudmersive API for server conversion in temporary memory and returned to your browser.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you need to email a pitch deck or lecture deck to someone viewing on a mobile phone without PowerPoint installed, exporting PDF pages locks text placement cleanly for universal reading.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select engine mode (optional):</strong> Leave Cloud Engine unchecked for browser conversion of <code>.pptx</code> files, or check it for legacy <code>.ppt</code> support or Cloudmersive slide rendering.</li><li><strong>Upload your presentation:</strong> Drop your <code>.pptx</code> or <code>.ppt</code> file into the converter box.</li><li><strong>Download PDF:</strong> Save the converted <code>.pdf</code> deck and review slide styling before distributing.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Client Proposals:</strong> Locking slide decks as static handouts before emailing clients.</li><li><strong>Study Slides:</strong> Reading lecture notes on phones without PowerPoint apps.</li><li><strong>Printing:</strong> Generating consistent PDF handouts for meetings.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will slide animations work inside the exported PDF?</strong><br>A: No. PDF documents are static pages, so slide animations and transitions are flattened to fixed frames.</p>
          <p><strong>Q: Does my presentation leave my computer?</strong><br>A: Modern .pptx slides render locally in your browser when Cloud Engine stays unchecked. Enabling the Cloud Engine checkbox (required for legacy .ppt files) transmits the selected presentation over HTTPS to the third-party Cloudmersive API in temporary memory.</p>
          <p><strong>Q: Do I need Microsoft Office installed?</strong><br>A: No. Neither browser rendering nor the optional cloud path requires an installed Office suite.</p>
        `
      }
    ]
  },
  "excel-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Excel to PDF converter reads cell values from the first worksheet (<code>sheet1</code>) of a modern Excel workbook (<code>.xlsx</code>) inside your browser and generates a clean landscape A4 Portable Document Format (<code>.pdf</code>) table.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Browser scripts unzip your <code>.xlsx</code> package with JSZip, extract shared strings and row values from <code>xl/worksheets/sheet1.xml</code>, style an HTML table, and convert it via <code>html2pdf.js</code> in browser memory without sending spreadsheet files to a remote server. Note that legacy <code>.xls</code> files, additional worksheet tabs, charts, macros, and custom Excel page styling are not preserved.</p>"
      },
      {
        title: "Examples",
        content: "<p>Converting a single-tab invoice summary, grade sheet, or budget table saved as <code>.xlsx</code> yields a clean landscape table PDF ready to share or print without Excel installed.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Prepare a modern .xlsx file:</strong> Ensure your data sits on the first worksheet tab and save legacy <code>.xls</code> files as <code>.xlsx</code> first.</li><li><strong>Upload spreadsheet:</strong> Drop your <code>.xlsx</code> workbook into the upload zone.</li><li><strong>Download PDF:</strong> Save the landscape <code>.pdf</code> table and verify numeric columns before sharing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this converter accept legacy .xls workbooks?</strong><br>A: No. It reads OOXML <code>.xlsx</code> archives only; resave older <code>.xls</code> files as <code>.xlsx</code> first.</p>
          <p><strong>Q: Are additional tabs, charts, and Excel formulas exported?</strong><br>A: No. Only the first worksheet's available cell values render into a clean static HTML/PDF table without charts or workbook formatting.</p>
          <p><strong>Q: Are my financial spreadsheets sent to an external server?</strong><br>A: No. Parsing and PDF table rendering run inside your browser without uploading spreadsheets to a conversion API.</p>
        `
      }
    ]
  },
  "html-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The HTML to PDF converter renders local HTML markup files (<code>.html</code> or <code>.htm</code>) directly inside your browser and captures them onto multi-page A4 portrait Portable Document Format (<code>.pdf</code>) sheets using <code>html2pdf.js</code>.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The browser reads your uploaded HTML text in memory, mounts it inside an offscreen 800 px portrait frame (`margin: 15 mm`, white background, Arial fallback font), and renders pages via <code>html2canvas</code> (`scale: 2`) + <code>jsPDF</code> cleanly without uploading your local web files or saved confirmations to an external server.</p>"
      },
      {
        title: "Examples &amp; Rendering Notes",
        content: "<p>If you save a web receipt, booking itinerary, invoice page, or static documentation HTML file locally, converting here produces a printable offline PDF archive. Note that page breaks follow block flow, and external web images inside HTML must permit CORS loading for <code>html2canvas</code> to paint them.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your HTML file:</strong> Drag and drop a saved <code>.html</code> or <code>.htm</code> file into the upload box.</li><li><strong>Browser rendering:</strong> Wait while <code>html2pdf.js</code> lays out pages onto A4 portrait frames cleanly.</li><li><strong>Download PDF:</strong> Save the generated <code>.pdf</code> file and inspect page breaks before distributing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are saved local receipts sent to a remote server?</strong><br>A: No. Rendering runs in your browser memory without uploading your local HTML file to a backend server (external cross-origin images referenced inside HTML may require CORS headers).</p>
          <p><strong>Q: Does it add any watermarks or usage fees?</strong><br>A: No. Exported PDFs are free and watermark-free.</p>
        `
      }
    ]
  },
  "pdf-to-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Convert PDF Pages to JPG Images",
        content: "<p>Turn pages from a Portable Document Format (<code>.pdf</code>) file into crisp JPEG images (<code>.jpg</code>) right inside your browser using <code>pdfjs-dist</code> canvas rendering at 2.0× scale for readable slides, forms, and handouts.</p>"
      },
      {
        title: "How Single-Page vs Multi-Page PDFs Export",
        content: "<p>Your browser paints every PDF page onto an opaque white HTML5 2D canvas and encodes <code>image/jpeg</code> at quality 0.92. Single-page PDFs download straight as a <code>.jpg</code> file, whereas multi-page PDFs are packaged cleanly into a single <code>.zip</code> archive containing sequentially numbered page images (such as <code>document_page_01.jpg</code>) without sending your PDF to a remote conversion server.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Drop your PDF:</strong> Select or drag a <code>.pdf</code> document into the upload area above.</li><li><strong>Render pages:</strong> Your browser paints every PDF page at 2.0× scale onto white-backed JPEG canvases in memory.</li><li><strong>Download JPG or ZIP:</strong> Save the direct image for 1-page PDFs, or unzip the multi-page archive on your device.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why did my multi-page PDF download as a .zip file?</strong><br>A: Bundling multi-page exports into one ZIP lets you download all rendered pages cleanly in one click instead of triggering separate download popups per page.</p>
          <p><strong>Q: What resolution are the exported JPG pages?</strong><br>A: Pages render via <code>pdfjs-dist</code> at 2.0× canvas scale (~150–200 DPI equivalent for standard A4/Letter dimensions) using JPEG quality 0.92.</p>
          <p><strong>Q: Are my PDF files sent to a server?</strong><br>A: No. Page rendering runs inside browser memory without uploading your document to a backend conversion server.</p>
        `
      }
    ]
  },
  "pdf-to-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Convert PDF Pages to Lossless PNG Images",
        content: "<p>Export pages from any Portable Document Format (<code>.pdf</code>) file into lossless PNG (<code>.png</code>) images directly inside your browser via <code>pdfjs-dist</code> 2.0× canvas rendering—preserving crisp typography, chart lines, and transparent backgrounds where present.</p>"
      },
      {
        title: "When to Choose PNG & Multi-Page ZIP Behavior",
        content: "<p>PNG avoids lossy JPEG artifacts around technical diagrams, schematics, UI mockups, and small footnotes, and supports an alpha transparency channel if the PDF omits solid page fills. One-page PDFs export straight as a single <code>.png</code> file, whereas multi-page PDFs bundle all sequentially named page PNGs (e.g., <code>file_page_01.png</code>) inside one downloadable <code>.zip</code> archive cleanly.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drag and drop your <code>.pdf</code> file into the upload zone above.</li><li><strong>Render PNG pages:</strong> Browser canvas paints and exports lossless PNG frames at 2.0× resolution scale.</li><li><strong>Download PNG or ZIP:</strong> Save your single PNG or extract the downloaded multi-page ZIP folder locally.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why choose PNG instead of JPG for PDF page exports?</strong><br>A: PNG preserves crisp edges around fine text and line charts without JPEG compression noise and supports alpha channels if needed.</p>
          <p><strong>Q: How do I access every page when converting a multi-page PDF?</strong><br>A: Multi-page documents automatically bundle all rendered pages as numbered PNG files inside one convenient <code>.zip</code> download.</p>
          <p><strong>Q: Are my confidential PDFs uploaded to a server?</strong><br>A: No. Rendering executes inside browser memory without sending your PDF files to an external backend conversion API.</p>
        `
      }
    ]
  },
  "word-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Word to PDF Converter - Convert DOCX & DOC to PDF Online",
        content: "<p>Our Word to PDF converter transforms Microsoft Word documents into standard PDF files. Modern <code>.docx</code> files run directly inside your browser by default. Legacy binary <code>.doc</code> files cannot be parsed locally in the browser and require enabling the optional Cloud Engine checkbox, which sends the selected file to the third-party Cloudmersive API for conversion in memory.</p>"
      },
      {
        title: "How does Word to PDF conversion work?",
        content: "<p>For <code>.docx</code> files, the browser extracts text, headings, lists, and embedded Word charts into an A4 PDF on your device without uploading the document. If you check <em>Use Cloud Engine via third-party service (Cloudmersive API)</em>—required for older Word 97–2003 <code>.doc</code> files or optional for complex layouts—the selected file is sent over HTTPS to Cloudmersive for conversion and returned to your browser.</p>"
      },
      {
        title: "Step-by-Step: How to Convert Word to PDF",
        content: "<ol><li><strong>Select your Word document:</strong> Drag and drop a <code>.docx</code> or <code>.doc</code> file into the upload box.</li><li><strong>Choose conversion engine:</strong> Leave <em>Use Cloud Engine</em> unchecked for default on-device browser conversion of <code>.docx</code> files, or check it when converting a legacy <code>.doc</code> file via Cloudmersive API.</li><li><strong>Convert and download:</strong> Click the convert button and save your generated <code>.pdf</code> document once finished.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Does my Word document leave my computer?</strong><br>A: Modern .docx files run locally in your browser when the Cloud Engine box is left unchecked. Legacy .doc files require enabling the optional Cloud Engine, which transmits the file to the Cloudmersive API for conversion in temporary memory.</p>
          <p><strong>Q: Will my converted PDF match every font and page break?</strong><br>A: Browser conversion renders paragraphs, headings, tables, and charts as closely as possible, while intricate Word layouts or missing system fonts can shift wrapping slightly. Always review the PDF before submitting.</p>
          <p><strong>Q: What if the Cloud Engine is busy when converting a legacy .doc file?</strong><br>A: Open the .doc file in Microsoft Word, LibreOffice, or Google Docs and save it as modern .docx, then convert it in your browser without needing the cloud option.</p>
        `
      }
    ]
  }
};

