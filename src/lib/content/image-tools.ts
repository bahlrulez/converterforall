export const imageToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
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
    sections: [
      {
        title: "What is this compressor?",
        content: "<p>Our Compress JPG tool is designed to reduce the file size of your JPEG and JPG images without noticeable loss in visual quality. High-resolution photos from smartphones and cameras can easily be 5MB to 10MB each. This compressor shrinks the file footprint so your photos upload faster on portals, fit into email attachments, and load quickly on websites.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The compression runs locally inside your web browser. When you select an image, your device processes the image data directly in memory. Because supported operations happen on your own computer or phone, you don't have to wait for server uploads or worry about file privacy.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have an 8MB photo to upload to a portfolio or job portal that has a 2MB limit, dropping it into our compressor quickly reduces the file size to under 500KB while keeping the image clear and sharp.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your image:</strong> Drag and drop your JPG file into the box or browse your device.</li><li><strong>Adjust Compression:</strong> Choose your preferred compression level or target size.</li><li><strong>Download:</strong> Click download to save your new lightweight JPG file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Website Speed:</strong> Optimizing photos so blog posts and online stores load quickly.</li><li><strong>Email Attachments:</strong> Shrinking photos to fit within email attachment size limits.</li><li><strong>Job &amp; Exam Portals:</strong> Meeting strict upload caps on government and university applications.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my photos become blurry?</strong><br>A: At standard compression settings, the visual difference is practically unnoticeable for regular viewing while significantly reducing file size.</p>
          <p><strong>Q: Are my photos kept private?</strong><br>A: Yes. The compression runs in your browser's local memory and is not uploaded to our servers.</p>
          <p><strong>Q: Does it strip camera location data?</strong><br>A: Yes, in-browser canvas processing naturally removes EXIF metadata (such as GPS coordinates), which protects your privacy and helps make the file smaller.</p>
        `
      }
    ]
  },
  "compress-png": {
    sections: [
      {
        title: "What is this compressor?",
        content: "<p>The Compress PNG tool reduces the file size of Portable Network Graphics (PNG) images while preserving sharp lines and transparent backgrounds. It is especially useful for screenshots, logos, and digital graphics that need to be lightweight for web use.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Our tool uses in-browser color optimization to reduce unnecessary palette data without causing visible banding. By running directly on your device, your images remain private and download immediately.</p>"
      },
      {
        title: "Examples",
        content: "<p>A high-resolution screenshot or app icon exported as a 3MB PNG can often be reduced to under 400KB with clean edges and transparent background intact.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PNG:</strong> Drag your file into the box.</li><li><strong>Adjust:</strong> Choose your desired compression level.</li><li><strong>Download:</strong> Click download to save your optimized PNG file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>App &amp; Web Design:</strong> Compressing transparent logos and icons for faster rendering.</li><li><strong>Email Graphics:</strong> Keeping newsletters and email banners under size caps.</li><li><strong>Sharing Screenshots:</strong> Sending crisp screenshots without sending heavy files.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my image keep its transparent background?</strong><br>A: Yes. The PNG compressor preserves transparent alpha layers.</p>
          <p><strong>Q: Is this compression private?</strong><br>A: Yes. Processing happens locally in your browser's memory without server uploads.</p>
        `
      }
    ]
  },
  "passport-photo-maker": {
    sections: [
      {
        title: "Free Online Passport Photo Converter",
        content: "<p>Our free online passport photo converter takes your existing portrait or selfie and converts it into a perfectly cropped passport or visa photo directly in your browser. Since it processes the image locally on your device, your personal photos are never uploaded to any server. You can convert photos into supported standard 2x2 inch dimensions (for US passport and Indian Visa/OCI) or 35x45mm sizes (for Indian domestic passport, UK, European Schengen, or Australian visas), and replace background colors to meet standard requirements.</p>"
      },
      {
        title: "How does background replacement work?",
        content: "<p>The tool uses on-device image processing to separate your portrait from the background and apply a standard solid color (such as white, light blue, or gray). Because this runs locally in your web browser, your personal photo is not uploaded or stored on any server.</p>"
      },
      {
        title: "Step-by-step guide to a clean photo",
        content: "<ol><li><strong>Select a portrait:</strong> Choose a clear photo with even lighting on your face.</li><li><strong>Background Color:</strong> Use the background tool to select a solid color (white or light blue) as required by your application.</li><li><strong>Choose Size:</strong> Select US/India Visa (2x2 inches) or International Standard (35x45mm).</li><li><strong>Crop &amp; Center:</strong> Position your face within the guidelines.</li><li><strong>Download:</strong> Save your formatted photo ready for printing or digital submission.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Passport Renewals:</strong> Creating compliant photos with standard solid white backgrounds.</li><li><strong>Online Visa Portals:</strong> Preparing exact dimension requirements for online immigration forms.</li><li><strong>Student &amp; Work IDs:</strong> Standardizing photos for badges and application profiles.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is it safe to use for passport photos?</strong><br>A: Yes. The tool runs locally in your browser, so your photos are not saved or sent to external databases.</p>
          <p><strong>Q: What size do I need for a US Passport or Indian Visa/OCI?</strong><br>A: Select the 2x2 inch (square) preset.</p>
          <p><strong>Q: What size is used for Indian domestic passports and Schengen Visas?</strong><br>A: The 35x45mm international standard is used for Indian passports, Schengen visas, and UK applications.</p>
          <p><strong>Q: Can I print the downloaded file?</strong><br>A: Yes. The tool outputs a standard high-resolution JPG file that you can print at home or at any local photo center.</p>
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
    sections: [
      {
        title: "Image Raster to Vector Converter (PNG/JPG to SVG)",
        content: "<p>Instantly vectorize logos, icons, and signatures. Convert pixel-based images (PNG, JPG, WEBP) into scalable vector graphics (SVG) entirely inside your browser without uploading your files to any cloud server.</p>"
      },
      {
        title: "Is this Image to Vector converter really free?",
        content: "<p>Yes! Unlike most vectorizer tools that charge monthly fees or add watermarks to your downloads, our tool is 100% free with unlimited conversions and zero watermarks.</p>"
      },
      {
        title: "Are my images uploaded to your servers?",
        content: "<p>No. All vector tracing is done entirely in your browser using advanced client-side scripts. Your sensitive images and signatures never leave your device.</p>"
      },
      {
        title: "What is the difference between Raster and Vector?",
        content: "<p>Raster images (like PNG or JPG) are made of fixed pixels and become blurry when zoomed in. Vector graphics (like SVG) are made of mathematical paths, meaning they can be scaled to any size (from a business card to a billboard) without losing quality.</p>"
      },
      {
        title: "What types of images work best?",
        content: "<p>This tool works best on high-contrast images with solid colors and clear edges, such as logos, icons, line art, and scanned signatures. It is not designed to vectorize complex, highly detailed photographs.</p>"
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
          <p><strong>Border Padding &amp; Print Margins:</strong> You can apply outer border padding (convenient presets up to 400 px or custom slider up to 400 px) to add uniform border margins around your merged image. Larger pixel margins are particularly helpful when preparing combined images for physical printing, framing, or trimming. Because padding is applied in digital image pixels, actual physical margins on paper depend on your output resolution and printer scaling settings. For example, 400 pixels at 300 DPI is approximately 1.33 inches (33.9 mm), though this will vary depending on your printer scale and page setup.</p>
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
  }
};

