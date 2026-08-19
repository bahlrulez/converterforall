// Test chart parsing with real Word OpenXML chart structure
const xmlStr = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <c:chart>
    <c:plotArea>
      <c:barChart>
        <c:barDir val="col"/>
        <c:ser>
          <c:idx val="0"/>
          <c:order val="0"/>
          <c:tx>
            <c:strRef>
              <c:strCache>
                <c:ptCount val="1"/>
                <c:pt idx="0"><c:v>Column 1</c:v></c:pt>
              </c:strCache>
            </c:strRef>
          </c:tx>
          <c:spPr>
            <a:solidFill><a:srgbClr val="4F81BD"/></a:solidFill>
          </c:spPr>
          <c:cat>
            <c:strRef>
              <c:strCache>
                <c:ptCount val="4"/>
                <c:pt idx="0"><c:v>Row 1</c:v></c:pt>
                <c:pt idx="1"><c:v>Row 2</c:v></c:pt>
                <c:pt idx="2"><c:v>Row 3</c:v></c:pt>
                <c:pt idx="3"><c:v>Row 4</c:v></c:pt>
              </c:strCache>
            </c:strRef>
          </c:cat>
          <c:val>
            <c:numRef>
              <c:numCache>
                <c:ptCount val="4"/>
                <c:pt idx="0"><c:v>8</c:v></c:pt>
                <c:pt idx="1"><c:v>2</c:v></c:pt>
                <c:pt idx="2"><c:v>3</c:v></c:pt>
                <c:pt idx="3"><c:v>5</c:v></c:pt>
              </c:numCache>
            </c:numRef>
          </c:val>
        </c:ser>
        <c:ser>
          <c:idx val="1"/>
          <c:order val="1"/>
          <c:tx>
            <c:strRef>
              <c:strCache>
                <c:ptCount val="1"/>
                <c:pt idx="0"><c:v>Column 2</c:v></c:pt>
              </c:strCache>
            </c:strRef>
          </c:tx>
          <c:spPr>
            <a:solidFill><a:srgbClr val="C0504D"/></a:solidFill>
          </c:spPr>
          <c:val>
            <c:numRef>
              <c:numCache>
                <c:ptCount val="4"/>
                <c:pt idx="0"><c:v>4</c:v></c:pt>
                <c:pt idx="1"><c:v>8</c:v></c:pt>
                <c:pt idx="2"><c:v>2</c:v></c:pt>
                <c:pt idx="3"><c:v>7</c:v></c:pt>
              </c:numCache>
            </c:numRef>
          </c:val>
        </c:ser>
        <c:ser>
          <c:idx val="2"/>
          <c:order val="2"/>
          <c:tx>
            <c:strRef>
              <c:strCache>
                <c:ptCount val="1"/>
                <c:pt idx="0"><c:v>Column 3</c:v></c:pt>
              </c:strCache>
            </c:strRef>
          </c:tx>
          <c:spPr>
            <a:solidFill><a:srgbClr val="9BBB59"/></a:solidFill>
          </c:spPr>
          <c:val>
            <c:numRef>
              <c:numCache>
                <c:ptCount val="4"/>
                <c:pt idx="0"><c:v>6</c:v></c:pt>
                <c:pt idx="1"><c:v>4</c:v></c:pt>
                <c:pt idx="2"><c:v>3</c:v></c:pt>
                <c:pt idx="3"><c:v>6</c:v></c:pt>
              </c:numCache>
            </c:numRef>
          </c:val>
        </c:ser>
      </c:barChart>
    </c:plotArea>
  </c:chart>
</c:chartSpace>`;

function parseUniversalChartXml(xmlStr) {
  const chartData = { title: "", categories: [], series: [] };

  // Categories
  const catMatches = [...xmlStr.matchAll(/<c:cat>[\s\S]*?<\/c:cat>/gi)];
  if (catMatches.length > 0) {
    const ptMatches = [...catMatches[0][0].matchAll(/<c:pt[^>]*>[\s\S]*?<c:v>([^<]+)<\/c:v>/gi)];
    chartData.categories = ptMatches.map(m => m[1].trim());
  }

  // Series
  const serMatches = [...xmlStr.matchAll(/<c:ser>([\s\S]*?)<\/c:ser>/gi)];
  serMatches.forEach((sMatch, idx) => {
    const serXml = sMatch[1];
    
    // Name
    const txMatch = serXml.match(/<c:tx>[\s\S]*?<c:v>([^<]+)<\/c:v>/i) || serXml.match(/<c:tx>[\s\S]*?<a:t>([^<]+)<\/a:t>/i);
    const name = txMatch ? txMatch[1].trim() : `Column ${idx + 1}`;

    // Values
    const valBlock = serXml.match(/<c:val>([\s\S]*?)<\/c:val>/i);
    const values = [];
    if (valBlock) {
      const ptMatches = [...valBlock[1].matchAll(/<c:pt[^>]*>[\s\S]*?<c:v>([^<]+)<\/c:v>/gi)];
      ptMatches.forEach(m => values.push(parseFloat(m[1]) || 0));
    }

    // Color
    const clrMatch = serXml.match(/<a:srgbClr\s+val="([0-9a-fA-F]{6})"/i);
    const color = clrMatch ? `#${clrMatch[1]}` : null;

    chartData.series.push({ name, values, color });
  });

  return chartData;
}

const parsed = parseUniversalChartXml(xmlStr);
console.log("Parsed chart categories:", parsed.categories);
console.log("Parsed chart series:", parsed.series);
