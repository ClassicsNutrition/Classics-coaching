import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const sourceImage = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\b6ddc892-614b-4e8f-8cb9-538aa5f30003\\media__1780059677587.png';
const outputDir = path.resolve('public', 'avatars');

async function main() {
  console.log("Creating output directory...");
  fs.mkdirSync(outputDir, { recursive: true });

  console.log("Installing jimp temporarily...");
  try {
    execSync('npm install --no-save jimp@0.22.12', { stdio: 'inherit' });
  } catch (err) {
    console.error("Failed to install jimp:", err);
    process.exit(1);
  }

  const JimpModule = await import('jimp');
  const Jimp = JimpModule.default || JimpModule;

  console.log(`Reading source image from ${sourceImage}...`);
  const image = await Jimp.read(sourceImage);
  const W = image.bitmap.width;
  const H = image.bitmap.height;
  console.log(`Image dimensions: ${W}x${H}`);

  // Hardcoded precise coordinates for the 12 avatars (based on 1024x827 image dimensions)
  const avatars = [
    // Row 1 (y = 232)
    { index: 1, x: 112, y: 232 },
    { index: 2, x: 308, y: 232 },
    { index: 3, x: 509, y: 232 },
    { index: 4, x: 706, y: 232 },
    { index: 5, x: 902, y: 232 },
    // Row 2 (y = 482)
    { index: 6, x: 112, y: 482 },
    { index: 7, x: 902, y: 482 },
    // Row 3 (y = 732)
    { index: 8, x: 112, y: 732 },
    { index: 9, x: 308, y: 732 },
    { index: 10, x: 509, y: 732 },
    { index: 11, x: 706, y: 732 },
    { index: 12, x: 902, y: 732 }
  ];

  const cropSize = 160;

  for (const av of avatars) {
    const x = Math.max(0, Math.floor(av.x - (cropSize / 2)));
    const y = Math.max(0, Math.floor(av.y - (cropSize / 2)));

    console.log(`Cropping Avatar ${av.index} at center (${av.x}, ${av.y})...`);
    
    // Clone and crop
    const cropped = image.clone().crop(x, y, cropSize, cropSize);
    
    // Resize to standard 200x200
    cropped.resize(200, 200);

    const outputPath = path.join(outputDir, `avatar-${av.index}.png`);
    await cropped.writeAsync(outputPath);
    console.log(`Saved: ${outputPath}`);
  }

  console.log("All avatars successfully cropped and saved!");
}

main().catch(console.error);
