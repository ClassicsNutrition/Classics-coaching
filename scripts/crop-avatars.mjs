import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const sourceImage = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\b6ddc892-614b-4e8f-8cb9-538aa5f30003\\media__1780059677587.png';
const outputDir = path.resolve('public', 'avatars');

async function main() {
  console.log("Creating output directory...");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Reading source image from ${sourceImage}...`);
  const image = await Jimp.read(sourceImage);
  const W = image.bitmap.width;
  const H = image.bitmap.height;
  console.log(`Source image dimensions: ${W}x${H}`);

  // Grid constants
  const startX = 114;
  const startY = 200;
  const spacingX = 200;
  const spacingY = 225;
  const cropRadius = 95; // diameter = 190

  // The 12 avatars on the grid:
  // Row 1: index 1 to 5 (cols 0 to 4)
  // Row 2: index 6 (col 0), index 7 (col 4)
  // Row 3: index 8 to 12 (cols 0 to 4)
  const avatars = [
    { index: 1, row: 0, col: 0 },
    { index: 2, row: 0, col: 1 },
    { index: 3, row: 0, col: 2 },
    { index: 4, row: 0, col: 3 },
    { index: 5, row: 0, col: 4 },
    { index: 6, row: 1, col: 0 },
    { index: 7, row: 1, col: 4 },
    { index: 8, row: 2, col: 0 },
    { index: 9, row: 2, col: 1 },
    { index: 10, row: 2, col: 2 },
    { index: 11, row: 2, col: 3 },
    { index: 12, row: 2, col: 4 }
  ];

  for (const av of avatars) {
    const centerX = startX + av.col * spacingX;
    const centerY = startY + av.row * spacingY;
    
    console.log(`Processing Avatar ${av.index} at center (${centerX}, ${centerY})...`);

    // Create a new transparent image of size diameter x diameter
    const diameter = cropRadius * 2;
    const cropped = new Jimp(diameter, diameter, 0x00000000); // completely transparent

    // Copy circle pixels with anti-aliasing
    for (let dy = -cropRadius; dy < cropRadius; dy++) {
      for (let dx = -cropRadius; dx < cropRadius; dx++) {
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < cropRadius) {
          const sx = centerX + dx;
          const sy = centerY + dy;

          if (sx >= 0 && sx < W && sy >= 0 && sy < H) {
            const color = image.getPixelColor(sx, sy);
            
            // If near edge, apply anti-aliasing to alpha channel
            let alphaScale = 1.0;
            if (dist > cropRadius - 1.5) {
              alphaScale = (cropRadius - dist) / 1.5;
            }

            if (alphaScale < 1.0) {
              const r = (color >> 24) & 0xff;
              const g = (color >> 16) & 0xff;
              const b = (color >> 8) & 0xff;
              const a = color & 0xff;
              const newA = Math.round(a * alphaScale);
              const newColor = Jimp.rgbaToInt(r, g, b, newA);
              cropped.setPixelColor(newColor, dx + cropRadius, dy + cropRadius);
            } else {
              cropped.setPixelColor(color, dx + cropRadius, dy + cropRadius);
            }
          }
        }
      }
    }

    // Resize to standard 200x200 for frontend usage
    cropped.resize(200, 200);

    const outputPath = path.join(outputDir, `avatar-${av.index}.png`);
    await cropped.writeAsync(outputPath);
    console.log(`Saved: ${outputPath}`);
  }

  console.log("All avatars successfully regenerated and saved with circular transparent masks!");
}

main().catch(console.error);
