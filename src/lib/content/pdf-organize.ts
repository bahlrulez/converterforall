export const pdfOrganizeContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "merge-pdf": {
    sections: [
      {
        title: "Universal PDF Merger: Combine PDF, Word (DOCX), JPG, and PNG Online for Free",
        content: "<p>Welcome to the universal document combiner designed to bring all your files together into one clean, polished PDF. Whether you need to attach a Microsoft Word (.docx, .doc) cover letter to a PDF contract, append JPG photographs, or insert PNG screenshots, our powerful in-browser tool merges them seamlessly. Best of all, everything is 100% free, unlimited, and runs locally on your device without cloud server uploads.</p>"
      },
      {
        title: "How to Merge Word Documents, PDFs, and Images in Seconds?",
        content: "<ol><li><strong>Select or Drop Files:</strong> Drag and drop your PDFs, Word documents (.docx, .doc), and images (JPG, PNG, WebP) into the upload area above.</li><li><strong>Arrange Page Sequence:</strong> Drag and reorder the visual file cards to arrange your documents in the exact order you want them to appear.</li><li><strong>Click 'Merge Files':</strong> Our client-side engine parses Word formatting, decodes PDF pages, and embeds high-resolution photos into a single unified document.</li><li><strong>Download Instantly:</strong> Save your complete, professional PDF file directly to your computer or mobile phone with zero watermarks.</li></ol>"
      },
      {
        title: "100% Client-Side Privacy: Your Confidential Files Never Leave Your Device",
        content: "<p>Most online PDF mergers upload your sensitive business contracts, medical forms, tax returns, and personal resumes to remote cloud servers. At <strong>ConverterForAll</strong>, our state-of-the-art WebAssembly and JavaScript engines process everything directly inside your web browser. <strong>0 bytes are uploaded to external servers</strong>, guaranteeing absolute confidentiality, compliance, and instant processing speed.</p>"
      },
      {
        title: "Popular Real-World Merging Workflows",
        content: "<ul><li><strong>Job Applications & Resumes:</strong> Combine a Word (.docx) cover letter, a PDF resume, and scanned JPG recommendation letters into one single application package.</li><li><strong>Legal & Financial Filing:</strong> Merge Word agreements, PDF tax schedules, and ID photo proofs in the exact required sequence.</li><li><strong>Real Estate & Invoicing:</strong> Bundle Word proposal agreements with PDF inspection reports and high-resolution site photos.</li><li><strong>Academic & School Projects:</strong> Stitch together Word essays, reference PDF handouts, and diagram images for clean digital submission.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Can I merge Microsoft Word (.docx / .doc) files directly with PDF documents?</strong><br>A: Yes! You can upload Word documents alongside existing PDFs. Our tool automatically converts the Word document into crisp PDF pages in your browser and merges them together seamlessly into one final document.</p>
          <p><strong>Q: How do I combine JPG, PNG, and WebP images with my PDFs?</strong><br>A: Simply drop your image files into the upload box along with your PDFs or Word files. Each image is automatically scaled and embedded as a full-page photo in your final PDF.</p>
          <p><strong>Q: Are my files kept private and secure?</strong><br>A: 100% yes. All file conversion and PDF page stitching happen locally in your web browser. Your private documents, contracts, and photos never travel across the internet or touch any external server.</p>
          <p><strong>Q: Can I rearrange the order of the files before creating the PDF?</strong><br>A: Yes! Each uploaded document has a preview card. Simply click and drag the cards (or tap and drag on touchscreens) to arrange the exact page order you want.</p>
          <p><strong>Q: Is there any limit on how many files or pages I can merge?</strong><br>A: No. ConverterForAll is 100% free and unlimited. You can combine 2 files or 20+ files in a single session without hitting daily limits or paywalls.</p>
          <p><strong>Q: Will merging degrade the quality of my images or text?</strong><br>A: No. Original PDF text vectors, Word fonts, and high-resolution photo dimensions are preserved with maximum clarity.</p>
          <p><strong>Q: Does this tool add any watermark or logo to my merged PDF?</strong><br>A: Never. Your downloaded PDF is 100% clean, professional, and ready for business, school, or legal use.</p>
          <p><strong>Q: Can I merge Word and PDF files on my phone (iPhone & Android)?</strong><br>A: Yes. The tool works directly inside Safari, Chrome, Edge, and Firefox on all mobile devices and desktop computers without installing any apps.</p>
        `
      }
    ]
  },
  "split-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Split PDF tool is a document separation utility designed to break down large, unwieldy PDF files into smaller, individual documents. Often, you might receive a massive 100-page PDF from a colleague, but you only need to forward three specific pages to a client, or perhaps you want to save every single page as its own separate file. This tool efficiently pulls apart the document, saving you from the hassle of printing, physically separating, and re-scanning pages.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you provide a PDF to be split, our client-side tool loads the document's structure into your browser's memory. It systematically reads the metadata and content of every page. It then creates a brand-new PDF file for every single page in the original document, copying the exact visual data over. To make downloading convenient, it utilizes a local compression library (JSZip) to bundle all these newly generated, single-page PDFs into a single \`.zip\` archive. This entire process executes locally on your CPU, guaranteeing total privacy.</p>"
      },
      {
        title: "Examples",
        content: "<p>Suppose an HR department scans a stack of 50 individual employee review forms into a scanner, which generates one massive 50-page PDF document. Sorting these manually is tedious. By uploading this master document to the Split PDF tool, the HR manager instantly receives a ZIP folder containing 50 separate PDF files—one for each employee. These can then be easily renamed and placed into individual digital employee personnel folders.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your PDF:</strong> Drag and drop your large PDF file into the upload zone.</li><li><strong>Instant Separation:</strong> The browser immediately begins duplicating every page into its own individual PDF file and zipping them together.</li><li><strong>Download Archive:</strong> Click the download button to save the \`.zip\` file to your computer.</li><li><strong>Extract:</strong> Open the \`.zip\` file on your device to access all your newly separated PDF pages.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Client Communication:</strong> Sending a client only the relevant sections of a massive technical manual or architectural blueprint.</li><li><strong>Data Entry:</strong> Breaking apart bulk-scanned invoices so they can be processed individually by accounting software.</li><li><strong>Legal Discovery:</strong> Isolating specific pages of evidence from a massive digital case file for presentation in court.</li><li><strong>Archiving:</strong> Separating bulk documents to properly tag, categorize, and store them in a Content Management System.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What format will my files download in?</strong><br>A: To ensure you receive all your split pages at once, they are packaged into a standard \`.zip\` archive. You will need to extract the ZIP file on your device to view the individual PDFs.</p>
          <p><strong>Q: Will splitting the PDF affect the text quality or images?</strong><br>A: No. The split pages are exact digital clones of the pages in the original document. No compression or quality loss occurs.</p>
          <p><strong>Q: Does this tool upload my document to the cloud?</strong><br>A: Never. The splitting and zipping happen entirely within the memory of your web browser.</p>
          <p><strong>Q: How do I open a ZIP file?</strong><br>A: Most modern operating systems (Windows, macOS, iOS, Android) have built-in support for extracting ZIP files. Simply double-click or tap the file to access its contents.</p>
          <p><strong>Q: Can I split the PDF by specific page ranges instead of single pages?</strong><br>A: Currently, this specific tool splits every single page into its own file. If you want to pull out a specific chunk (like pages 1-5), you should use our Extract Pages tool.</p>
          <p><strong>Q: Is there a page limit for the PDF I can upload?</strong><br>A: The limit is purely based on your device's memory. Splitting a 500-page document might take a few moments and requires a modern computer, but it is entirely possible.</p>
          <p><strong>Q: Will the tool rename the split files automatically?</strong><br>A: Yes, the files inside the ZIP archive will be sequentially numbered (e.g., page_1.pdf, page_2.pdf) to help you keep them organized.</p>
          <p><strong>Q: Is it safe to split financial or medical records?</strong><br>A: Yes, because the tool works completely offline within your browser, your sensitive data is 100% secure.</p>
          <p><strong>Q: Does it cost money to split large PDF documents?</strong><br>A: No, all the tools on our platform are completely free to use.</p>
          <p><strong>Q: Will hyperlinks and text searchability remain intact on the split pages?</strong><br>A: Yes, any text that was searchable in the original document will remain fully searchable in the newly split single pages.</p>
        `
      }
    ]
  },
  "remove-pages": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Remove Pages tool is a precision editing utility that allows you to permanently delete unwanted, blank, or confidential pages from an existing PDF document. Often, when downloading reports or scanning documents, you end up with cover pages, blank spacer pages, or sensitive financial information mixed in with general data. Instead of paying for expensive desktop PDF editing software, this tool allows you to quickly specify which pages you want to eliminate and instantly generates a clean, updated document.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>This tool relies on a modern, browser-based PDF manipulation engine. When you upload your document and input the page numbers you wish to remove (e.g., '1, 3, 5-8'), the tool parses your request into an array of index values. It loads the PDF into memory, navigates to the specified pages, and permanently deletes them from the document's internal node tree. To prevent formatting corruption, it safely restructures the document and exports a fresh, modified PDF file. Because no server is involved, your sensitive data is completely secure.</p>"
      },
      {
        title: "Examples",
        content: "<p>Imagine you are a real estate agent preparing a 40-page property disclosure packet for a prospective buyer. However, pages 12 through 15 contain confidential financial communications between you and the seller that the buyer should not see. By uploading the packet to our Remove Pages tool and typing '12-15' into the selection box, those four pages are instantly excised. You can then confidently email the remaining 36-page document to the buyer without worrying about a privacy breach.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload the PDF:</strong> Select the document containing the pages you wish to delete.</li><li><strong>Specify Pages:</strong> In the text input field, type the page numbers you want to remove. You can use commas for individual pages and hyphens for ranges (e.g., 2, 4, 7-10).</li><li><strong>Process:</strong> Click the primary action button. The browser will instantly delete the targeted pages.</li><li><strong>Download:</strong> Save the newly trimmed PDF document to your device.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Privacy & Redaction:</strong> Removing pages containing Social Security numbers, banking details, or confidential legal arguments before public distribution.</li><li><strong>Document Cleanup:</strong> Deleting blank pages or accidental duplicate scans from a digital filing system.</li><li><strong>Tailoring Proposals:</strong> Taking a massive, generic business proposal and removing the irrelevant service offerings to create a customized pitch for a specific client.</li><li><strong>File Size Reduction:</strong> Eliminating heavy, image-dense introductory pages from a manual to save storage space.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are the pages permanently deleted from my computer?</strong><br>A: They are permanently deleted from the <em>new</em> file you download. Your original file on your computer remains completely untouched and safe.</p>
          <p><strong>Q: Can I remove multiple different ranges at once?</strong><br>A: Yes! You can type complex selections like '1, 3, 5-8, 12-15' and the tool will remove all of those specified pages simultaneously.</p>
          <p><strong>Q: Is this secure for legal documents?</strong><br>A: Absolutely. The page removal happens locally on your device. The document is never sent to our servers, making it completely secure for HIPAA or NDA-protected materials.</p>
          <p><strong>Q: Can I remove the first and last page only?</strong><br>A: Yes. If your document is 10 pages long, you can just type '1, 10' to instantly remove only those two pages.</p>
          <p><strong>Q: Will removing pages reduce the file size?</strong><br>A: Yes. If the pages you remove contain heavy images or graphics, the resulting downloaded PDF will be noticeably smaller in file size.</p>
          <p><strong>Q: Do I need to be connected to the internet to remove pages?</strong><br>A: Once the tool loads in your browser, the processing relies on local scripts. You do not need a continuous internet connection to perform the deletion.</p>
          <p><strong>Q: What happens if I type a page number that doesn't exist?</strong><br>A: The tool will safely ignore it. For example, if you type '50' for a 10-page document, it will just process the document normally without errors.</p>
          <p><strong>Q: Can I use this tool to remove watermarks?</strong><br>A: No. This tool removes entire pages. It cannot edit or remove specific elements, like watermarks or logos, from within a page.</p>
          <p><strong>Q: Will this affect the formatting of the remaining pages?</strong><br>A: Not at all. The internal layout of the remaining pages is perfectly preserved.</p>
          <p><strong>Q: Does this tool add a watermark to my edited PDF?</strong><br>A: Never. Our tools are completely free and will never modify your documents with unwanted branding or watermarks.</p>
        `
      }
    ]
  },
  "extract-pages": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Extract Pages tool is the exact opposite of removing pages: it is designed to help you pull out only the specific pages you <em>want</em> to keep from a massive PDF document, discarding the rest. When dealing with massive ebooks, government regulations, or corporate handbooks, you often only need a handful of pages for your research or reference. This tool allows you to isolate those crucial pages and compile them into a new, lightweight PDF file.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you specify which pages you want to extract (e.g., '5, 10-15'), our local browser-based PDF engine opens your original document in read-only memory. It then creates a completely blank PDF file. The engine carefully copies the exact visual data, text layers, and formatting of your requested pages from the original document and pastes them into the new document in sequential order. Finally, it exports this new, highly focused PDF directly to your hard drive, all without requiring any cloud processing.</p>"
      },
      {
        title: "Examples",
        content: "<p>Suppose you are a university student writing a research paper. You've downloaded a 500-page academic journal in PDF format, but the only information relevant to your thesis is an article spanning pages 234 to 241. Instead of keeping the massive 500-page document cluttering your hard drive and slowing down your PDF reader, you use the Extract Pages tool. You type '234-241', and instantly, you receive a nimble, 8-page PDF containing exactly what you need for your bibliography.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select File:</strong> Upload the large PDF you want to pull pages from.</li><li><strong>Choose Pages:</strong> In the text input area, specify the exact pages you wish to keep (e.g., 4, 8, 15-20).</li><li><strong>Extract:</strong> Click the conversion button. The tool will rapidly copy your chosen pages into a new document.</li><li><strong>Download:</strong> Save your newly focused, lightweight PDF file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Academic Research:</strong> Pulling specific chapters or articles out of massive digital textbooks and academic journals.</li><li><strong>Tax Preparation:</strong> Extracting only the relevant W2s and summary pages from a massive 100-page financial brokerage statement to send to an accountant.</li><li><strong>Presentation Prep:</strong> Pulling specific charts and graphs from various corporate reports to reference during a meeting.</li><li><strong>Invoicing:</strong> Extracting a specific invoice from a monthly bulk-billing document to send to an individual client.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What happens to the pages I don't select?</strong><br>A: They are simply ignored. The new PDF you download will only contain the pages you explicitly requested. Your original file on your computer remains unchanged.</p>
          <p><strong>Q: Can I extract pages out of order?</strong><br>A: Currently, the tool extracts the pages and orders them sequentially based on their position in the original document.</p>
          <p><strong>Q: Is there a file size limit for extraction?</strong><br>A: Because the extraction happens locally on your machine, there are no strict server limits. It simply depends on how much memory your current device has.</p>
          <p><strong>Q: Can I extract just a single page?</strong><br>A: Yes! If you just type "12", it will create a new PDF containing only page 12 of the original document.</p>
          <p><strong>Q: Is this process secure?</strong><br>A: Yes. All file processing happens entirely inside your browser. No files are uploaded to our servers, keeping your documents completely private.</p>
          <p><strong>Q: Will the extracted pages lose their quality or become blurry?</strong><br>A: No, the pages are cloned exactly as they appear in the original document, preserving all vector data and image quality flawlessly.</p>
          <p><strong>Q: Can I extract ranges and single pages at the same time?</strong><br>A: Yes, you can combine them. For example, typing "1, 3, 10-15" will extract pages 1, 3, and all pages from 10 to 15.</p>
          <p><strong>Q: Does this tool cost money?</strong><br>A: No, all tools on ConverterForAll are completely free.</p>
          <p><strong>Q: Can I use this tool on my smartphone?</strong><br>A: Absolutely. Our web interface is optimized for mobile browsers, allowing you to extract pages directly on your phone.</p>
          <p><strong>Q: Will this remove password protection?</strong><br>A: No, if the original PDF is encrypted, you will need to unlock it first before our tool can read and extract the pages.</p>
        `
      }
    ]
  },
  "organize-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Organize PDF tool is a structural editing utility that allows you to completely rearrange and reorder the pages of an existing PDF document. Sometimes, pages get scanned out of order, or you realize that the flow of your presentation would be significantly better if chapter three came before chapter two. Instead of going back to the original source software (like Microsoft Word or InDesign) to move the pages and re-exporting the entire document, this tool lets you reshuffle the deck directly within the PDF itself.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>This tool utilizes a highly optimized client-side PDF parser. When you input your desired new page order using comma-separated values (for example, '3, 1, 2, 4-6'), the engine creates a new, blank PDF document. It then selectively copies pages from your uploaded original file and inserts them into the new document in the exact sequence you specified, including handling backward ranges (like '5-1'). This deep architectural restructuring happens instantaneously within your web browser, preserving perfect image quality and text searchability.</p>"
      },
      {
        title: "Examples",
        content: "<p>Imagine you used an automatic document feeder on an office scanner to digitize a 10-page contract, but the pages were accidentally loaded backwards. The resulting PDF reads from page 10 down to page 1. Instead of physically re-scanning the stack, you can simply upload the PDF to our Organize tool, type '10-1' into the order selection box, and instantly download a perfectly corrected document that reads from page 1 to 10 in the correct, logical flow.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your Document:</strong> Add the PDF whose pages need rearranging to the upload zone.</li><li><strong>Specify New Order:</strong> In the text input field, type the exact order you want the pages to appear. For example, typing '3, 1, 2, 4-10' moves page 3 to the very front.</li><li><strong>Process:</strong> Click the action button to have the browser instantly restructure the document tree.</li><li><strong>Download:</strong> Save your newly organized PDF back to your device.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Correcting Scans:</strong> Fixing documents that were scanned out of order or upside down in an automatic feeder.</li><li><strong>Presentation Tuning:</strong> Rearranging the flow of a slide deck to better suit a specific audience's narrative needs.</li><li><strong>Portfolio Curation:</strong> Moving your strongest or most relevant work samples to the very front of your design or writing portfolio.</li><li><strong>Document Assembly:</strong> Reordering a massive report so that the executive summary appears before the dense methodology section.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I duplicate pages using this tool?</strong><br>A: Yes! If you type '1, 1, 1, 2, 3', the tool will copy page 1 three times before moving on to the rest of the document.</p>
          <p><strong>Q: What happens if I leave a page number out of my sequence?</strong><br>A: If a page number is omitted from your custom order list, it will not be included in the final downloaded PDF. This means you can organize and remove pages simultaneously.</p>
          <p><strong>Q: Does reordering pages break hyperlinks?</strong><br>A: Internal document links (like a table of contents) may become inaccurate if the destination page is moved, as standard PDFs link to a specific page index. External web links will continue to work perfectly.</p>
          <p><strong>Q: Is my data kept private?</strong><br>A: Yes. The restructuring occurs locally inside your web browser. We never upload or view your documents.</p>
          <p><strong>Q: Can I reverse the order of the entire document?</strong><br>A: Yes. If your document has 20 pages, simply type "20-1" and it will instantly flip the entire document backwards.</p>
          <p><strong>Q: Does this work on Mac and Windows?</strong><br>A: Yes, because it is web-based, it works flawlessly on macOS, Windows, Linux, and all mobile platforms.</p>
          <p><strong>Q: Will my page numbers at the bottom of the page automatically update?</strong><br>A: No. The visual numbers printed on the pages are static text. The PDF structural page order will change, but the printed numbers will remain what they originally were.</p>
          <p><strong>Q: Is there any limit to how many times I can reorganize a file?</strong><br>A: No limits whatsoever. You can use this tool completely free as many times as you like.</p>
          <p><strong>Q: Can I use this tool to combine two different PDFs?</strong><br>A: No, this tool only reorganizes the pages of a single uploaded PDF. To combine two different files, use our Merge PDF tool.</p>
          <p><strong>Q: Will organizing the pages degrade their quality?</strong><br>A: Not at all. The process is completely lossless, retaining original fonts, images, and formatting.</p>
        `
      }
    ]
  },
  "scan-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Scan to PDF tool is a modern digital utility that turns your device's camera into a portable document scanner. Traditionally, digitizing physical documents like receipts, whiteboard notes, signed contracts, or ID cards required bulky, expensive hardware scanners. With this tool, you can simply take a photograph using your smartphone, tablet, or laptop webcam, and instantly convert that raw image into a standardized, universally accepted PDF document, ready for professional archiving or emailing.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you access this tool on a device with a camera, clicking the 'Take Photo' button securely triggers your device's native camera application. Once you snap a picture of your document, the image is passed directly into your browser's local memory. The client-side processing engine then creates a brand-new PDF container, calculates the optimal dimensions based on your photograph's resolution, and seamlessly embeds the image onto the PDF page. Because it leverages your browser, no apps need to be installed, and your private documents are never uploaded to a remote server.</p>"
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
