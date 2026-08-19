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

  // 1. Extract clean HTML with Mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  // 2. Extract paragraph alignments from DOCX XML
  const docxStyles = await extractDocxAlignments(arrayBuffer);

  // 3. Create document container styled like a real Word page
  const container = document.createElement("div");
  container.className = "word-document-container";
  container.innerHTML = htmlContent;
  
  // High-accuracy Word formatting
  container.style.position = "fixed";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.zIndex = "-99999";
  container.style.opacity = "1";
  container.style.pointerEvents = "none";
  container.style.width = "185mm"; // Fits A4 print area
  container.style.minHeight = "270mm";
  container.style.padding = "0px";
  container.style.boxSizing = "border-box";
  container.style.background = "#ffffff";
  container.style.color = "#000000";
  container.style.fontFamily = "'Times New Roman', Times, 'Liberation Serif', Georgia, serif";
  container.style.fontSize = "11pt";
  container.style.lineHeight = "1.35";

  // 4. Map paragraph alignments to HTML elements
  const htmlParas = Array.from(container.querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, h5, h6, li"));
  
  htmlParas.forEach((p, idx) => {
    // Prevent awkward page cuts inside paragraphs
    p.style.pageBreakInside = "avoid";
    p.style.breakInside = "avoid";
    p.style.margin = "0 0 6pt 0";

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

  // Style tables if any
  const tables = container.querySelectorAll<HTMLElement>("table");
  tables.forEach((tbl) => {
    tbl.style.width = "100%";
    tbl.style.borderCollapse = "collapse";
    tbl.style.margin = "8pt 0";
    tbl.style.pageBreakInside = "avoid";
  });

  const tableCells = container.querySelectorAll<HTMLElement>("td, th");
  tableCells.forEach((cell) => {
    cell.style.padding = "4pt 6pt";
    cell.style.verticalAlign = "top";
  });

  // Mount to body
  document.body.appendChild(container);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: [12, 12, 12, 12], // Standard 12mm page margin
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



