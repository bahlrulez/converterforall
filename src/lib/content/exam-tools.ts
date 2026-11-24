export const examToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "exam-photo-resizer": {
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
        title: "Check the exported file",
        content: "<p>The compressor tries several JPEG quality levels and may add JPEG comment metadata when the generated image is below the preset minimum. It cannot guarantee that every input image will fit the selected range. Review the actual downloaded file size and image quality; do not submit an output that falls outside the portal's stated requirements.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Are my selected images sent to a conversion API?</strong><br>The photo and signature resizers use browser FileReader and canvas operations for image processing; they do not send the selected image to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Does a preset guarantee acceptance?</strong><br>No. It is a convenience starting point. Only the current examination instructions determine what the portal accepts.</p><p><strong>What if the output is outside the target size?</strong><br>Try another crop or source image, then check the resulting file size again. If it still does not meet the official requirement, use another image editor or compression workflow.</p>"
      }
    ]
  },
  "photo-name-date-stamper": {
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
        title: "Output quality and size",
        content: "<p>The tool exports a new JPEG from the canvas at a quality setting of 0.95. This is a recompressed image, so the file size and image quality may differ from the original. Review the output dimensions, text legibility, and file size before submitting it.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Does the tool upload my photo to a conversion API?</strong><br>The image is read in the browser and drawn to a canvas; this tool does not send it to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Does it automatically meet an exam portal's photo requirements?</strong><br>No. It adds a label and a selectable crop; it does not verify the latest portal rules or guarantee acceptance. Check the current official instructions.</p><p><strong>Can I compress the result afterward?</strong><br>Yes. You can use the Exam Photo Resizer to try a crop and file-size target, then inspect the actual output. The preset is not a guarantee of portal compliance.</p>"
      }
    ]
  },
  "exam-signature-resizer": {
    sections: [
      {
        title: "Clean and crop a signature image",
        content: "<p>Upload a JPEG, PNG, or WebP signature photo, adjust the crop, choose black-and-white or blue-ink treatment, and tune the paper-whitening threshold. The result is exported as a JPEG using the selected preset's crop ratio and target file-size range.</p>"
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
        content: "<p><strong>Is the selected signature sent to a conversion API?</strong><br>The signature editor uses browser FileReader and canvas operations and does not send the selected image to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Does the tool guarantee a portal-ready signature?</strong><br>No. It creates an edited JPEG and shows its file size. You must compare the result with the current portal instructions.</p><p><strong>Will paper whitening always remove every shadow?</strong><br>Results depend on the lighting, paper colour, ink, and chosen threshold. Inspect the preview and adjust the settings as needed.</p>"
      }
    ]
  },
  "compress-pdf-100kb": {
    sections: [
      {
        title: "Compress a PDF toward a target file size",
        content: "<p>This browser-based tool renders each source PDF page to an image, recompresses the page images, and assembles them into a new PDF. It tries several page scales and JPEG quality levels to approach the selected file-size target.</p>"
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
        content: "<p><strong>Are my documents sent to a conversion API?</strong><br>The compression code reads the file in the browser and uses PDF.js, canvas, and PDF assembly libraries locally; it does not send the selected PDF to a file-conversion API. The website may still load its normal page resources and analytics.</p><p><strong>Will the output remain searchable?</strong><br>No. Pages are rendered to images before being placed into the output PDF, so text is not retained as selectable text.</p><p><strong>Will every file reach the selected KB target?</strong><br>No. The tool tries several scales and quality levels. Some PDFs cannot reach the requested size without unacceptable quality loss or may remain above the target.</p>"
      }
    ]
  }
};
