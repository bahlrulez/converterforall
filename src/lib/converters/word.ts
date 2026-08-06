import mammoth from "mammoth";

export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  // 1. Convert DOCX to HTML using mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;
  
  // 2. Wrap HTML in a container to give it a document-like appearance
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "12pt";
  container.style.lineHeight = "1.5";
  container.style.color = "#000";
  container.style.background = "#fff";
  
  // Apply CSS to prevent page breaks inside common text block elements
  const elementsToAvoid = container.querySelectorAll('p, li, tr, h1, h2, h3, h4, h5, h6, img');
  elementsToAvoid.forEach((el: any) => {
    el.style.pageBreakInside = 'avoid';
    el.style.breakInside = 'avoid';
    // Add small margin to paragraphs so they look like Word docs
    if (el.tagName === 'P') {
      el.style.marginBottom = '10px';
    }
  });
  
  // Create a hidden div to append to body so html2pdf can process it properly
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  try {
    // 3. Dynamically import html2pdf.js to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default;
    
    // 4. Configure html2pdf
    const opt: any = {
      margin:       15, // mm
      filename:     'converted.pdf',
      pagebreak:    { mode: ['css', 'legacy'] },
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // 5. Generate PDF and get Blob
    const worker = html2pdf().set(opt).from(container);
    
    // html2pdf().output('blob') returns a promise resolving to a blob in newer versions.
    const pdfBlob = await worker.output('blob');
    
    return pdfBlob;
  } finally {
    // Clean up the hidden element
    document.body.removeChild(wrapper);
  }
}
