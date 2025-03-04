import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyRecursive(src, dest) {
  // Check if source exists
  if (!fs.existsSync(src)) {
    console.error(`Source ${src} does not exist`);
    return;
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read directory contents
  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      // Recursively copy directory
      copyRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const sourceDir = path.resolve(__dirname, 'dist', 'public');
const targetDir = path.resolve(__dirname, 'dist');

try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy all files recursively
  copyRecursive(sourceDir, targetDir);
  console.log('Files copied successfully from dist/public to dist');
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
}