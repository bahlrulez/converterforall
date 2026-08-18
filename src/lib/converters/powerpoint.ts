import JSZip from "jszip";

interface TextRun {
  text: string;
  fontSize?: number; // in pt
  bold?: boolean;
  italic?: boolean;
  color?: string; // hex
}

interface TextParagraph {
  runs: TextRun[];
  align?: "left" | "center" | "right" | "justify";
  spaceBefore?: number;
}

interface ShapeItem {
  id: string;
  type: "shape" | "picture" | "table";
  x: number; // in pixels
  y: number; // in pixels
  width: number; // in pixels
  height: number; // in pixels
  bgColor?: string;
  borderColor?: string;
  borderRadius?: string;
  paragraphs?: TextParagraph[];
  imgSrc?: string;
  tableRows?: string[][];
  zIndex?: number;
}

interface SlideObject {
  slideNumber: number;
  bgColor: string;
  shapes: ShapeItem[];
}

export async function convertPptxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Determine presentation dimensions (default 16:9 widescreen: 12192000 x 6858000 EMUs)
  let emuWidth = 12192000;
  let emuHeight = 6858000;

  const presXmlText = await zip.file("ppt/presentation.xml")?.async("text");
  const parser = new DOMParser();

  if (presXmlText) {
    const presDoc = parser.parseFromString(presXmlText, "text/xml");
    const sldSz = presDoc.getElementsByTagName("p:sldSz")[0];
    if (sldSz) {
      const cx = parseInt(sldSz.getAttribute("cx") || "12192000", 10);
      const cy = parseInt(sldSz.getAttribute("cy") || "6858000", 10);
      if (cx > 0 && cy > 0) {
        emuWidth = cx;
        emuHeight = cy;
      }
    }
  }

  // Target viewport size in pixels for the generated PDF page
  const VIEW_WIDTH = 1280;
  const VIEW_HEIGHT = Math.round((VIEW_WIDTH * emuHeight) / emuWidth);
  const scaleX = VIEW_WIDTH / emuWidth;
  const scaleY = VIEW_HEIGHT / emuHeight;

  // 2. Discover all slide XML files and sort them numerically
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

  const slides: SlideObject[] = [];

  for (let sIdx = 0; sIdx < slidePaths.length; sIdx++) {
    const slidePath = slidePaths[sIdx];
    const slideXmlText = await zip.file(slidePath)?.async("text");
    if (!slideXmlText) continue;

    const xmlDoc = parser.parseFromString(slideXmlText, "text/xml");

    // Load relationships for images
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
          relsMap[id] = target.replace("../", "ppt/");
        }
      }
    }

    // Determine slide background color
    let slideBgColor = "#0f172a"; // Default dark navy
    const bgPr = xmlDoc.getElementsByTagName("p:bgPr")[0];
    if (bgPr) {
      const srgbClr = bgPr.getElementsByTagName("a:srgbClr")[0];
      if (srgbClr) {
        const val = srgbClr.getAttribute("val");
        if (val) slideBgColor = "#" + val;
      }
    }

    const shapes: ShapeItem[] = [];
    const spTree = xmlDoc.getElementsByTagName("p:spTree")[0];

    if (spTree) {
      const children = Array.from(spTree.childNodes) as Element[];

      for (let cIdx = 0; cIdx < children.length; cIdx++) {
        const node = children[cIdx];
        if (!node.tagName) continue;

        // --- Handle Pictures (<p:pic>) ---
        if (node.tagName === "p:pic") {
          const xfrm = node.getElementsByTagName("a:xfrm")[0];
          const blip = node.getElementsByTagName("a:blip")[0];

          if (xfrm && blip) {
            const off = xfrm.getElementsByTagName("a:off")[0];
            const ext = xfrm.getElementsByTagName("a:ext")[0];
            const embedId = blip.getAttribute("r:embed");

            if (off && ext && embedId && relsMap[embedId]) {
              const xEmu = parseInt(off.getAttribute("x") || "0", 10);
              const yEmu = parseInt(off.getAttribute("y") || "0", 10);
              const cxEmu = parseInt(ext.getAttribute("cx") || "0", 10);
              const cyEmu = parseInt(ext.getAttribute("cy") || "0", 10);

              const imageFile = zip.file(relsMap[embedId]);
              if (imageFile) {
                const imgBase64 = await imageFile.async("base64");
                const mime = relsMap[embedId].endsWith(".png")
                  ? "image/png"
                  : relsMap[embedId].endsWith(".svg")
                  ? "image/svg+xml"
                  : "image/jpeg";

                shapes.push({
                  id: "pic-" + cIdx,
                  type: "picture",
                  x: Math.round(xEmu * scaleX),
                  y: Math.round(yEmu * scaleY),
                  width: Math.round(cxEmu * scaleX),
                  height: Math.round(cyEmu * scaleY),
                  imgSrc: `data:${mime};base64,${imgBase64}`,
                  borderRadius: "12px",
                  zIndex: cIdx + 1,
                });
              }
            }
          }
        }

        // --- Handle Shapes & Text Boxes (<p:sp>) ---
        if (node.tagName === "p:sp") {
          const spPr = node.getElementsByTagName("p:spPr")[0];
          const txBody = node.getElementsByTagName("p:txBody")[0];

          let x = 0, y = 0, width = VIEW_WIDTH - 80, height = 100;
          let bgColor = "transparent";
          let borderColor = "transparent";
          let borderRadius = "0px";

          if (spPr) {
            const xfrm = spPr.getElementsByTagName("a:xfrm")[0];
            if (xfrm) {
              const off = xfrm.getElementsByTagName("a:off")[0];
              const ext = xfrm.getElementsByTagName("a:ext")[0];
              if (off && ext) {
                const xEmu = parseInt(off.getAttribute("x") || "0", 10);
                const yEmu = parseInt(off.getAttribute("y") || "0", 10);
                const cxEmu = parseInt(ext.getAttribute("cx") || "0", 10);
                const cyEmu = parseInt(ext.getAttribute("cy") || "0", 10);

                x = Math.round(xEmu * scaleX);
                y = Math.round(yEmu * scaleY);
                width = Math.round(cxEmu * scaleX);
                height = Math.round(cyEmu * scaleY);
              }
            }

            // Fill color
            const solidFill = spPr.getElementsByTagName("a:solidFill")[0];
            if (solidFill) {
              const srgbClr = solidFill.getElementsByTagName("a:srgbClr")[0];
              if (srgbClr) {
                const val = srgbClr.getAttribute("val");
                if (val) bgColor = "#" + val;
              }
            }

            // Border
            const ln = spPr.getElementsByTagName("a:ln")[0];
            if (ln) {
              const lnFill = ln.getElementsByTagName("a:solidFill")[0];
              const lnClr = lnFill?.getElementsByTagName("a:srgbClr")[0];
              if (lnClr) {
                const val = lnClr.getAttribute("val");
                if (val) borderColor = "#" + val;
              }
            }

            // Shape Geometry (rounded rectangle, pill, etc.)
            const prstGeom = spPr.getElementsByTagName("a:prstGeom")[0];
            if (prstGeom) {
              const prst = prstGeom.getAttribute("prst");
              if (prst === "roundRect" || prst === "snipRoundRect") {
                borderRadius = "12px";
              } else if (prst === "ellipse") {
                borderRadius = "9999px";
              }
            }
          }

          // Extract text runs and paragraphs
          const paragraphs: TextParagraph[] = [];
          if (txBody) {
            const pElements = txBody.getElementsByTagName("a:p");

            for (let pI = 0; pI < pElements.length; pI++) {
              const pEl = pElements[pI];
              const pPr = pEl.getElementsByTagName("a:pPr")[0];
              const algnAttr = pPr?.getAttribute("algn");

              let align: "left" | "center" | "right" = "left";
              if (algnAttr === "ctr") align = "center";
              else if (algnAttr === "r") align = "right";

              const runs: TextRun[] = [];
              const rElements = pEl.getElementsByTagName("a:r");

              for (let rI = 0; rI < rElements.length; rI++) {
                const rEl = rElements[rI];
                const tEl = rEl.getElementsByTagName("a:t")[0];
                const rPr = rEl.getElementsByTagName("a:rPr")[0];

                const text = tEl?.textContent || "";
                if (!text) continue;

                let fontSizePt = 16;
                let bold = false;
                let italic = false;
                let color = "#ffffff";

                if (rPr) {
                  const sz = rPr.getAttribute("sz");
                  if (sz) fontSizePt = parseInt(sz, 10) / 100;
                  if (rPr.getAttribute("b") === "1") bold = true;
                  if (rPr.getAttribute("i") === "1") italic = true;

                  const srgbClr = rPr.getElementsByTagName("a:srgbClr")[0];
                  if (srgbClr) {
                    const val = srgbClr.getAttribute("val");
                    if (val) color = "#" + val;
                  }
                }

                runs.push({
                  text,
                  fontSize: fontSizePt,
                  bold,
                  italic,
                  color,
                });
              }

              // If no <a:r> child, check direct <a:t>
              if (runs.length === 0) {
                const tElements = pEl.getElementsByTagName("a:t");
                let directText = "";
                for (let dt = 0; dt < tElements.length; dt++) {
                  directText += tElements[dt].textContent || "";
                }
                if (directText.trim()) {
                  runs.push({
                    text: directText,
                    fontSize: 16,
                    color: "#ffffff",
                  });
                }
              }

              if (runs.length > 0) {
                paragraphs.push({ runs, align });
              }
            }
          }

          // Only add shape if it has background, border, or text
          if (bgColor !== "transparent" || borderColor !== "transparent" || paragraphs.length > 0) {
            shapes.push({
              id: "sp-" + cIdx,
              type: "shape",
              x,
              y,
              width,
              height,
              bgColor,
              borderColor,
              borderRadius,
              paragraphs,
              zIndex: cIdx + 1,
            });
          }
        }
      }
    }

    slides.push({
      slideNumber: sIdx + 1,
      bgColor: slideBgColor,
      shapes,
    });
  }

  // 3. Render all slides as exact-positioned 1280x720 HTML canvas containers
  const container = document.createElement("div");
  container.style.width = `${VIEW_WIDTH}px`;
  container.style.background = "#000000";

  slides.forEach((slide, sIdx) => {
    const slidePage = document.createElement("div");
    slidePage.style.width = `${VIEW_WIDTH}px`;
    slidePage.style.height = `${VIEW_HEIGHT}px`;
    slidePage.style.position = "relative";
    slidePage.style.background = slide.bgColor;
    slidePage.style.boxSizing = "border-box";
    slidePage.style.overflow = "hidden";
    slidePage.style.pageBreakAfter = sIdx < slides.length - 1 ? "always" : "auto";
    slidePage.style.breakAfter = sIdx < slides.length - 1 ? "page" : "auto";
    slidePage.style.fontFamily = "system-ui, -apple-system, sans-serif";

    slide.shapes.forEach((item) => {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = `${item.x}px`;
      el.style.top = `${item.y}px`;
      el.style.width = `${item.width}px`;
      el.style.height = `${item.height}px`;
      el.style.boxSizing = "border-box";
      el.style.zIndex = `${item.zIndex || 1}`;

      if (item.bgColor && item.bgColor !== "transparent") {
        el.style.backgroundColor = item.bgColor;
      }
      if (item.borderColor && item.borderColor !== "transparent") {
        el.style.border = `1.5px solid ${item.borderColor}`;
      }
      if (item.borderRadius && item.borderRadius !== "0px") {
        el.style.borderRadius = item.borderRadius;
      }

      if (item.type === "picture" && item.imgSrc) {
        const img = document.createElement("img");
        img.src = item.imgSrc;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        if (item.borderRadius) img.style.borderRadius = item.borderRadius;
        el.appendChild(img);
      } else if (item.paragraphs && item.paragraphs.length > 0) {
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.justifyContent = "center";
        el.style.padding = item.bgColor !== "transparent" ? "12px 18px" : "4px 8px";

        item.paragraphs.forEach((p) => {
          const pEl = document.createElement("div");
          pEl.style.textAlign = p.align || "left";
          pEl.style.lineHeight = "1.25";
          pEl.style.marginBottom = "4px";

          p.runs.forEach((r) => {
            const span = document.createElement("span");
            span.innerText = r.text;

            // Scale font size proportionally to viewport width
            const pxSize = Math.max(11, Math.round((r.fontSize || 16) * 1.33));
            span.style.fontSize = `${pxSize}px`;
            span.style.fontWeight = r.bold ? "800" : "400";
            if (r.italic) span.style.fontStyle = "italic";
            if (r.color) span.style.color = r.color;

            pEl.appendChild(span);
          });
          el.appendChild(pEl);
        });
      }

      slidePage.appendChild(el);
    });

    // Watermark page number in bottom corner
    const footerNum = document.createElement("div");
    footerNum.style.position = "absolute";
    footerNum.style.bottom = "16px";
    footerNum.style.right = "24px";
    footerNum.style.fontSize = "12px";
    footerNum.style.fontWeight = "bold";
    footerNum.style.color = "rgba(255, 255, 255, 0.4)";
    footerNum.innerText = `${slide.slideNumber}`;
    slidePage.appendChild(footerNum);

    container.appendChild(slidePage);
  });

  // 4. Mount hidden wrapper and compile to Landscape PDF
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
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: VIEW_WIDTH,
        backgroundColor: null,
      },
      jsPDF: { unit: "px", format: [VIEW_WIDTH, VIEW_HEIGHT], orientation: "landscape" },
    };

    const worker = html2pdf().set(opt).from(container);
    const pdfBlob = await worker.output("blob");
    return pdfBlob;
  } finally {
    document.body.removeChild(wrapper);
  }
}
