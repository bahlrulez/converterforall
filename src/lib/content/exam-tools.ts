export const examToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "exam-photo-resizer": {
    sections: [
      {
        title: "What is this tool?",
        content: "<p>The Exam Photo & Signature Resizer is a dedicated utility designed specifically for Indian government job and exam applicants. Navigating the strict photo and signature upload requirements for portals like SSC (Staff Selection Commission), UPSC, and IBPS can be incredibly frustrating. This tool takes the guesswork out of the process by providing exact dimensional crops and automatically compressing your files to strictly fit within the required KB size limits, ensuring your application is never rejected due to an invalid image.</p>"
      },
      {
        title: "Standard Exam Specifications",
        content: `
          <div class="overflow-x-auto my-4">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Exam Portal</th>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Type</th>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Size Limit</th>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Dimensions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-3 font-semibold">SSC</td>
                  <td class="px-4 py-3">Photo</td>
                  <td class="px-4 py-3">20 KB &ndash; 50 KB</td>
                  <td class="px-4 py-3">3.5cm x 4.5cm</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-semibold">SSC</td>
                  <td class="px-4 py-3">Signature</td>
                  <td class="px-4 py-3">10 KB &ndash; 20 KB</td>
                  <td class="px-4 py-3">4.0cm x 2.0cm</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/50">
                  <td class="px-4 py-3 font-semibold">UPSC</td>
                  <td class="px-4 py-3">Photo &amp; Sig</td>
                  <td class="px-4 py-3">20 KB &ndash; 300 KB</td>
                  <td class="px-4 py-3">Min 350x350 px (1:1)</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-semibold">IBPS (Banking)</td>
                  <td class="px-4 py-3">Photo</td>
                  <td class="px-4 py-3">20 KB &ndash; 50 KB</td>
                  <td class="px-4 py-3">200 x 230 px</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-semibold">IBPS (Banking)</td>
                  <td class="px-4 py-3">Signature</td>
                  <td class="px-4 py-3">10 KB &ndash; 20 KB</td>
                  <td class="px-4 py-3">140 x 60 px</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        title: "How does it work?",
        content: "<p>When you select a preset (like UPSC or SSC), the cropper automatically locks to the correct aspect ratio (width vs height). Once you align your face or signature inside the box and click process, our client-side engine crops the image and repeatedly tests different JPEG compression levels in milliseconds. If the resulting file is too large, it lowers the quality until it hits the target. If the file is too small (which causes rejections on strict portals), it safely injects standard compliant padding data to perfectly reach the minimum KB threshold.</p>"
      },
      {
        title: "Common Rejection Reasons",
        content: "<p>Avoid these common mistakes to ensure your application isn't rejected: <strong>Blurry Signatures:</strong> Do not take a photo of a tiny signature from far away and stretch it. Write largely on a blank white paper. <strong>Wrong Background:</strong> Most exams strictly require a light or white background for passport photos. <strong>Spectacles:</strong> SSC often rejects photos where flash reflects off glasses. It is safest to remove glasses entirely. <strong>Caps/Hats:</strong> Wearing caps or dark sunglasses will result in immediate rejection.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my photos uploaded to a server?</strong><br>A: No. All cropping, resizing, and compression happens entirely within your web browser (client-side). Your personal photos and signatures never leave your device, ensuring complete privacy.</p>
          <p><strong>Q: Why is my signature file still saying it's too small on the exam portal?</strong><br>A: Some portals have strict minimum limits (e.g., minimum 20 KB). Our tool automatically pads the file with safe data to guarantee it crosses this threshold, so you should not face this issue when using our presets.</p>
          <p><strong>Q: Does this tool work on mobile phones?</strong><br>A: Yes! You can take a photo of your signature directly from your smartphone camera and use the touch-screen cropper to easily format it for your application.</p>
          <p><strong>Q: What if the portal asks for DPI settings?</strong><br>A: Most modern portals actually only validate the pixel dimensions and KB size, regardless of what they state about DPI. As long as you use our tool's presets to meet the KB and pixel limits, your photo will be accepted.</p>
          <p><strong>Q: The downloaded photo looks a bit lower quality, is this normal?</strong><br>A: Yes. To squeeze a high-resolution smartphone photo into a tiny 50 KB limit, standard JPEG compression is applied. This slight loss in quality is expected and perfectly acceptable for exam applications.</p>
          <p><strong>Q: Can I use this for state-level PSC exams?</strong><br>A: Absolutely. While we have presets for central exams, you can check your specific state PSC notification. If their limits match one of our presets (e.g., 20-50 KB), the output will be perfectly valid.</p>
        `
      }
    ]
  },
  "photo-name-date-stamper": {
    sections: [
      {
        title: "Which Exams Require Name and Date on Photo?",
        content: "<p>Many Indian government job portals strictly require candidates to upload a passport-size photograph with their <strong>Name and Date of Photograph (DOP)</strong> printed at the bottom. Failure to follow this rule is one of the most common reasons for application rejection.</p><p>Major exams enforcing this rule include:</p><ul><li><strong>SSC (Staff Selection Commission):</strong> CGL, CHSL, MTS, GD Constable</li><li><strong>Defense & Police:</strong> CISF, CRPF, State Police recruitment</li><li><strong>UPSC:</strong> NDA, CDS (always verify the latest notification)</li><li><strong>Railway Recruitment Board (RRB)</strong></li></ul>"
      },
      {
        title: "Rules for Valid Date of Photograph (DOP)",
        content: "<p>When stamping the date on your photo, keep these strict guidelines in mind to prevent rejection:</p><ul><li><strong>3-Month Rule:</strong> The Date of Photograph (DOP) printed on the image must not be older than 3 months from the date of publication of the exam notification.</li><li><strong>Format:</strong> While DD/MM/YYYY is standard and widely accepted, always check if the specific exam notification requests a different format.</li><li><strong>Legibility:</strong> The text must be clearly visible. Our tool ensures this by letting you choose a solid white or black strip to contrast with the text.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will my photo lose quality when I add the name and date?</strong><br>A: No. Our tool processes the image directly in your browser and outputs a high-resolution JPEG without unnecessary compression.</p>
          <p><strong>Q: What if I need to compress the photo to 50 KB after stamping?</strong><br>A: After downloading your stamped photo, you can use our <a href="/exam-photo-resizer" class="text-blue-600 hover:underline">Exam Photo Resizer</a> to crop and compress it to the exact KB limits required by portals like SSC or UPSC.</p>
          <p><strong>Q: Is it safe to upload my photo here?</strong><br>A: Yes! This tool works 100% client-side. Your photo is processed securely within your own web browser and is never uploaded to our servers.</p>
        `
      }
    ]
  }
};
