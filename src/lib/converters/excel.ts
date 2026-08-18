import JSZip from "jszip";

export async function convertExcelToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Read shared strings if available
  const sharedStringsXml = await zip.file("xl/sharedStrings.xml")?.async("text");
  const sharedStrings: string[] = [];
  const parser = new DOMParser();

  if (sharedStringsXml) {
    const ssDoc = parser.parseFromString(sharedStringsXml, "text/xml");
    const siElements = ssDoc.getElementsByTagName("si");
    for (let i = 0; i < siElements.length; i++) {
      const tElements = siElements[i].getElementsByTagName("t");
      let text = "";
      for (let j = 0; j < tElements.length; j++) {
        text += tElements[j].textContent || "";
      }
      sharedStrings.push(text);
    }
  }

  // 2. Read sheet1.xml
  const sheetXml = await zip.file("xl/worksheets/sheet1.xml")?.async("text");
  if (!sheetXml) {
    throw new Error("No readable worksheet found in this Excel spreadsheet.");
  }

  const sheetDoc = parser.parseFromString(sheetXml, "text/xml");
  const rowElements = sheetDoc.getElementsByTagName("row");
  const rows: string[][] = [];

  for (let r = 0; r < rowElements.length; r++) {
    const rowEl = rowElements[r];
    const cellElements = rowEl.getElementsByTagName("c");
    const rowData: string[] = [];

    for (let c = 0; c < cellElements.length; c++) {
      const cellEl = cellElements[c];
      const cellType = cellEl.getAttribute("t");
      const vEl = cellEl.getElementsByTagName("v")[0];
      const val = vEl?.textContent || "";

      if (cellType === "s" && val !== "") {
        const strIdx = parseInt(val, 10);
        rowData.push(sharedStrings[strIdx] || "");
      } else {
        rowData.push(val);
      }
    }
    if (rowData.some((cell) => cell.trim() !== "")) {
      rows.push(rowData);
    }
  }

  if (rows.length === 0) {
    throw new Error("The Excel worksheet appears to be empty.");
  }

  // 3. Render HTML Table
  const container = document.createElement("div");
  container.style.padding = "30px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.background = "#ffffff";
  container.style.color = "#000000";

  const title = document.createElement("h2");
  title.innerText = file.name.replace(/\.[^/.]+$/, "");
  title.style.margin = "0 0 15px 0";
  title.style.fontSize = "18px";
  title.style.color = "#0f172a";
  title.style.borderBottom = "2px solid #10b981";
  title.style.paddingBottom = "8px";
  container.appendChild(title);

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.fontSize = "11px";

  rows.forEach((row, rIdx) => {
    const tr = document.createElement("tr");
    tr.style.background = rIdx === 0 ? "#f1f5f9" : rIdx % 2 === 0 ? "#f8fafc" : "#ffffff";
    row.forEach((cell) => {
      const td = document.createElement(rIdx === 0 ? "th" : "td");
      td.innerText = cell;
      td.style.padding = "6px 10px";
      td.style.border = "1px solid #cbd5e1";
      td.style.textAlign = isNaN(Number(cell)) ? "left" : "right";
      if (rIdx === 0) td.style.fontWeight = "bold";
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  container.appendChild(table);

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const opt: any = {
      margin: 10,
      filename: "spreadsheet.pdf",
      pagebreak: { mode: ["css", "legacy"] },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    const worker = html2pdf().set(opt).from(container);
    const pdfBlob = await worker.output("blob");
    return pdfBlob;
  } finally {
    document.body.removeChild(wrapper);
  }
}
