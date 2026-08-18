export async function convertHtmlToPdf(file: File): Promise<Blob> {
  const htmlContent = await file.text();

  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.background = "#ffffff";
  container.style.color = "#000000";

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: 15,
      filename: "document.pdf",
      pagebreak: { mode: ["css", "legacy"] },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const worker = html2pdf().set(opt).from(container);
    const pdfBlob = await worker.output("blob");
    return pdfBlob;
  } finally {
    document.body.removeChild(wrapper);
  }
}
