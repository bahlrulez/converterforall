const { JSDOM } = require("jsdom");
const dom = new JSDOM();
const DOMParser = dom.window.DOMParser;

const sampleXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart">
  <w:body>
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Title"/>
      </w:pPr>
      <w:r><w:t>Lorem ipsum</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:drawing>
          <wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
            <a:graphic>
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
                <c:chart r:id="rId4"/>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

const parser = new DOMParser();
const doc = parser.parseFromString(sampleXml, "text/xml");

console.log("querySelector c\\:chart:", doc.querySelector("c\\:chart"));
console.log("querySelector chart:", doc.querySelector("chart"));
console.log("getElementsByTagName c:chart:", doc.getElementsByTagName("c:chart").length);
console.log("getElementsByTagName chart:", doc.getElementsByTagName("chart").length);

const allElements = Array.from(doc.getElementsByTagName("*"));
const charts = allElements.filter(el => el.localName === "chart" || el.tagName.endsWith(":chart") || el.tagName === "chart");
console.log("localName match chart count:", charts.length);
if (charts.length > 0) {
  const rId = charts[0].getAttribute("r:id") || charts[0].getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id") || charts[0].getAttribute("id");
  console.log("Chart r:id:", rId);
}
