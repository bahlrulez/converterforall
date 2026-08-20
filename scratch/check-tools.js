const fs = require('fs');
const content = fs.readFileSync('src/lib/tools-db.ts', 'utf8');
const lines = content.split('\n');
let currentTool = '';
const interactiveTools = [];
for (const line of lines) {
  const m = line.match(/^\s*"([a-zA-Z0-9_-]+)":\s*\{/);
  if (m) currentTool = m[1];
  if (line.includes('isInteractive: true')) {
    interactiveTools.push(currentTool);
  }
}
console.log('Interactive tools found:', interactiveTools);

const rendererContent = fs.readFileSync('src/components/tools/tool-renderer.tsx', 'utf8');
for (const tool of interactiveTools) {
  const handled = rendererContent.includes(tool);
  console.log(`Tool ${tool}: ${handled ? 'HANDLED' : 'MISSING'}`);
}
