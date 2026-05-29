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

  // Hardcoded mathematically detected coordinates and diameters for the 12 avatars
  const avatars = [
    { index: 1, x: 114, y: 217, diameter: 187 },
    { index: 2, x: 312, y: 217, diameter: 183 },
    { index: 3, x: 512, y: 217, diameter: 184 },
    { index: 4, x: 711, y: 217, diameter: 181 },
    { index: 5, x: 902, y: 217, diameter: 190 },
    { index: 6, x: 114, y: 481, diameter: 188 },
    { index: 7, x: 909, y: 482, diameter: 190 },
    { index: 8, x: 114, y: 695, diameter: 187 },
    { index: 9, x: 312, y: 698, diameter: 183 },
    { index: 10, x: 512, y: 694, diameter: 184 },
    { index: 11, x: 711, y: 694, diameter: 181 },
    { index: 12, x: 902, y: 698, diameter: 190 }
  ];

  for (const av of avatars) {
    const size = av.diameter;
    const x = Math.max(0, Math.floor(av.x - (size / 2)));
    const y = Math.max(0, Math.floor(av.y - (size / 2)));

    console.log(`Cropping Avatar ${av.index} at center (${av.x}, ${av.y}) with size ${size}...`);
    
    // Clone and crop
    const cropped = image.clone().crop(x, y, size, size);
    
    // Resize to standard 200x200
    cropped.resize(200, 200);

    const outputPath = path.join(outputDir, `avatar-${av.index}.png`);
    await cropped.writeAsync(outputPath);
    console.log(`Saved: ${outputPath}`);
  }

  console.log("All avatars successfully cropped and saved!");
}

main().catch(console.error);
