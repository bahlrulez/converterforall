export const imageToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "webp-to-png": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The WEBP to PNG converter is a specialized image processing utility designed to effortlessly transform modern WEBP files into universally compatible PNG images. WEBP is an advanced image format created by Google that provides superior lossless and lossy compression for images on the web. While WEBP is fantastic for reducing file sizes and improving website load times, it isn't universally supported by all legacy operating systems, older image editing software, or certain content management systems. This converter seamlessly bridges that compatibility gap by rendering the WEBP file and exporting it as a standard Portable Network Graphic (PNG), ensuring you can open, edit, and share your images anywhere.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Unlike traditional conversion services that require you to upload your personal photos to a remote server, our WEBP to PNG tool operates entirely within your web browser using HTML5 Canvas and modern browser APIs. When you select a file, the browser decodes the WEBP image locally into raw pixel data. This data is then instantly re-encoded by the browser's native rendering engine into a high-quality PNG format. This process preserves the exact color profile, resolution, and transparency (alpha channel) of the original image. Because the entire conversion happens on your device's RAM, it guarantees absolute privacy and lightning-fast speeds with zero upload or download latency.</p>"
      },
      {
        title: "Examples",
        content: "<p>Imagine you've just downloaded a beautiful transparent logo or a high-resolution graphic from a modern website, but it is saved as a WEBP file. When you try to import this graphic into an older version of Photoshop or a desktop presentation software like Microsoft PowerPoint, you receive an 'unsupported file format' error. By quickly running the file through our WEBP to PNG converter, you get an identical, transparent PNG file that is instantly recognized by virtually every design and presentation software ever made.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your file:</strong> Drag and drop your WEBP image directly into the designated upload zone on the page, or click to open your device's file picker.</li><li><strong>Local Processing:</strong> Once selected, the image is immediately read by your browser. No internet upload is required.</li><li><strong>Instant Conversion:</strong> The browser renders the image data onto a hidden canvas and exports it as a PNG file in a fraction of a second.</li><li><strong>Download:</strong> Click the prominent download button to save the new PNG file directly to your local storage.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Graphic Design:</strong> Converting downloaded web assets into a format compatible with Adobe Creative Suite and other design tools.</li><li><strong>Website Building:</strong> Standardizing image formats for uploading to older Content Management Systems (CMS) that reject WEBP uploads.</li><li><strong>Archiving:</strong> Saving images in a widely recognized format to ensure they can be opened on any device.</li><li><strong>Social Media:</strong> Converting images for platforms or forums that only accept JPG and PNG files.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my data safe when using this background remover?</strong><br>A: Yes. Processing happens locally in your web browser. Your images are not uploaded to our servers.</p>
          <p><strong>Q: How does this tool utilize WebGPU and WebGL hardware acceleration?</strong><br>A: Our background removal tool can utilize your device's graphics processor (GPU) using standard WebGPU and WebGL APIs for fast, responsive edge detection.</p>
          <p><strong>Q: What happens if my browser or smartphone does not support WebGPU?</strong><br>A: The tool automatically falls back to standard WebGL or CPU WebAssembly processing so the conversion runs smoothly without errors.</p>
          <p><strong>Q: What is the maximum file size I can upload?</strong><br>A: Since processing is local, the file size is only limited by your device's available memory. Images under 20MB are recommended for the best performance.</p>
          <p><strong>Q: Why is the output always a PNG?</strong><br>A: PNG supports transparency (an alpha channel). If saved as a JPG, transparent background areas would automatically be filled with solid white.</p>
          <p><strong>Q: Do I need to install any software to convert WEBP to PNG?</strong><br>A: No software installation is required. This tool runs directly in your web browser (Chrome, Firefox, Safari, Edge).</p>
          <p><strong>Q: Is there a file size limit for uploading WEBP images?</strong><br>A: Because conversion happens locally on your device, there are no strict server-side upload limits.</p>
          <p><strong>Q: Can I use this WEBP to PNG converter on my smartphone?</strong><br>A: Yes. The tool works on mobile browsers on both iOS and Android.</p>
          <p><strong>Q: Why do some websites use WEBP instead of PNG?</strong><br>A: WEBP provides efficient compression, helping websites load faster while maintaining good visual quality.</p>
        `
      }
    ]
  },
  "jpg-to-png": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The JPG to PNG converter transforms standard JPEG photos into the Portable Network Graphics (PNG) format. While JPG is popular for digital photography due to its small file size, it does not support transparent backgrounds. PNG is a lossless format that supports transparency. Converting a JPG to a PNG is often the first step when preparing an image for background removal or graphic design overlays.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Our JPG to PNG tool uses your browser's native image decoding to read the JPG data into uncompressed pixels, then encodes the image into the PNG format. Because this happens locally within your browser's memory, your photos are not sent to external servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>Imagine you have a product photo in JPG format and want to remove its background for an online store banner. Converting the JPG to a PNG creates a format that supports transparent layers, so you can cleanly place the product against different colored backgrounds.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your JPG:</strong> Drag and drop your image into the box or browse your local files.</li><li><strong>Conversion:</strong> The browser reads and encodes your image directly.</li><li><strong>Save:</strong> Click download to save your new PNG file to your computer or phone.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Photo Editing:</strong> Creating a lossless copy of an image before making edits.</li><li><strong>Design Preparation:</strong> Converting an image to support transparency before background removal.</li><li><strong>App Development:</strong> Preparing assets for applications that require PNG format for UI icons.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will converting a JPG to a PNG automatically make the background transparent?</strong><br>A: No. Converting to PNG allows the file to <em>support</em> transparency, but you will still need to use our Background Remover or a photo editor to remove the background.</p>
          <p><strong>Q: Why is the PNG file larger than the original JPG?</strong><br>A: JPG uses lossy compression to minimize file size, while PNG uses lossless compression to preserve full pixel detail, resulting in larger file sizes for complex photos.</p>
          <p><strong>Q: Is this JPG to PNG converter private?</strong><br>A: Yes. The conversion happens entirely within your web browser on your own device.</p>
          <p><strong>Q: What is the difference between JPG and JPEG?</strong><br>A: There is no functional difference. '.jpg' and '.jpeg' are two file extensions for the exact same image format.</p>
        `
      }
    ]
  },
  "png-to-jpg": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The PNG to JPG converter reduces image file sizes by converting lossless PNG images into compressed JPG/JPEG format. While PNGs are great for graphics and transparent logos, they can create large file sizes for photographs. Converting heavy PNGs to JPGs makes them much lighter for websites, emails, and online applications.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you select a PNG, our tool renders the image locally in your browser. Because JPG format does not support transparency, any transparent areas are filled with a solid white background before compressing the image to a standard JPG file.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you take a high-resolution screenshot on a Mac, it often saves as a 10MB PNG file. Uploading that heavy file to a portal or email can be slow. Running it through our converter creates a lightweight JPG under 1MB with practically identical visual clarity.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PNG:</strong> Drag and drop your file into the box.</li><li><strong>Automatic Conversion:</strong> The tool flattens transparency and compresses the image to JPG locally.</li><li><strong>Download:</strong> Click download to save your new lightweight JPG file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Web Optimization:</strong> Speeding up website loading times by serving compact JPGs.</li><li><strong>Upload Limits:</strong> Shrinking file sizes to meet upload limits on government and job portals.</li><li><strong>Saving Storage:</strong> Freeing up disk space by converting large screenshot libraries to JPG.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What happens to transparent areas when converting PNG to JPG?</strong><br>A: Because the JPG format does not support transparency, transparent areas are filled with a solid white background.</p>
          <p><strong>Q: Will I lose visual quality when converting to JPG?</strong><br>A: For most photos and screenshots, the difference is practically unnoticeable while reducing file size by 70% to 90%.</p>
          <p><strong>Q: Is it safe to convert private photos?</strong><br>A: Yes. The conversion occurs locally in your browser without uploading to external servers.</p>
          <p><strong>Q: Does this tool work on mobile phones?</strong><br>A: Yes. It works smoothly in Safari on iOS and Chrome on Android.</p>
        `
      }
    ]
  },
  "avif-to-jpeg": {
    sections: [
      {
        title: "Why convert AVIF to JPEG?",
        content: "<p>AVIF is a highly efficient next-generation image format that offers incredible compression and quality. However, many legacy software applications, older operating systems, and some content management systems still do not fully support AVIF. Converting your AVIF images to the universal JPEG format ensures maximum compatibility across all devices, email clients, and upload portals.</p>"
      },
      {
        title: "Fast, Private AVIF to JPG Conversion",
        content: "<p>This AVIF to JPEG converter runs completely in your browser using modern WebAssembly. This means your images are never uploaded to a remote server. You avoid slow upload times, waiting in queues, and risking the privacy of your personal photos.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does converting AVIF to JPEG reduce quality?</strong><br>A: JPEG is a lossy format, meaning some image data is discarded during conversion. Our converter uses conservative compression settings to minimize visible artifacts and balance image clarity.</p>
          <p><strong>Q: Will my image's transparent background be preserved?</strong><br>A: No. The JPEG format does not support transparency. Any transparent areas in your AVIF will be automatically filled with a solid color (usually white) during conversion. If you need to keep transparency, use our AVIF to PNG converter instead.</p>
          <p><strong>Q: Are there any file size limits?</strong><br>A: Because processing happens locally on your device, there is no fixed server upload limit. However, processing very large images is constrained by your browser's allocated memory and device resources.</p>
        `
      }
    ]
  },
  "avif-to-png": {
    sections: [
      {
        title: "Why convert AVIF to PNG?",
        content: "<p>AVIF is an excellent modern format that supports both high compression and alpha-channel transparency. However, you may need to open the image in design software or upload it to a platform that doesn't yet support AVIF. Converting AVIF to PNG allows you to retain the original image's transparent background while guaranteeing universal compatibility across all editing tools and browsers.</p>"
      },
      {
        title: "Private Browser-Based AVIF to PNG Conversion",
        content: "<p>Unlike cloud-based conversion services, our AVIF to PNG tool processes your images locally on your device. Your files are never uploaded to the internet, ensuring complete privacy for sensitive graphics, logos, and personal photos.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will converting to PNG preserve my image's transparency?</strong><br>A: Yes. Unlike JPEG, the PNG format fully supports alpha transparency. If your original AVIF contains a transparent background, the PNG will retain those transparent areas.</p>
          <p><strong>Q: Is PNG better than AVIF?</strong><br>A: PNG is a lossless, widely supported format, making it ideal for editing and design work. However, PNG files are typically much larger than AVIF files. AVIF is better for web delivery, while PNG is better for broad compatibility and lossless editing.</p>
          <p><strong>Q: Are my files uploaded to your servers?</strong><br>A: No. All conversions happen entirely in your web browser. Your images remain safely on your computer or mobile device.</p>
        `
      }
    ]
  },
  "remove-background": {
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Remove Background tool cuts out the background from your images and gives you a clean, transparent PNG. Whether you are creating product photos for an online store, designing flyers, or cutting out people from photos, this tool removes backgrounds automatically in your web browser.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool uses an in-browser AI model to detect the foreground subject and create a transparent cutout directly on your device. Because the model runs on your computer or phone, your personal photos are not uploaded to cloud servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you take a photo of a product on a table and want a clean white or transparent background for your online shop, uploading the photo quickly isolates your product so you can place it onto any background.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Image:</strong> Drag and drop your photo into the box.</li><li><strong>Processing:</strong> The browser removes the background on your device.</li><li><strong>Download:</strong> Save your transparent PNG image.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Online Stores:</strong> Creating clean product photos for Shopify, Amazon, or Etsy.</li><li><strong>Graphic Design:</strong> Isolating subjects for posters, YouTube thumbnails, and social media posts.</li><li><strong>Presentations:</strong> Removing distracting backgrounds from logos and headshots for slides.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my photos uploaded to external servers?</strong><br>A: No. The background removal runs locally in your web browser.</p>
          <p><strong>Q: Why does the download format have to be PNG?</strong><br>A: PNG supports transparent backgrounds, whereas standard JPG formats do not.</p>
          <p><strong>Q: Does this tool cost money?</strong><br>A: No. The background remover is free with no watermarks.</p>
        `
      }
    ]
  },
  "compress-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the JPG Compressor Does",
        content: "<p>Upload one JPG/JPEG image and the tool automatically creates an output using the browser-image-compression library. You can adjust its initial quality setting from 1 to 100, keep the original dimensions or downscale the longest side to a maximum of 1920, 1280 or 800 pixels, and optionally convert the image to grayscale. The page shows the source and output file sizes before download.</p>"
      },
      {
        title: "Quality, Dimensions and File-Size Behaviour",
        content: "<p>The quality slider is passed to the compression library as an initial quality value. A lower value may reduce JPEG file size but can also make compression artifacts more visible. The dimension menu applies a maximum width-or-height setting while preserving the aspect ratio; it does not set an exact width and height. The default is to keep the original dimensions.</p><p>There is no target-KB field and no guarantee that the output will be 20 KB, 50 KB, 100 KB or any other specific size. If a plain compression attempt produces a file that is not smaller, the tool keeps the original file. When grayscale or downscaling is explicitly selected, the processed output is kept so that the requested transformation is not silently discarded. The final size can therefore be smaller, unchanged or larger than the source.</p>"
      },
      {
        title: "Grayscale and Metadata",
        content: "<p>The optional Grayscale control draws the source image to a browser Canvas with a grayscale filter before compression. This changes the image's appearance and is not reversible from the exported file. The compressor may re-encode the image, so do not rely on all camera metadata being preserved. If the plain compression result is not smaller and the original file is kept, its original metadata may remain. Check metadata separately when it matters.</p>"
      },
      {
        title: "Browser Processing and Network Behaviour",
        content: "<p>The selected image is passed to the browser-image-compression library and processed in a browser worker where supported, with a main-thread fallback depending on browser capabilities. The image is processed in the browser; this component does not upload the image to a compression API. The library's documented worker setup can load its worker script from jsDelivr unless a different library URL is configured, so browser-side processing does not mean that the page makes no network requests.</p>"
      },
      {
        title: "Supported Input and Output",
        content: "<p>This route accepts one JPG or JPEG file at a time. It exports the same JPEG file type. It does not accept PNG or WEBP on the JPG route, process a batch of images, or provide a specific output-size target.</p>"
      },
      {
        title: "How to Compress a JPG",
        content: "<ol><li><strong>Select one JPG/JPEG:</strong> Upload or drop a single image.</li><li><strong>Adjust quality:</strong> Move the quality slider. Lower settings may produce smaller files with more visible compression artifacts.</li><li><strong>Choose dimensions:</strong> Keep the original size or select a maximum longest-side dimension of 1920, 1280 or 800 pixels.</li><li><strong>Optional grayscale:</strong> Turn on grayscale only when a black-and-white result is acceptable.</li><li><strong>Compare and download:</strong> Check the displayed source and output sizes, inspect the result and download the processed image.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I set an exact 20 KB or 100 KB target?</strong><br>A: No. The page has a quality slider and optional maximum-dimension choices, but no target-KB control. The final size depends on the image and settings.</p>
          <p><strong>Q: Will the JPG always become smaller?</strong><br>A: No. When no grayscale or downscale transformation is selected and compression does not reduce the size, the tool keeps the original file. When you request grayscale or downscaling, that processed output is kept even if it is not smaller.</p>
          <p><strong>Q: Does the dimension menu set exact pixel dimensions?</strong><br>A: No. It sets a maximum width-or-height value of 1920, 1280 or 800 pixels. The other dimension follows the source aspect ratio.</p>
          <p><strong>Q: Does grayscale reduce the file size?</strong><br>A: It may, but this is not guaranteed. Grayscale also changes the image's appearance, so inspect the result before using it.</p>
          <p><strong>Q: Does the compressor preserve EXIF and GPS metadata?</strong><br>A: Metadata preservation is not guaranteed. The image may be re-encoded, while an unchanged original can be kept when a plain compression attempt does not reduce its size.</p>
          <p><strong>Q: Is my photo uploaded to a server?</strong><br>A: The image is processed in a browser worker where supported, and this component does not send it to a compression API. The worker script may be loaded from the library's CDN; that is a code download, not an upload of your image.</p>
          <p><strong>Q: Can I process multiple JPG files at once?</strong><br>A: No. The current interface accepts one image at a time.</p>
        `
      }
    ]
  },
  "compress-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the PNG Compressor Does",
        content: "<p>Upload one PNG image and the tool processes it with the browser-image-compression library. The controls include an initial quality setting from 1 to 100, an option to keep the original dimensions or downscale the longest side to a maximum of 1920, 1280 or 800 pixels, and an optional grayscale conversion. The page compares the source and output file sizes.</p>"
      },
      {
        title: "PNG Compression, Quality and Dimensions",
        content: "<p>The quality slider is passed to the compression library as an initial quality value, but the visible effect and file-size change depend on the PNG encoder, image content and browser. PNG is a lossless image format; a quality value is not a promise of a particular compression ratio or output size. Downscaling can reduce the number of pixels and change image detail. The maximum-dimension options preserve the image's aspect ratio rather than forcing exact width and height values.</p><p>There is no target-KB input. The output is not guaranteed to be under 20 KB, 100 KB or any other limit. If a plain compression attempt does not make the file smaller, the original is kept. If you select grayscale or downscaling, the transformed output is kept even when it is not smaller than the source.</p>"
      },
      {
        title: "Transparency and Grayscale",
        content: "<p>The PNG route keeps PNG as the output format, which supports an alpha channel. Inspect the downloaded file when transparency is important, especially after grayscale conversion or resizing. The Grayscale option changes the image's colour appearance; it is not reversible in the exported image.</p>"
      },
      {
        title: "Browser Processing and Network Behaviour",
        content: "<p>The image is passed to the browser-image-compression library and processed in a browser worker where supported, with a main-thread fallback depending on browser capabilities. This component does not upload the image to a compression API. The library's documented worker setup can load its worker script from jsDelivr unless a different library URL is configured, so browser-side image processing can still involve a request to download worker code.</p>"
      },
      {
        title: "Supported Input and Output",
        content: "<p>This route accepts one PNG file at a time and exports PNG. It does not accept JPG/JPEG or WEBP on this route, and it does not provide batch processing or a target file-size field.</p>"
      },
      {
        title: "How to Compress a PNG",
        content: "<ol><li><strong>Select one PNG:</strong> Upload or drop a single image.</li><li><strong>Adjust the quality setting:</strong> Change the slider and compare the resulting file size and appearance.</li><li><strong>Choose dimensions:</strong> Keep the original dimensions or set a maximum longest side of 1920, 1280 or 800 pixels.</li><li><strong>Optional grayscale:</strong> Enable grayscale only when a monochrome output is suitable.</li><li><strong>Review transparency and detail:</strong> Check transparent edges, small text and fine graphics, then download the PNG.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I set an exact KB target for the PNG?</strong><br>A: No. There is no target-KB input. The tool applies a quality setting and optional downscaling, and the resulting file size varies.</p>
          <p><strong>Q: Will PNG compression always make the file smaller?</strong><br>A: No. When no grayscale or downscale transformation is selected and the result is not smaller, the original PNG is kept. An explicitly requested grayscale or downscale result is retained even if it is larger.</p>
          <p><strong>Q: Does the quality slider guarantee a smaller PNG?</strong><br>A: No. The slider is passed to the compression library, but output size and visual changes depend on the encoder, browser and image. Compare the resulting file rather than relying on the percentage alone.</p>
          <p><strong>Q: Does the PNG route preserve transparency?</strong><br>A: It keeps PNG as the output format, which supports transparency. Check transparent edges in the downloaded image before using it.</p>
          <p><strong>Q: Does grayscale improve compression?</strong><br>A: It can change the resulting file size, but there is no guaranteed reduction. It also removes colour from the output.</p>
          <p><strong>Q: Is the image uploaded to a conversion server?</strong><br>A: The image is processed in a browser worker where supported, and this component does not send it to a compression API. The worker script may be downloaded from the library's CDN.</p>
          <p><strong>Q: Can I upload a batch of PNG files?</strong><br>A: No. The current interface accepts one PNG image at a time.</p>
        `
      }
    ]
  },  "passport-photo-maker": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Passport Photo Maker Does",
        content: "<p>Upload or capture a portrait, crop it to one of two shapes, optionally remove the background, choose a replacement colour and download a JPEG. The upload picker accepts JPG/JPEG, PNG and WEBP images. This is an image editor; it does not check whether a photo complies with a country's passport, visa or identity-document rules.</p>"
      },
      {
        title: "Choose a Crop Shape — Not a Fixed Print Size",
        content: "<p>The portrait option sets a 35:45 aspect ratio and the square option sets a 1:1 aspect ratio. These settings control the shape of the crop window only. The exported canvas uses the selected crop area's pixel width and height; the tool does not resize every result to a fixed pixel dimension, set a physical print size in millimetres or inches, or write a DPI value. The labels should not be treated as confirmation that a finished image is exactly 35 × 45 mm or 2 × 2 inches when printed.</p><p>Photo rules vary by country, document type and application route. Confirm the required pixel dimensions, physical size, head position, background, expression, file type and file-size limit with the official passport or visa authority before submitting your image.</p>"
      },
      {
        title: "AI Background Removal and Privacy",
        content: "<p>Background removal is performed in the browser. The tool first tries a Web Worker, which attempts the Bria RMBG-1.4 model through Transformers.js and falls back to the ISNet model through the IMG.LY background-removal library if needed. If the worker fails, the page also has a main-thread fallback using IMG.LY. The selected photo is processed in the browser and this implementation does not upload the photo to a background-removal API.</p><p>The model and runtime files are fetched from external model hosts when needed: the Bria model uses the Hugging Face model pipeline, and the fallback library uses IMG.LY-hosted model and WebAssembly assets by default. The first background-removal attempt can therefore require an internet connection and may take longer while these files are downloaded. Your browser may cache them for later use. This means the photo processing is local, but the feature is not network-free.</p>"
      },
      {
        title: "How to Make a Cropped Photo",
        content: "<ol><li><strong>Choose a portrait:</strong> Upload one JPG/JPEG, PNG or WEBP image, or use the camera capture control where your browser supports it.</li><li><strong>Optional background removal:</strong> Select Remove Background and allow the model files to load. Review the cutout because fine hair, similar foreground/background colours and complex edges can produce imperfect results.</li><li><strong>Choose a background:</strong> After background removal, select a solid preset colour or use the custom colour picker. The output is JPEG, so it cannot retain transparent pixels; choose a solid background before downloading.</li><li><strong>Select the crop ratio:</strong> Choose the 35:45 portrait shape or 1:1 square shape, then move and zoom the image inside the crop window.</li><li><strong>Create and inspect the JPEG:</strong> Generate the crop, review the result and download it. Check its pixel dimensions and file size separately if your application specifies them.</li></ol>"
      },
      {
        title: "Output and Important Limitations",
        content: "<p>The crop is exported as a JPEG at the browser canvas's high-quality setting. There is no target file-size control, fixed pixel-size preset, DPI setting, face-measurement tool or official-rule validator. Background removal is an automated estimate rather than a manual cutout editor, so inspect hair, clothing edges and objects near the subject before using the result. A successful download does not mean an embassy, passport office or visa portal will accept the image.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does the 35:45 option create an exact 35 × 45 mm passport photograph?</strong><br>A: No. It sets a 35:45 crop ratio. The final pixel dimensions depend on the crop area, and the tool does not set print dimensions or DPI.</p>
          <p><strong>Q: Does the square option guarantee a US passport or OCI-compliant photo?</strong><br>A: No. It creates a 1:1 crop only. It does not verify the current photo, head-size, background, pixel or other requirements for a US passport, OCI or visa application.</p>
          <p><strong>Q: Which image formats can I upload?</strong><br>A: The upload area accepts JPG/JPEG, PNG and WEBP images. The downloaded crop is a JPEG.</p>
          <p><strong>Q: Can I download a transparent PNG after removing the background?</strong><br>A: No. The crop/export function encodes the result as JPEG, which does not support transparency. Choose a solid background colour before creating the final image.</p>
          <p><strong>Q: Is my selected photograph uploaded to a server?</strong><br>A: The photo is passed to the in-browser background-removal worker and is not sent to a photo-processing API by this code. The AI model and runtime assets are downloaded from Hugging Face or IMG.LY when needed, so the feature does make external requests for model files.</p>
          <p><strong>Q: Why can background removal take longer the first time?</strong><br>A: The browser may need to download the AI model and runtime assets before it can process the photo. Later use may be faster if those assets remain cached.</p>
          <p><strong>Q: Does this tool compress the image to a portal's KB limit?</strong><br>A: No. It creates a JPEG crop but has no target-KB control. Check the downloaded file size and use a separate compressor if the official application specifies a limit.</p>
          <p><strong>Q: Does the tool check the face position or guarantee photo acceptance?</strong><br>A: No. You position the image manually in the crop window. The tool does not measure facial proportions, inspect official photo rules or guarantee acceptance.</p>
        `
      }
    ]
  },
  "heic-to-jpg": {
    sections: [
      {
        title: "HEIC to JPG Converter - Convert iPhone Photos Online",
        content: "<p>When you take photos on an iPhone or iPad, iOS often saves them in the <strong>HEIC (High Efficiency Image Container)</strong> format. However, HEIC photos often cannot be opened on Windows PCs, older photo software, or online application portals. Our tool converts your Apple HEIC photos into standard JPG files so they open anywhere.</p>"
      },
      {
        title: "Private, On-Device Browser Processing",
        content: "<p>Our HEIC to JPG converter operates directly inside your web browser. Your photos are decoded and saved locally in your device's memory without being sent across the internet, keeping your personal photos and document scans private.</p>"
      },
      {
        title: "Step-by-Step: How to Convert HEIC to JPG",
        content: "<ol><li><strong>Select Your HEIC Image:</strong> Drag and drop your .heic or .heif file into the box.</li><li><strong>Conversion:</strong> The browser decodes the image and converts it to JPG.</li><li><strong>Download:</strong> Click download to save your standard JPG photo.</li></ol>"
      },
      {
        title: "Practical Uses",
        content: "<ul><li><strong>Windows &amp; Android Viewing:</strong> Opening and viewing iPhone photos on Windows laptops and Android devices.</li><li><strong>Application Portals:</strong> Submitting photo IDs and receipts to portals that reject HEIC files.</li><li><strong>Photo Printing:</strong> Printing iPhone photos at retail kiosks that require JPG format.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Why won't my Windows PC open HEIC files?</strong><br>A: Windows does not always have built-in HEIC codec support installed. Converting the photos to JPG allows them to open in any default photo viewer.</p>
          <p><strong>Q: Are my photos kept private?</strong><br>A: Yes. The conversion takes place entirely within your web browser on your own device.</p>
          <p><strong>Q: How can I make my iPhone take JPG photos directly?</strong><br>A: On your iPhone, go to <em>Settings &gt; Camera &gt; Formats</em> and choose <strong>'Most Compatible'</strong>.</p>
        `
      }
    ]
  },
  "heic-to-png": {
    sections: [
      {
        title: "HEIC to PNG Converter - Convert Apple Photos to PNG Online",
        content: "<p>Convert Apple HEIC and HEIF photos into standard PNG files for free. If you need lossless quality or want to edit iPhone screenshots in graphic design software like Photoshop, Figma, or Canva, converting to PNG gives you a widely supported format.</p>"
      },
      {
        title: "Private Browser Conversion",
        content: "<p>The tool decodes the HEIC image directly in your browser's local memory. Your files are not uploaded to external servers or logged in any database.</p>"
      },
      {
        title: "Step-by-Step: How to Convert HEIC to PNG",
        content: "<ol><li><strong>Select Your HEIC File:</strong> Drag your HEIC image into the box.</li><li><strong>Conversion:</strong> The browser decodes the image and converts it to PNG.</li><li><strong>Download:</strong> Click download to save your PNG file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: When should I convert to PNG instead of JPG?</strong><br>A: JPG is great for smaller file sizes when sharing photos. PNG is better for screenshots and graphics where you want uncompressed pixel detail.</p>
          <p><strong>Q: Does this converter work on Mac, Windows, and phones?</strong><br>A: Yes. It works directly in modern web browsers across desktop and mobile devices.</p>
          <p><strong>Q: Are my files private?</strong><br>A: Yes. The conversion executes locally on your device without server uploads.</p>
        `
      }
    ]
  },
  "image-to-svg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Image to SVG Vector Tracer Does",
        content: "<p>Upload one JPG/JPEG, PNG or WEBP image and choose a tracing preset. The page uses ImageTracerJS 1.2.6 in the browser to analyse the raster pixels and generate an SVG made from vector shapes and paths. You can preview the generated SVG and download it as an .svg file.</p><p>This is raster-to-vector tracing, not an exact reconstruction of the original design. It approximates visible edges, regions and colours as vector geometry. Fine details, gradients, texture and small text can be simplified or lost.</p>"
      },
      {
        title: "What the Four Tracing Presets Change",
        content: "<p><strong>Default (Balanced):</strong> Uses the library's default tracing and colour settings.</p><p><strong>Logo (Crisp):</strong> Uses the posterized1 preset, which reduces the colour palette to two colours. It is intended for simple, high-contrast graphics rather than detailed photographs.</p><p><strong>Artwork (Smooth):</strong> Uses the curvy preset, which favours smoother curve tracing and less emphasis on right-angle corners.</p><p><strong>Grayscale (B&W):</strong> Uses ImageTracerJS's grayscale preset for a monochrome-style trace. It is a tracing preset, not a guarantee of a perfect black-and-white threshold conversion.</p>"
      },
      {
        title: "Which Images Usually Trace Best?",
        content: "<p>Simple logos, icons, illustrations, symbols, bold line art and high-contrast scans are generally better tracing candidates because their edges and colour regions are easier to separate. Busy photographs, gradients, textured backgrounds, shadows, tiny lettering and low-contrast images can produce many complex paths or lose important detail.</p><p>For best results, begin with a clean, high-resolution source with a simple background. Try another preset if the first SVG has too many shapes, rough edges or missing detail. The tool does not provide manual node editing or a text-recognition step.</p>"
      },
      {
        title: "SVG Paths, Scalability and Editability",
        content: "<p>The downloaded SVG contains traced vector geometry rather than simply renaming the source image. Its paths can be scaled without the same pixelation that occurs when enlarging a raster image. However, scalability does not make the trace identical to the source: any details simplified during tracing remain simplified at larger sizes.</p><p>Text in the source image is traced as shapes; it is not converted into editable font text. Depending on the source and preset, the SVG can contain many paths and may be larger or harder to edit than the original image. Open the downloaded SVG in a vector editor to inspect and refine it if needed.</p>"
      },
      {
        title: "Browser Processing and Privacy",
        content: "<p>The component loads the selected image through a browser object URL and calls the bundled ImageTracerJS library to generate the SVG. This component does not upload the selected image to an image-tracing API. The tracing operation takes place in the browser, though the page itself still makes the normal requests required to load the website and its scripts.</p>"
      },
      {
        title: "Supported Input and Output",
        content: "<p>The upload control accepts one JPG/JPEG, PNG or WEBP image per run. The output is an SVG file. This tool does not batch-process several images at once, create a font file, convert photographed text into editable text, or guarantee a specific number of paths or output file size.</p>"
      },
      {
        title: "How to Trace an Image into SVG",
        content: "<ol><li><strong>Choose one raster image:</strong> Upload a JPG/JPEG, PNG or WEBP file.</li><li><strong>Select a tracing preset:</strong> Choose Default, Logo (Crisp), Artwork (Smooth) or Grayscale (B&W).</li><li><strong>Run the trace:</strong> The browser uses ImageTracerJS to generate SVG geometry from the image pixels.</li><li><strong>Inspect the preview:</strong> Check edges, colours, small shapes and text-like details. Try a different preset if the trace is too rough or too complex.</li><li><strong>Download and refine:</strong> Download the SVG and inspect its paths in a vector editor before using it in production artwork.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is the SVG an exact copy of the original image?</strong><br>A: No. ImageTracerJS estimates vector shapes from raster pixels. The result can simplify colours, edges and small details, so compare it with the source.</p>
          <p><strong>Q: Does the SVG contain vector paths or just the original embedded image?</strong><br>A: The tracer generates SVG vector geometry from the image. It is not simply a raster image saved with an SVG extension.</p>
          <p><strong>Q: Can I scale the SVG without pixelation?</strong><br>A: The generated paths can be scaled without raster pixelation, but scaling cannot restore detail that was lost or simplified during tracing.</p>
          <p><strong>Q: Does the tool turn words in an image into editable text?</strong><br>A: No. Letters and words are traced as shapes. The tool does not perform OCR or identify fonts.</p>
          <p><strong>Q: Which images work best?</strong><br>A: High-contrast logos, icons, illustrations and line art usually trace more cleanly than photographs with gradients, textures, shadows or many small details.</p>
          <p><strong>Q: What does the Grayscale preset do?</strong><br>A: It selects ImageTracerJS's built-in grayscale tracing preset. It does not guarantee a perfect thresholded black-and-white trace.</p>
          <p><strong>Q: Is my image uploaded to a tracing server?</strong><br>A: The component passes a browser object URL to the bundled ImageTracerJS library and does not send the selected image to an image-tracing API.</p>
          <p><strong>Q: Can I process multiple images at once?</strong><br>A: No. The current interface accepts one image per run.</p>
        `
      }
    ]
  },
  "merge-images-to-jpg": {
    sections: [
      {
        title: "Why Combine Two Images into One JPG?",
        content: `
          <p>Whether you need to submit the front and back of an ID card on an official portal, create a side-by-side before-and-after comparison photo, assemble receipts for expense reimbursement, or prepare a two-panel photo for social media, combining two images into a single file is an everyday necessity.</p>
          <p>Most basic image viewers do not provide a straightforward way to join two pictures without manually opening complicated graphic design software like Photoshop. This tool provides a dedicated, streamlined way to combine any two JPEG or PNG images into a single, high-quality JPG directly inside your web browser.</p>
          <p>All processing runs locally in your browser using client-side HTML5 Canvas technology. Your photos stay entirely on your computer or phone and are never uploaded to any remote server.</p>
          <h3>How to merge two images:</h3>
          <ol>
            <li><strong>Select Image 1 and Image 2:</strong> Drag and drop your photos into Slot 1 and Slot 2, or browse your local files. You can also drop two files at once to fill both slots automatically.</li>
            <li><strong>Choose layout and spacing:</strong> Choose <strong>Side by Side</strong> (horizontal) or <strong>Top and Bottom</strong> (vertical). Adjust the gap between photos, outer border padding, and background color.</li>
            <li><strong>Preview and download:</strong> Check the live composite preview, then click <strong>Download Merged JPG</strong> to save your merged image as <code>merged-images.jpg</code>.</li>
          </ol>
        `
      },
      {
        title: "Layout Options: Side by Side vs. Top and Bottom",
        content: `
          <p>Choosing the right layout depends on your photos' subject matter and orientation:</p>
          <ul>
            <li><strong>Side by Side (Horizontal):</strong> Places Image 1 on the left and Image 2 on the right. This is the recommended choice for before-and-after comparisons, landscape orientation photos, and two-sided identity cards.</li>
            <li><strong>Top and Bottom (Vertical):</strong> Places Image 1 above Image 2. This layout works best for mobile portrait photos, vertical documents, long paper receipts, and smartphone screenshots.</li>
            <li><strong>Swap Order:</strong> Click the central <strong>Swap Order</strong> (⇄) button at any time to switch the positions of Image 1 and Image 2 without re-uploading either file.</li>
          </ul>
        `
      },
      {
        title: "How Different Dimensions Are Handled Without Distortion",
        content: `
          <p>One of the most frustrating problems when combining photos from different cameras or phones is mismatched image sizes. Many basic online tools stretch the smaller photo or crop away important edges.</p>
          <p>Our tool preserves 100% of each photo's original aspect ratio using proportional dimension matching:</p>
          <ul>
            <li><strong>In Side by Side layout:</strong> The engine matches heights to the taller image and scales both widths proportionally. Neither photo is vertically stretched or cropped.</li>
            <li><strong>In Top and Bottom layout:</strong> The engine matches widths to the wider image and scales both heights proportionally. Both photos maintain their natural proportions and crisp details.</li>
          </ul>
        `
      },
      {
        title: "PNG Transparency & Solid Background Compositing",
        content: `
          <p>The standard JPEG format does not support transparency (it lacks an alpha channel). When a transparent PNG file is converted to a JPG without proper handling, the transparent areas frequently turn into solid black boxes.</p>
          <p>To ensure clean results, our tool fills the canvas with your selected solid background color (pure white by default) before drawing your images. Transparent logos, product cutouts, and signatures will blend smoothly against the background color without ugly dark borders or artifacts.</p>
        `
      },
      {
        title: "Understanding JPEG Quality Settings",
        content: `
          <p>JPEG compression is always lossy, even when selecting the maximum quality setting. Our tool gives you three balanced quality options:</p>
          <ul>
            <li><strong>High (92% quality - Default):</strong> Delivers excellent visual clarity with minimal compression artifacts, ideal for general photography and printing.</li>
            <li><strong>Maximum (100% quality):</strong> Minimizes compression for maximum fidelity, resulting in larger file sizes. Note that JPEG encoding remains technically lossy at 100%.</li>
            <li><strong>Compact (80% quality):</strong> Reduces the output file size significantly, making it suitable for quick email attachments or web portals with strict upload limits.</li>
          </ul>
        `
      },
      {
        title: "Common Formatting Problems and Troubleshooting",
        content: `
          <ul>
            <li><strong>Problem: The merged file is too large for an application portal.</strong><br>
            <em>Fix:</em> Switch the JPEG quality to Compact (80%), or use our dedicated <a href="/compress-jpg" class="font-semibold text-blue-600 hover:underline">Compress JPG</a> tool to reduce the file size further without significant quality loss.</li>
            <li><strong>Problem: Massive camera photos cause browser slowdown.</strong><br>
            <em>Fix:</em> Modern 48-megapixel phone cameras produce very large raw pixel buffers. Our tool automatically applies safety downscaling if the combined dimensions exceed browser memory thresholds (8,192 px max) to ensure stable processing.</li>
            <li><strong>Problem: Transparent PNG areas look dark or gray.</strong><br>
            <em>Fix:</em> Ensure the background color setting is set to solid White (#FFFFFF) to composite transparent areas cleanly before JPEG export.</li>
          </ul>
        `
      },
      {
        title: "Contextual Related Tools & Guides",
        content: `
          <ul>
            <li><a href="/compress-jpg" class="font-semibold text-blue-600 hover:underline">Compress JPG</a>: Shrink the file size of your merged JPEG photo for online forms or email attachments.</li>
            <li><a href="/image-resizer" class="font-semibold text-blue-600 hover:underline">Image Resizer</a>: Resize individual photos to exact pixel dimensions before merging.</li>
            <li><a href="/jpg-to-png" class="font-semibold text-blue-600 hover:underline">Convert JPG to PNG</a>: Convert standard JPEG images into lossless PNG format.</li>
            <li><a href="/png-to-jpg" class="font-semibold text-blue-600 hover:underline">Convert PNG to JPG</a>: Convert PNG graphics with transparency into standard JPEG photos.</li>
            <li><a href="/exam-photo-resizer" class="font-semibold text-blue-600 hover:underline">Exam Photo &amp; Signature Resizer</a>: Crop and resize photos and signatures to strict government exam specifications.</li>
            <li><a href="/passport-photo-maker" class="font-semibold text-blue-600 hover:underline">Passport Photo Maker</a>: Create official biometric passport and visa photo sheets on your device.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I combine a JPG and a PNG image together?</strong><br>A: Yes. You can select one JPG and one PNG, two JPGs, or two PNGs. The tool automatically decodes both formats and composites them into a single unified JPG file.</p>
          <p><strong>Q: Will merging two photos reduce their original quality?</strong><br>A: Our default setting uses 92% JPEG quality with high-quality bicubic smoothing, preserving sharp details and accurate colors. Note that JPEG compression is inherently lossy, but visual differences are minimal.</p>
          <p><strong>Q: What happens if my two images have different heights or widths?</strong><br>A: In Side by Side layout, the tool automatically matches heights to the taller image and scales both widths proportionally. In Top and Bottom layout, it matches widths to the wider image. Neither image is cropped or distorted.</p>
          <p><strong>Q: Why does my transparent PNG need a background color?</strong><br>A: The JPEG format does not support transparency. Filling the canvas with a solid background (white by default) prevents transparent areas from rendering as black boxes upon export.</p>
          <p><strong>Q: Is there an input file size limit?</strong><br>A: Yes, each individual image can be up to 25 MB (50 MB total for both). This limit ensures your browser has sufficient memory to decode and composite the photos smoothly.</p>
          <p><strong>Q: Are my photos uploaded to your server?</strong><br>A: No. All image decoding, compositing, and JPEG generation happen locally inside your web browser using HTML5 Canvas. Your photos never leave your device.</p>
          <p><strong>Q: Can I use this image merging tool on an iPhone or Android phone?</strong><br>A: Yes. The tool works directly inside mobile browsers like Safari, Chrome, and Firefox on both iOS and Android smartphones.</p>
        `
      }
    ]
  },
  "image-dpi-converter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Image DPI Metadata Editor Changes",
        content: "<p>This tool updates the DPI or pixel-density metadata stored in JPEG and PNG files. For JPEG images, it updates or adds the JFIF density fields. For PNG images, it updates or inserts the pHYs chunk, which stores pixel density in pixels per metre. The selected image is not resized or resampled.</p>"
      },
      {
        title: "DPI Metadata Is Not the Same as Pixel Resolution",
        content: "<p>The image's pixel width and height remain unchanged. Setting a file to 200 or 300 DPI does not add pixels, sharpen a blurry photograph, restore missing detail or improve the source image's actual resolution. It changes the density value that compatible editors and print workflows can use when calculating physical size.</p><p>For the same pixel dimensions, changing the DPI value changes the physical print size that some applications infer. Different software and upload portals may ignore this metadata or use their own pixel-dimension requirements. Check the current instructions for your intended use.</p>"
      },
      {
        title: "Supported Image Formats",
        content: "<p>The tool accepts JPEG/JPG and PNG files and keeps the original image format when downloading. It supports batch processing. It does not accept WEBP, GIF, TIFF or PDF in the current dropzone.</p><p>The JPEG path edits the JFIF density metadata. The PNG path updates the pHYs chunk and its CRC. The raster image data is not recompressed by these metadata edits, although adding a missing metadata segment or chunk can change the file size slightly.</p>"
      },
      {
        title: "What This Tool Does Not Do",
        content: "<p>This is a metadata editor, not an image resizer or an image enhancer. It does not change pixel dimensions, crop an image, add detail, compress the file to a KB target, or verify that a passport, exam, print shop or document portal will accept it. A DPI value alone is not enough to establish that an image meets a particular application's requirements.</p>"
      },
      {
        title: "Browser Processing",
        content: "<p>The selected files are read as ArrayBuffers in the browser and their metadata bytes are updated locally. This component does not send the image to a DPI-conversion API. The exported JPEG or PNG is downloaded in the same format as the source file.</p>"
      },
      {
        title: "How to Change Image DPI Metadata",
        content: "<ol><li><strong>Choose a DPI value:</strong> Select 72, 96, 200 or 300 DPI, or enter a custom value from 1 to 65,535.</li><li><strong>Add images:</strong> Drop or select one or more JPEG/JPG or PNG files.</li><li><strong>Wait for the metadata update:</strong> The tool updates the JPEG JFIF density fields or PNG pHYs chunk without resampling pixels.</li><li><strong>Check the output:</strong> Review the displayed output file size and selected DPI metadata, then download the file.</li><li><strong>Verify the destination requirements:</strong> Confirm whether the receiving application checks DPI metadata, pixel dimensions, physical print size or another property.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does setting an image to 300 DPI make it sharper?</strong><br>A: No. The tool changes density metadata only. It does not add pixels or recover detail that is not present in the source image.</p>
          <p><strong>Q: Does the tool resize the image to a required pixel width and height?</strong><br>A: No. The pixel dimensions remain unchanged. Use an image resizer when an application specifies pixel dimensions.</p>
          <p><strong>Q: What does the JPEG DPI setting change?</strong><br>A: The tool updates the JFIF density unit and horizontal and vertical density fields to pixels per inch, or inserts a JFIF APP0 segment when one is not present.</p>
          <p><strong>Q: What does the PNG DPI setting change?</strong><br>A: It updates or inserts the PNG pHYs chunk, which records pixel density in pixels per metre.</p>
          <p><strong>Q: Which formats can I process?</strong><br>A: JPEG/JPG and PNG are supported. The tool keeps the input format when exporting.</p>
          <p><strong>Q: Does 200 or 300 DPI guarantee acceptance by an exam portal?</strong><br>A: No. The tool changes metadata only. An application may require particular pixel dimensions, image content, file size or other conditions. Check its current official instructions.</p>
          <p><strong>Q: Is the image uploaded to a server?</strong><br>A: The component reads and updates the image metadata in the browser. It does not send the image to a DPI-conversion API.</p>
          <p><strong>Q: Will the file size remain exactly the same?</strong><br>A: Not always. If a JFIF or pHYs metadata segment must be inserted, the output can be slightly larger. The pixel image data is not recompressed by the metadata change.</p>
        `
      }
    ]
  },,
  "image-to-text": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Image to Text (OCR) Tool Does",
        content: "<p>Upload one JPG/JPEG, PNG or WEBP image and use optical character recognition (OCR) to extract editable text. The tool uses Tesseract.js in your browser and lets you choose English, Hindi or Punjabi. You can review and edit the recognised text, copy it to the clipboard or download it as a plain-text .TXT file.</p><p>This is text recognition, not translation or document reconstruction. It returns recognised text; it does not recreate the original page layout, tables, fonts, images or formatting.</p>"
      },
      {
        title: "Supported Languages",
        content: "<p>The language selector provides three choices: English, Hindi and Punjabi. Choose the language present in the image before starting OCR. The tool does not automatically detect the language, offer an 'any language' mode or expose a multi-language combination in the current interface. The selected language controls which locally hosted Tesseract trained-data file is loaded.</p>"
      },
      {
        title: "How OCR Runs in Your Browser",
        content: "<p>The page loads a Tesseract.js script from this site's own /tesseract/ path. The OCR worker, engine core and language trained-data files are also configured to load from same-origin /tesseract/ paths. The image is passed to the browser-side OCR worker; this component does not send the image to an external OCR API.</p><p>These script, worker, engine and language files are still downloaded by the browser from this website when needed. That is different from uploading the selected image for server-side recognition. This page does not promise that no network requests occur at all.</p>"
      },
      {
        title: "Image Preprocessing and Size",
        content: "<p>Before OCR, the tool checks the image's largest dimension. If it is larger than 3,500 pixels, it creates a smaller copy with the longest side reduced to 3,500 pixels while keeping the aspect ratio, then encodes that working copy as JPEG at quality 0.95. Images at or below 3,500 pixels on their longest side are passed through without this resize step.</p><p>Downscaling very large scans can reduce processing load, but it can also remove detail from tiny text. Keep an original copy and use a sufficiently clear image when small print matters.</p>"
      },
      {
        title: "Recognition Accuracy and Limitations",
        content: "<p>OCR results depend on the source image and the selected language data. Blur, low contrast, shadows, skewed pages, unusual fonts, handwriting, tightly spaced letters, multi-column layouts and small characters can cause missing, repeated or misread text. The tool does not show a confidence score or verify the extracted text against the original image.</p><p>Always compare the output with the image, especially names, numbers, dates, addresses and application details. The result is editable so you can correct recognition mistakes before copying or downloading it.</p>"
      },
      {
        title: "Output and Supported Workflow",
        content: "<p>The tool accepts one image at a time and returns plain text. You can edit the result in the output text box, copy it or download a UTF-8 .TXT file. It does not accept PDF or Word documents in this image OCR interface, process a batch of images, translate the recognised content or create a searchable PDF.</p>"
      },
      {
        title: "How to Extract Text from an Image",
        content: "<ol><li><strong>Select one image:</strong> Upload a JPG/JPEG, PNG or WEBP file.</li><li><strong>Choose the OCR language:</strong> Select English, Hindi or Punjabi based on the text in the image.</li><li><strong>Run OCR:</strong> Click Extract Text and keep the page open while the browser loads the required OCR files and recognises the text.</li><li><strong>Review the result:</strong> Compare names, numbers, dates and other important details with the source image. Edit any errors in the text box.</li><li><strong>Copy or download:</strong> Copy the corrected text or download it as a .TXT file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Which languages can I extract?</strong><br>A: The current selector offers English, Hindi and Punjabi. Choose one language for the image; automatic language detection and a general 'all languages' mode are not provided.</p>
          <p><strong>Q: Does the OCR tool upload my image to a server?</strong><br>A: The image is processed by Tesseract in your browser, and this component does not send it to an external OCR API. The OCR script, worker, engine and language data are loaded from this site's own /tesseract/ paths.</p>
          <p><strong>Q: Does the page make any network requests?</strong><br>A: Yes. The browser may request the locally hosted Tesseract script, worker, engine core and selected language trained data from this website. That is an asset download; it does not mean the selected image is uploaded for OCR processing.</p>
          <p><strong>Q: Can I upload more than one image at a time?</strong><br>A: No. The current upload control accepts one image per run.</p>
          <p><strong>Q: What happens to a very large image?</strong><br>A: If its longest side exceeds 3,500 pixels, the tool scales it down to a maximum of 3,500 pixels on that side before recognition. This can make very small text harder to recognise.</p>
          <p><strong>Q: Will the extracted text be perfectly accurate?</strong><br>A: No. OCR can misread small, blurry, handwritten, skewed or low-contrast text. Review and correct the result against the image before relying on it.</p>
          <p><strong>Q: Does OCR translate the text or preserve its formatting?</strong><br>A: No. It recognises characters in the selected language and returns plain editable text. It does not translate the content or recreate the original page layout.</p>
          <p><strong>Q: Can I download the extracted text?</strong><br>A: Yes. You can copy the text or download a plain-text .TXT file.</p>
        `
      }
    ]
  },
};

