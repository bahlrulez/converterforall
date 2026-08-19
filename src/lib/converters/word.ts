export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  // Create temporary offscreen visible container for capturing
  const container = document.createElement("div");
  container.id = "docx-pdf-render-box";
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
    // 1. High-fidelity rendering with docx-preview (renders exact Word pages, charts, tables, fonts, alignments)
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

    // Clean padding/shadows for exact A4 canvas capture
    const pageSections = Array.from(
      container.querySelectorAll<HTMLElement>("section.docx, section.docx-doc, .docx-wrapper > section, article.docx-doc")
    );

    // If docx-preview grouped into sections
    const pagesToRender = pageSections.length > 0 ? pageSections : [container];

    pagesToRender.forEach((sec) => {
      sec.style.boxShadow = "none";
      sec.style.margin = "0 auto";
      sec.style.background = "#ffffff";
    });

    // Wait for fonts and all images/charts to be completely loaded
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

    // Small tick to ensure browser layout & SVG/canvas charts are fully drawn
    await new Promise((resolve) => setTimeout(resolve, 150));

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < pagesToRender.length; i++) {
      const pageEl = pagesToRender[i];
      const pageCanvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 1024
      });

      if (i > 0) {
        pdf.addPage();
      }

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.96);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
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
  container.style.minHeight = "1123px";
  container.style.padding = "48px 56px";
  container.style.boxSizing = "border-box";
  container.style.background = "#ffffff";
  container.style.color = "#000000";
  container.style.fontFamily = "'Times New Roman', Times, 'Liberation Serif', Georgia, serif";
  container.style.fontSize = "11pt";
  container.style.lineHeight = "1.35";

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
      logging: false,
      windowWidth: 1024
    });

    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/jpeg", 0.96);

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    return pdf.output("blob");
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}






