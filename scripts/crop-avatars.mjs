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

  // The grid has 5 columns and 3 rows
  const cols = 5;
  const rows = 3;
  const cellW = W / cols;
  const cellH = H / rows;

  // We want to crop a square from the center of each cell.
  // Let's make the crop size slightly smaller than the cell to avoid borders.
  const cropSize = Math.min(cellW, cellH) * 0.92;

  // Define which cells contain avatars
  // (row, col) coordinates (0-indexed)
  const avatarPositions = [
    // Row 0
    { row: 0, col: 0, index: 1 },
    { row: 0, col: 1, index: 2 },
    { row: 0, col: 2, index: 3 },
    { row: 0, col: 3, index: 4 },
    { row: 0, col: 4, index: 5 },
    // Row 1
    { row: 1, col: 0, index: 6 },
    { row: 1, col: 4, index: 7 },
    // Row 2
    { row: 2, col: 0, index: 8 },
    { row: 2, col: 1, index: 9 },
    { row: 2, col: 2, index: 10 },
    { row: 2, col: 3, index: 11 },
    { row: 2, col: 4, index: 12 }
  ];

  for (const pos of avatarPositions) {
    // Calculate cell center
    const centerX = (pos.col * cellW) + (cellW / 2);
    const centerY = (pos.row * cellH) + (cellH / 2);

    // Calculate crop top-left corner
    const x = Math.max(0, Math.floor(centerX - (cropSize / 2)));
    const y = Math.max(0, Math.floor(centerY - (cropSize / 2)));

    console.log(`Cropping Avatar ${pos.index} from cell (row: ${pos.row}, col: ${pos.col})...`);
    
    // Clone and crop
    const cropped = image.clone().crop(x, y, Math.floor(cropSize), Math.floor(cropSize));
    
    // Resize to a standard 200x200 for web optimization
    cropped.resize(200, 200);

    const outputPath = path.join(outputDir, `avatar-${pos.index}.png`);
    await cropped.writeAsync(outputPath);
    console.log(`Saved: ${outputPath}`);
  }

  console.log("All avatars successfully cropped and saved!");
}

main().catch(console.error);
