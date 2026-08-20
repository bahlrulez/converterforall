export const pdfOptimizeContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "compress-pdf": {
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Compress PDF tool reduces the file size of heavy PDF documents. Large PDFs with high-resolution photos or scans can be difficult to email, slow to open on phones, or rejected by application portals. This tool removes unnecessary background data and optimizes embedded images so your PDF is easier to share and upload.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The compression runs directly inside your web browser. The tool optimizes internal images and cleans up unneeded metadata on your computer or phone without uploading your private files to cloud servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have a 30MB report that won't attach to an email due to a 25MB limit, running it through our compressor can easily bring it down to 4MB–8MB while keeping text and photos easy to read.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drag and drop your PDF file into the box.</li><li><strong>Choose Compression:</strong> Pick 'Recommended' for a good balance of quality and size, or 'Extreme' for strict portal limits.</li><li><strong>Download:</strong> Save your newly compressed PDF.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Email Attachments:</strong> Shrinking PDFs under 20MB–25MB email limits.</li><li><strong>Job &amp; Exam Portals:</strong> Meeting strict upload limits (like 500KB or 1MB caps).</li><li><strong>Saving Storage:</strong> Freeing up hard drive and phone storage space.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will compressing the PDF make the text blurry?</strong><br>A: No. Standard PDF text is vector-based, so compression only adjusts image resolution while keeping text sharp.</p>
          <p><strong>Q: Are my documents uploaded to external servers?</strong><br>A: No. Compression happens locally inside your web browser on your own device.</p>
          <p><strong>Q: What is the difference between 'Recommended' and 'Extreme'?</strong><br>A: 'Recommended' keeps images sharp for reading on screens. 'Extreme' compresses images more heavily to fit strict upload caps.</p>
        `
      }
    ]
  },
  "repair-pdf": {
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Repair PDF tool attempts to recover readable pages from damaged or corrupted PDF files. If a PDF was interrupted during download or failed to save properly and now refuses to open in standard PDF viewers, this tool scans the file structure to salvage readable content.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool reads the raw data of your corrupted file in your browser, finds valid text and image blocks, and rebuilds a healthy PDF file structure directly on your device.</p>"
      },
      {
        title: "Examples",
        content: "<p>If a PDF download was cut short by a dropped internet connection and your reader says 'file is damaged', running it through this repair tool can often restore the downloaded pages so you can read them.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select Damaged File:</strong> Drag and drop the corrupted PDF into the box.</li><li><strong>Scan &amp; Rebuild:</strong> The browser scans and extracts readable pages.</li><li><strong>Download:</strong> Save the recovered PDF file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Interrupted Downloads:</strong> Recovering partial PDFs downloaded over unstable connections.</li><li><strong>Damaged USB Files:</strong> Salvaging documents from drives removed too quickly.</li><li><strong>Old Scans:</strong> Fixing older PDFs that trigger format errors in modern viewers.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can every broken PDF be repaired?</strong><br>A: Not always. If crucial parts of the file were never saved or completely overwritten, they cannot be reconstructed. The tool recovers whatever structural data is still readable.</p>
          <p><strong>Q: Are my files uploaded anywhere?</strong><br>A: No. The repair scan happens locally in your web browser.</p>
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
