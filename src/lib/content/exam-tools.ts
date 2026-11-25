export const examToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "exam-photo-resizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Exam Photo & Signature Resizer Does",
        content: "<p>This tool lets you upload one image, choose Photo or Signature mode, select a preset, adjust the crop and export a JPEG. The file picker accepts JPG/JPEG, PNG and WEBP images. The crop and compression work in your browser; the tool does not upload an application or submit anything to an exam portal.</p><p>It is an image-preparation aid, not an official exam validator. A downloaded image is not proof that it meets every visual, identity, live-capture or document rule for a recruitment.</p>"
      },
      {
        title: "What the Presets Actually Control",
        content: "<p>A preset supplies a crop aspect ratio, a minimum and maximum file-size target, a minimum crop width and guidance text. The crop box uses the selected aspect ratio, but the final pixel dimensions depend on the crop area selected from the source image. The implementation can scale a crop up when its width is below the preset minimum; it does not force every result to a fixed width and height. The dimensions shown on a preset card should therefore be treated as guidance, not a guaranteed output size.</p><p>The compressor adjusts JPEG quality when the image is too large and can add JPEG comment data when it is below the configured minimum. The result panel compares the exported JPEG's actual byte size with the selected preset range and reports when it falls outside. This check covers file size only; it does not validate pixel dimensions, DPI, visual content, live-capture requirements or portal acceptance.</p>"
      },
      {
        title: "Check the Current Recruitment Notice Before Using a Preset",
        content: `
          <p>Photo and signature instructions differ by recruiting body, examination, post and application year. Presets on this page are stored convenience settings; they are not fetched from official portals or automatically updated when a notification changes.</p>
          <p><strong>Example — SSC CGL 2026:</strong> The <a href="https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf" target="_blank" rel="noopener noreferrer">SSC CGL 2026 notice</a> instructs candidates to capture their application photograph through the portal's camera workflow. It separately specifies a scanned JPEG/JPG signature of 10–20 KB, about 6.0 cm × 2.0 cm. This tool only crops an existing image; it cannot perform SSC's live-photo capture. Its generic SSC preset should not be treated as an SSC CGL 2026-compliant profile.</p>
          <p><strong>Example — UPSC Engineering Services 2027:</strong> The <a href="https://www.upsc.gov.in/uploads/2026/09/Notif-ESEP-2027-Engl-160926.pdf" target="_blank" rel="noopener noreferrer">UPSC ESE 2027 notice</a> requires both an uploaded photograph and a separate live photograph. It also asks candidates to upload three signatures one below another. A single cropped image from this tool cannot fulfil the live-capture step or verify a triplicate signature.</p>
          <p>Before uploading, read the notification and the live application portal instructions for your exact recruitment cycle. Check the required image type, pixel dimensions, file-size range, background, date or name markings, signature layout and any live-photo or additional-document steps.</p>
        `
      },
      {
        title: "How to Use the Resizer",
        content: "<ol><li><strong>Select the image type:</strong> Choose Photo or Signature.</li><li><strong>Choose a preset:</strong> Use it only as a starting point after checking the current recruitment instructions.</li><li><strong>Upload one image:</strong> Select a JPG/JPEG, PNG or WEBP image.</li><li><strong>Adjust the crop:</strong> Move and zoom the image inside the crop frame. The tool does not assess whether your face, signature, background or ink meets the portal's visual rules.</li><li><strong>Export and inspect:</strong> Create the JPEG, check its actual file size and image dimensions, and compare them with the official instructions before uploading it yourself.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool guarantee that my photo or signature will be accepted?</strong><br>A: No. It crops and compresses an image; it does not check the recruitment portal's complete requirements or guarantee acceptance.</p>
          <p><strong>Q: Can it capture a live photograph for SSC or UPSC?</strong><br>A: No. It accepts an existing image file. When an application requires a live photograph through its own camera or mobile workflow, complete that step on the official portal.</p>
          <p><strong>Q: Will the output always have the exact pixel dimensions shown in the preset?</strong><br>A: No. The crop ratio is applied, but final pixel dimensions depend on the selected crop area. The tool only scales up when the crop width is below the configured minimum; it does not enforce a fixed width-and-height pair.</p>
          <p><strong>Q: Which image formats can I upload, and what format is downloaded?</strong><br>A: The file picker accepts JPG/JPEG, PNG and WEBP. The generated output is JPEG.</p>
          <p><strong>Q: Does it remove or replace the photo background or clean a signature?</strong><br>A: No. It does not perform background removal, paper whitening, ink extraction or signature verification. Prepare an image with the required background and appearance before using the cropper.</p>
          <p><strong>Q: Does it set a specific DPI value?</strong><br>A: There is no DPI setting in this crop-and-export workflow. Check whether your recruitment portal specifies pixel dimensions, physical dimensions or resolution metadata, and use a suitable editor if it requires something this tool does not create.</p>
          <p><strong>Q: Is the image uploaded to a conversion server?</strong><br>A: The component reads the selected image in the browser and crops it with Canvas. The crop-and-compression workflow does not send the image to a conversion API.</p>
          <p><strong>Q: How can I check whether the file-size target was met?</strong><br>A: Check the numeric file size shown after processing and inspect the downloaded JPEG's properties. The result panel reports whether the exported JPEG's actual byte size falls within the selected preset range. That is only a file-size check, not a portal-compliance check; compare the image with the current recruitment notification.</p>
        `
      }
    ]
  },
  "photo-name-date-stamper": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Photo Name & Date Stamper Does",
        content: "<p>Upload an image, enter a candidate name and a date of photograph, choose a crop mode, set the strip placement and colour, then download a JPEG with the text stamped onto the image. The tool renders the result on a browser Canvas. It adds the values you enter; it does not verify your identity, the accuracy of the name or date, or whether a particular recruitment portal requires those details.</p>"
      },
      {
        title: "Crop Ratio and Output Dimensions",
        content: "<p>The Portrait option crops the image to a 3.5:4.5 aspect ratio. The Original option keeps the source image's proportions. The output pixel dimensions depend on the source image and the selected crop area. The tool does not set a physical print size in millimetres, enforce a fixed pixel width and height, or write a DPI value. A 3.5:4.5 crop ratio is not a guarantee of an exact 35 mm × 45 mm printed photo.</p>"
      },
      {
        title: "How the Name and Date Strip Works",
        content: "<p>The candidate name is rendered in uppercase. The date input is formatted as DD/MM/YYYY in the output and appears with the label DOP. You can choose to overlay the strip at the bottom of the cropped photo or append a strip below it, select a white or black strip, and adjust text scale and strip height.</p><p>The tool does not check whether the date is within a required age window, whether the date format matches a particular notification, whether the strip position or size is officially accepted, or whether the entered name matches your application. Confirm those details yourself against the current instructions for your recruitment.</p>"
      },
      {
        title: "What the One-Click Presets Change",
        content: "<p>The UPSC-style and State/SSC-style buttons are local visual presets. They set a combination of strip placement, strip colour, strip-height ratio and text scale. They do not fetch official specifications, check the current notification or certify that the resulting layout is compliant. Treat the preset names as starting points and compare the result with the requirements for your exact exam and application cycle.</p>"
      },
      {
        title: "JPEG Output, File Size and Privacy",
        content: "<p>The download is re-encoded as JPEG at a Canvas quality setting of 0.95. There is no target file-size control, so the final size depends on the source image dimensions and image content. The tool does not guarantee an output such as 20 KB, 50 KB or any other portal limit.</p><p>The selected image is read with FileReader and drawn to Canvas in the browser. This component does not send the photo to a photo-stamping API. After stamping, you can use the separate Exam Photo Resizer to crop and try one of its stored file-size presets, then check the actual output against the official instructions.</p>"
      },
      {
        title: "How to Stamp a Photo",
        content: "<ol><li><strong>Upload an image:</strong> Select a photo file that your browser can decode. The interface lists JPG, PNG and WEBP as supported examples.</li><li><strong>Choose the crop:</strong> Select the 3.5:4.5 portrait crop or keep the original aspect ratio. Adjust the crop position if the portrait crop is applied to a landscape image.</li><li><strong>Enter the text:</strong> Type the candidate name and choose the date of photograph. The tool formats the date as DD/MM/YYYY.</li><li><strong>Set the strip:</strong> Choose the visual preset or manually adjust strip placement, contrast, height and text scale.</li><li><strong>Inspect and download:</strong> Review the canvas preview and download the JPEG. Check the image dimensions, file size, name, date and layout against the current recruitment notice.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool check whether a recruitment requires a name and date on the photo?</strong><br>A: No. It stamps the values you enter. It does not identify the exam or verify whether a name/date strip is required.</p>
          <p><strong>Q: Does it enforce a three-month Date of Photograph (DOP) rule?</strong><br>A: No. You choose the date manually, and the tool prints it. It does not calculate or validate the date's age against an exam notification.</p>
          <p><strong>Q: Does the Portrait option create an exact 35 mm × 45 mm printed photograph?</strong><br>A: No. It applies a 3.5:4.5 crop ratio. The pixel dimensions depend on the source crop; the tool does not set print size or DPI.</p>
          <p><strong>Q: Does the tool compress the stamped image to 20 KB or 50 KB?</strong><br>A: No. It exports a JPEG at quality 0.95 but has no target file-size control. Check the downloaded JPEG's actual size.</p>
          <p><strong>Q: Does the UPSC or State/SSC preset guarantee that the layout is accepted?</strong><br>A: No. These buttons change visual settings only. Verify the current official instructions for your exam and application cycle.</p>
          <p><strong>Q: Which date format appears on the output?</strong><br>A: The entered date is printed as DD/MM/YYYY after the DOP label.</p>
          <p><strong>Q: Is the photo uploaded to a stamping server?</strong><br>A: The component reads the selected image in the browser and draws it to Canvas. This photo-stamping component does not send the image to a stamping API.</p>
          <p><strong>Q: What file format is downloaded?</strong><br>A: The stamped image is downloaded as JPEG.</p>
        `
      }
    ]
  },
  "exam-signature-resizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Signature Photo Cropper and Whitener Does",
        content: "<p>Upload one JPG/JPEG, PNG or WEBP image, crop the signature area, choose a black-ink or blue-ink filter mode, adjust the paper-whitening threshold and export a JPEG. The image is read and processed in the browser using Canvas. The component does not upload the selected image to a signature-processing API or submit it to an exam portal.</p><p>This is an image crop and filter tool, not a signature verifier or official recruitment validator. It does not check whether the handwriting, ink, background or final image meets a particular application's rules.</p>"
      },
      {
        title: "How the Paper and Ink Filters Work",
        content: "<p>The Paper Whitener control adjusts a brightness threshold: pixels above the threshold are changed to white. Darker grey shadows or uneven paper tones can remain because the tool does not perform a separate background-segmentation or shadow-removal operation.</p><p>Black Ink mode converts the remaining pixels to grayscale and adjusts their brightness. Blue Ink mode uses a simple blue-dominance check to emphasize pixels where blue is stronger than red and green; other pixels are converted to grayscale. These are image filters, not precise ink extraction. Fine strokes, coloured paper, shadows and mixed lighting can affect the result. Inspect the preview and downloaded JPEG at full size.</p>"
      },
      {
        title: "What the Presets Control — and What They Do Not",
        content: "<p>The preset selector provides stored crop ratios, minimum crop widths and file-size ranges. The crop frame follows the selected aspect ratio. The output canvas is based on the crop area the user selects; the code can scale it up when its width is below the preset minimum, but it does not enforce the preset's displayed pixel dimensions, a maximum pixel width, a physical print size or a DPI value.</p><p>The preset values are saved in the site's configuration. They are not fetched from recruitment portals and are not automatically updated when a notification changes. Preset names and values are convenience starting points, not proof that a file matches SSC, UPSC, IBPS, RRB, NTA, GATE or any other current application requirement. Always check the latest notification for the exact exam, post and cycle.</p>"
      },
      {
        title: "JPEG File-Size Behaviour",
        content: "<p>The compressor first creates a JPEG and, if it is larger than the selected maximum, tries up to ten JPEG-quality values to find a smaller result. If none of those attempts reaches the maximum, the function can still return the best available blob even when it remains oversized. When a JPEG is smaller than the configured minimum, the implementation may add JPEG comment metadata to increase its byte count; this padding does not improve image quality.</p><p>The result panel checks the exported blob's actual byte size against the selected preset range and shows whether it is inside or outside that range. This is only a byte-size comparison. It does not validate the image's dimensions, visual quality, signature content or portal acceptance.</p>"
      },
      {
        title: "How to Use the Signature Tool",
        content: "<ol><li><strong>Choose a preset starting point:</strong> Select the stored crop ratio and byte-size range you want to try. Compare them with the current recruitment notice before relying on them.</li><li><strong>Upload one image:</strong> Select a JPG/JPEG, PNG or WEBP signature image.</li><li><strong>Adjust the crop:</strong> Move and zoom the source image inside the crop frame.</li><li><strong>Adjust the filters:</strong> Choose Black Ink or Blue Ink, then tune the Paper Whitener threshold. Check that the signature strokes remain visible and that unwanted paper shading is acceptably reduced.</li><li><strong>Export and inspect:</strong> Create the JPEG, review the actual file-size status, and inspect its dimensions and appearance before uploading it yourself.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool completely remove every grey paper shadow?</strong><br>A: No. It changes pixels above a brightness threshold to white. Darker shadows and uneven paper tones may remain; the tool does not use a dedicated background-removal or shadow-segmentation model.</p>
          <p><strong>Q: Does Blue Ink mode preserve every blue signature exactly?</strong><br>A: No. It uses a simple colour comparison to emphasize pixels where blue is stronger than red and green. It is not precise ink extraction, so inspect the result for colour and stroke loss.</p>
          <p><strong>Q: Will the output always have the exact pixel dimensions shown in a preset?</strong><br>A: No. The crop uses the preset aspect ratio, and the implementation only scales up when the selected crop width is below the preset's minimum. It does not set a fixed width-and-height pair or DPI.</p>
          <p><strong>Q: Is the file guaranteed to fall within the selected KB range?</strong><br>A: No. The compressor tries up to ten JPEG-quality settings. If none reaches the maximum, it can return a file above the range. The result panel compares the exported file's actual byte size with the selected range.</p>
          <p><strong>Q: Does increasing a file to the minimum KB improve its image quality?</strong><br>A: No. When the JPEG is below the minimum, the implementation can add JPEG comment metadata to increase its file size. That padding does not add image detail or improve quality.</p>
          <p><strong>Q: Which file types can I upload, and what type is downloaded?</strong><br>A: The dropzone accepts JPG/JPEG, PNG and WEBP images. The tool exports a JPEG.</p>
          <p><strong>Q: Can I upload a Word or PDF document?</strong><br>A: No. The tool processes one image file. It does not import documents, preserve document formatting or submit files to an exam portal.</p>
          <p><strong>Q: Is my signature uploaded to a conversion server?</strong><br>A: The component reads the selected image in the browser and processes it with Canvas. This component does not send the image to a signature-processing API.</p>
          <p><strong>Q: Does the preset guarantee acceptance by SSC, UPSC, IBPS or another portal?</strong><br>A: No. Presets are local starting points, not live portal specifications. Check the current notification and application instructions for your exact recruitment cycle.</p>
        `
      }
    ]
  },
  "compress-pdf-100kb": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the PDF Size Reducer Does",
        content: "<p>Upload one PDF and choose a file-size target, such as 100 KB, 200 KB, 300 KB, 500 KB or a custom value. The tool renders each PDF page in the browser, converts the page image to JPEG and assembles those images into a new PDF. It is an image-based size reducer, not a lossless PDF optimizer.</p><p>The compressor attempts to reach the selected target, but it can still return a file that is larger than the target after its retry passes. Check the actual output size shown in the result before using the file.</p>"
      },
      {
        title: "How Compression Works",
        content: "<p>The tool uses PDF.js to render pages to Canvas and pdf-lib to create a new PDF from embedded JPEG images. It adjusts page render scale and tries a limited set of JPEG quality values, then rebuilds the PDF over up to five overall passes. If the result is still above the internal size target after the final pass, the current implementation returns that last result rather than rejecting it or guaranteeing the requested size.</p><p>For the built-in 100, 200, 300 and 500 KB presets, the compressor uses an internal byte target below the displayed limit as a safety margin. Custom targets also reserve some bytes for PDF overhead. These are attempts to reduce the chance of exceeding the chosen size, not guarantees.</p>"
      },
      {
        title: "Important: The Output Pages Are Images",
        content: "<p>Because each page is rendered and embedded as a JPEG image, the rebuilt PDF does not retain the original page text as selectable or searchable text. It does not run OCR to recreate a text layer. Vector artwork is rasterized, and small print, thin lines, stamps and signatures can become less clear when the page is downscaled or JPEG-compressed.</p><p>The new PDF is assembled from rendered page images. Do not use this tool when you need to preserve editable text, vector graphics, form fields or other interactive PDF elements. Keep the original document and compare the result at normal and zoomed viewing sizes.</p>"
      },
      {
        title: "File-Size Targets Are Not Portal Verification",
        content: "<p>The built-in 100, 200, 300 and 500 KB options and the custom value are local size targets. They are not live specifications retrieved from SSC, UPSC, NTA, State PSC or other application portals. Requirements vary by examination, document type, post and application cycle. Check the current official instructions before choosing a target.</p><p>The result panel compares the exported PDF's actual byte size with the selected target. A result within that size limit is not a portal acceptance check: the tool does not validate page content, readability, document authenticity, page count, orientation, password rules or the receiving portal's other requirements.</p>"
      },
      {
        title: "Browser Processing, Input and Output",
        content: "<p>The selected PDF is read in the browser, rendered by PDF.js and rebuilt with pdf-lib. This component does not send the selected PDF to a conversion API. It accepts one PDF file and exports a PDF file. Very large or multi-page documents can require substantial browser memory and processing time; the page may display a device-memory warning for higher-risk files.</p><p>Password-protected PDFs may fail to open in the current workflow. If processing fails, check whether the PDF is encrypted or damaged.</p>"
      },
      {
        title: "How to Try Compressing a PDF",
        content: "<ol><li><strong>Select one PDF:</strong> Choose the document you want to reduce.</li><li><strong>Choose a size target:</strong> Pick a built-in KB target or enter a custom value.</li><li><strong>Run compression:</strong> The tool renders pages as images and attempts to reduce their resolution and JPEG quality enough to approach the target.</li><li><strong>Check the result:</strong> Review the actual output size and first-page sample. The preview is captured from the initial render, so the final PDF can be lower resolution than the sample.</li><li><strong>Inspect the full PDF:</strong> Open the downloaded file, check every page for readability and verify that its actual size and format meet the current upload instructions.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is the PDF guaranteed to be below 100 KB or my chosen target?</strong><br>A: No. The compressor tries several render scales and JPEG quality settings over up to five passes. If the final result is still above the target, the current implementation returns that result. Check the actual file-size status.</p>
          <p><strong>Q: Will my text remain selectable and searchable after compression?</strong><br>A: No. Each page is converted to a JPEG image and placed into a new PDF. The tool does not run OCR or recreate a selectable text layer.</p>
          <p><strong>Q: Does it preserve the original PDF's vector graphics and interactive elements?</strong><br>A: No. The pages are rendered to images before the new PDF is assembled. Vector elements are rasterized, and the original interactive PDF structure is not retained as such.</p>
          <p><strong>Q: Will small text and signatures remain perfectly clear?</strong><br>A: This is not guaranteed. Reducing page scale and JPEG quality can soften small text, fine lines, stamps and signatures. Inspect every page before relying on the output.</p>
          <p><strong>Q: Is the PDF uploaded to a conversion server?</strong><br>A: The component reads the selected PDF in the browser and processes it with PDF.js, Canvas and pdf-lib. This component does not send the PDF to a conversion API.</p>
          <p><strong>Q: Can I compress a password-protected PDF?</strong><br>A: Password-protected PDFs may fail to open in this workflow. The current error message asks you to check whether the document is encrypted.</p>
          <p><strong>Q: Does a file-size result within the target mean a portal will accept it?</strong><br>A: No. The result panel only checks the byte size against your chosen target. It does not verify document type, readability, authenticity or any portal-specific rules.</p>
          <p><strong>Q: Why does the output look different from the original PDF?</strong><br>A: The tool rebuilds each page as a JPEG image. Text, vector lines and other content are rasterized, and image scaling or compression can affect appearance and legibility.</p>
        `
      }
    ]
  },
};
