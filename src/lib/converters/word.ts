import mammoth from "mammoth";

async function fallbackMammothConvert(arrayBuffer: ArrayBuffer, fileName: string): Promise<Blob> {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.padding = "25mm 20mm";
  container.style.fontFamily = "Calibri, 'Segoe UI', Arial, sans-serif";
  container.style.fontSize = "11pt";
  container.style.lineHeight = "1.35";
  container.style.color = "#111";
  container.style.background = "#fff";
  container.style.width = "210mm";

  const elementsToAvoid = container.querySelectorAll("p, li, tr, h1, h2, h3, h4, h5, h6, img");
  elementsToAvoid.forEach((el: any) => {
    el.style.pageBreakInside = "avoid";
    el.style.breakInside = "avoid";
    if (el.tagName === "P") {
      el.style.marginBottom = "8px";
    }
  });

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: 0,
      filename: fileName.replace(/\.docx?$/i, ".pdf"),
      pagebreak: { mode: ["css", "legacy"] },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    return await html2pdf().set(opt).from(container).output("blob");
  } finally {
    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  }
}

export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  // Create temporary offscreen container
  const container = document.createElement("div");
  container.className = "docx-render-wrapper";
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "210mm";
  container.style.background = "#fff";
  container.style.color = "#000";
  document.body.appendChild(container);

  try {
    // 1. High-fidelity rendering with docx-preview (preserves right/center alignments, tables, margins, font styles)
    const { renderAsync } = await import("docx-preview");
    await renderAsync(arrayBuffer, container, undefined, {
      className: "docx-doc",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      useBase64URL: true,
    });

    // Clean padding inside docx pages for exact A4 print rendering
    const pages = container.querySelectorAll<HTMLElement>(".docx-doc, section.docx-doc, .docx-wrapper > section");
    pages.forEach((page) => {
      page.style.boxShadow = "none";
      page.style.margin = "0 auto";
    });

    // 2. Generate PDF via html2pdf.js
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: 0,
      filename: file.name.replace(/\.docx?$/i, ".pdf"),
      pagebreak: { mode: ["css", "legacy"] },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    const pdfBlob: Blob = await html2pdf().set(opt).from(container).output("blob");
    return pdfBlob;
  } catch (error) {
    console.warn("docx-preview conversion fallback to mammoth:", error);
    return await fallbackMammothConvert(arrayBuffer, file.name);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

