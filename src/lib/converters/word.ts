import JSZip from "jszip";

// Style definition interface
interface DocxStyle {
  id: string;
  name?: string;
  alignment?: string;
  fontSizePt?: number;
  isBold?: boolean;
  isItalic?: boolean;
  color?: string;
  isHeading?: boolean;
  isTitle?: boolean;
}

// Chart data interface
interface ChartData {
  title: string;
  categories: string[];
  series: { name: string; values: number[]; color?: string }[];
}

// Extract all styles from word/styles.xml
function parseStylesXml(xmlStr: string): Map<string, DocxStyle> {
  const stylesMap = new Map<string, DocxStyle>();
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "text/xml");
    const allStyles = Array.from(doc.getElementsByTagName("*")).filter(
      (el) => el.localName === "style"
    );

    for (const s of allStyles) {
      const styleId = s.getAttribute("w:styleId") || s.getAttribute("styleId") || s.getAttribute("id");
      if (!styleId) continue;

      const styleObj: DocxStyle = { id: styleId };
      const nameEl = Array.from(s.getElementsByTagName("*")).find((el) => el.localName === "name");
      if (nameEl) {
        styleObj.name = nameEl.getAttribute("w:val") || nameEl.getAttribute("val") || "";
      }

      // Check if Heading or Title
      const sName = (styleObj.name || styleId).toLowerCase();
      if (sName.includes("title")) {
        styleObj.isTitle = true;
        styleObj.alignment = "center";
        styleObj.fontSizePt = 24;
        styleObj.isBold = true;
      } else if (sName.includes("subtitle")) {
        styleObj.alignment = "center";
        styleObj.fontSizePt = 13;
        styleObj.isBold = true;
      } else if (sName.includes("heading 1") || sName === "heading1") {
        styleObj.isHeading = true;
        styleObj.fontSizePt = 16;
        styleObj.isBold = true;
      } else if (sName.includes("heading 2") || sName === "heading2") {
        styleObj.isHeading = true;
        styleObj.fontSizePt = 13;
        styleObj.isBold = true;
      }

      // Paragraph Properties (w:pPr)
      const pPr = Array.from(s.getElementsByTagName("*")).find((el) => el.localName === "pPr");
      if (pPr) {
        const jc = Array.from(pPr.getElementsByTagName("*")).find((el) => el.localName === "jc");
        if (jc) {
          const val = (jc.getAttribute("w:val") || jc.getAttribute("val") || "").toLowerCase();
          if (val === "center") styleObj.alignment = "center";
          else if (val === "right") styleObj.alignment = "right";
          else if (val === "both" || val === "justify") styleObj.alignment = "justify";
          else if (val === "left") styleObj.alignment = "left";
        }
      }

      // Run Properties (w:rPr)
      const rPr = Array.from(s.getElementsByTagName("*")).find((el) => el.localName === "rPr");
      if (rPr) {
        const sz = Array.from(rPr.getElementsByTagName("*")).find((el) => el.localName === "sz");
        if (sz) {
          const val = parseInt(sz.getAttribute("w:val") || sz.getAttribute("val") || "0", 10);
          if (val > 0) styleObj.fontSizePt = val / 2; // half-points to pt
        }
        const b = Array.from(rPr.getElementsByTagName("*")).find((el) => el.localName === "b");
        if (b) styleObj.isBold = true;
        const colorEl = Array.from(rPr.getElementsByTagName("*")).find((el) => el.localName === "color");
        if (colorEl) {
          const cVal = colorEl.getAttribute("w:val") || colorEl.getAttribute("val");
          if (cVal && cVal !== "auto") styleObj.color = `#${cVal}`;
        }
      }

      stylesMap.set(styleId, styleObj);
    }
  } catch (e) {
    console.warn("Failed to parse styles.xml:", e);
  }
  return stylesMap;
}

// Extract default document font from styles.xml or settings
function extractDocxDefaultFont(stylesXml: string): string {
  const fontMatch = stylesXml.match(/<w:rFonts\s+[^>]*w:ascii="([^"]+)"/i) || stylesXml.match(/<w:rFonts\s+[^>]*ascii="([^"]+)"/i);
  if (fontMatch) {
    const f = fontMatch[1];
    if (/calibri|arial|liberation sans|segoe|helvetica/i.test(f)) {
      return `'Calibri', 'Segoe UI', 'Liberation Sans', Arial, sans-serif`;
    }
    if (/times|liberation serif|georgia|cambria/i.test(f)) {
      return `'Times New Roman', 'Liberation Serif', Georgia, serif`;
    }
    return `'${f}', Calibri, Arial, sans-serif`;
  }
  return `'Calibri', 'Segoe UI', 'Liberation Sans', Arial, sans-serif`;
}

// Parse DrawingML Chart XML into structured ChartData using universal pattern matching
function parseChartXml(xmlStr: string): ChartData {
  const chartData: ChartData = { title: "", categories: [], series: [] };

  // Title
  const titleMatch = xmlStr.match(/<c:title>[\s\S]*?<c:v>([^<]+)<\/c:v>/i) || xmlStr.match(/<c:title>[\s\S]*?<a:t>([^<]+)<\/a:t>/i);
  if (titleMatch) chartData.title = titleMatch[1].trim();

  // Categories
  const catMatches = [...xmlStr.matchAll(/<c:cat>([\s\S]*?)<\/c:cat>/gi)];
  if (catMatches.length > 0) {
    const ptMatches = [...catMatches[0][1].matchAll(/<c:pt[^>]*>[\s\S]*?<c:v>([^<]+)<\/c:v>/gi)];
    chartData.categories = ptMatches.map((m) => m[1].trim());
  }

  // Series
  const serMatches = [...xmlStr.matchAll(/<c:ser>([\s\S]*?)<\/c:ser>/gi)];
  serMatches.forEach((sMatch, idx) => {
    const serXml = sMatch[1];

    // Name
    const txMatch =
      serXml.match(/<c:tx>[\s\S]*?<c:v>([^<]+)<\/c:v>/i) ||
      serXml.match(/<c:tx>[\s\S]*?<a:t>([^<]+)<\/a:t>/i);
    const name = txMatch ? txMatch[1].trim() : `Column ${idx + 1}`;

    // Values
    const valBlock = serXml.match(/<c:val>([\s\S]*?)<\/c:val>/i);
    const values: number[] = [];
    if (valBlock) {
      const ptMatches = [...valBlock[1].matchAll(/<c:pt[^>]*>[\s\S]*?<c:v>([^<]+)<\/c:v>/gi)];
      ptMatches.forEach((m) => values.push(parseFloat(m[1]) || 0));
    }

    // Color
    const clrMatch = serXml.match(/<a:srgbClr\s+val="([0-9a-fA-F]{6})"/i);
    const color = clrMatch ? `#${clrMatch[1]}` : undefined;

    chartData.series.push({ name, values, color });
  });

  return chartData;
}

// Render ChartData into crisp vector SVG matching Microsoft Word chart aesthetics
function renderChartToSvg(chartData: ChartData): string {
  const width = 500;
  const height = 270;
  const padLeft = 45;
  const padRight = 115;
  const padTop = 25;
  const padBottom = 35;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  let maxVal = 10;
  for (const s of chartData.series) {
    for (const v of s.values) {
      if (v > maxVal) maxVal = v;
    }
  }
  maxVal = Math.ceil(maxVal * 1.15) || 12;

  const numCats = Math.max(1, chartData.categories.length);
  const catWidth = plotWidth / numCats;
  const numSeries = Math.max(1, chartData.series.length);
  const barWidth = Math.max(6, Math.min(22, (catWidth * 0.7) / numSeries));
  // Exact Microsoft Office standard chart theme colors
  const defaultColors = ["#2F5597", "#C65911", "#FFC000", "#70AD47", "#5B9BD5", "#A5A5A5"];

  let svg = `<div style="width: 100%; display: flex; justify-content: center; margin: 14pt 0;">`;
  svg += `<svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: 500px; height: auto; display: block; font-family: Calibri, 'Segoe UI', Arial, sans-serif; background: #ffffff; border: 1px solid #d0d7de; border-radius: 4px; padding: 4px;">`;

  // Grid lines
  const gridSteps = 4;
  for (let g = 0; g <= gridSteps; g++) {
    const val = Math.round((maxVal / gridSteps) * g);
    const y = padTop + plotHeight - (g / gridSteps) * plotHeight;
    svg += `<line x1="${padLeft}" y1="${y}" x2="${padLeft + plotWidth}" y2="${y}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="2,2" />`;
    svg += `<text x="${padLeft - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#6b7280">${val}</text>`;
  }

  // Axes
  svg += `<line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + plotHeight}" stroke="#9ca3af" stroke-width="1" />`;
  svg += `<line x1="${padLeft}" y1="${padTop + plotHeight}" x2="${padLeft + plotWidth}" y2="${padTop + plotHeight}" stroke="#9ca3af" stroke-width="1" />`;

  // Draw Bars
  for (let c = 0; c < numCats; c++) {
    const catCenter = padLeft + c * catWidth + catWidth / 2;
    const groupStartX = catCenter - (numSeries * barWidth) / 2;

    for (let s = 0; s < numSeries; s++) {
      const val = chartData.series[s]?.values[c] || 0;
      const barH = (val / maxVal) * plotHeight;
      const x = groupStartX + s * barWidth;
      const y = padTop + plotHeight - barH;
      const col = chartData.series[s]?.color || defaultColors[s % defaultColors.length];

      svg += `<rect x="${x}" y="${y}" width="${barWidth - 2}" height="${Math.max(0, barH)}" fill="${col}" rx="1" />`;
    }

    const catName = chartData.categories[c] || `Row ${c + 1}`;
    svg += `<text x="${catCenter}" y="${padTop + plotHeight + 16}" text-anchor="middle" font-size="10" fill="#374151" font-weight="500">${catName}</text>`;
  }

  // Legend on Right
  const legendX = padLeft + plotWidth + 12;
  for (let s = 0; s < numSeries; s++) {
    const ly = padTop + 25 + s * 20;
    const col = chartData.series[s]?.color || defaultColors[s % defaultColors.length];
    const sName = chartData.series[s]?.name || `Column ${s + 1}`;
    svg += `<rect x="${legendX}" y="${ly - 9}" width="10" height="10" fill="${col}" rx="1" />`;
    svg += `<text x="${legendX + 15}" y="${ly}" font-size="10" fill="#374151">${sName}</text>`;
  }

  svg += `</svg></div>`;
  return svg;
}

export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    // 1. Unzip DOCX archive
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 2. Parse styles.xml and default font
    let stylesMap = new Map<string, DocxStyle>();
    let docDefaultFont = `'Calibri', 'Segoe UI', 'Liberation Sans', Arial, sans-serif`;
    const stylesFile = zip.file("word/styles.xml");
    if (stylesFile) {
      const stylesXml = await stylesFile.async("text");
      stylesMap = parseStylesXml(stylesXml);
      docDefaultFont = extractDocxDefaultFont(stylesXml);
    }

    // 3. Extract media images to base64 Data URLs with normalized file names
    const mediaMap = new Map<string, string>();
    const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/media/"));
    for (const mPath of mediaFiles) {
      const mFile = zip.file(mPath);
      if (mFile) {
        const b64 = await mFile.async("base64");
        const ext = mPath.split(".").pop()?.toLowerCase() || "png";
        const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/png";
        const simpleName = mPath.split("/").pop() || "";
        mediaMap.set(simpleName.toLowerCase(), `data:${mime};base64,${b64}`);
      }
    }

    // 4. Extract Relationships mapping rId -> Target
    const relsMap = new Map<string, string>();
    const relsFile = zip.file("word/_rels/document.xml.rels");
    if (relsFile) {
      const relsXml = await relsFile.async("text");
      const rParser = new DOMParser();
      const rDoc = rParser.parseFromString(relsXml, "text/xml");
      const relNodes = Array.from(rDoc.getElementsByTagName("*")).filter((el) => el.localName === "Relationship");
      for (const rel of relNodes) {
        const id = rel.getAttribute("Id");
        const target = rel.getAttribute("Target");
        if (id && target) {
          relsMap.set(id, target.split("/").pop() || target);
        }
      }
    }

    // 5. Extract and pre-render DrawingML Charts
    const chartSvgMap = new Map<string, string>();
    const chartFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/charts/") && k.endsWith(".xml"));
    for (const cPath of chartFiles) {
      const cFile = zip.file(cPath);
      if (cFile) {
        const cXml = await cFile.async("text");
        const chartData = parseChartXml(cXml);
        if (chartData.series.length > 0) {
          const svg = renderChartToSvg(chartData);
          const simpleName = cPath.split("/").pop() || "";
          chartSvgMap.set(simpleName.toLowerCase(), svg);
        }
      }
    }

    // 6. Parse word/document.xml
    const docFile = zip.file("word/document.xml");
    if (!docFile) {
      throw new Error("Missing word/document.xml in DOCX");
    }
    const docXml = await docFile.async("text");
    const docParser = new DOMParser();
    const doc = docParser.parseFromString(docXml, "text/xml");

    const body = Array.from(doc.getElementsByTagName("*")).find((el) => el.localName === "body");
    if (!body) throw new Error("Missing document body");

    const pageBuckets: string[][] = [[]];
    let currentPageIndex = 0;

    const childNodes = Array.from(body.children);

    for (const node of childNodes) {
      const localName = node.localName;

      // PARAGRAPH
      if (localName === "p") {
        const descendants = Array.from(node.getElementsByTagName("*"));
        
        // Page break detection
        const hasPageBreak = descendants.some(
          (el) =>
            (el.localName === "br" && (el.getAttribute("w:type") === "page" || el.getAttribute("type") === "page")) ||
            el.localName === "lastRenderedPageBreak"
        );

        // Style inheritance
        const pStyleEl = descendants.find((el) => el.localName === "pStyle");
        const styleId = pStyleEl ? (pStyleEl.getAttribute("w:val") || pStyleEl.getAttribute("val") || "") : "";
        const inheritedStyle = stylesMap.get(styleId);

        // Alignment: direct w:jc or inherited
        let alignment = inheritedStyle?.alignment || "left";
        const jcEl = descendants.find((el) => el.localName === "jc");
        if (jcEl) {
          const val = (jcEl.getAttribute("w:val") || jcEl.getAttribute("val") || "").toLowerCase();
          if (val === "center") alignment = "center";
          else if (val === "right") alignment = "right";
          else if (val === "both" || val === "justify") alignment = "justify";
          else if (val === "left") alignment = "left";
        }

        // Check for charts or drawings in this paragraph (using XML tree + regex match)
        let customMediaHtml = "";
        const nodeXml = new XMLSerializer().serializeToString(node);

        // Check chart via regex or localName
        const chartIdMatch = nodeXml.match(/<c:chart\s+[^>]*?(?:r:id|id)="([^"]+)"/i);
        if (chartIdMatch) {
          const rId = chartIdMatch[1];
          if (relsMap.has(rId)) {
            const chartTarget = (relsMap.get(rId) || "").toLowerCase();
            if (chartSvgMap.has(chartTarget)) {
              customMediaHtml = chartSvgMap.get(chartTarget)!;
            }
          }
        }

        // Check image via regex or blip
        if (!customMediaHtml) {
          const blipIdMatch = nodeXml.match(/<a:blip\s+[^>]*?(?:r:embed|embed)="([^"]+)"/i);
          if (blipIdMatch) {
            const embedId = blipIdMatch[1];
            if (relsMap.has(embedId)) {
              const target = (relsMap.get(embedId) || "").toLowerCase();
              if (mediaMap.has(target)) {
                customMediaHtml = `<div style="text-align: center; margin: 12pt 0;"><img src="${mediaMap.get(target)}" style="max-width: 100%; height: auto; display: inline-block;" /></div>`;
              }
            }
          }
        }

        // Runs, text formatting, and hyperlinks
        let pTextHtml = "";
        const runsAndLinks = descendants.filter((el) => el.localName === "r" || el.localName === "hyperlink");
        
        for (const item of runsAndLinks) {
          if (item.localName === "hyperlink") {
            const linkRuns = Array.from(item.getElementsByTagName("*")).filter((el) => el.localName === "r");
            for (const lr of linkRuns) {
              const tEl = Array.from(lr.getElementsByTagName("*")).find((el) => el.localName === "t");
              const t = (tEl?.textContent || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
              if (t) {
                pTextHtml += `<span style="color: #0563C1; text-decoration: underline;">${t}</span>`;
              }
            }
          } else if (item.localName === "r" && item.parentElement?.localName !== "hyperlink") {
            const rChildren = Array.from(item.getElementsByTagName("*"));
            const isBold = rChildren.some((el) => el.localName === "b");
            const isItalic = rChildren.some((el) => el.localName === "i");
            const isUnderline = rChildren.some((el) => el.localName === "u");

            // Text color
            const colorEl = rChildren.find((el) => el.localName === "color");
            const runColor = colorEl ? colorEl.getAttribute("w:val") || colorEl.getAttribute("val") : null;

            const tEl = rChildren.find((el) => el.localName === "t");
            let t = (tEl?.textContent || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (!t) continue;

            if (runColor && runColor !== "auto") {
              t = `<span style="color: #${runColor};">${t}</span>`;
            }
            if (isBold) t = `<strong>${t}</strong>`;
            if (isItalic) t = `<em>${t}</em>`;
            if (isUnderline) t = `<u>${t}</u>`;
            pTextHtml += t;
          }
        }

        const isBullet = descendants.some((el) => el.localName === "numPr");
        const isTitle = inheritedStyle?.isTitle || styleId.toLowerCase().includes("title");
        const isHeading = inheritedStyle?.isHeading || styleId.toLowerCase().includes("heading");

        let elHtml = "";
        if (customMediaHtml) {
          elHtml += customMediaHtml;
        }
        if (pTextHtml.trim()) {
          if (isTitle) {
            elHtml += `<h1 style="font-size: 22pt; font-weight: bold; margin: 14pt 0 8pt 0; text-align: ${alignment}; color: #000000;">${pTextHtml}</h1>`;
          } else if (isHeading) {
            const fSize = inheritedStyle?.fontSizePt ? `${inheritedStyle.fontSizePt}pt` : "14pt";
            elHtml += `<h2 style="font-size: ${fSize}; font-weight: bold; margin: 12pt 0 6pt 0; text-align: ${alignment}; color: #000000;">${pTextHtml}</h2>`;
          } else if (isBullet) {
            elHtml += `<div style="margin-left: 24pt; margin-bottom: 4pt; color: #000000; text-align: ${alignment};">• &nbsp;${pTextHtml}</div>`;
          } else {
            const rightStyle = alignment === "right" ? "margin-left: auto; width: 100%;" : "";
            elHtml += `<p style="margin: 0 0 6pt 0; line-height: 1.35; text-align: ${alignment}; ${rightStyle} color: #000000;">${pTextHtml}</p>`;
          }
        }

        if (elHtml) {
          pageBuckets[currentPageIndex].push(elHtml);
        }

        if (hasPageBreak) {
          currentPageIndex++;
          pageBuckets[currentPageIndex] = [];
        }
      } else if (localName === "tbl") {
        // TABLE
        let tblHtml = `<table style="width: 100%; border-collapse: collapse; margin: 12pt 0;">`;
        const rowNodes = Array.from(node.getElementsByTagName("*")).filter((el) => el.localName === "tr");
        for (const row of rowNodes) {
          tblHtml += `<tr>`;
          const cellNodes = Array.from(row.getElementsByTagName("*")).filter((el) => el.localName === "tc");
          for (const cell of cellNodes) {
            const cellText = (cell.textContent || "").trim();
            tblHtml += `<td style="border: 1px solid #555555; padding: 6pt 10pt; font-size: 10.5pt; color: #000000; vertical-align: top;">${cellText}</td>`;
          }
          tblHtml += `</tr>`;
        }
        tblHtml += `</table>`;
        pageBuckets[currentPageIndex].push(tblHtml);
      }
    }

    // Filter valid page buckets
    const validPages = pageBuckets.filter((p) => p.length > 0);
    if (validPages.length === 0) {
      throw new Error("No page content could be extracted from DOCX");
    }

    // 7. Multi-page A4 PDF Generation
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    for (let pIdx = 0; pIdx < validPages.length; pIdx++) {
      const pageContainer = document.createElement("div");
      pageContainer.id = `docx-page-render-${pIdx}`;
      pageContainer.innerHTML = validPages[pIdx].join("\n");

      // Standard A4 Dimensions (794px × 1123px, 1-inch margins)
      pageContainer.style.position = "fixed";
      pageContainer.style.top = "0px";
      pageContainer.style.left = "0px";
      pageContainer.style.zIndex = "999999";
      pageContainer.style.opacity = "1";
      pageContainer.style.width = "794px";
      pageContainer.style.minHeight = "1123px";
      pageContainer.style.padding = "60px 65px";
      pageContainer.style.boxSizing = "border-box";
      pageContainer.style.background = "#ffffff";
      pageContainer.style.color = "#000000";
      pageContainer.style.fontFamily = docDefaultFont;
      pageContainer.style.fontSize = "11pt";
      pageContainer.style.lineHeight = "1.35";
      pageContainer.style.pointerEvents = "none";
      pageContainer.style.overflow = "visible";

      document.body.appendChild(pageContainer);

      try {
        if (document.fonts) {
          await document.fonts.ready;
        }
        const pageCanvas = await html2canvas(pageContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: 1024
        });

        if (pIdx > 0) {
          pdf.addPage();
        }

        const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      } finally {
        if (document.body.contains(pageContainer)) {
          document.body.removeChild(pageContainer);
        }
      }
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("OpenXML conversion error:", error);
    throw error;
  }
}










