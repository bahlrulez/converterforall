export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  // Create offscreen container for rendering
  const container = document.createElement("div");
  container.id = "docx-render-container";
  container.style.position = "fixed";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.zIndex = "999999";
  container.style.opacity = "1";
  container.style.background = "#ffffff";
  container.style.color = "#000000";
  container.style.pointerEvents = "none";
  container.style.overflow = "visible";
  document.body.appendChild(container);

  try {
    // 1. High-fidelity rendering with docx-preview
    const docxModule = await import("docx-preview");
    const renderAsync = docxModule.renderAsync || (docxModule as any).default?.renderAsync || (docxModule as any).default;

    if (typeof renderAsync !== "function") {
      throw new Error("docx-preview renderAsync is not available");
    }

    await renderAsync(arrayBuffer, container, undefined, {
      className: "docx",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      useBase64URL: true,
      renderChanges: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
    });

    // Wait for fonts & images/charts to be completely ready
    if (document.fonts) {
      await document.fonts.ready;
    }
    const imgs = Array.from(container.querySelectorAll("img"));
    if (imgs.length > 0) {
      await Promise.all(
        imgs.map((img) =>
          img.complete ? Promise.resolve() : new Promise((res) => { img.onload = res; img.onerror = res; })
        )
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Find individual rendered page sections
    let pageSections = Array.from(
      container.querySelectorAll<HTMLElement>("section.docx, .docx-wrapper > section, section")
    );

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    if (pageSections.length > 0) {
      for (let i = 0; i < pageSections.length; i++) {
        const sec = pageSections[i];
        sec.style.boxShadow = "none";
        sec.style.margin = "0 auto";
        sec.style.background = "#ffffff";

        const pageCanvas = await html2canvas(sec, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false
        });

        if (i > 0) {
          pdf.addPage();
        }

        const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      }
    } else {
      // Single continuous container fallback: slice into true A4 pages without squashing
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const pageCanvasHeight = (canvas.width * pageHeight) / pageWidth;
      const numPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

      for (let p = 0; p < numPages; p++) {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = pageCanvasHeight;
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0, p * pageCanvasHeight, canvas.width, pageCanvasHeight,
            0, 0, canvas.width, pageCanvasHeight
          );
        }

        if (p > 0) {
          pdf.addPage();
        }
        pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.98), "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }
    }

    return pdf.output("blob");
  } catch (error) {
    console.warn("docx-preview failed, falling back to mammoth:", error);
    return await fallbackMammothConvert(arrayBuffer, file.name);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

async function fallbackMammothConvert(arrayBuffer: ArrayBuffer, fileName: string): Promise<Blob> {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.position = "fixed";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.zIndex = "999999";
  container.style.opacity = "1";
  container.style.width = "794px";
  container.style.padding = "48px 56px";
  container.style.boxSizing = "border-box";
  container.style.background = "#ffffff";
  container.style.color = "#000000";
  container.style.fontFamily = "'Times New Roman', Times, 'Liberation Serif', Georgia, serif";
  container.style.fontSize = "11pt";
  container.style.lineHeight = "1.4";

  document.body.appendChild(container);

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false
    });

    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const pageCanvasHeight = (canvas.width * pageHeight) / pageWidth;
    const numPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    for (let p = 0; p < numPages; p++) {
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = pageCanvasHeight;
      const ctx = sliceCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0, p * pageCanvasHeight, canvas.width, pageCanvasHeight,
          0, 0, canvas.width, pageCanvasHeight
        );
      }

      if (p > 0) {
        pdf.addPage();
      }
      pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.98), "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
    }

    return pdf.output("blob");
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}







