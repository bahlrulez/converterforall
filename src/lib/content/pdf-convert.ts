export const pdfConvertContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "pdf-to-word": {
    sections: [
      {
        title: "What is the Free PDF to Word Converter?",
        content: "<p>The PDF to Word converter extracts text from your PDF files and turns it into a standard Microsoft Word document (.docx). If you have a resume, contract, or report locked in PDF format that you need to edit or copy from, this tool converts the document back into an editable Word file.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool reads your PDF text directly in your web browser and structures it into a Word (.docx) document on your device. Because the text parsing happens locally on your computer or phone, your documents are not sent to external servers.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PDF:</strong> Drag and drop your PDF into the box, or browse your device.</li><li><strong>Text Extraction:</strong> The browser reads and organizes the text into Word paragraphs.</li><li><strong>Download:</strong> Click download to save your new .docx file, ready to edit in Word or Google Docs.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Resumes:</strong> Updating an old PDF resume without typing everything out from scratch.</li><li><strong>Agreements &amp; Contracts:</strong> Reusing text from a finalized PDF contract for a new template.</li><li><strong>Study Material:</strong> Copying quotes and sections from PDF study guides into your notes.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my documents kept private?</strong><br>A: Yes. The conversion runs locally in your web browser without uploading your files to remote servers.</p>
          <p><strong>Q: Will the Word document match the PDF layout?</strong><br>A: The tool focuses on extracting paragraphs and clean text. Complex multi-column magazine layouts or overlapping graphics may need small adjustments in Word.</p>
          <p><strong>Q: Can I edit the downloaded file?</strong><br>A: Yes. The downloaded .docx file can be opened and edited in Microsoft Word, Google Docs, LibreOffice, and Apple Pages.</p>
          <p><strong>Q: Does this work on scanned image PDFs?</strong><br>A: This tool is for text-based PDFs. If your PDF is a scanned photo of paper, you will need an OCR tool to read the image text.</p>
        `
      }
    ]
  },
  "jpg-to-pdf": {
    sections: [
      {
        title: "JPG to PDF Converter - Convert Images to PDF Online",
        content: "<p>Convert JPG and JPEG photos into standard PDF documents. Whether you need to attach a photo ID to a form, combine receipts for an expense report, or save photos as a clean document, this tool packages your pictures into a PDF in seconds.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool scales and embeds your image onto a standard PDF page directly inside your web browser. Because the processing occurs on your device, your personal photos stay on your computer or phone.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Image:</strong> Drag and drop your JPG into the box.</li><li><strong>Conversion:</strong> The browser creates a standard PDF page with your photo.</li><li><strong>Download:</strong> Click download to save your new PDF.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Applications &amp; Forms:</strong> Uploading photo IDs or certificates to portals that require PDF format.</li><li><strong>Receipts:</strong> Saving photos of receipts and bills into a printable document for filing.</li><li><strong>School Assignments:</strong> Turning photos of handwritten notes into a clean PDF for submission.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Will my photo quality be preserved?</strong><br>A: Yes. The image is embedded at full resolution into the PDF page.</p>
          <p><strong>Q: Are my photos uploaded to external servers?</strong><br>A: No. Image embedding happens locally in your web browser.</p>
          <p><strong>Q: Can I merge multiple JPG photos into one PDF?</strong><br>A: Yes! You can use our Merge PDF tool to combine multiple images and documents together.</p>
        `
      }
    ]
  },
  "png-to-pdf": {
    sections: [
      {
        title: "PNG to PDF Converter - Convert PNG Images to PDF Online",
        content: "<p>Convert PNG graphics and screenshots into standard PDF files. Converting to PDF ensures your images maintain consistent dimensions and print cleanly across all devices.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool formats your PNG image onto a standard PDF page inside your web browser without uploading your files to external servers.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PNG:</strong> Drag and drop your PNG image into the box.</li><li><strong>Conversion:</strong> The browser embeds the image onto a PDF canvas.</li><li><strong>Download:</strong> Click download to save your new PDF file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: What happens to transparent PNG backgrounds?</strong><br>A: Transparent backgrounds are placed on a clean white PDF page background so all text and elements remain clear.</p>
          <p><strong>Q: Are my documents kept private?</strong><br>A: Yes. All conversions run locally in your web browser.</p>
          <p><strong>Q: Does this tool add watermarks?</strong><br>A: No. Converted PDFs are clean with no watermarks.</p>
        `
      }
    ]
  },
  "powerpoint-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The PowerPoint to PDF converter turns presentation slides into standard PDF documents. Modern .pptx slides are converted locally in your web browser. If you have an older legacy .ppt file, conversion requires enabling the optional Cloud Engine, which converts the file in temporary memory and removes it after download.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>For modern .pptx presentations, parsing and PDF generation happen directly inside your web browser. For legacy binary .ppt presentations, browser parsing is not possible, so conversion requires opting into our secure Cloud Engine (via Cloudmersive API), which processes the file in memory and discards it once conversion finishes.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you created a slide deck and need to send it to someone who might view it on a phone or tablet, converting it to PDF ensures your slides can be viewed anywhere without PowerPoint installed.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Presentation:</strong> Drag and drop your .pptx file into the box (or select a .ppt file and enable Cloud Engine).</li><li><strong>Conversion:</strong> The slides are parsed and formatted into standard PDF pages.</li><li><strong>Download:</strong> Click download to save your PDF slides.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Client Proposals:</strong> Sharing non-editable versions of slides so formatting remains locked.</li><li><strong>Handouts:</strong> Printing presentation slides for meetings or study sheets.</li><li><strong>Mobile Viewing:</strong> Enabling smooth slide viewing on devices without presentation software.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will slide animations work in the PDF?</strong><br>A: No. PDFs are static documents, so animations and video clips are flattened to show the final slide appearance.</p>
          <p><strong>Q: Does my presentation leave my computer?</strong><br>A: Supported .pptx files are converted in your browser. Legacy .ppt files require checking the Cloud Engine option, which processes files in secure memory and discards them immediately after download.</p>
          <p><strong>Q: Do I need a Microsoft 365 subscription?</strong><br>A: No. The converter runs without requiring any Microsoft Office license or software.</p>
        `
      }
    ]
  },
  "excel-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Excel to PDF converter transforms the first worksheet of a modern Microsoft Excel workbook (.xlsx) into a clean, simple PDF table. Sharing spreadsheets as PDFs locks your row and column data into a fixed document that anyone can open or print without spreadsheet software.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool extracts the first worksheet (sheet1) directly from your .xlsx file in your browser and formats the cells into a standard PDF data table. Note that legacy binary .xls files, multiple sheets, embedded charts, and custom print layouts are not converted—only the primary sheet's table data is exported.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have a single-sheet invoice, budget summary, or tabular report in XLSX format, this tool converts it into a printable PDF table for sharing or filing.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Spreadsheet:</strong> Drag and drop your .xlsx file into the box.</li><li><strong>Rendering:</strong> The tool extracts the first worksheet table into PDF pages.</li><li><strong>Download:</strong> Click download to save your PDF report.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Single-Sheet Summaries:</strong> Turning basic tables and invoices into fixed PDF documents.</li><li><strong>Quick Sharing:</strong> Exporting spreadsheet data to PDF for mobile viewing without spreadsheet apps.</li><li><strong>Printable Tables:</strong> Generating a standard table layout without software installation.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this converter support legacy .xls files?</strong><br>A: No. The in-browser converter currently supports modern .xlsx workbooks. If you have an older .xls file, save it as .xlsx first.</p>
          <p><strong>Q: Are all sheets converted into the PDF?</strong><br>A: No. The tool converts only the first worksheet in your workbook. Additional tabs or hidden sheets are omitted.</p>
          <p><strong>Q: Will formatting, charts, and formulas carry over?</strong><br>A: The converter reads cell values and places them in a basic table layout. Custom formulas, macros, and embedded charts are not rendered.</p>
          <p><strong>Q: Are my financial spreadsheets secure?</strong><br>A: Yes. All processing runs locally inside your browser—your spreadsheet data is never uploaded to remote servers.</p>
        `
      }
    ]
  },
  "html-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The HTML to PDF converter turns HTML files and saved web pages into standard PDF documents. It allows you to create permanent offline copies of digital receipts, articles, or documentation so you can archive, print, or share them easily.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your web browser renders the HTML markup and styles, then captures the page layout into a multi-page PDF document. Because rendering happens directly in your browser, your local HTML files remain private.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you complete an online booking or purchase and want to save the confirmation page before the session expires, saving it as an HTML file and converting it to PDF creates a permanent record you can reference anytime.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your HTML file:</strong> Drag and drop your .html file into the box.</li><li><strong>Rendering:</strong> The browser formats the HTML layout and styles.</li><li><strong>Download:</strong> Click download to save your PDF document.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Digital Receipts:</strong> Saving purchase confirmations and banking statements for tax records.</li><li><strong>Articles &amp; Research:</strong> Keeping offline copies of web articles for study.</li><li><strong>Documentation:</strong> Converting local HTML user guides into printable PDF manuals.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will links still work in the PDF?</strong><br>A: Yes, standard text links usually remain clickable in the generated PDF.</p>
          <p><strong>Q: Is this tool private for saved receipts?</strong><br>A: Yes. If you upload a locally saved HTML file, it is rendered locally on your device.</p>
          <p><strong>Q: Does this converter cost anything?</strong><br>A: No, all tools on ConverterForAll are free with no watermarks.</p>
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

