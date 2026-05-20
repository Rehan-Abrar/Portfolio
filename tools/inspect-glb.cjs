const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'public', 'models', '3dPortfolio.glb');
if (!fs.existsSync(file)) {
  console.error('file not found:', file);
  process.exit(2);
}

const buf = fs.readFileSync(file);

function readUInt32LE(offset) {
  return buf.readUInt32LE(offset);
}

// header
const magic = buf.toString('ascii', 0, 4);
if (magic !== 'glTF') {
  console.error('Not a GLB file');
  process.exit(1);
}
const version = readUInt32LE(4);
const length = readUInt32LE(8);

let offset = 12;
let jsonChunk = null;
while (offset < length) {
  const chunkLength = readUInt32LE(offset);
  const chunkType = readUInt32LE(offset + 4);
  const chunkDataStart = offset + 8;
  const chunkDataEnd = chunkDataStart + chunkLength;
  const typeStr = String.fromCharCode(
    chunkType & 0xff,
    (chunkType >> 8) & 0xff,
    (chunkType >> 16) & 0xff,
    (chunkType >> 24) & 0xff,
  );
  if (typeStr === 'JSON') {
    const jsonText = buf.toString('utf8', chunkDataStart, chunkDataEnd);
    jsonChunk = JSON.parse(jsonText);
    break;
  }
  offset = chunkDataEnd;
}

if (!jsonChunk) {
  console.error('No JSON chunk found');
  process.exit(1);
}

console.log('GLTF version', jsonChunk.asset && jsonChunk.asset.version);

if (jsonChunk.images && jsonChunk.images.length) {
  console.log('\nImages:');
  jsonChunk.images.forEach((img, i) => {
    console.log(i, img.uri ? `uri: ${img.uri}` : 'bufferView embedded');
  });
} else {
  console.log('\nNo images in glTF JSON.');
}

if (jsonChunk.materials && jsonChunk.materials.length) {
  console.log('\nMaterials:');
  jsonChunk.materials.forEach((m, i) => {
    const parts = [];
    if (m.name) parts.push(`name=${m.name}`);
    if (m.pbrMetallicRoughness && m.pbrMetallicRoughness.baseColorTexture)
      parts.push(`baseColorTex=${m.pbrMetallicRoughness.baseColorTexture.index}`);
    if (m.emissiveTexture) parts.push(`emissiveTex=${m.emissiveTexture.index}`);
    if (m.normalTexture) parts.push(`normalTex=${m.normalTexture.index}`);
    console.log(i, parts.join(', '));
  });
} else {
  console.log('\nNo materials');
}

if (jsonChunk.textures && jsonChunk.textures.length) {
  console.log('\nTextures:');
  jsonChunk.textures.forEach((t, i) => {
    console.log(i, `source=${t.source}`);
  });
}

if (jsonChunk.nodes) {
  console.log('\nNodes with names (sample):');
  jsonChunk.nodes.forEach((n, i) => {
    if (n.name) console.log(i, n.name);
  });
}

// If images are external URIs, list them so we can inspect files
if (jsonChunk.images) {
  const external = jsonChunk.images.filter((img) => img.uri && !img.uri.startsWith('data:'));
  if (external.length) {
    console.log('\nExternal image URIs:');
    external.forEach((img) => console.log('-', img.uri));
  }
}
