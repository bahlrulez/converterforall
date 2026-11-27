export const imageToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "webp-to-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The WEBP to PNG converter turns modern WEBP images into widely compatible PNG files directly in your browser. Google's WEBP format compresses web graphics efficiently, so many websites serve saved logos, product shots, and screenshots as <code>.webp</code>. However, older desktop image editors, presentation tools, and upload forms still reject WEBP files. Converting to PNG preserves transparency (the alpha channel) so the file opens across design tools and document editors.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Rather than uploading your images to a remote server, this converter decodes your <code>.webp</code> files using native browser image decoding and renders them onto an HTML5 2D canvas. The canvas then exports a PNG image (or JPG if you switch the output selector to JPEG, filling any transparent regions with solid white). Because decoding and encoding happen inside browser memory, you can convert single files or batches directly on your computer or phone.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you save a transparent company logo or illustration from a website and it downloads as a <code>.webp</code> file, older presentation apps or upload portals may show an unsupported format error. Dropping it into this WEBP to PNG converter produces a transparent PNG copy that opens in Word, PowerPoint, Figma, Photoshop, and standard web uploaders.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your WEBP files:</strong> Drag and drop one or multiple <code>.webp</code> images into the upload box, or browse your files.</li><li><strong>Adjust format or quality (optional):</strong> By default on this route the output is PNG; if you switch to JPG, you can adjust the JPEG quality slider before downloading.</li><li><strong>Download results:</strong> Click <em>Download</em> on individual images or use <em>Download All</em> to save your converted batch.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Graphic Design:</strong> Converting saved web graphics into transparent PNG assets for design editors.</li><li><strong>CMS &amp; Portal Uploads:</strong> Preparing images for older portals or forms that only accept PNG or JPG files.</li><li><strong>Presentations &amp; Documents:</strong> Embedding crisp transparent logos into slide decks and reports without format errors.</li><li><strong>Archiving:</strong> Saving downloaded web assets in a universally readable raster format.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my WEBP images uploaded to a server?</strong><br>A: No. Decoding happens directly in your browser via HTML5 Canvas APIs; your images are not sent to a file-conversion server. Normal website resources and analytics may still load.</p>
          <p><strong>Q: Will my transparent PNG keep its alpha background?</strong><br>A: Yes. Exporting to PNG preserves existing alpha transparency from the source WEBP. If you switch the output selector to JPEG, transparent regions are filled with solid white because JPEG does not support transparency.</p>
          <p><strong>Q: Can I convert multiple WEBP files at once?</strong><br>A: Yes. The converter supports dropping multiple WEBP files at once and downloading them individually or via Download All.</p>
          <p><strong>Q: Do I need to install extra codecs or desktop software?</strong><br>A: No. It runs inside modern browsers including Chrome, Firefox, Safari, and Edge on desktop and mobile.</p>
        `
      }
    ]
  },
  "jpg-to-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The JPG to PNG converter transforms standard JPEG photos into the Portable Network Graphics (<code>.png</code>) format directly inside your browser. While JPG keeps camera files compact with lossy compression, it lacks an alpha channel for transparency. Converting JPG to PNG creates a lossless raster copy suitable for overlays, screenshots, and background removal workflows.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Our JPG to PNG tool decodes your <code>.jpg</code> or <code>.jpeg</code> image using native browser image decoding onto an HTML5 2D canvas and exports PNG bytes in browser memory without sending your photos to an external server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have a product photo in JPG format and need an uncompressed PNG intermediate before cutting out its background or layering it inside presentation software, converting here produces a clean PNG image directly.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your JPG:</strong> Drag and drop your <code>.jpg</code> or <code>.jpeg</code> image into the box or browse your device.</li><li><strong>Convert in browser:</strong> The browser renders pixels onto a canvas and exports PNG format.</li><li><strong>Save PNG:</strong> Click download to save your new <code>.png</code> file.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Photo Editing:</strong> Creating a lossless PNG copy before making graphic edits.</li><li><strong>Design Preparation:</strong> Preparing an image before removing its background in another editor.</li><li><strong>Portal &amp; App Assets:</strong> Converting photos for tools or forms that expect PNG uploads.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will converting a JPG to a PNG automatically make the background transparent?</strong><br>A: No. Converting allows the file to <em>support</em> an alpha layer, but existing solid backgrounds remain opaque until removed with our <a href="/remove-background">Remove Background</a> tool.</p>
          <p><strong>Q: Why is the PNG file larger than the original JPG?</strong><br>A: JPG uses lossy compression tuned for photographs, whereas PNG stores lossless pixel data, leading to larger files for complex photos.</p>
          <p><strong>Q: Is this JPG to PNG converter private?</strong><br>A: Yes. Conversion runs inside your web browser without sending files to a remote conversion server.</p>
          <p><strong>Q: What is the difference between JPG and JPEG?</strong><br>A: None technically—<code>.jpg</code> and <code>.jpeg</code> refer to the same JPEG image format.</p>
        `
      }
    ]
  },
  "png-to-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The PNG to JPG converter shrinks large lossless <code>.png</code> graphics and screenshots into smaller compressed JPEG (<code>.jpg</code>) images inside your browser. Smaller JPG files upload faster to application portals, fit under email limits, and load quickly across devices.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you pick a <code>.png</code> file, your browser decodes the image onto an HTML5 2D canvas and exports JPEG bytes in browser memory without sending the file to an external conversion server. Use this tool for photographic screenshots and lighter sharing copies rather than images needing alpha transparency.</p>"
      },
      {
        title: "Examples",
        content: "<p>High-DPI screen captures saved as 8MB PNG files can slow down email threads or exceed portal limits. Exporting to JPG creates a lighter file that still looks sharp in standard viewers.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PNG:</strong> Drag and drop your <code>.png</code> file into the upload box.</li><li><strong>Canvas conversion:</strong> The browser renders the graphic and encodes JPEG output in memory.</li><li><strong>Download JPG:</strong> Click download to save the compressed <code>.jpg</code> file to your device.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Web Optimization:</strong> Reducing page image payload sizes with compact JPEGs.</li><li><strong>Upload Limits:</strong> Meeting strict KB limits on forms that reject heavy PNG screenshots.</li><li><strong>Sharing &amp; Storage:</strong> Saving smaller copies of large desktop screenshot collections.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can JPG files preserve transparent PNG backgrounds?</strong><br>A: No. The JPEG format lacks an alpha transparency channel, so transparent pixels cannot remain transparent after exporting to JPG.</p>
          <p><strong>Q: Will I lose visual quality when converting PNG to JPG?</strong><br>A: The converter encodes at JPEG quality 1.0 to minimize compression artifacts, though JPEG remains a lossy format compared to PNG.</p>
          <p><strong>Q: Are my photos sent to an external server?</strong><br>A: No. Canvas conversion executes inside your browser without uploading photos to a conversion API.</p>
          <p><strong>Q: Does this work on mobile devices?</strong><br>A: Yes. It works directly inside modern mobile browsers such as Chrome on Android and Safari on iOS.</p>
        `
      }
    ]
  },
  "avif-to-jpeg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why convert AVIF to JPEG?",
        content: "<p>AVIF (<code>.avif</code>) is a modern image compression format that achieves very small file sizes, but many desktop editors, older operating systems, email clients, and application forms still refuse to open or upload AVIF images. Converting AVIF to universal JPEG (<code>.jpg</code>) ensures smooth compatibility across standard apps and upload portals.</p>"
      },
      {
        title: "Browser-Based AVIF to JPG Conversion",
        content: "<p>This converter decodes your <code>.avif</code> image directly using your browser's native AVIF decoder and draws it onto an HTML5 2D canvas to export a high-quality JPEG copy in memory without sending photos to a backend server. Note that modern browsers (recent Chrome, Edge, Firefox, or Safari) are required for native AVIF decoding.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your AVIF file:</strong> Drop a <code>.avif</code> image into the upload area above.</li><li><strong>Convert to JPEG:</strong> Click convert to decode the AVIF frame via browser canvas and encode <code>.jpg</code> output.</li><li><strong>Download JPG:</strong> Save your converted JPEG photo and verify its dimensions and quality.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does converting AVIF to JPEG reduce quality?</strong><br>A: JPEG is a lossy format, though the tool encodes at quality 1.0 to keep compression artifacts minimal for photos and everyday viewing.</p>
          <p><strong>Q: Does JPEG preserve transparency from an AVIF image?</strong><br>A: No. JPEG does not support an alpha channel, so transparent pixels flatten onto an opaque canvas bitmap; convert with our <a href="/avif-to-png">AVIF to PNG</a> tool instead if you need transparent backgrounds.</p>
          <p><strong>Q: Are my images sent to an external conversion server?</strong><br>A: No. Native decoding and canvas export run inside your browser without sending photos to a remote conversion server.</p>
        `
      }
    ]
  },
  "avif-to-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why convert AVIF to PNG?",
        content: "<p>AVIF (<code>.avif</code>) supports compact compression and alpha-channel transparency, yet many graphic editors and document portals still lack AVIF import support. Converting AVIF to <code>.png</code> keeps transparent backgrounds intact in a lossless raster format opened cleanly across desktop design software and browsers.</p><p>Older presentation tools, email clients, CMS uploaders, and print-prep workflows often reject <code>.avif</code> uploads or fail to generate thumbnails. Converting to PNG gives you a universal bitmap format with predictable alpha channels for UI icons, overlays, and transparent product cutouts.</p>"
      },
      {
        title: "Browser-Based AVIF to PNG Conversion",
        content: "<p>Using your browser's native AVIF decoder and HTML5 2D canvas, this tool draws the decoded AVIF frame with alpha transparency preserved and exports a standard <code>.png</code> image directly in browser memory rather than uploading graphics to a conversion server.</p><p>If your browser opens the AVIF file natively, canvas decoding captures exact RGBA pixel dimensions without stripping transparent corners, letting you inspect or archive clean artwork right away.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose your AVIF graphic:</strong> Drag and drop your <code>.avif</code> file into the upload box.</li><li><strong>Rasterize to PNG:</strong> Click convert to decode pixels onto a transparent 2D canvas.</li><li><strong>Download PNG:</strong> Save the lossless <code>.png</code> file to your device for editing or sharing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will converting to PNG preserve my image's transparency?</strong><br>A: Yes. Unlike JPEG, PNG stores full alpha-channel transparency so transparent logos and cutouts stay transparent.</p>
          <p><strong>Q: Why is the exported PNG file larger than the original AVIF?</strong><br>A: AVIF applies modern lossy or compact compression, whereas PNG stores lossless pixel streams that produce larger files but avoid recompression blur in editors.</p>
          <p><strong>Q: Are my graphics uploaded to a server?</strong><br>A: No. All browser decoding and canvas conversion execute inside your device's browser memory without sending images to a backend API.</p>
        `
      }
    ]
  },
  "remove-background": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Remove Background tool separates the foreground subject from JPG, PNG, or WEBP photos and exports a transparent PNG. Whether you are preparing product photos for an online shop, creating flyer cutouts, or isolating portraits from cluttered backgrounds, segmentation runs directly inside your browser.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool runs an on-device ISNet segmentation model (via <code>@imgly/background-removal</code>) in a browser Web Worker, with options for <strong>Fast</strong>, <strong>Balanced</strong>, or <strong>Maximum Quality</strong>. After automatic cutout, you can use the built-in brush editor to restore or erase fine edge details manually before exporting your transparent PNG without sending the image to a conversion server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you photograph a product on a table and want a clean transparent cutout for a catalog banner, running it through the background remover isolates the item so you can place it over any color background.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose quality &amp; upload photo:</strong> Pick Fast, Balanced, or Maximum Quality and drop a JPG, PNG, or WEBP image into the upload box.</li><li><strong>Automatic cutout &amp; manual touch-up:</strong> Let the on-device ISNet model generate the transparent alpha mask, and refine edges with the restore/erase brush if needed.</li><li><strong>Download PNG:</strong> Save your transparent PNG cutout to your device.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Online Stores:</strong> Creating clean product photos for Shopify, Amazon, or Etsy.</li><li><strong>Graphic Design:</strong> Isolating subjects for posters, thumbnails, and social media graphics.</li><li><strong>Presentations:</strong> Removing distracting backgrounds from logos and portraits for slides.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my photos uploaded to external servers?</strong><br>A: No. Background segmentation runs in your browser via @imgly/background-removal and canvas refinement without uploading your photos to a remote conversion server.</p>
          <p><strong>Q: Why does the output download as PNG?</strong><br>A: PNG preserves an alpha channel for transparent backgrounds, whereas standard JPG fills transparent regions with solid color.</p>
          <p><strong>Q: Can I fix small missed edges around hair or objects?</strong><br>A: Yes. After the automatic cutout finishes, you can open the built-in touch-up editor to brush areas back in or erase leftover background pixels.</p>
        `
      }
    ]
  },
  "compress-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this compressor?",
        content: "<p>Our Compress JPG tool reduces the file size of JPEG and JPG images directly in your browser. High-resolution photos from smartphones and cameras often exceed 5MB to 10MB; compressing them helps fit portal limits, email attachments, and web uploads. It includes a quality slider (0%–100%), an optional resolution downscale selector, and an optional grayscale filter using <code>browser-image-compression</code>.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you drop a JPG or PNG image, browser workers re-encode the file in memory according to your chosen quality percentage and optional downscale width while keeping original resolution by default. If re-encoding would produce a larger file than the input, the compressor returns the original file instead, without uploading photos to a conversion server.</p>"
      },
      {
        title: "Examples",
        content: "<p>If you have an 8MB photo to upload to a portfolio or job portal with a 2MB limit, lowering the quality slider to around 70%–80% shrinks the file footprint while keeping everyday photographic detail clear.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your image:</strong> Drag and drop your JPG file into the box or browse your device.</li><li><strong>Adjust compression options:</strong> Move the quality slider (default 80%), pick an optional downscale cap, or toggle grayscale if needed.</li><li><strong>Download:</strong> Save your compressed <code>.jpg</code> file and inspect the resulting KB size.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Website Speed:</strong> Optimizing photos so blog posts and online stores load faster.</li><li><strong>Email Attachments:</strong> Shrinking photos to fit within email attachment size limits.</li><li><strong>Job &amp; Exam Portals:</strong> Reducing photo file sizes toward portal limits before submitting applications.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my photos become blurry?</strong><br>A: Standard settings around 75%–85% preserve clean visual detail while reducing file size; lower quality values or heavy downscaling trade fine detail for smaller KB counts.</p>
          <p><strong>Q: Are my photos sent to a conversion server?</strong><br>A: No. Image compression runs in your browser memory and Web Workers without sending your selected image to a backend conversion API.</p>
          <p><strong>Q: Does canvas re-encoding strip camera metadata?</strong><br>A: Canvas and re-encoding passes generally drop embedded EXIF metadata (such as GPS coordinates) when recompressing the image.</p>
        `
      }
    ]
  },
  "compress-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this compressor?",
        content: "<p>The Compress PNG tool shrinks Portable Network Graphics (<code>.png</code>) images directly in your browser for screenshots, icons, and web graphics. Using <code>browser-image-compression</code> together with optional downscaling and grayscale controls, it helps trim oversized PNG uploads before sending or publishing them.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Your PNG is processed inside browser memory using client-side image compression workers at your chosen quality percentage (0%–100%). Original pixel dimensions are kept unless you pick a smaller target resolution, and if compression does not shrink an already optimized PNG, the tool returns your original file size cleanly without sending photos to a server.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your PNG:</strong> Drag your <code>.png</code> file into the drop zone.</li><li><strong>Adjust compression settings:</strong> Tune the quality slider or choose optional downscale/grayscale settings.</li><li><strong>Download:</strong> Save the resulting PNG and verify transparency and edge sharpness before using it.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>App &amp; Web Design:</strong> Reducing PNG asset sizes for faster page loading.</li><li><strong>Email Graphics:</strong> Keeping newsletters and email banners under attachment caps.</li><li><strong>Screenshots:</strong> Trimming high-DPI desktop screenshots before sharing in chat or bug reports.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does compressing a PNG preserve its format and dimensions?</strong><br>A: Yes. Original PNG format and pixel width/height remain intact unless you select a downscale option.</p>
          <p><strong>Q: Are my PNG files uploaded to external servers?</strong><br>A: No. Compression runs locally inside your browser memory rather than uploading images to a backend server.</p>
          <p><strong>Q: Why might an already optimized PNG stay the same size?</strong><br>A: When a PNG is already tightly compressed, further lossy reduction isn't applied blindly—if the output grows larger, the tool preserves the smaller original file.</p>
        `
      }
    ]
  },
  "passport-photo-maker": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Free Online Passport Photo Maker",
        content: "<p>Our online passport photo maker crops an existing portrait or selfie to common passport and visa aspect ratios directly in your browser. It runs in your browser without sending your photos to a conversion server, lets you select <strong>2x2 inch</strong> (US passport and Indian Visa/OCI) or <strong>35x45mm</strong> (Indian domestic passport, UK, Schengen, and Australian visas) crop ratios, and optionally replaces the background with solid White, Light Blue, Light Gray, or Deep Red.</p>"
      },
      {
        title: "How does background replacement work?",
        content: "<p>The tool runs our on-device ISNet background segmentation model inside your browser to separate your portrait from the room background and place a solid color behind you. Because segmentation and canvas cropping execute inside browser memory, your portrait does not go to an external photo-editing API.</p>"
      },
      {
        title: "Step-by-step guide to a clean photo",
        content: "<ol><li><strong>Select a portrait:</strong> Choose a clear, evenly lit front-facing photo from your device or webcam.</li><li><strong>Replace background color (optional):</strong> Run background removal and pick solid White, Light Blue, Light Gray, or Deep Red if needed.</li><li><strong>Choose size preset:</strong> Select 2x2 inches or 35x45mm aspect framing.</li><li><strong>Crop &amp; center:</strong> Position your head and shoulders inside the frame and click download to save your JPG copy.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Passport Renewals:</strong> Preparing portraits on plain white or off-white backgrounds.</li><li><strong>Online Visa Portals:</strong> Cropping headshots toward official aspect guidelines before checking exact portal KB/pixel specs.</li><li><strong>Student &amp; Work IDs:</strong> Standardizing portraits for badges and application profiles.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my passport photos uploaded to a conversion server?</strong><br>A: No. Cropping and optional background segmentation run in your browser memory without uploading your portrait to a conversion API.</p>
          <p><strong>Q: What preset do I choose for a US Passport or Indian Visa/OCI?</strong><br>A: Select the 2x2 inch (square) preset, then confirm current official pixel and file-size rules before submitting.</p>
          <p><strong>Q: What preset matches Indian domestic passports and Schengen Visas?</strong><br>A: The 35x45mm aspect ratio aligns with Indian domestic passports, UK passports, and Schengen visa applications.</p>
          <p><strong>Q: Can I print or adjust the KB size afterward?</strong><br>A: Yes. The tool exports a JPG photo you can print or pass through a photo compressor if an online portal specifies a tight KB limit.</p>
        `
      }
    ]
  },
  "heic-to-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "HEIC to JPG Converter - Convert iPhone Photos Online",
        content: "<p>When you shoot photos on an iPhone or iPad, iOS often saves them in the <strong>HEIC (High Efficiency Image Container)</strong> format, which many Windows apps and older upload portals cannot open directly. This tool decodes your Apple <code>.heic</code> or <code>.heif</code> images directly in your browser using <code>heic2any</code> WebAssembly and exports standard JPG photos.</p>"
      },
      {
        title: "Browser-based HEIC decoding",
        content: "<p>Decoding and JPG re-encoding happen directly in your browser's local memory without sending your photos to a remote conversion server, helping keep personal camera rolls and document scans private.</p>"
      },
      {
        title: "Step-by-Step: How to Convert HEIC to JPG",
        content: "<ol><li><strong>Select your HEIC image:</strong> Drag and drop your <code>.heic</code> or <code>.heif</code> file into the box.</li><li><strong>Decode &amp; convert:</strong> Your browser decodes the HEVC/HEIC frame and exports it to standard JPEG at quality setting 1.</li><li><strong>Download:</strong> Save your new <code>.jpg</code> file ready for Windows, Android, email, or application portals.</li></ol>"
      },
      {
        title: "Practical Uses",
        content: "<ul><li><strong>Windows &amp; Android Viewing:</strong> Opening iPhone camera photos on Windows PCs and older devices.</li><li><strong>Application Portals:</strong> Uploading IDs, forms, and receipts to sites that reject HEIC files.</li><li><strong>Photo Printing:</strong> Sending iPhone snapshots to print kiosks that require standard JPG files.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: Why won't my Windows PC open HEIC files directly?</strong><br>A: Older Windows setups and many websites lack built-in HEIC codec extensions. Converting to JPG produces a universally supported image.</p>
          <p><strong>Q: Are my photos sent to a server?</strong><br>A: No. Decoding via <code>heic2any</code> runs inside browser memory on your device without uploading your photo to a conversion API.</p>
          <p><strong>Q: How can I make my iPhone save JPG photos natively?</strong><br>A: On your iPhone, open <em>Settings &gt; Camera &gt; Formats</em> and pick <strong>Most Compatible</strong> instead of High Efficiency.</p>
        `
      }
    ]
  },
  "heic-to-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "HEIC to PNG Converter - Convert Apple Photos to PNG Online",
        content: "<p>Convert Apple <code>.heic</code> and <code>.heif</code> images into standard lossless <code>.png</code> files directly in your browser. If you need clean pixel reproduction to edit iPhone screenshots or graphics in Figma, Photoshop, Canva, or desktop publishing apps, converting to PNG provides wide software compatibility.</p><p>Older Windows PCs, web portals, and online design workflows frequently reject Apple <code>.heic</code> files exported from iPhones and iPads. Converting to PNG preserves crisp text in screenshots, receipts, and edited mobile captures without introducing extra JPEG block artifacts.</p>"
      },
      {
        title: "Browser-Based Decoding",
        content: "<p>This converter uses <code>heic2any</code> WebAssembly directly inside browser memory to decode HEIC frames and encode a standard PNG file without sending your images to a file-conversion server.</p>"
      },
      {
        title: "Step-by-Step: How to Convert HEIC to PNG",
        content: "<ol><li><strong>Select your HEIC file:</strong> Drag and drop a <code>.heic</code> or <code>.heif</code> image from your phone or computer.</li><li><strong>Browser decoding:</strong> The browser decodes the HEIC container and converts the raster pixels into PNG format.</li><li><strong>Download:</strong> Save the exported <code>.png</code> image directly to your device.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: When should I choose PNG instead of JPG for HEIC files?</strong><br>A: Choose JPG when you want smaller photo file sizes for portals and email; choose PNG when editing screenshots, diagrams, or graphics without extra JPEG compression artifacts.</p>
          <p><strong>Q: Why is a converted PNG larger than the original HEIC photo?</strong><br>A: HEIC uses high-efficiency video-style compression, whereas PNG stores lossless pixel data suited for clean editing, sharp screenshots, and graphic overlays.</p>
          <p><strong>Q: Does this converter run on Windows, Mac, and mobile?</strong><br>A: Yes. Because decoding runs inside JavaScript and WebAssembly, it works across modern desktop and mobile browsers.</p>
          <p><strong>Q: Are my personal photos uploaded externally?</strong><br>A: No. HEIC decoding and PNG export run inside your browser without uploading the image file to a backend server.</p>
        `
      }
    ]
  },
  "image-to-svg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Image Raster to Vector Converter (PNG/JPG/WEBP to SVG)",
        content: "<p>Convert high-contrast pixel graphics—such as logos, icons, illustrations, and scanned signatures—from <strong>JPG, PNG, or WEBP</strong> into scalable <strong>SVG vector paths</strong> directly inside your browser using client-side <code>imagetracerjs</code> path tracing.</p>"
      },
      {
        title: "Tracing Presets and Best Input Types",
        content: "<p>Pick from four built-in tracing presets: <strong>Logo (Crisp)</strong> for sharp fewer-color marks, <strong>Default (Balanced)</strong> for general color graphics, <strong>Artwork (Smooth)</strong> for rounded curves, and <strong>Line Art (B&amp;W)</strong> for black-and-white sketches and signatures. Vector tracing works cleanly on solid colors and crisp shapes rather than complex photographs.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select a raster image:</strong> Upload a JPG, PNG, or WEBP file containing a logo, icon, or clear line art.</li><li><strong>Pick a tracing preset:</strong> Choose Default, Logo (Crisp), Artwork (Smooth), or Line Art (B&amp;W).</li><li><strong>Vectorize &amp; download:</strong> Preview the traced vector paths and save the <code>-vectorized.svg</code> output to your device.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my logos or signatures uploaded to a server?</strong><br>A: No. Tracing runs inside browser memory using <code>imagetracerjs</code> rather than sending images to a backend vectorization API.</p>
          <p><strong>Q: What is the difference between Raster (PNG/JPG) and Vector (SVG)?</strong><br>A: Raster formats store fixed pixel grids that blur when zoomed in, whereas SVG files describe mathematical vector shapes that scale sharply at any print or screen size.</p>
          <p><strong>Q: Why do detailed photographs produce simplified shapes?</strong><br>A: Path tracing quantizes colors into flat regions, so smooth camera photos turn into posterized artwork while clean logos and signatures trace crisply.</p>
        `
      }
    ]
  },
  "merge-images-to-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Combine Two Images into One JPG?",
        content: `
          <p>Whether you need to submit the front and back of an ID card on an official portal, create a side-by-side comparison photo, assemble receipts, or prepare a two-panel image, joining two pictures into one JPG file saves opening heavy desktop software. This tool composites any two JPEG or PNG images onto an HTML5 2D canvas right inside your browser without uploading photos to a conversion server.</p>
          <h3>How to merge two images:</h3>
          <ol>
            <li><strong>Select Image 1 and Image 2:</strong> Drag and drop your photos into Slot 1 and Slot 2, or drop two files at once to fill both slots automatically.</li>
            <li><strong>Choose layout and spacing:</strong> Select <strong>Side by Side</strong> (horizontal) or <strong>Top and Bottom</strong> (vertical), and adjust gap spacing, outer border padding, background color, and JPEG quality (Compact 80%, High 92%, or Maximum 100%).</li>
            <li><strong>Preview and download:</strong> Inspect the live canvas preview, then click <strong>Download Merged JPG</strong> to save <code>merged-images.jpg</code>.</li>
          </ol>
        `
      },
      {
        title: "Layout Options: Side by Side vs. Top and Bottom",
        content: `
          <p>Choosing the right layout depends on your photos' orientation:</p>
          <ul>
            <li><strong>Side by Side (Horizontal):</strong> Places Image 1 on the left and Image 2 on the right—helpful for landscape photos and two-sided identity cards.</li>
            <li><strong>Top and Bottom (Vertical):</strong> Stacks Image 1 above Image 2—ideal for mobile portrait screenshots and vertical receipts.</li>
            <li><strong>Swap Order:</strong> Click <strong>Swap Order</strong> to flip Image 1 and Image 2 positions without re-selecting files.</li>
          </ul>
        `
      },
      {
        title: "Proportional Dimension Matching & Transparency Handling",
        content: `
          <p>The canvas engine preserves each photo's aspect ratio by matching heights in Side by Side mode or matching widths in Top and Bottom mode rather than stretching images. Because standard JPEG lacks an alpha channel, transparent PNG regions are drawn over your chosen solid background fill (pure white <code>#FFFFFF</code> by default) so transparent logos or signatures do not turn black.</p>
        `
      },
      {
        title: "Practical Limits & Troubleshooting",
        content: `
          <ul>
            <li><strong>File size limits:</strong> Individual source images can be up to 25 MB (50 MB total) and combined canvas dimensions are safely capped at 8,192 px to prevent browser tab crashes.</li>
            <li><strong>Shrink the output further:</strong> Switch JPEG quality to Compact (80%) or pass the result through <a href="/compress-jpg" class="font-semibold text-blue-600 hover:underline">Compress JPG</a> if a portal caps file sizes.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I combine a JPG and a PNG image together?</strong><br>A: Yes. You can mix JPG and PNG files in either slot; both are decoded and composited into one JPG file.</p>
          <p><strong>Q: Does merging two photos compress them?</strong><br>A: JPEG export is lossy at every setting; the default High (92%) preset balances sharp edges and reasonable file size, while Maximum uses 100% JPEG encoding and Compact uses 80%.</p>
          <p><strong>Q: Are my photos sent to a server?</strong><br>A: No. Image decoding, canvas compositing, and JPEG export execute in browser memory without sending your photos to a backend server.</p>
          <p><strong>Q: Why does a transparent PNG show behind a solid color?</strong><br>A: JPEG files do not support transparent alpha channels, so the tool fills the canvas with your selected background color before exporting.</p>
        `
      }
    ]
  },
  "image-to-text": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Extract Text from Images with In-Browser OCR",
        content: "<p>This Optical Character Recognition (OCR) utility extracts readable text from JPG, PNG, and WEBP screenshots, photos of printed documents, and scanned notes directly in your browser using <strong>Tesseract.js</strong> WebAssembly (loading language training files from <code>/tesseract/lang-data</code>). Very large images are downscaled to a maximum dimension of 3,500 pixels in browser memory before recognition.</p>"
      },
      {
        title: "How to Extract Text from a Picture",
        content: "<ol><li><strong>Choose your document language:</strong> Pick the language matching your image so Tesseract loads the right character set.</li><li><strong>Upload your photo or screenshot:</strong> Select or drop an image file into the upload box to start browser OCR extraction.</li><li><strong>Review and copy text:</strong> Edit or copy the recognized plain text directly into your notes, email, or document.</li></ol>"
      },
      {
        title: "Tips & Recognition Accuracy",
        content: "<p>OCR works best on sharp, evenly lit printed fonts laid out horizontally. Blurry smartphone snaps, skewed angles, cursive handwriting, or decorative fonts may need manual proofreading after extraction.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my screenshots or photos uploaded to a server for OCR?</strong><br>A: No. Text recognition runs locally in your browser via Tesseract.js WebAssembly using language data files without sending your image to a remote conversion API.</p>
          <p><strong>Q: Can it read handwritten notes?</strong><br>A: Tesseract OCR is designed for clear printed typography; neat block handwriting may partially work, while messy script typically produces low accuracy.</p>
          <p><strong>Q: Does it resize huge camera images before scanning?</strong><br>A: Yes. Images wider or taller than 3,500 px are scaled down inside the browser to keep recognition responsive and avoid tab memory errors.</p>
        `
      }
    ]
  },
  "webp-to-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "WEBP to JPG Converter",
        content: "<p>Convert Google <code>.webp</code> images into universally compatible <code>.jpg</code> photos directly inside your browser using native image decoding and HTML5 2D canvas rendering. Unlike WEBP, JPG opens on practically every Windows photo viewer, desktop presentation editor, email app, and portal uploader.</p>"
      },
      {
        title: "Transparency Handling & Batch Conversion",
        content: "<p>Because JPEG format does not support alpha transparency, the converter fills the 2D canvas with a solid white background before drawing transparent WEBP graphics so logos do not turn black. You can drop single files or multiple WEBP images at once and adjust the JPEG quality slider before downloading individually or via Download All.</p>"
      },
      {
        title: "Practical Examples",
        content: "<p>If you save product photos or thumbnails from modern web storefronts, browsers often store them as <code>.webp</code>, which legacy CMS forms and job application sites may reject. Dropping a batch here produces lightweight <code>.jpg</code> copies cleanly in one step.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Drop your WEBP files:</strong> Upload one or multiple <code>.webp</code> images from your device.</li><li><strong>Tune JPEG quality:</strong> Keep JPG selected as the output format and adjust the quality slider if you need a smaller file size.</li><li><strong>Download results:</strong> Save each converted <code>.jpg</code> file individually or download the entire batch at once.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What happens to transparent areas in a WEBP file?</strong><br>A: Standard JPEG cannot store transparency, so transparent pixels are composited onto a solid white background. Choose <a href="/webp-to-png">WEBP to PNG</a> if you need to keep transparency.</p>
          <p><strong>Q: Are my WEBP files uploaded to a server?</strong><br>A: No. Decoding and JPEG export run locally via your browser canvas without sending photos to a backend server.</p>
          <p><strong>Q: Can I batch convert several WEBP images?</strong><br>A: Yes. Drop multiple files at once and download each JPG or use Download All.</p>
        `
      }
    ]
  },
  "svg-to-png": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "SVG to PNG Converter",
        content: "<p>Rasterize Scalable Vector Graphics (<code>.svg</code>) into standard transparent <code>.png</code> images right in your browser. While SVG files scale crisply on websites, social platforms, document editors, email signatures, and upload portals commonly require raster PNG files.</p>"
      },
      {
        title: "How Browser SVG Rasterization Works",
        content: "<p>Your browser loads the uploaded <code>.svg</code> file into an HTML image element, sizes a 2D HTML5 canvas to the SVG's rendered pixel width and height, draws the vector paths onto the canvas while keeping transparent regions clear, and exports a <code>.png</code> bitmap directly in browser memory without sending assets to a conversion server.</p>"
      },
      {
        title: "Practical Uses &amp; Examples",
        content: "<p>When you export an icon or company logo as an <code>.svg</code> from Figma or Illustrator and need a transparent PNG copy to insert into Google Docs, Microsoft Word, PowerPoint, or a CMS banner uploader, this browser rasterizer generates a clean bitmap while retaining alpha transparency.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your SVG file:</strong> Drag and drop a valid <code>.svg</code> graphic into the upload box above.</li><li><strong>Rasterize in browser:</strong> The canvas renders the vector shapes at the SVG's intrinsic dimensions.</li><li><strong>Download PNG:</strong> Save the exported transparent <code>.png</code> file to your device for design or portal sharing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my exported PNG keep its transparent background?</strong><br>A: Yes. Empty regions in your SVG remain transparent in the resulting PNG canvas export.</p>
          <p><strong>Q: Why might an SVG fail to render?</strong><br>A: SVGs missing explicit width/height attributes or referencing blocked external fonts or external bitmap images may fail browser canvas drawing rules.</p>
          <p><strong>Q: Are my vector logos uploaded externally?</strong><br>A: No. Rendering runs inside browser memory without sending your SVG file to a backend server.</p>
        `
      }
    ]
  },
  "svg-to-jpg": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "SVG to JPG Converter",
        content: "<p>Convert Scalable Vector Graphics (<code>.svg</code>) into standard compressed <code>.jpg</code> image files directly inside your browser. Helpful when older photo viewers, messaging tools, email forms, or government portals require JPEG format instead of vector SVG artwork.</p>"
      },
      {
        title: "How SVG to JPG Conversion Works",
        content: "<p>The browser draws your uploaded <code>.svg</code> artwork onto an HTML5 2D canvas at its intrinsic width and height and encodes it as an <code>image/jpeg</code> file at quality setting 1.0. Because JPEG lacks an alpha channel, transparent SVG regions turn into an opaque bitmap canvas rather than staying transparent; use <a href='/svg-to-png'>SVG to PNG</a> when alpha transparency must be preserved.</p>"
      },
      {
        title: "Practical Examples",
        content: "<p>If an online registration portal accepts only JPG attachments and you have a diagram, badge, or flowchart saved in SVG format from a web export, running it through SVG to JPG generates a standard compressed JPEG image compatible with all legacy photo forms.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Choose your SVG file:</strong> Drop your <code>.svg</code> graphic into the upload area.</li><li><strong>Convert to JPEG:</strong> Click convert to render the vector artwork onto a 2D canvas and encode JPEG bytes in memory.</li><li><strong>Download JPG:</strong> Save the resulting <code>.jpg</code> image and inspect how edges and backgrounds look before sharing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does SVG to JPG preserve transparency?</strong><br>A: No. JPEG does not support an alpha channel. Pick <a href="/svg-to-png">SVG to PNG</a> when you want a transparent background.</p>
          <p><strong>Q: Why does a very small SVG export with low resolution?</strong><br>A: The canvas sizes to the SVG file's intrinsic <code>width</code> and <code>height</code>; SVG graphics without explicit pixel sizing or with small <code>24×24</code> viewports export at those pixel dimensions.</p>
          <p><strong>Q: Are my SVG files sent to a server?</strong><br>A: No. Rasterization runs locally inside your web browser rather than uploading files to a conversion server.</p>
        `
      }
    ]
  },
  "gif-maker": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Single-Image GIF Export Tool",
        content: "<p>Pass a raster image (such as a PNG, JPG, or WEBP photo) through your browser canvas pipeline to attempt saving a basic single-frame GIF target where supported by the browser's canvas encoder. If you want a true multi-frame animated looping GIF made from a video clip with FPS control and Lanczos scaling, open our dedicated <a href='/video-to-gif'>Video to GIF</a> converter instead.</p>"
      },
      {
        title: "Important Browser Codec Limitations & Recommendations",
        content: "<p>Modern desktop and mobile browsers natively support encoding PNG and JPEG via HTML5 <code>canvas.toBlob</code>, whereas true multi-frame animated GIF creation requires compiling video frames with palette quantization via FFmpeg WebAssembly on our <a href='/video-to-gif'>Video to GIF</a> route. This uploader provides a single-image raster pass inside browser memory rather than multi-image timeline authoring or frame sequencing.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select a single raster image:</strong> Drop a JPG, PNG, or WEBP photo into the upload box above.</li><li><strong>Attempt canvas export:</strong> Click convert to run the browser's native canvas blob export.</li><li><strong>For multi-frame animated loops:</strong> Visit <a href='/video-to-gif'>Video to GIF</a> to convert short MP4, MOV, or WebM clips into looping animated GIFs cleanly.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can this page stitch multiple photos into an animated GIF?</strong><br>A: No. Multi-frame animation requires a video source on the <a href="/video-to-gif">Video to GIF</a> tool rather than this single-file canvas uploader.</p>
          <p><strong>Q: Are uploaded files processed inside my browser?</strong><br>A: Yes. Canvas conversion attempts run locally in browser memory without sending images to a backend conversion server.</p>
        `
      }
    ]
  },
  "image-cropper": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Browser Image Export & Interactive Cropping Alternatives",
        content: "<p>This utility reads an uploaded JPG, PNG, or WEBP image onto your browser's HTML5 2D canvas and re-exports a clean JPG copy directly in browser memory. Note that this generic route runs canvas re-encoding on the full frame rather than offering manual pixel drag handles.</p>"
      },
      {
        title: "Where to Crop Photos & Signatures Interactively",
        content: "<p>If you need visual drag-and-zoom crop handles, custom framing rectangles, passport aspect ratios (3.5:4.5 or 2×2 inch), or target KB sizing for exams, job portals, or forms, use one of our interactive cropper studios instead: <a href='/exam-photo-resizer'>Exam Photo Resizer</a>, <a href='/exam-signature-resizer'>Exam Signature Resizer</a>, <a href='/photo-name-date-stamper'>Photo Name &amp; Date Stamper</a>, or <a href='/passport-photo-maker'>Passport Photo Maker</a>.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Drop your image:</strong> Upload a JPG, PNG, or WEBP file above if you simply want a stripped/re-encoded canvas JPG copy.</li><li><strong>Need interactive crop framing?</strong> Open <a href='/exam-photo-resizer'>Exam Photo Resizer</a> or <a href='/passport-photo-maker'>Passport Photo Maker</a> for manual crop handles and preset aspect ratios.</li><li><strong>Save output:</strong> Download the exported JPG and inspect final pixel dimensions against your requirements.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this route include drag-and-drop crop handles for custom aspect ratios?</strong><br>A: No. For interactive crop zoom and drag framing, open <a href="/exam-photo-resizer">Exam Photo Resizer</a>, <a href="/exam-signature-resizer">Exam Signature Resizer</a>, or <a href="/passport-photo-maker">Passport Photo Maker</a>.</p>
          <p><strong>Q: Will opening an interactive cropper upload my photo to a cloud server?</strong><br>A: No. Both the generic canvas uploader and interactive crop studios run inside your browser memory without transmitting photos externally.</p>
          <p><strong>Q: Are uploaded photos sent to external servers?</strong><br>A: No. Canvas processing runs in browser memory without sending your image to a backend conversion server.</p>
        `
      }
    ]
  },
  "image-resizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Browser Image Export & Dimension-Control Alternatives",
        content: "<p>This route decodes uploaded JPG, PNG, or WEBP photos and re-exports them as standard JPG files via HTML5 2D canvas inside your browser. It performs full-frame canvas export rather than providing custom pixel-width input fields on this generic uploader.</p>"
      },
      {
        title: "Tools with Downscale Sliders, Aspect Presets & DPI Controls",
        content: "<p>If you want to downscale image resolution, compress toward specific KB limits, or edit DPI metadata headers, use our specialized tools built for those exact controls: <a href='/compress-jpg'>Compress JPG</a> and <a href='/compress-png'>Compress PNG</a> include quality sliders and max-dimension downscale options; <a href='/exam-photo-resizer'>Exam Photo Resizer</a> crops ratios and targets KB caps; and <a href='/image-dpi-converter'>Image DPI Converter</a> updates 72/96/200/300 DPI headers on JPG and PNG files cleanly.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Drop your photo:</strong> Upload a JPG, PNG, or WEBP image above for standard canvas JPG export.</li><li><strong>Need custom resolution downscaling or DPI?</strong> Use <a href='/compress-jpg'>Compress JPG</a> for width/quality sliders or <a href='/image-dpi-converter'>Image DPI Converter</a> for DPI headers.</li><li><strong>Download result:</strong> Save the exported JPG and verify file properties cleanly.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Where can I adjust resolution or compress to a smaller KB size?</strong><br>A: Use <a href="/compress-jpg">Compress JPG</a> for resolution downscaling and quality control, <a href="/exam-photo-resizer">Exam Photo Resizer</a> for crop + KB ranges, or <a href="/image-dpi-converter">Image DPI Converter</a> for JPG/PNG DPI header edits.</p>
          <p><strong>Q: Does running a full-frame export remove camera EXIF metadata?</strong><br>A: Yes. Drawing an image through HTML5 canvas creates a fresh pixel bitmap without carrying GPS or camera tags into the saved JPG.</p>
          <p><strong>Q: Are images uploaded to a cloud server?</strong><br>A: No. Image re-encoding runs inside browser memory rather than sending files to a remote conversion server.</p>
        `
      }
    ]
  }
};

