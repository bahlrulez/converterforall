const JSZip = require("jszip");

// Test parsing chart XML structure
function parseChartXml(xmlStr) {
  const chartData = { type: "bar", title: "", categories: [], series: [] };
  
  // Extract title
  const titleMatch = xmlStr.match(/<c:title>[\s\S]*?<c:v>([^<]+)<\/c:v>/i) || xmlStr.match(/<c:title>[\s\S]*?<a:t>([^<]+)<\/a:t>/i);
  if (titleMatch) chartData.title = titleMatch[1];

  // Extract categories
  const catMatches = [...xmlStr.matchAll(/<c:cat>[\s\S]*?<c:pt idx="(\d+)">[\s\S]*?<c:v>([^<]+)<\/c:v>/gi)];
  chartData.categories = catMatches.map(m => m[2]);

  // Extract series
  const serRegex = /<c:ser>([\s\S]*?)<\/c:ser>/gi;
  let serMatch;
  while ((serMatch = serRegex.exec(xmlStr)) !== null) {
    const serXml = serMatch[1];
    const nameMatch = serXml.match(/<c:tx>[\s\S]*?<c:v>([^<]+)<\/c:v>/i) || serXml.match(/<c:tx>[\s\S]*?<a:t>([^<]+)<\/a:t>/i);
    const name = nameMatch ? nameMatch[1] : `Series ${chartData.series.length + 1}`;
    
    const valMatches = [...serXml.matchAll(/<c:val>[\s\S]*?<c:pt idx="(\d+)">[\s\S]*?<c:v>([^<]+)<\/c:v>/gi)];
    const values = valMatches.map(m => parseFloat(m[2]) || 0);

    // Color
    const colorMatch = serXml.match(/<a:srgbClr val="([0-9a-fA-F]{6})"/i);
    const color = colorMatch ? `#${colorMatch[1]}` : null;

    chartData.series.push({ name, values, color });
  }

  return chartData;
}

console.log("Chart parser ready");
