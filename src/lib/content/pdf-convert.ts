export const pdfConvertContent: Record<string, { sections: { title: string, content: string }[] }> = {
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
        content: "<p>The PowerPoint to PDF converter turns Microsoft PowerPoint presentation files (.ppt, .pptx) into standard PDF documents. Converting slides to PDF locks your formatting and fonts in place, ensuring colleagues and clients can view your slides on any phone, tablet, or computer even if they don't have PowerPoint installed.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Our tool parses the slide structure, text, and embedded graphics from your PowerPoint presentation and generates a standard PDF document. For supported in-browser conversions, the processing occurs directly on your device without server upload wait times.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you created a pitch deck or class presentation in PowerPoint and need to email it to someone who might open it on a phone or tablet, converting it to PDF ensures your fonts, images, and layout stay clean and readable.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Presentation:</strong> Drag and drop your .pptx file into the box.</li><li><strong>Conversion:</strong> The tool reads and formats the slide contents.</li><li><strong>Download:</strong> Click download to save your PDF slides.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Client Proposals:</strong> Sharing non-editable versions of slides so formatting remains locked.</li><li><strong>Handouts &amp; Study Sheets:</strong> Printing presentation slides as handouts for meetings or classes.</li><li><strong>Mobile Viewing:</strong> Enabling smooth slide viewing on devices without Microsoft Office.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will slide animations work in the PDF?</strong><br>A: No. PDFs are static documents, so animations and video clips are flattened to show the final slide appearance.</p>
          <p><strong>Q: Are my presentations kept private?</strong><br>A: Yes. Your presentation files are handled securely without permanent server storage.</p>
          <p><strong>Q: Do I need a Microsoft 365 subscription?</strong><br>A: No. The converter runs independently in your web browser.</p>
        `
      }
    ]
  },
  "excel-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Excel to PDF converter transforms Microsoft Excel spreadsheets (.xls, .xlsx) into fixed-layout PDF files. Sharing raw spreadsheets can lead to accidental formula edits or messy printing. Converting your spreadsheet to PDF locks your data into a clean, printable document that anyone can open without spreadsheet software.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool reads your spreadsheet rows, columns, and tables, calculating page boundaries to create a clean, formatted PDF document. Processing runs efficiently without requiring your financial records to be permanently stored on external servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you built an invoice, monthly budget, or expense report in Excel and want to share it with a client, converting it to PDF ensures they see the finalized calculations in a clean document ready for printing or filing.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Spreadsheet:</strong> Drag and drop your .xlsx file into the box.</li><li><strong>Rendering:</strong> The tool organizes your spreadsheet tables into PDF pages.</li><li><strong>Download:</strong> Click download to save your new PDF report.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Financial Summaries:</strong> Sending clean balance sheets, invoices, and budget reports.</li><li><strong>Easy Printing:</strong> Locking in margins and table layout so sheets print without missing columns.</li><li><strong>Mobile Sharing:</strong> Sharing data tables that can be opened on any phone without Office apps.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my Excel formulas still work in the PDF?</strong><br>A: No. The PDF shows the final calculated values of your cells.</p>
          <p><strong>Q: Are my financial spreadsheets secure?</strong><br>A: Yes. Your documents are processed securely and are never stored or logged on our servers.</p>
          <p><strong>Q: Will the text remain selectable and searchable?</strong><br>A: Yes, table text and numbers remain searchable inside the PDF.</p>
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
    sections: [
      {
        title: "Word to PDF Converter - Convert DOCX & DOC to PDF Online",
        content: "<p>Our Word to PDF converter transforms Microsoft Word documents (.docx, .doc) into clean, standard PDF files. Whether you are submitting a resume, emailing a business contract, or sharing an assignment, converting to PDF keeps your formatting, fonts, and margins locked in across all devices.</p>"
      },
      {
        title: "How does Word to PDF conversion work?",
        content: "<p>The converter reads the text, headings, tables, and embedded images from your Word document and formats them into a PDF copy. For supported files, conversion runs directly in your browser's local memory, keeping your documents private.</p>"
      },
      {
        title: "Step-by-Step: How to Convert Word to PDF",
        content: "<ol><li><strong>Select Your Word Document:</strong> Drag and drop your .docx or .doc file into the box, or browse your device.</li><li><strong>Conversion:</strong> The tool reads the layout, typography, and embedded elements.</li><li><strong>Download:</strong> Click 'Download PDF' to save your new file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Will my converted PDF keep its layout and page count?</strong><br>A: Yes. The converter maps typography, tables, and spacing to match your original Word document as closely as possible.</p>
          <p><strong>Q: Are my confidential documents kept private?</strong><br>A: Yes. Files are processed securely in temporary memory and are never permanently stored, logged, or shared.</p>
          <p><strong>Q: Does this tool support tables and images?</strong><br>A: Yes. Embedded photos, charts, and tables from your Word document are included in the PDF.</p>
          <p><strong>Q: Can I convert Word documents on my phone?</strong><br>A: Yes. The converter works in mobile browsers on iOS and Android as well as desktop computers.</p>
        `
      }
    ]
  }
};

