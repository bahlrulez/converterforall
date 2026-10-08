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
  }
};
