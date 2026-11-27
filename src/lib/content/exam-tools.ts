export const examToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "exam-photo-resizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Prepare a photo or signature image",
        content: "<p>Choose a reference preset, crop the image, and let the browser try JPEG quality settings for the selected file-size range. The preset controls the crop aspect ratio, minimum source width, and target size range; it does not create fixed centimetre dimensions, fixed pixel dimensions, or a DPI setting.</p>"
      },
      {
        title: "Use the latest exam instructions",
        content: "<p>Exam bodies can change image requirements between notifications and recruitment cycles. The values shown in this tool are reference presets, not live or officially verified portal specifications. Check the current official notification for the exact format, pixel dimensions, file-size range, background, and date requirements before uploading.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose a reference preset:</strong> Select an exam preset matching the approximate aspect ratio and file-size range from your notice.</li><li><strong>Upload and crop:</strong> Select your photograph and position the crop box cleanly around your head and shoulders.</li><li><strong>Download and inspect:</strong> Save the compressed JPEG, check its displayed KB size, and verify every portal requirement before submitting.</li></ol>"
      },
      {
        title: "Check the exported file",
        content: "<p>The compressor tries several JPEG quality levels and may add JPEG comment metadata when the generated image is below the preset minimum. It cannot guarantee that every input image will fit the selected range. Review the actual downloaded file size and image quality; do not submit an output that falls outside the portal's stated requirements.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Are my selected images sent to a conversion API?</strong><br>A: The photo and signature resizers use browser FileReader and canvas operations for image processing; they do not send the selected image to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Q: Does a preset guarantee acceptance?</strong><br>A: No. It is a convenience starting point. Only the current examination instructions determine what the portal accepts.</p><p><strong>Q: What if the output is outside the target size?</strong><br>A: Try another crop or source image, then check the resulting file size again. If it still does not meet the official requirement, use another image editor or compression workflow.</p>"
      }
    ]
  },
  "photo-name-date-stamper": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Add a candidate name and photograph date",
        content: "<p>This browser-based canvas tool adds the name text and a date-of-photograph label to an image. You can choose a white or black strip, adjust its height and text scale, and choose whether the strip overlays the photo or extends the canvas.</p>"
      },
      {
        title: "Confirm whether a date label is required",
        content: "<p>Some examination or recruitment instructions request a candidate name, date of photograph, or both; others do not. Requirements and date formats can change. Check the current official notification before adding a label, and enter the date that the photograph was actually taken.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your photo:</strong> Choose a clear front-facing JPG or PNG photograph from your device.</li><li><strong>Enter name and date:</strong> Type the candidate name and date of photograph in the format requested by your exam notification, then pick white or black strip styling.</li><li><strong>Download and verify:</strong> Export the labeled JPEG at quality 0.95 and check legibility and dimensions against your portal rules.</li></ol>"
      },
      {
        title: "Output quality and size",
        content: "<p>The tool exports a new JPEG from the canvas at a quality setting of 0.95. This is a recompressed image, so the file size and image quality may differ from the original. Review the output dimensions, text legibility, and file size before submitting it.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Does the tool upload my photo to a conversion API?</strong><br>A: The image is read in the browser and drawn to a canvas; this tool does not send it to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Q: Does it automatically meet an exam portal's photo requirements?</strong><br>A: No. It adds a label and a selectable crop; it does not verify the latest portal rules or guarantee acceptance. Check the current official instructions.</p><p><strong>Q: Can I compress the result afterward?</strong><br>A: Yes. You can use the Exam Photo Resizer to try a crop and file-size target, then inspect the actual output. The preset is not a guarantee of portal compliance.</p>"
      }
    ]
  },
  "exam-signature-resizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Clean and crop a signature image",
        content: "<p>Upload a JPEG, PNG, or WebP signature photo, adjust the crop, choose black-and-white or blue-ink treatment, and tune the paper-whitening threshold. The result is exported as a JPEG using the selected preset's crop ratio and target file-size range.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select a signature photo:</strong> Upload a clearly lit JPEG, PNG, or WebP scan or phone photo of your handwritten signature on plain white paper.</li><li><strong>Crop and tune ink cleanup:</strong> Tighten the crop around your signature, choose black-and-white or blue-ink styling, and raise or lower the paper-whitening slider to clear background paper shadows.</li><li><strong>Check the exported KB size:</strong> Download the processed JPEG and inspect both stroke clarity and file size against your current portal requirements.</li></ol>"
      },
      {
        title: "Presets are reference values, not official requirements",
        content: "<p>The available settings cover several common recruitment categories, but they are not live official specifications. Different examinations and recruitment cycles may ask for different dimensions, formats, ink colours, and file-size limits. Always use the current notification as the source of truth.</p>"
      },
      {
        title: "Verify the result before submitting",
        content: "<p>The compressor attempts to place the JPEG within the selected size range. Very simple images may need metadata padding to reach the lower threshold, while a complex image may remain above the upper threshold after compression. Check the actual file size, crop, and legibility before submission.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Is the selected signature sent to a conversion API?</strong><br>A: The signature editor uses browser FileReader and canvas operations and does not send the selected image to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Q: Does the tool guarantee a portal-ready signature?</strong><br>A: No. It creates an edited JPEG and shows its file size. You must compare the result with the current portal instructions.</p><p><strong>Q: Will paper whitening always remove every shadow?</strong><br>A: Results depend on the lighting, paper colour, ink, and chosen threshold. Inspect the preview and adjust the settings as needed.</p>"
      }
    ]
  },
  "compress-pdf-100kb": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Compress a PDF toward a target file size",
        content: "<p>This browser-based tool rasterizes each source Portable Document Format (<code>.pdf</code>) page onto a canvas image, recompresses the page images as JPEGs, and assembles them into a new PDF. It tries several page scales and JPEG quality levels to approach your selected target KB size.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose a target KB cap:</strong> Pick the preset ceiling matching your application form limit (such as 100 KB, 200 KB, or 300 KB).</li><li><strong>Select your PDF document:</strong> Drop your <code>.pdf</code> file into the tool to start multi-pass page rasterization and compression in browser memory.</li><li><strong>Inspect the output:</strong> Download the smaller PDF, verify its final KB size, and zoom into small text and signatures before uploading to a portal.</li></ol>"
      },
      {
        title: "Important output limitations",
        content: "<p>The result is image-based: text is not retained as selectable or searchable text, and links, forms, bookmarks, accessibility structure, vector graphics, and original document metadata are not preserved as in the source PDF. Compression can reduce text legibility, especially at small file-size targets.</p>"
      },
      {
        title: "Check the final file size and every page",
        content: "<p>The tool makes up to five compression passes, but the final PDF can still remain above the selected target for some inputs. Check the displayed file size and inspect all pages at normal reading size before using the file. No portal acceptance or file-size limit is guaranteed.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Are my documents sent to a conversion API?</strong><br>A: The compression code reads the file in the browser and uses PDF.js, canvas, and PDF assembly libraries locally; it does not send the selected PDF to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Q: Will the output remain searchable?</strong><br>A: No. Pages are rasterized to JPEG images before being placed into the output PDF, so text is not retained as selectable text.</p><p><strong>Q: Will every file reach the selected KB target?</strong><br>A: No. The tool tries several scales and quality levels. Some PDFs cannot reach the requested size without unacceptable quality loss or may remain above the target.</p>"
      }
    ]
  },
  "image-dpi-converter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Update JPG or PNG DPI metadata without resampling",
        content: "<p>This browser-based tool updates or inserts the DPI density header inside JPEG (<code>JFIF APP0</code>) and PNG (<code>pHYs</code>) files. You can choose a quick preset for <strong>72 DPI</strong>, <strong>96 DPI</strong>, <strong>200 DPI (Sarkari)</strong>, or <strong>300 DPI (Print)</strong>, or enter any custom positive DPI value. Only standard JPG/JPEG and PNG files are accepted; WEBP, AVIF, and SVG images are not supported here.</p>"
      },
      {
        title: "What DPI metadata changes — and what stays unchanged",
        content: "<p>Changing the DPI header only modifies how many dots per inch are recorded in the file metadata. It does <strong>not</strong> resize pixel width and height, crop your photo, compress the file to a target KB limit, or add visual detail to a blurry scan. Because the pixel buffer is copied directly rather than re-encoded on a canvas, your image resolution and compression quality stay untouched.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose a target DPI:</strong> Pick 72, 96, 200, or 300 DPI, or enter a custom DPI value. You can also adjust the DPI after uploading and files will re-process automatically.</li><li><strong>Drop your JPG or PNG images:</strong> Select one or multiple JPEG or PNG files to update their metadata headers in a batch.</li><li><strong>Download and inspect:</strong> Save each updated file and check both the DPI metadata and exact pixel dimensions against your examination notice or print specifications.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Does changing DPI resize pixel dimensions or reduce file size?</strong><br>A: No. The tool updates the JFIF density bytes on JPEG files and the pHYs chunk on PNG files while leaving the pixel dimensions unchanged. If a portal also specifies pixel dimensions or a KB size limit, use a dedicated cropper or compressor afterward.</p><p><strong>Q: Are my photos sent to a conversion API?</strong><br>A: No. All binary header updates run directly in your browser using typed byte arrays; your selected JPG or PNG files are not sent to a file-conversion API. Normal website assets and analytics may still load.</p><p><strong>Q: Which image formats work with this DPI tool?</strong><br>A: Only JPEG (<code>.jpg</code>, <code>.jpeg</code>) and PNG (<code>.png</code>) files are accepted. WEBP, AVIF, and SVG files are rejected because they do not use JFIF or PNG pHYs density chunks.</p>"
      }
    ]
  }
};
