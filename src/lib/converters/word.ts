import JSZip from "jszip";
import mammoth from "mammoth";

// Chart data interface
interface ChartData {
  title: string;
  categories: string[];
  series: { name: string; values: number[]; color?: string }[];
}

// Parse DrawingML Chart XML into structured ChartData
function parseChartXml(xmlStr: string): ChartData {
  const chartData: ChartData = { title: "", categories: [], series: [] };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "text/xml");

    // Title
    const titleEl = doc.querySelector("title");
    if (titleEl) {
      chartData.title = (titleEl.textContent || "").trim();
    }

    // Categories
    const catPts = Array.from(doc.querySelectorAll("cat pt, c\\:cat c\\:pt"));
    if (catPts.length > 0) {
      chartData.categories = catPts.map((pt) => {
        const val = pt.querySelector("v, c\\:v");
        return val ? (val.textContent || "").trim() : "";
      });
    }

    // Series
    const serNodes = Array.from(doc.querySelectorAll("ser, c\\:ser"));
    serNodes.forEach((ser, sIdx) => {
      let name = `Series ${sIdx + 1}`;
      const tx = ser.querySelector("tx, c\\:tx");
      if (tx) {
        const v = tx.querySelector("v, c\\:v, a\\:t, t");
        if (v && v.textContent) name = v.textContent.trim();
      }

      const valPts = Array.from(ser.querySelectorAll("val pt, c\\:val c\\:pt"));
      const values = valPts.map((pt) => {
        const v = pt.querySelector("v, c\\:v");
        return v ? parseFloat(v.textContent || "0") || 0 : 0;
      });

      let color: string | undefined;
      const clr = ser.querySelector("srgbClr, a\\:srgbClr");
      if (clr) {
        const hex = clr.getAttribute("val");
        if (hex) color = `#${hex}`;
      }

      chartData.series.push({ name, values, color });
    });
  } catch (e) {
    console.warn("Error parsing chart XML:", e);
  }

  return chartData;
}

// Render ChartData into crisp vector SVG
function renderChartToSvg(chartData: ChartData): string {
  const width = 480;
  const height = 260;
  const padLeft = 45;
  const padRight = 110;
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
  maxVal = Math.ceil(maxVal * 1.15) || 10;

  const numCats = Math.max(1, chartData.categories.length);
  const catWidth = plotWidth / numCats;
  const numSeries = Math.max(1, chartData.series.length);
  const barWidth = Math.max(6, Math.min(24, (catWidth * 0.7) / numSeries));
  const defaultColors = ["#4472C4", "#ED7D31", "#FFC000", "#A5A5A5", "#70AD47", "#264478"];

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: 480px; height: auto; display: block; margin: 12pt auto; font-family: Calibri, Arial, sans-serif; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 6px;">`;

  // Grid lines
  const gridSteps = 4;
  for (let g = 0; g <= gridSteps; g++) {
    const val = Math.round((maxVal / gridSteps) * g);
    const y = padTop + plotHeight - (g / gridSteps) * plotHeight;
    svg += `<line x1="${padLeft}" y1="${y}" x2="${padLeft + plotWidth}" y2="${y}" stroke="#e0e0e0" stroke-width="1" stroke-dasharray="2,2" />`;
    svg += `<text x="${padLeft - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#666">${val}</text>`;
  }

  // Axes
  svg += `<line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + plotHeight}" stroke="#888" stroke-width="1" />`;
  svg += `<line x1="${padLeft}" y1="${padTop + plotHeight}" x2="${padLeft + plotWidth}" y2="${padTop + plotHeight}" stroke="#888" stroke-width="1" />`;

  // Bars
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
    svg += `<text x="${catCenter}" y="${padTop + plotHeight + 16}" text-anchor="middle" font-size="10" fill="#333">${catName}</text>`;
  }

  // Legend
  const legendX = padLeft + plotWidth + 10;
  for (let s = 0; s < numSeries; s++) {
    const ly = padTop + 20 + s * 18;
    const col = chartData.series[s]?.color || defaultColors[s % defaultColors.length];
    const sName = chartData.series[s]?.name || `Column ${s + 1}`;
    svg += `<rect x="${legendX}" y="${ly - 9}" width="10" height="10" fill="${col}" rx="1" />`;
    svg += `<text x="${legendX + 15}" y="${ly}" font-size="10" fill="#444">${sName}</text>`;
  }

  svg += `</svg>`;
  return svg;
}

export async function convertWordToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    // 1. Unzip DOCX package
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 2. Extract media images to base64 Data URLs
    const mediaMap = new Map<string, string>();
    const mediaFolder = zip.folder("word/media");
    if (mediaFolder) {
      const mediaFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/media/"));
      for (const mPath of mediaFiles) {
        const mFile = zip.file(mPath);
        if (mFile) {
          const b64 = await mFile.async("base64");
          const ext = mPath.split(".").pop()?.toLowerCase() || "png";
          const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/png";
          const filename = mPath.replace("word/media/", "");
          mediaMap.set(filename, `data:${mime};base64,${b64}`);
        }
      }
    }

    // 3. Extract Relationships mapping rId -> Target
    const relsMap = new Map<string, string>();
    const relsFile = zip.file("word/_rels/document.xml.rels");
    if (relsFile) {
      const relsXml = await relsFile.async("text");
      const rParser = new DOMParser();
      const rDoc = rParser.parseFromString(relsXml, "text/xml");
      const relNodes = Array.from(rDoc.querySelectorAll("Relationship"));
      for (const rel of relNodes) {
        const id = rel.getAttribute("Id");
        const target = rel.getAttribute("Target");
        if (id && target) {
          relsMap.set(id, target);
        }
      }
    }

    // 4. Extract Charts
    const chartSvgMap = new Map<string, string>();
    const chartFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/charts/") && k.endsWith(".xml"));
    for (const cPath of chartFiles) {
      const cFile = zip.file(cPath);
      if (cFile) {
        const cXml = await cFile.async("text");
        const chartData = parseChartXml(cXml);
        if (chartData.series.length > 0) {
          const svg = renderChartToSvg(chartData);
          const cName = cPath.replace("word/", "");
          chartSvgMap.set(cName, svg);
        }
      }
    }

    // 5. Parse word/document.xml page-by-page
    const docFile = zip.file("word/document.xml");
    if (!docFile) {
      throw new Error("Missing word/document.xml in DOCX");
    }
    const docXml = await docFile.async("text");
    const docParser = new DOMParser();
    const doc = docParser.parseFromString(docXml, "text/xml");

    // Extract pages by splitting on page breaks
    const body = doc.querySelector("w\\:body, body");
    if (!body) throw new Error("Missing document body");

    const pageBuckets: string[][] = [[]];
    let currentPageIndex = 0;

    const childNodes = Array.from(body.children);

    for (const node of childNodes) {
      const tagName = node.tagName.toLowerCase();

      // Check for explicit page break in paragraphs
      if (tagName.includes("p") || tagName === "w:p") {
        const hasPageBreak = !!node.querySelector("w\\:br[w\\:type='page'], br[type='page'], w\\:lastRenderedPageBreak, lastRenderedPageBreak");
        
        // Convert paragraph to HTML
        let alignment = "left";
        const jc = node.querySelector("w\\:jc, jc");
        if (jc) {
          const val = (jc.getAttribute("w:val") || jc.getAttribute("val") || "").toLowerCase();
          if (val === "right") alignment = "right";
          else if (val === "center") alignment = "center";
          else if (val === "both" || val === "justify") alignment = "justify";
        }

        // Check for charts or drawings in this paragraph
        const blip = node.querySelector("a\\:blip, blip");
        const chartRef = node.querySelector("c\\:chart, chart");

        let customMediaHtml = "";
        if (chartRef) {
          const rId = chartRef.getAttribute("r:id") || chartRef.getAttribute("id");
          if (rId && relsMap.has(rId)) {
            const chartTarget = relsMap.get(rId)!;
            if (chartSvgMap.has(chartTarget)) {
              customMediaHtml = chartSvgMap.get(chartTarget)!;
            }
          }
        } else if (blip) {
          const embedId = blip.getAttribute("r:embed") || blip.getAttribute("embed");
          if (embedId && relsMap.has(embedId)) {
            const target = relsMap.get(embedId)!.replace("media/", "");
            if (mediaMap.has(target)) {
              customMediaHtml = `<img src="${mediaMap.get(target)}" style="max-width: 100%; height: auto; display: block; margin: 10pt auto;" />`;
            }
          }
        }

        // Paragraph text content & formatting
        const runs = Array.from(node.querySelectorAll("w\\:r, r"));
        let pTextHtml = "";
        for (const r of runs) {
          const isBold = !!r.querySelector("w\\:b, b");
          const isItalic = !!r.querySelector("w\\:i, i");
          const isUnderline = !!r.querySelector("w\\:u, u");
          let t = (r.querySelector("w\\:t, t")?.textContent || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if (!t) continue;
          if (isBold) t = `<strong>${t}</strong>`;
          if (isItalic) t = `<em>${t}</em>`;
          if (isUnderline) t = `<u>${t}</u>`;
          pTextHtml += t;
        }

        const isBullet = !!node.querySelector("w\\:numPr, numPr");
        const headingStyle = node.querySelector("w\\:pStyle, pStyle")?.getAttribute("w:val") || "";
        const isHeading = headingStyle.toLowerCase().includes("heading") || headingStyle.toLowerCase().includes("title");

        let elHtml = "";
        if (customMediaHtml) {
          elHtml += customMediaHtml;
        }
        if (pTextHtml.trim()) {
          if (isHeading) {
            elHtml += `<h2 style="font-size: 14pt; font-weight: bold; margin: 12pt 0 6pt 0; text-align: ${alignment}; color: #000;">${pTextHtml}</h2>`;
          } else if (isBullet) {
            elHtml += `<div style="margin-left: 20pt; margin-bottom: 4pt; color: #000;">• ${pTextHtml}</div>`;
          } else {
            const rightStyle = alignment === "right" ? "margin-left: auto; width: 100%;" : "";
            elHtml += `<p style="margin: 0 0 6pt 0; line-height: 1.35; text-align: ${alignment}; ${rightStyle} color: #000;">${pTextHtml}</p>`;
          }
        }

        if (elHtml) {
          pageBuckets[currentPageIndex].push(elHtml);
        }

        if (hasPageBreak) {
          currentPageIndex++;
          pageBuckets[currentPageIndex] = [];
        }
      } else if (tagName.includes("tbl") || tagName === "w:tbl") {
        // Table parsing
        let tblHtml = `<table style="width: 100%; border-collapse: collapse; margin: 10pt 0;">`;
        const rows = Array.from(node.querySelectorAll("w\\:tr, tr"));
        for (const row of rows) {
          tblHtml += `<tr>`;
          const cells = Array.from(row.querySelectorAll("w\\:tc, tc"));
          for (const cell of cells) {
            const cellText = (cell.textContent || "").trim();
            tblHtml += `<td style="border: 1px solid #555; padding: 5pt 8pt; font-size: 10.5pt; color: #000; vertical-align: top;">${cellText}</td>`;
          }
          tblHtml += `</tr>`;
        }
        tblHtml += `</table>`;
        pageBuckets[currentPageIndex].push(tblHtml);
      }
    }

    // Filter out completely empty page buckets
    const validPages = pageBuckets.filter((p) => p.length > 0);
    if (validPages.length === 0) {
      throw new Error("No page content parsed");
    }

    // 6. Multi-page A4 rendering via html2canvas & jsPDF
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    for (let pIdx = 0; pIdx < validPages.length; pIdx++) {
      const pageContainer = document.createElement("div");
      pageContainer.id = `docx-page-${pIdx}`;
      pageContainer.innerHTML = validPages[pIdx].join("\n");

      // Exact A4 dimensions (794px × 1123px)
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
      pageContainer.style.fontFamily = "'Times New Roman', Times, 'Liberation Serif', Georgia, serif";
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
    console.warn("Custom docx parser failed, falling back to mammoth:", error);
    return await fallbackMammothConvert(arrayBuffer, file.name);
  }
}

async function fallbackMammothConvert(arrayBuffer: ArrayBuffer, fileName: string): Promise<Blob> {
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
  container.style.padding = "60px 65px";
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








