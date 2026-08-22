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
        title: "What is this converter?",
        content: "<p>The AVIF to JPEG converter turns modern AVIF images into standard JPEG format. AVIF is a newer image format with great compression efficiency, but some older programs, devices, and websites cannot open it yet. This tool converts your AVIF files into standard JPEGs so you can use them anywhere.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your browser decodes the AVIF file locally and re-encodes the image into the standard JPEG format. Because decoding and encoding happen on your local device, no files are uploaded to a remote server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you download an image from a modern website saved as an AVIF file, you might find that older versions of Word or Photoshop refuse to open it. Converting it to a standard JPEG allows you to insert it into documents and share it without compatibility issues.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your AVIF:</strong> Drag and drop your file into the box.</li><li><strong>Local Conversion:</strong> Your browser decodes and converts the image.</li><li><strong>Download:</strong> Click download to save your new JPEG file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Software Compatibility:</strong> Making web assets usable in older versions of Word, PowerPoint, and photo editors.</li><li><strong>Social Media Sharing:</strong> Converting AVIF files into standard JPEGs for platforms that do not yet support AVIF.</li><li><strong>Printing:</strong> Preparing images for photo print kiosks that require standard JPG files.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why would I convert AVIF to JPEG?</strong><br>A: For compatibility with older software, photo editors, or websites that do not yet support AVIF files.</p>
          <p><strong>Q: Does AVIF support transparency?</strong><br>A: Yes, but because JPEG does not support transparency, transparent areas are filled with white during conversion.</p>
          <p><strong>Q: Is this AVIF converter private?</strong><br>A: Yes. The file is processed locally in your browser's memory without external server uploads.</p>
        `
      }
    ]
  },
  "avif-to-png": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The AVIF to PNG converter transforms modern AVIF images into standard PNG format while preserving transparent backgrounds. This makes transparent web assets usable in graphic design tools and older software that cannot yet open AVIF files.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your browser decodes the AVIF image and encodes it into the standard PNG format, maintaining transparency and full image detail without sending files to external servers.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you download a transparent graphic in AVIF format and your video editor or design program rejects it, converting it to PNG gives you a compatible file with its transparent background intact.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your AVIF:</strong> Drag your file into the box.</li><li><strong>Conversion:</strong> The browser processes the image locally.</li><li><strong>Download:</strong> Click download to save your PNG file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Design Compatibility:</strong> Ensuring transparent graphics can be opened in Photoshop, Illustrator, and Canva.</li><li><strong>Video Overlays:</strong> Creating compatible transparent overlays for video editing software.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my image lose quality during AVIF to PNG conversion?</strong><br>A: No. PNG is a lossless format. Our converter extracts the exact pixel data from the AVIF and saves it as a PNG, ensuring absolutely zero generation loss or degradation.</p>
          <p><strong>Q: Will the converter preserve my transparent background?</strong><br>A: Yes! Unlike converting to a JPEG, converting an AVIF to a PNG perfectly preserves the alpha channel, meaning your transparent backgrounds will remain fully transparent.</p>
          <p><strong>Q: Why is the new PNG file so much larger than the AVIF?</strong><br>A: AVIF uses incredibly advanced, modern lossy compression algorithms. PNG is an older, lossless format. Consequently, the PNG file requires significantly more data to store the exact same image detail.</p>
          <p><strong>Q: Is it safe to process confidential designs with this tool?</strong><br>A: Completely. The conversion takes place exclusively on your local device. Your files are never uploaded to a server, guaranteeing 100% privacy.</p>
          <p><strong>Q: Do I need a specific browser to convert AVIF files?</strong><br>A: You need a modern browser that natively supports AVIF decoding, such as recent versions of Google Chrome, Mozilla Firefox, or Microsoft Edge.</p>
          <p><strong>Q: Can I use this AVIF converter on a mobile phone?</strong><br>A: Yes, as long as your mobile browser is up-to-date and supports AVIF decoding natively.</p>
          <p><strong>Q: Does AVIF to PNG conversion take a long time?</strong><br>A: Not at all. Because it avoids server uploads and downloads, the local processing usually takes less than a second.</p>
          <p><strong>Q: Will this remove HDR data from the AVIF?</strong><br>A: Yes, standard PNG formats do not support the advanced High Dynamic Range (HDR) color profiles found in some AVIF files, so the colors will be tonemapped to standard RGB space.</p>
          <p><strong>Q: Can I convert an animated AVIF to an animated PNG?</strong><br>A: Currently, this tool will extract and convert only the first frame of an animated AVIF sequence.</p>
          <p><strong>Q: Are there any watermarks added to the downloaded PNG?</strong><br>A: None at all. Our tool provides clean, watermark-free conversions entirely for free.</p>
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
        title: "What is the Passport Photo Maker?",
        content: "<p>Our Passport Photo Maker lets you convert portraits and selfies into properly sized passport and visa photos directly in your browser. Whether you need standard 2x2 inch photos (for US passport and Indian Visa/OCI) or 35x45mm photos (for Indian domestic passport, UK, European Schengen, or Australian visas), you can easily crop, frame, and replace background colors to meet official requirements.</p>"
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
  }
};
