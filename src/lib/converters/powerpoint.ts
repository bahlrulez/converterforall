import JSZip from "jszip";

interface ExtractedSlide {
  slideNumber: number;
  title: string;
  subtitles: string[];
  paragraphs: string[];
  tables: string[][][];
  images: string[]; // Base64 data URLs
  bgColor?: string;
}

export async function convertPptxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Discover all slide XML files and sort them numerically
  const slidePaths: string[] = [];
  zip.forEach((relativePath) => {
    if (/^ppt\/slides\/slide\d+\.xml$/i.test(relativePath)) {
      slidePaths.push(relativePath);
    }
  });

  slidePaths.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)![0], 10);
    const numB = parseInt(b.match(/\d+/)![0], 10);
    return numA - numB;
  });

  if (slidePaths.length === 0) {
    throw new Error("No readable presentation slides found in this PowerPoint file.");
  }

  const parser = new DOMParser();
  const slidesData: ExtractedSlide[] = [];

  for (let i = 0; i < slidePaths.length; i++) {
    const slidePath = slidePaths[i];
    const slideXmlText = await zip.file(slidePath)?.async("text");
    if (!slideXmlText) continue;

    const xmlDoc = parser.parseFromString(slideXmlText, "text/xml");

    // Check for relationship file to load embedded images
    const relsPath = slidePath.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels";
    const relsXmlText = await zip.file(relsPath)?.async("text");
    const relsMap: Record<string, string> = {};

    if (relsXmlText) {
      const relsDoc = parser.parseFromString(relsXmlText, "text/xml");
      const relElements = relsDoc.getElementsByTagName("Relationship");
      for (let r = 0; r < relElements.length; r++) {
        const id = relElements[r].getAttribute("Id");
        const target = relElements[r].getAttribute("Target");
        if (id && target) {
          const cleanTarget = target.replace("../", "ppt/");
          relsMap[id] = cleanTarget;
        }
      }
    }

    // Extract embedded images for this slide
    const slideImages: string[] = [];
    const blipElements = xmlDoc.getElementsByTagName("a:blip");
    for (let b = 0; b < blipElements.length; b++) {
      const embedId = blipElements[b].getAttribute("r:embed");
      if (embedId && relsMap[embedId]) {
        const imageFile = zip.file(relsMap[embedId]);
        if (imageFile) {
          const imgBase64 = await imageFile.async("base64");
          const mime = relsMap[embedId].endsWith(".png")
            ? "image/png"
            : relsMap[embedId].endsWith(".svg")
            ? "image/svg+xml"
            : "image/jpeg";
          slideImages.push(`data:${mime};base64,${imgBase64}`);
        }
      }
    }

    // Extract text paragraphs and titles
    let title = "";
    const subtitles: string[] = [];
    const paragraphs: string[] = [];

    const shapeElements = xmlDoc.getElementsByTagName("p:sp");
    for (let s = 0; s < shapeElements.length; s++) {
      const sp = shapeElements[s];
      const pElements = sp.getElementsByTagName("a:p");

      let shapeText = "";
      for (let p = 0; p < pElements.length; p++) {
        const tElements = pElements[p].getElementsByTagName("a:t");
        let paraLine = "";
        for (let t = 0; t < tElements.length; t++) {
          paraLine += tElements[t].textContent || "";
        }
        if (paraLine.trim()) {
          paragraphs.push(paraLine.trim());
          shapeText += " " + paraLine.trim();
        }
      }

      // Detect title shape
      const ph = sp.getElementsByTagName("p:ph")[0];
      const phType = ph?.getAttribute("type");
      if (phType === "title" || phType === "ctrTitle") {
        if (shapeText.trim() && !title) {
          title = shapeText.trim();
        }
      } else if (phType === "subTitle") {
        if (shapeText.trim()) {
          subtitles.push(shapeText.trim());
        }
      }
    }

    // Fallback: If no explicit title placeholder was found, use the first paragraph
    if (!title && paragraphs.length > 0) {
      title = paragraphs[0];
      paragraphs.shift();
    }

    // Extract tables
    const tables: string[][][] = [];
    const tblElements = xmlDoc.getElementsByTagName("a:tbl");
    for (let t = 0; t < tblElements.length; t++) {
      const tbl = tblElements[t];
      const rowElements = tbl.getElementsByTagName("a:tr");
      const tableData: string[][] = [];
      for (let r = 0; r < rowElements.length; r++) {
        const cellElements = rowElements[r].getElementsByTagName("a:tc");
        const rowData: string[] = [];
        for (let c = 0; c < cellElements.length; c++) {
          const tElements = cellElements[c].getElementsByTagName("a:t");
          let cellText = "";
          for (let k = 0; k < tElements.length; k++) {
            cellText += tElements[k].textContent || "";
          }
          rowData.push(cellText.trim());
        }
        if (rowData.length > 0) tableData.push(rowData);
      }
      if (tableData.length > 0) tables.push(tableData);
    }

    slidesData.push({
      slideNumber: i + 1,
      title: title || `Slide ${i + 1}`,
      subtitles,
      paragraphs,
      tables,
      images: slideImages,
    });
  }

  // 2. Render all slides into a print/PDF container with slide layout styling
  const container = document.createElement("div");
  container.style.width = "1120px";
  container.style.background = "#0f172a";
  container.style.color = "#ffffff";
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";

  slidesData.forEach((slide, idx) => {
    const slideBox = document.createElement("div");
    slideBox.style.width = "1120px";
    slideBox.style.minHeight = "630px";
    slideBox.style.height = "630px";
    slideBox.style.boxSizing = "border-box";
    slideBox.style.padding = "50px 60px";
    slideBox.style.position = "relative";
    slideBox.style.display = "flex";
    slideBox.style.flexDirection = "column";
    slideBox.style.justifyContent = "space-between";
    slideBox.style.background = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
    slideBox.style.color = "#f8fafc";
    slideBox.style.pageBreakAfter = idx < slidesData.length - 1 ? "always" : "auto";
    slideBox.style.breakAfter = idx < slidesData.length - 1 ? "page" : "auto";
    slideBox.style.overflow = "hidden";

    // Slide Header / Title
    const headerBox = document.createElement("div");
    headerBox.style.marginBottom = "24px";

    const titleEl = document.createElement("h1");
    titleEl.innerText = slide.title;
    titleEl.style.fontSize = "32px";
    titleEl.style.fontWeight = "800";
    titleEl.style.lineHeight = "1.2";
    titleEl.style.margin = "0 0 10px 0";
    titleEl.style.color = "#ffffff";
    titleEl.style.borderBottom = "3px solid #3b82f6";
    titleEl.style.paddingBottom = "12px";
    headerBox.appendChild(titleEl);

    if (slide.subtitles.length > 0) {
      const subEl = document.createElement("p");
      subEl.innerText = slide.subtitles.join(" • ");
      subEl.style.fontSize = "16px";
      subEl.style.color = "#94a3b8";
      subEl.style.margin = "0";
      headerBox.appendChild(subEl);
    }
    slideBox.appendChild(headerBox);

    // Slide Body Content
    const bodyBox = document.createElement("div");
    bodyBox.style.flex = "1";
    bodyBox.style.display = "flex";
    bodyBox.style.gap = "30px";
    bodyBox.style.alignItems = "flex-start";

    // Left Column: Text & Bullets
    const textBox = document.createElement("div");
    textBox.style.flex = "1";

    if (slide.paragraphs.length > 0) {
      const ul = document.createElement("ul");
      ul.style.listStyleType = "none";
      ul.style.padding = "0";
      ul.style.margin = "0";

      slide.paragraphs.forEach((pText) => {
        const li = document.createElement("li");
        li.style.fontSize = "16px";
        li.style.lineHeight = "1.6";
        li.style.color = "#cbd5e1";
        li.style.marginBottom = "14px";
        li.style.display = "flex";
        li.style.alignItems = "flex-start";
        li.style.gap = "10px";

        const dot = document.createElement("span");
        dot.innerHTML = "•";
        dot.style.color = "#3b82f6";
        dot.style.fontSize = "22px";
        dot.style.lineHeight = "1";

        const span = document.createElement("span");
        span.innerText = pText;

        li.appendChild(dot);
        li.appendChild(span);
        ul.appendChild(li);
      });
      textBox.appendChild(ul);
    }

    // Tables if any
    if (slide.tables.length > 0) {
      slide.tables.forEach((tableData) => {
        const tblEl = document.createElement("table");
        tblEl.style.width = "100%";
        tblEl.style.borderCollapse = "collapse";
        tblEl.style.marginTop = "16px";
        tblEl.style.fontSize = "13px";

        tableData.forEach((row, rIdx) => {
          const tr = document.createElement("tr");
          tr.style.background = rIdx === 0 ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)";
          row.forEach((cell) => {
            const td = document.createElement(rIdx === 0 ? "th" : "td");
            td.innerText = cell;
            td.style.padding = "8px 12px";
            td.style.border = "1px solid rgba(255, 255, 255, 0.1)";
            td.style.color = rIdx === 0 ? "#ffffff" : "#cbd5e1";
            tr.appendChild(td);
          });
          tblEl.appendChild(tr);
        });
        textBox.appendChild(tblEl);
      });
    }

    bodyBox.appendChild(textBox);

    // Right Column: Images if any
    if (slide.images.length > 0) {
      const imgBox = document.createElement("div");
      imgBox.style.width = "380px";
      imgBox.style.display = "flex";
      imgBox.style.flexDirection = "column";
      imgBox.style.gap = "12px";

      slide.images.slice(0, 2).forEach((imgSrc) => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.style.width = "100%";
        img.style.maxHeight = "240px";
        img.style.objectFit = "contain";
        img.style.borderRadius = "12px";
        img.style.border = "1px solid rgba(255, 255, 255, 0.15)";
        img.style.background = "rgba(0, 0, 0, 0.2)";
        imgBox.appendChild(img);
      });
      bodyBox.appendChild(imgBox);
    }

    slideBox.appendChild(bodyBox);

    // Slide Footer
    const footerBox = document.createElement("div");
    footerBox.style.display = "flex";
    footerBox.style.justifyContent = "space-between";
    footerBox.style.alignItems = "center";
    footerBox.style.paddingTop = "16px";
    footerBox.style.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
    footerBox.style.fontSize = "12px";
    footerBox.style.color = "#64748b";

    const brand = document.createElement("span");
    brand.innerText = "ConverterForAll Slides";
    const pageNum = document.createElement("span");
    pageNum.innerText = `Slide ${slide.slideNumber} of ${slidesData.length}`;

    footerBox.appendChild(brand);
    footerBox.appendChild(pageNum);
    slideBox.appendChild(footerBox);

    container.appendChild(slideBox);
  });

  // 3. Mount hidden container and generate Landscape PDF
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
      filename: "presentation.pdf",
      pagebreak: { mode: ["css", "legacy"] },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 1120 },
      jsPDF: { unit: "px", format: [1120, 630], orientation: "landscape" },
    };

    const worker = html2pdf().set(opt).from(container);
    const pdfBlob = await worker.output("blob");
    return pdfBlob;
  } finally {
    document.body.removeChild(wrapper);
  }
}
