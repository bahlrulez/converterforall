import JSZip from "jszip";
import * as docxPreview from "docx-preview";

// Chart data interface
interface ChartData {
  title: string;
  categories: string[];
  series: { name: string; values: number[]; color?: string }[];
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

  let svg = `<div class="embedded-word-chart" style="width: 100%; display: flex; justify-content: center; margin: 14pt 0;">`;
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
  // 1. First attempt high-fidelity server-side conversion if available
  try {
    const formData = new FormData();
    formData.append("file", file);

    const apiRes = await fetch("/api/convert-word-to-pdf", {
      method: "POST",
      body: formData,
    });

    if (apiRes.ok) {
      const contentType = apiRes.headers.get("content-type") || "";
      if (contentType.includes("application/pdf")) {
        const blob = await apiRes.blob();
        if (blob.size > 0) {
          return blob;
        }
      }
    }
  } catch (apiErr) {
    console.info("Server API bypass, running client-side engine:", apiErr);
  }

  // 2. Client-Side High-Precision Engine
  const arrayBuffer = await file.arrayBuffer();

  // Extract DrawingML Charts from ZIP
  const chartSvgList: string[] = [];
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const chartFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/charts/") && k.endsWith(".xml"));
    for (const cPath of chartFiles) {
      const cFile = zip.file(cPath);
      if (cFile) {
        const cXml = await cFile.async("text");
        const chartData = parseChartXml(cXml);
        if (chartData.series.length > 0) {
          chartSvgList.push(renderChartToSvg(chartData));
        }
      }
    }
  } catch (e) {
    console.warn("Chart extraction warning:", e);
  }

  // Mount high-precision docx-preview container
  const renderContainer = document.createElement("div");
  renderContainer.id = "docx-render-stage";
  renderContainer.style.position = "fixed";
  renderContainer.style.top = "0px";
  renderContainer.style.left = "0px";
  renderContainer.style.zIndex = "999999";
  renderContainer.style.opacity = "1";
  renderContainer.style.background = "#ffffff";
  renderContainer.style.pointerEvents = "none";
  renderContainer.style.overflow = "visible";

  // Exact Microsoft Word Typography & Box-Model Metrics Reset
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    #docx-render-stage .docx-wrapper {
      background: #ffffff !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    #docx-render-stage section.docx {
      box-shadow: none !important;
      margin: 0 auto !important;
      background: #ffffff !important;
      box-sizing: border-box !important;
      width: 210mm !important;
      min-height: 297mm !important;
      padding: 25.4mm !important; /* Standard 1-inch Word margin */
      font-family: 'Times New Roman', Times, 'Liberation Serif', serif !important;
      letter-spacing: -0.012em !important; /* Sub-pixel glyph tracking matching Word DirectWrite */
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: geometricPrecision !important;
    }
    #docx-render-stage p {
      margin-top: 0 !important;
      margin-bottom: 2.5pt !important; /* Exact space-after */
      line-height: 1.15 !important;     /* Exact 1.15 line pitch */
      text-align: justify !important;
      text-justify: inter-word !important;
    }
    #docx-render-stage h1,
    #docx-render-stage h2,
    #docx-render-stage h3,
    #docx-render-stage h4 {
      margin-top: 5pt !important;
      margin-bottom: 2pt !important;
      line-height: 1.18 !important;
    }
    #docx-render-stage ul,
    #docx-render-stage ol {
      margin-top: 2pt !important;
      margin-bottom: 3pt !important;
      padding-left: 18pt !important;
    }
    #docx-render-stage li {
      margin-top: 0 !important;
      margin-bottom: 1.5pt !important;
      line-height: 1.15 !important;
      text-align: left !important;
    }
    #docx-render-stage table {
      margin-top: 4pt !important;
      margin-bottom: 4pt !important;
      border-collapse: collapse !important;
    }
  `;
  renderContainer.appendChild(styleEl);
  document.body.appendChild(renderContainer);

  try {
    // 3. Render DOCX using docx-preview layout engine with authentic Word layout
    await docxPreview.renderAsync(arrayBuffer, renderContainer, undefined, {
      className: "docx",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      experimental: true,
      trimXmlDeclaration: true,
      useBase64URL: true,
      renderHeaders: true,
      renderFooters: true,
    });

    // 4. Inject DrawingML vector charts into drawing placeholders if missing
    if (chartSvgList.length > 0) {
      const allParagraphs = Array.from(renderContainer.querySelectorAll("p, div, section"));
      let chartIdx = 0;
      for (const p of allParagraphs) {
        if (p.textContent?.includes("Column 1") || p.innerHTML.includes("drawing") || p.classList.contains("docx-drawing")) {
          if (chartIdx < chartSvgList.length) {
            const chartWrapper = document.createElement("div");
            chartWrapper.innerHTML = chartSvgList[chartIdx];
            p.appendChild(chartWrapper);
            chartIdx++;
          }
        }
      }
      // If not inserted yet, append to first section
      if (chartIdx < chartSvgList.length) {
        const firstSection = renderContainer.querySelector("section.docx, section");
        if (firstSection) {
          const chartWrapper = document.createElement("div");
          chartWrapper.innerHTML = chartSvgList[0];
          firstSection.appendChild(chartWrapper);
        }
      }
    }

    // 5. Wait for document fonts and images to complete rendering
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise((r) => setTimeout(r, 150));

    // 6. Locate all rendered page sections
    const pageSections = Array.from(
      renderContainer.querySelectorAll("section.docx, .docx-wrapper > section, section")
    ) as HTMLElement[];

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    if (pageSections.length > 0) {
      // Process page by page matching exact Word section pagination
      for (let i = 0; i < pageSections.length; i++) {
        const section = pageSections[i];
        
        // Ensure clean white background and full visibility
        section.style.background = "#ffffff";
        section.style.boxShadow = "none";
        section.style.margin = "0";

        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        if (i > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      }
    } else {
      // Fallback single wrapper capture
      const canvas = await html2canvas(renderContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
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
  } finally {
    if (document.body.contains(renderContainer)) {
      document.body.removeChild(renderContainer);
    }
  }
}












