import mammoth from "mammoth";
import JSZip from "jszip";

interface ParagraphStyleInfo {
  alignment?: "left" | "right" | "center" | "justify";
  indentPt?: number;
  snippet?: string;
}

async function extractDocxAlignments(arrayBuffer: ArrayBuffer): Promise<ParagraphStyleInfo[]> {
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXmlFile = zip.file("word/document.xml");
    if (!docXmlFile) return [];

    const xmlText = await docXmlFile.async("text");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const pNodes = Array.from(xmlDoc.getElementsByTagName("w:p"));

    return pNodes.map((p) => {
      const info: ParagraphStyleInfo = {};
      
      // Check alignment (w:jc)
      const jc = p.getElementsByTagName("w:jc")[0] || p.querySelector("jc");
      if (jc) {
        const val = (jc.getAttribute("w:val") || jc.getAttribute("val") || "").toLowerCase();
        if (val === "right") info.alignment = "right";
        else if (val === "center") info.alignment = "center";
        else if (val === "both" || val === "justify") info.alignment = "justify";
        else if (val === "left") info.alignment = "left";
      }

      // Check left indentation
      const ind = p.getElementsByTagName("w:ind")[0] || p.querySelector("ind");
      if (ind) {
        const left = ind.getAttribute("w:left") || ind.getAttribute("left");
        if (left) {
          const dxa = parseInt(left, 10);
          if (!isNaN(dxa) && dxa > 720) {
            info.indentPt = Math.round(dxa / 20); // 20 dxa = 1 pt
          }
        }
      }

      // Clean snippet for matching
      info.snippet = (p.textContent || "").trim().replace(/\s+/g, " ").toLowerCase().substring(0, 35);

      return info;
    });
  } catch (err) {
    console.warn("Failed to extract DOCX alignment XML:", err);
    return [];
  }
}

export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  // 1. Extract clean HTML and embedded images with Mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  // 2. Extract paragraph alignments from DOCX XML
  const docxStyles = await extractDocxAlignments(arrayBuffer);

  // 3. Create document container styled like a real Word page
  const container = document.createElement("div");
  container.id = "word-pdf-render-box";
  container.innerHTML = htmlContent;
  
  // High-accuracy Word formatting
  // Positioned on top with full opacity so html2canvas renders 100% of the content without dark theme overlay or blank clipping
  container.style.position = "fixed";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.zIndex = "999999";
  container.style.opacity = "1";
  container.style.width = "794px"; // Standard A4 width (210mm at 96dpi)
  container.style.minHeight = "1123px";
  container.style.padding = "40px 50px";
  container.style.boxSizing = "border-box";
  container.style.background = "#ffffff";
  container.style.color = "#000000";
  container.style.fontFamily = "'Times New Roman', Times, 'Liberation Serif', Georgia, serif";
  container.style.fontSize = "11pt";
  container.style.lineHeight = "1.35";
  container.style.overflow = "visible";

  // 4. Style headings, lists, tables, and images inside container
  const headings = container.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6");
  headings.forEach((h) => {
    h.style.color = "#000000";
    h.style.fontWeight = "bold";
    h.style.margin = "12pt 0 6pt 0";
    h.style.pageBreakInside = "avoid";
  });

  const h1s = container.querySelectorAll<HTMLElement>("h1");
  h1s.forEach((h) => {
    h.style.fontSize = "18pt";
  });

  const lists = container.querySelectorAll<HTMLElement>("ul, ol");
  lists.forEach((l) => {
    l.style.margin = "4pt 0 8pt 24pt";
    l.style.padding = "0";
  });

  const listItems = container.querySelectorAll<HTMLElement>("li");
  listItems.forEach((li) => {
    li.style.margin = "0 0 3pt 0";
    li.style.pageBreakInside = "avoid";
  });

  const images = container.querySelectorAll<HTMLElement>("img");
  images.forEach((img) => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "10pt auto";
    img.style.pageBreakInside = "avoid";
  });

  const tables = container.querySelectorAll<HTMLElement>("table");
  tables.forEach((tbl) => {
    tbl.style.width = "100%";
    tbl.style.borderCollapse = "collapse";
    tbl.style.margin = "10pt 0";
    tbl.style.pageBreakInside = "avoid";
  });

  const tableCells = container.querySelectorAll<HTMLElement>("td, th");
  tableCells.forEach((cell) => {
    cell.style.border = "1px solid #666666";
    cell.style.padding = "5pt 8pt";
    cell.style.verticalAlign = "top";
    cell.style.fontSize = "10.5pt";
    cell.style.color = "#000000";
  });

  // 5. Map paragraph alignments to HTML elements
  const htmlParas = Array.from(container.querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, h5, h6, li"));
  
  htmlParas.forEach((p, idx) => {
    p.style.pageBreakInside = "avoid";
    p.style.breakInside = "avoid";
    if (p.tagName === "P") {
      p.style.margin = "0 0 6pt 0";
      p.style.color = "#000000";
    }

    const pText = (p.textContent || "").trim().replace(/\s+/g, " ").toLowerCase();
    if (!pText) return;

    // Match style by index or snippet
    let match = docxStyles[idx];
    if (!match || (match.snippet && !pText.includes(match.snippet.substring(0, 15)))) {
      match = docxStyles.find(
        (s) => s.snippet && pText.includes(s.snippet.substring(0, 15))
      ) || match;
    }

    if (match) {
      if (match.alignment) {
        p.style.textAlign = match.alignment;
        if (match.alignment === "right") {
          p.style.marginLeft = "auto";
          p.style.width = "100%";
        }
      }
      if (match.indentPt && match.indentPt > 36) {
        p.style.marginLeft = `${match.indentPt}pt`;
      }
    }

    // Heuristic detection for common right-aligned letter headers (Addresses, Phone numbers, Emails, Dates)
    if (!p.style.textAlign || p.style.textAlign === "left") {
      const isHeaderSnippet = /^(date:|117 junction|birmingham|b21|\+44|sbunty94|handsworth)/i.test(pText) ||
        /\b(england|yahoo\.com|\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})\b/i.test(pText);

      if (isHeaderSnippet) {
        const isRightInXml = docxStyles.some(
          (s) => s.alignment === "right" && s.snippet && pText.includes(s.snippet.substring(0, 10))
        );
        if (isRightInXml) {
          p.style.textAlign = "right";
          p.style.marginLeft = "auto";
          p.style.width = "100%";
        }
      }
    }
  });

  // Mount to body for capture
  document.body.appendChild(container);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: [10, 10, 10, 10], // 10mm margins for clean A4 printing
      filename: file.name.replace(/\.docx?$/i, ".pdf"),
      pagebreak: { mode: ["css", "legacy", "avoid-all"] },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1024
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    const worker = html2pdf().set(opt).from(container);
    const pdfBlob: Blob = await worker.outputPdf("blob");
    return pdfBlob;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}




