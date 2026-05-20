const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'models', '3dPortfolio.glb');
if (!fs.existsSync(file)) {
  console.error('file not found:', file);
  process.exit(2);
}

const buf = fs.readFileSync(file);
const text = buf.toString('latin1');

const needles = [
  'CARLOS', 'CARLOS ITO', 'ITO', 'ItO210', 'ito210', 'carlositom', 'ItO_210', 'ito210', '@ito210', 'CARLOSITO', 'Rehan', 'Rehan-Abrar', 'RehanAbrar'
];

let found = false;
for (const n of needles) {
  const idx = text.indexOf(n);
  if (idx >= 0) {
    found = true;
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + n.length + 40);
    const snippet = text.slice(start, end).replace(/[^\x20-\x7E]/g, '.');
    console.log(`FOUND "${n}" at byte ${idx}: ...${snippet}...`);
  }
}

if (!found) console.log('No needle strings found in GLB.');
