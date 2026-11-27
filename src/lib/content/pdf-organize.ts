export const pdfOrganizeContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "merge-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Merge PDF, Word (DOCX), PowerPoint (PPTX), and Images Online for Free",
        content: "<p>Combine multiple documents and images into one unified Portable Document Format (<code>.pdf</code>). Drop existing PDFs alongside modern Word (<code>.docx</code>), PowerPoint (<code>.pptx</code>), or image files (JPG, PNG, WEBP, GIF, BMP, SVG), drag cards to order them, rotate pages, and tune optional Portrait/Landscape A4/Letter/Legal/A3/A5 page scaling before merging in browser memory.</p>"
      },
      {
        title: "How to Merge Word Documents, Slides, PDFs, and Images",
        content: "<ol><li><strong>Select Files:</strong> Drag and drop your <code>.pdf</code> files, <code>.docx</code> documents, <code>.pptx</code> slides, or images into the drop zone.</li><li><strong>Arrange Sequence &amp; Scaling:</strong> Drag file cards into order, rotate individual items, and choose whether to auto-scale images only or all pages with custom page size, orientation, fit mode, and margins.</li><li><strong>Merge &amp; Download:</strong> Click merge to assemble everything via <code>pdf-lib</code> and download the combined PDF.</li></ol>"
      },
      {
        title: "Processing & Engine Scope",
        content: "<p>Unencrypted PDFs, form flattening, images, modern <code>.docx</code>, and <code>.pptx</code> conversions run locally in your browser using <code>pdf-lib</code>, <code>pdfjs-dist</code> (for locked/complex PDFs), canvas image compositing, and client-side XML renderers without sending files to a conversion server. Legacy binary <code>.doc</code> or <code>.ppt</code> formats require separate cloud conversion first before merging cleanly.</p>"
      },
      {
        title: "Popular Merging Workflows",
        content: "<ul><li><strong>Job Applications:</strong> Combine a Word cover letter, a PDF resume, and scanned certificates into one single submission file.</li><li><strong>Business Proposals:</strong> Bundle PowerPoint pitch slides with PDF price quotes and site photos.</li><li><strong>School &amp; University Projects:</strong> Combine essays, charts, and diagram images into a single ordered PDF.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Can I merge Word (.docx) and PowerPoint (.pptx) files directly with PDFs?</strong><br>A: Yes. Modern .docx and .pptx files convert in browser memory into PDF pages and merge cleanly into one PDF alongside existing PDF documents and photos.</p>
          <p><strong>Q: How do I combine JPG and PNG images with my PDFs?</strong><br>A: Drop images alongside your PDFs; you can keep native sizes or turn on auto-scaling to standardize page dimensions and margins.</p>
          <p><strong>Q: Are my files kept private?</strong><br>A: Yes. Merging and client-side conversions execute inside browser memory without sending your documents to a backend conversion server.</p>
          <p><strong>Q: Does this tool add watermarks?</strong><br>A: No. Merged PDFs export watermark-free.</p>
        `
      }
    ]
  },
  "split-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Split a PDF into Individual Page Files",
        content: "<p>The Split PDF tool separates every page of a multi-page Portable Document Format (<code>.pdf</code>) document into its own standalone PDF file inside your browser and bundles all generated single-page PDFs into a clean <code>.zip</code> archive.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your browser loads the source <code>.pdf</code> using <code>pdf-lib</code>, copies each page individually into a fresh single-page PDF named sequentially (such as <code>document_page_01.pdf</code>), and packages them with JSZip into a single downloadable archive without sending your files to a conversion server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you scanned a 20-page stack containing separate invoices or receipts into one PDF, running Split PDF creates a ZIP archive with 20 individual single-page PDF files ready for filing or emailing separately. To keep only specific pages in one combined PDF instead, use <a href='/extract-pages'>Extract Pages</a>.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drag and drop your multi-page <code>.pdf</code> into the upload box.</li><li><strong>Split every page:</strong> Click split so the browser copies every page into its own standalone single-page PDF file.</li><li><strong>Download ZIP:</strong> Save the resulting <code>.zip</code> bundle containing your numbered single-page PDFs.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What format will my split files download in?</strong><br>A: Every page becomes its own individual PDF file, packaged inside one downloadable <code>.zip</code> archive.</p>
          <p><strong>Q: Will splitting alter text clarity or fonts?</strong><br>A: No. Pages are copied structurally with <code>pdf-lib</code>, preserving vector text and embedded images.</p>
          <p><strong>Q: Are my documents sent to external servers?</strong><br>A: No. Page separation and ZIP compression execute inside your browser without uploading the PDF.</p>
        `
      }
    ]
  },
  "remove-pages": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Remove Unwanted Pages from a PDF",
        content: "<p>The Remove Pages tool deletes unwanted, blank, or confidential pages from an existing Portable Document Format (<code>.pdf</code>) document inside your browser. Specify individual page numbers or hyphenated ranges (such as <code>1, 3, 5-8</code>) to strip those pages and download an updated PDF right away.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Using <code>pdf-lib</code> directly inside browser memory, the utility parses your <code>.pdf</code>, parses comma- and hyphen-separated page numbers into 0-based indices, deletes matching pages from back to front so page numbering never shifts out of order, and builds a clean PDF without uploading files to a remote server.</p>"
      },
      {
        title: "Examples &amp; Practical Uses",
        content: "<p>If a 15-page contract or scanned report contains blank separator pages on pages 4 and 9 (or private appendix sheets on pages 12–15), entering <code>4, 9, 12-15</code> removes only those sheets while preserving selectable vector text and embedded images across the remaining document.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Specify page numbers:</strong> Enter the 1-based page numbers or ranges to delete (for example <code>2, 4, 7-10</code>).</li><li><strong>Select your PDF:</strong> Drop your <code>.pdf</code> into the upload zone to strip matching pages in browser memory.</li><li><strong>Download clean PDF:</strong> Save your updated document and verify remaining page counts before emailing or submitting.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this modify my original PDF file on disk?</strong><br>A: No. Your original file remains untouched while the browser saves a newly generated copy without the removed pages.</p>
          <p><strong>Q: Are my PDF files sent to a conversion server?</strong><br>A: No. Page removal executes inside your browser using <code>pdf-lib</code> rather than sending your document to an external server.</p>
        `
      }
    ]
  },
  "extract-pages": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Extract Specific Pages from a PDF",
        content: "<p>The Extract Pages tool pulls only the pages you select out of a larger Portable Document Format (<code>.pdf</code>) document and compiles them into a clean standalone PDF file directly inside your browser without altering the source document.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Enter individual 1-based page numbers or page ranges (like <code>5, 10-15</code>). The tool loads your source <code>.pdf</code> with <code>pdf-lib</code> in browser memory, copies only the chosen pages into a fresh PDF container, and saves the slimmer file without sending your documents to a backend conversion server.</p>"
      },
      {
        title: "Examples &amp; Practical Uses",
        content: "<p>If you downloaded a 100-page reference manual, tax packet, or statement PDF and only need pages 12 through 18 for an application form or accounting upload, typing <code>12-18</code> extracts just those 7 pages into a lightweight document. To split every single page into separate PDFs inside a ZIP instead, use <a href='/split-pdf'>Split PDF</a>.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose pages to keep:</strong> Type single page numbers or hyphenated ranges (for example <code>4, 8, 15-20</code>).</li><li><strong>Select your PDF:</strong> Drag and drop your source <code>.pdf</code> document into the upload box above.</li><li><strong>Download result:</strong> Save the extracted PDF containing only those selected pages.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Do extracted pages keep original text and fonts?</strong><br>A: Yes. Pages are copied structurally with <code>pdf-lib</code>, preserving selectable text, vector drawings, and images.</p>
          <p><strong>Q: Are my files sent to a conversion API?</strong><br>A: No. Extraction runs inside browser memory without sending your PDF to a remote server.</p>
        `
      }
    ]
  },
  "organize-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Organize, Reorder, Rotate & Clean PDF Pages",
        content: "<p>Arrange visual page thumbnails, rotate upside-down scans, delete extra sheets, duplicate pages, insert blank spacer pages, or append images and extra <code>.pdf</code> files inside our interactive organizer without leaving your browser.</p>"
      },
      {
        title: "How visual page organization works",
        content: "<p>Your browser renders thumbnail previews for every page of your uploaded Portable Document Format (<code>.pdf</code>) file. Drag thumbnails or click arrows to reorder sequences, rotate individual or selected pages in 90-degree increments, undo accidental deletions, and rebuild the final PDF structurally via <code>pdf-lib</code> without sending files to a conversion server.</p>"
      },
      {
        title: "Simple step-by-step guide",
        content: "<ol><li><strong>Load one or more PDFs (or images):</strong> Drop your <code>.pdf</code> into the organizer workspace and add extra pages if needed.</li><li><strong>Reorder, rotate, or prune pages:</strong> Drag thumbnails into sequence, rotate sideways pages by 90°, duplicate sheets, insert blanks, or delete unwanted pages.</li><li><strong>Export organized PDF:</strong> Click download to rebuild and save your updated PDF file.</li></ol>"
      },
      {
        title: "Practical everyday uses",
        content: "<ul><li><strong>Fixing Scanned Packets:</strong> Flipping pages scanned sideways or out of order before emailing.</li><li><strong>Combining Additions:</strong> Inserting extra JPG scans, blank notes pages, or secondary PDFs into one sequence.</li><li><strong>Pruning Unwanted Sheets:</strong> Removing cover pages or accidental blanks while inspecting thumbnails in the lightbox preview.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I preview each page closely before deleting or rotating it?</strong><br>A: Yes. Every page renders a visual thumbnail card and opens in a full zoom lightbox modal on click.</p>
          <p><strong>Q: Are my documents uploaded to a remote server?</strong><br>A: No. Thumbnail rendering and structural page rebuilding run inside your browser without uploading files to a conversion API.</p>
          <p><strong>Q: Does reordering reduce visual quality or text selectability?</strong><br>A: No. Pages from your PDF are copied structurally with <code>pdf-lib</code>, keeping original vector text and images intact.</p>
        `
      }
    ]
  },
  "scan-to-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Scan to PDF tool captures a photograph using your phone camera or computer webcam (or selects an image file) and places it onto a standard Portable Document Format (<code>.pdf</code>) page inside your browser.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you click <em>Take Photo</em>, your browser captures a picture via your device camera and embeds the image directly onto a 1:1 point PDF page with <code>pdf-lib</code> inside browser memory without sending your photo to a conversion server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you need to attach a paper receipt, signed delivery slip, or physical ID to an expense form on the go, you can capture the photo from your phone camera and download a single-page PDF file straight from the browser.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Access the Camera:</strong> Click <em>Take Photo</em> on the tool interface to launch your device camera or webcam.</li><li><strong>Capture the Document:</strong> Ensure even lighting and hold your camera steady over the flat document before capturing.</li><li><strong>Generate &amp; Download:</strong> The browser embeds your photo onto a PDF page so you can download the <code>.pdf</code> file right away.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Expense Receipts:</strong> Turning paper bills into attachable PDF files while traveling.</li><li><strong>Signed Paperwork:</strong> Converting physically signed handouts or agreements into single-page PDFs.</li><li><strong>Notes &amp; Whiteboards:</strong> Capturing printed sheets or handwritten notes as portable documents.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool automatically perspective-crop or filter the photo?</strong><br>A: Currently it embeds the exact frame you capture on a clean PDF page. Place documents on a contrasting surface in good lighting for clear reads.</p>
          <p><strong>Q: Can I scan multiple pages into one PDF?</strong><br>A: Each capture saves one PDF page; to combine multiple captures into a single document, load them afterward into <a href="/merge-pdf">Merge PDF</a>.</p>
          <p><strong>Q: Are my captured photos uploaded to external servers?</strong><br>A: No. Camera capture and PDF assembly execute inside your browser without sending photos to a backend conversion API.</p>
          <p><strong>Q: Can I make the resulting image PDF searchable afterward?</strong><br>A: Yes. Captured files are image-based PDFs; pass them through <a href="/ocr-pdf">OCR PDF</a> if you need a searchable text layer.</p>
        `
      }
    ]
  },
  "rotate-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Rotate Individual or All PDF Pages",
        content: "<p>Fix sideways or upside-down scans in Portable Document Format (<code>.pdf</code>) files inside your browser. Our page organizer renders crisp thumbnails so you can rotate specific pages clockwise or counter-clockwise by 90°, 180°, or 270° (or batch-rotate selected sheets) and save a corrected PDF.</p>"
      },
      {
        title: "How Rotation Works",
        content: "<p>Rotation adjusts page orientation properties structurally via <code>pdf-lib</code> without rasterizing pages to compressed JPEGs, keeping selectable vector text, hyperlinks, and image sharpness intact while operating directly inside browser memory.</p><p>Because rotation changes page-dictionary metadata in 90-degree increments rather than re-encoding embedded photographs or outlining fonts, file sizes stay close to the original document. You can correct mixed-orientation binder scans—such as landscape spreadsheets mixed into portrait contracts—in a single pass before exporting.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drop your <code>.pdf</code> file into the workspace to display thumbnails for every page.</li><li><strong>Rotate sideways pages:</strong> Click rotate icons on individual page cards, or enable multi-select to turn multiple pages at once.</li><li><strong>Save rotated PDF:</strong> Export the updated document and verify page orientation in your reader.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I rotate only page 3 instead of rotating every page?</strong><br>A: Yes. Each thumbnail card has its own left/right rotation controls, or you can select multiple specific pages for batch rotation.</p>
          <p><strong>Q: Does rotating a PDF degrade text quality?</strong><br>A: No. Structural page rotation updates page orientation with <code>pdf-lib</code> without flattening text into lower-resolution images.</p>
          <p><strong>Q: Does rotating pages affect searchable OCR text?</strong><br>A: No. Existing selectable text layers rotate together with each page canvas so viewers can still highlight and search text properly.</p>
          <p><strong>Q: Are my files sent to a server?</strong><br>A: No. Rendering thumbnails and saving the rotated PDF run inside browser memory without sending your document to a backend server.</p>
        `
      }
    ]
  },
  "edit-pdf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Edit, Annotate, Sign & Redact PDFs in Your Browser",
        content: "<p>Add typed text boxes, freehand pen strokes, highlighter marks, rectangles, black redaction boxes, preset stamps (APPROVED, CONFIDENTIAL, DRAFT, PAID, FINAL), and drawn or typed signatures onto Portable Document Format (<code>.pdf</code>) pages inside your browser.</p>"
      },
      {
        title: "How Annotations & Redactions Are Exported",
        content: "<p>Pages containing only text, highlights, shapes, or signatures preserve their vector structure via <code>pdf-lib</code>. If you place redaction boxes on any page, the exporter inspects the PDF for embedded attachments (blocking redaction export if hidden attachments exist to avoid leaks), displays a confirmation notice, and flattens redacted pages into rendered PNG page images so covered text is removed from the page stream rather than merely covered visually.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your PDF:</strong> Select a <code>.pdf</code> file to open the page viewer and editing toolbar.</li><li><strong>Annotate, sign, or redact:</strong> Pick Text, Draw, Highlight, Rectangle, Redact, Signature, or Stamp tools and position elements directly on the page.</li><li><strong>Download edited PDF:</strong> Click export (confirming the flattening notice if redactions were applied) to save your <code>Edited_</code> PDF copy.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does the Redact tool actually strip hidden text underneath black boxes?</strong><br>A: Yes. When redactions are present, those redacted pages are flattened into rendered PNG representations rather than keeping underlying selectable text, and exports stop if embedded PDF attachments are detected.</p>
          <p><strong>Q: Can I draw or type my signature?</strong><br>A: Yes. Open the Signature dialog to sketch on the touch/mouse pad or type a styled signature to place on any page.</p>
          <p><strong>Q: Are my PDFs sent to an external server while editing?</strong><br>A: No. Rendering, annotation placement, and PDF saving execute inside your browser without uploading your document to a backend server.</p>
        `
      }
    ]
  },
  "clean-pdf-metadata": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is PDF Metadata?",
        content: "<p>Whenever a PDF is created by Word, Illustrator, Acrobat, or a scanner, hidden metadata properties are stored inside the file header. This commonly includes the document <strong>Title</strong>, <strong>Author</strong> name, <strong>Subject</strong>, <strong>Keywords</strong>, <strong>Creator</strong> software, <strong>Producer</strong> engine, and exact <strong>CreationDate</strong> and <strong>ModificationDate</strong> timestamps.</p>"
      },
      {
        title: "What this cleaner clears and resets",
        content: "<p>Before scrubbing, the inspector reads and displays any existing Author, Title, Creator, Producer, Subject, and Creation Date fields stored in the PDF. When you click <em>Scrub Metadata Now</em>, the browser loads the PDF with <code>pdf-lib</code>, sets Title, Author, Subject, Creator, and Producer to empty strings, clears Keywords to an empty array, and resets Creation Date and Modification Date to <code>1970-01-01T00:00:00Z</code> before saving a new scrubbed PDF file.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select a PDF:</strong> Drag and drop your <code>.pdf</code> file into the upload box to scan its existing metadata fields.</li><li><strong>Inspect found properties:</strong> Review the detected Author, Title, software Creator, Producer engine, and Creation Date shown on the left.</li><li><strong>Scrub and download:</strong> Click <em>Scrub Metadata Now</em> to overwrite those metadata fields and reset timestamps, then download the <code>-scrubbed.pdf</code> copy.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my PDFs uploaded to a server to strip metadata?</strong><br>A: No. Scanning and scrubbing run inside your web browser using <code>pdf-lib</code>; your file is not uploaded to a conversion server.</p>
          <p><strong>Q: What are timestamps set to after cleaning?</strong><br>A: Both Creation Date and Modification Date are reset to the Unix epoch (1970-01-01) and text metadata fields (Author, Title, Subject, Creator, Producer, Keywords) are cleared to blank values.</p>
          <p><strong>Q: Does removing metadata alter page text, images, or layout?</strong><br>A: No. Updating the PDF document metadata dictionary leaves visible pages, vector text, and images untouched, though files encrypted with a password cannot be loaded here.</p>
        `
      }
    ]
  }
};

