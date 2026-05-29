import path from 'path';

const sourceImage = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\b6ddc892-614b-4e8f-8cb9-538aa5f30003\\media__1780059677587.png';

async function main() {
  const JimpModule = await import('jimp');
  const Jimp = JimpModule.default || JimpModule;

  console.log("Loading image...");
  const image = await Jimp.read(sourceImage);
  const W = image.bitmap.width;
  const H = image.bitmap.height;

  // Approximate centers we used
  const guesses = [
    { index: 1, x: 112, y: 232 },
    { index: 2, x: 308, y: 232 },
    { index: 3, x: 509, y: 232 },
    { index: 4, x: 706, y: 232 },
    { index: 5, x: 902, y: 232 },
    { index: 6, x: 112, y: 482 },
    { index: 7, x: 902, y: 482 },
    { index: 8, x: 112, y: 732 },
    { index: 9, x: 308, y: 732 },
    { index: 10, x: 509, y: 732 },
    { index: 11, x: 706, y: 732 },
    { index: 12, x: 902, y: 732 }
  ];

  console.log("Scanning circle boundaries...");
  const results = [];

  for (const g of guesses) {
    let minX = W, maxX = 0, minY = H, maxY = 0;
    
    const radiusX = 80;
    const radiusY = 110;
    for (let dy = -radiusY; dy <= radiusY; dy++) {
      for (let dx = -radiusX; dx <= radiusX; dx++) {
        const px = g.x + dx;
        const py = g.y + dy;
        
        if (px >= 0 && px < W && py >= 0 && py < H) {
          const color = image.getPixelColor(px, py);
          const r = (color >> 24) & 0xff;
          const g_val = (color >> 16) & 0xff;
          const b = (color >> 8) & 0xff;
          
          // The circles have a bright white border
          // We look for pixels that are very bright (white border/bg)
          const brightness = (r + g_val + b) / 3;
          if (brightness > 220) {
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
          }
        }
      }
    }

    const detectedW = maxX - minX;
    const detectedH = maxY - minY;
    const centerX = Math.round(minX + detectedW / 2);
    const centerY = Math.round(minY + detectedH / 2);
    const diameter = Math.max(detectedW, detectedH);

    console.log(`Avatar ${g.index}:`);
    console.log(`  Guessed Center: (${g.x}, ${g.y})`);
    console.log(`  Detected Bounds: X:[${minX}..${maxX}] Y:[${minY}..${maxY}]`);
    console.log(`  Detected Center: (${centerX}, ${centerY}), Diameter: ${diameter}`);
    
    results.push({ index: g.index, x: centerX, y: centerY, diameter });
  }

  console.log("\nCopy-paste this array into crop-avatars.mjs:");
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
