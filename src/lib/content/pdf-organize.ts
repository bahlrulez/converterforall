export const pdfOrganizeContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "merge-pdf": {
    sections: [
      {
        title: "Merge PDF, Word (DOCX), PowerPoint (PPTX), and Images Online for Free",
        content: "<p>Combine multiple documents into one clean PDF. Whether you need to attach a Word document cover letter to a PDF contract, append PowerPoint presentation slides, or insert JPG/PNG photos, our in-browser tool merges them into a single PDF. Supported operations run locally on your device without server upload wait times.</p>"
      },
      {
        title: "How to Merge Word Documents, Slides, PDFs, and Images",
        content: "<ol><li><strong>Select Files:</strong> Drag and drop your PDFs, Word documents (.docx, .doc), PowerPoint slides (.pptx, .ppt), or images (JPG, PNG) into the box.</li><li><strong>Arrange Sequence:</strong> Drag and reorder file cards into your desired order. You can also turn on auto-scaling for uniform Portrait A4 pages.</li><li><strong>Click 'Merge Files':</strong> The tool combines your files into a single PDF document.</li><li><strong>Download:</strong> Save your complete PDF file directly to your computer or phone.</li></ol>"
      },
      {
        title: "On-Device Processing for File Privacy",
        content: "<p>Standard PDF merging and organizing operations run locally on your device via client-side WebAssembly. When complex documents are converted, processing occurs in temporary memory without permanent disk storage, keeping your resumes, tax returns, and agreements private.</p>"
      },
      {
        title: "Popular Merging Workflows",
        content: "<ul><li><strong>Job Applications:</strong> Combine a Word cover letter, a PDF resume, and scanned recommendation letters into one single application package.</li><li><strong>Business Proposals:</strong> Bundle PowerPoint pitch slides with PDF price quotes and site photos.</li><li><strong>School &amp; University Projects:</strong> Combine essays, reference charts, and diagram images for digital submission.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Can I merge Word (.docx) and PowerPoint (.pptx) files directly with PDFs?</strong><br>A: Yes. You can upload Word and PowerPoint files alongside existing PDFs. The tool automatically converts them into PDF pages and combines them into one document.</p>
          <p><strong>Q: How do I combine JPG and PNG images with my PDFs?</strong><br>A: Simply drop your image files into the upload box along with your documents. The tool scales and embeds them into your final PDF.</p>
          <p><strong>Q: Are my files kept private?</strong><br>A: Yes. Files are processed locally or in temporary memory and are never permanently stored, logged, or shared.</p>
          <p><strong>Q: Can I rearrange the order of the files before merging?</strong><br>A: Yes. Simply click and drag the file cards to arrange the exact page sequence you want.</p>
          <p><strong>Q: Does this tool add watermarks?</strong><br>A: No. Merged PDFs are clean with no watermarks.</p>
        `
      }
    ]
  },
  "split-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Split PDF tool breaks down large PDF files into smaller, individual documents. If you have a large multi-page document and want to separate every page into its own file, this tool splits the document quickly in your browser.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool reads the document structure in your browser, creates a separate PDF file for each page, and packages them into a convenient ZIP archive for a one-click download on your device.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you scanned a 20-page document containing individual receipts or forms, uploading it to the Split PDF tool generates a ZIP folder containing 20 separate, numbered PDF files ready to be organized.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drag and drop your PDF file into the box.</li><li><strong>Splitting:</strong> The tool separates each page into an individual PDF.</li><li><strong>Download ZIP:</strong> Click download to save your ZIP archive containing all split PDF pages.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Invoicing:</strong> Separating bulk-scanned invoices into individual files.</li><li><strong>Client Communication:</strong> Sending clients only the pages relevant to them.</li><li><strong>Archiving:</strong> Categorizing multi-page reports into individual records.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What format will my files download in?</strong><br>A: All split pages are bundled into a single standard \`.zip\` archive so you can download them at once.</p>
          <p><strong>Q: Will splitting affect text or image quality?</strong><br>A: No. The split pages maintain the exact visual data and text from the original document.</p>
          <p><strong>Q: Are my documents uploaded to external servers?</strong><br>A: No. Splitting runs in your browser's local memory on your own device.</p>
        `
      }
    ]
  },
  "remove-pages": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Remove Pages tool deletes unwanted, blank, or extra pages from an existing PDF document. You can specify single pages or page ranges (like '1, 3, 5-8') to remove them and download a clean, updated document.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool reads your PDF in your browser, removes the specified page indices from the document structure, and generates a fresh PDF file directly on your device without server uploads.</p>"
      },
      {
        title: "Examples",
        content: "<p>If a 15-page document includes blank spacer pages on pages 4 and 9, entering '4, 9' into the tool instantly removes those pages and gives you a clean 13-page PDF.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select the PDF:</strong> Upload the document you want to trim.</li><li><strong>Specify Pages:</strong> Type the page numbers you want to remove (e.g. 2, 4, 7-10).</li><li><strong>Download:</strong> Save your updated PDF document.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Document Cleanup:</strong> Removing blank pages or accidental duplicate scans.</li><li><strong>Redaction:</strong> Deleting pages containing private details before sharing.</li><li><strong>Custom Proposals:</strong> Removing irrelevant sections from a general proposal document.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this affect my original file?</strong><br>A: No. Your original file remains untouched. The tool creates a new modified PDF copy for you to download.</p>
          <p><strong>Q: Is this process secure?</strong><br>A: Yes. Page removal happens locally in your browser without uploading to external servers.</p>
        `
      }
    ]
  },
  "extract-pages": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Extract Pages tool pulls specific pages you want to keep from a larger PDF document and compiles them into a new, smaller PDF file.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you enter page numbers (e.g. '5, 10-15'), the tool copies those specific pages and exports them as a new PDF directly on your computer or phone.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you downloaded a 100-page manual or study guide but only need pages 12 to 18, entering '12-18' extracts just those 7 pages into a lightweight PDF file.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select PDF:</strong> Upload the document you want to extract pages from.</li><li><strong>Choose Pages:</strong> Type the page numbers you want to keep (e.g. 4, 8, 15-20).</li><li><strong>Download:</strong> Click download to save your new PDF.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Study Notes:</strong> Extracting specific chapters from textbooks.</li><li><strong>Tax Filing:</strong> Extracting relevant schedules and receipts from large statements.</li><li><strong>Presentations:</strong> Isolating specific charts and slides from reports.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are the extracted pages identical in quality?</strong><br>A: Yes. All text, fonts, and images are copied directly from the original document.</p>
          <p><strong>Q: Are my files private?</strong><br>A: Yes. Processing happens entirely in your web browser.</p>
        `
      }
    ]
  },
  "organize-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Organize PDF tool allows you to rearrange and reorder the pages of an existing PDF document. If pages were scanned in the wrong order or you want to reshuffle sections, this tool lets you reorder pages directly in your browser.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>You can enter a custom page sequence (for example, '3, 1, 2, 4-6') or reverse the order ('10-1'). The tool restructures the document into the new order and exports the updated PDF locally on your device.</p>"
      },
      {
        title: "Examples",
        content: "<p>If a 10-page document was scanned backwards through a document feeder, entering '10-1' flips the page order so the document reads from page 1 to 10 in the correct sequence.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Upload the document you want to rearrange.</li><li><strong>Specify Order:</strong> Type the new page order (e.g. '3, 1, 2, 4-10' or '10-1').</li><li><strong>Download:</strong> Save your newly ordered PDF file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Fixing Scans:</strong> Correcting documents scanned in reverse order.</li><li><strong>Narrative Flow:</strong> Adjusting slide decks so the most important slides appear first.</li><li><strong>Portfolios:</strong> Moving your best work samples to the front of a portfolio PDF.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this work on mobile phones and computers?</strong><br>A: Yes. It works directly in modern web browsers on macOS, Windows, Linux, iOS, and Android.</p>
          <p><strong>Q: Is my document kept private?</strong><br>A: Yes. Reordering happens locally inside your browser without uploading to external servers.</p>
        `
      }
    ]
  },
  "scan-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Scan to PDF tool allows you to take a photo of a document using your phone camera or computer webcam and convert it directly into a standard PDF file.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you click 'Take Photo', your browser captures the photo and embeds it onto a standard PDF page directly in your device's memory without server uploads.</p>"
      },
      {
        title: "Examples",
        content: "<p>Imagine you are a freelance contractor grabbing lunch on a business trip. To get reimbursed, you need to submit your receipt to the accounting department. Instead of stuffing the crumpled receipt into your wallet to scan when you get home, you open the Scan to PDF tool on your smartphone, snap a picture of the receipt on the restaurant table, and instantly download a professional PDF file. You can then immediately attach that PDF to an email and send it to accounting before you even leave the restaurant.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Access the Camera:</strong> Click the 'Take Photo' button on the tool interface to open your device's camera.</li><li><strong>Capture the Document:</strong> Ensure the physical document is well-lit and in focus, then snap the picture.</li><li><strong>Instant Conversion:</strong> The tool will instantly embed your captured photograph into a standard PDF structure.</li><li><strong>Download:</strong> Click the download button to save the newly created PDF to your device's local storage.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Expense Management:</strong> Instantly digitizing physical receipts and invoices for tax reporting and reimbursement software.</li><li><strong>On-the-go Contracts:</strong> Taking photos of physically signed NDA or leasing agreements and immediately returning them as professional PDFs.</li><li><strong>Note Taking:</strong> Capturing classroom whiteboards or collaborative sticky-note sessions and saving them in a universally readable format.</li><li><strong>Identity Verification:</strong> Safely snapping a picture of a driver's license or passport to upload to secure government or banking portals as a PDF.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool crop or enhance the document for me?</strong><br>A: Currently, the tool embeds the exact photograph you take. For best results, try to hold your camera parallel to the document and ensure good lighting before snapping the photo.</p>
          <p><strong>Q: Can I use this on a desktop computer?</strong><br>A: Yes! If you are on a laptop or desktop with a webcam, clicking 'Take Photo' will activate your webcam so you can hold a document up to the lens.</p>
          <p><strong>Q: Are my scanned documents uploaded to the internet?</strong><br>A: No. The camera capture and PDF generation happen 100% locally on your device. Your sensitive financial or legal documents are completely private.</p>
          <p><strong>Q: Can I scan multiple pages into one PDF?</strong><br>A: Currently, this tool focuses on quick, single-page captures. For multi-page PDFs, you can scan them individually and then use our Merge PDF tool.</p>
          <p><strong>Q: Do I need to download an app to use this?</strong><br>A: No! That is the beauty of this tool. It runs entirely within your mobile device's web browser, saving you from downloading bulky scanner apps.</p>
          <p><strong>Q: Is the final PDF in color or black and white?</strong><br>A: The tool preserves the full color of the photograph you take. If you want a black and white document, you can apply a filter in your camera app before taking the photo.</p>
          <p><strong>Q: What if the photo turns out blurry?</strong><br>A: You can simply discard the generated PDF and click 'Take Photo' again to try for a clearer shot.</p>
          <p><strong>Q: Is there a cost to use the scanner?</strong><br>A: No, our Scan to PDF tool is completely free.</p>
          <p><strong>Q: Will it capture the background behind the document?</strong><br>A: Yes, whatever is visible in the camera viewfinder will be embedded into the PDF. We recommend placing your document on a contrasting background and filling the frame.</p>
          <p><strong>Q: Can I extract text from the scanned PDF?</strong><br>A: The resulting file is an image-based PDF. To make the text selectable and searchable, you can run the generated file through our OCR PDF tool.</p>
        `
      }
    ]
  }
};
