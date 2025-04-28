import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing the images
const imageDir = 'frontend/dist/images/comparison';

// Output directory (same as input for in-place optimization)
const outputDir = 'frontend/dist/images/comparison';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Optimize the large PNG files (reduce size by 75%)
async function optimizePNG(filename) {
  const inputPath = path.join(imageDir, filename);
  const outputPath = path.join(outputDir, filename.replace('.png', '-optimized.png'));
  
  console.log(`Optimizing PNG: ${filename}`);
  
  try {
    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outputPath);
      
    console.log(`Optimized PNG saved to: ${outputPath}`);
    
    // Get original and new file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`New size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Reduction: ${((1 - newSize / originalSize) * 100).toFixed(2)}%`);
    
    return outputPath;
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
  }
}

// Optimize the JPG files (for before images)
async function optimizeJPG(filename) {
  const inputPath = path.join(imageDir, filename);
  const outputPath = path.join(outputDir, filename.replace('.jpg', '-optimized.jpg'));
  
  console.log(`Optimizing JPG: ${filename}`);
  
  try {
    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(outputPath);
      
    console.log(`Optimized JPG saved to: ${outputPath}`);
    
    // Get original and new file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`New size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Reduction: ${((1 - newSize / originalSize) * 100).toFixed(2)}%`);
    
    return outputPath;
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
  }
}

// Process all image files in the directory
async function optimizeAllImages() {
  try {
    const files = fs.readdirSync(imageDir);
    
    // First, optimize the two specifically used in the comparison slider
    const originalJpg = 'original-dog-final-v2.jpg';
    const transparentPng = 'dog-no-background.png';
    
    // Make sure these files exist
    if (files.includes(originalJpg) && files.includes(transparentPng)) {
      console.log('Optimizing comparison slider images...');
      
      const optimizedJpg = await optimizeJPG(originalJpg);
      const optimizedPng = await optimizePNG(transparentPng);
      
      console.log('\nImage optimization complete!');
      console.log('Edit the frontend/src/pages/Home.jsx file to use these optimized images:');
      console.log(`- Replace: /images/comparison/${originalJpg}`);
      console.log(`- With: /images/comparison/${path.basename(optimizedJpg)}`);
      console.log(`- Replace: /images/comparison/${transparentPng}`);
      console.log(`- With: /images/comparison/${path.basename(optimizedPng)}`);
      
      // Optimize remaining images if needed
      console.log('\nOptimizing remaining images...');
      for (const file of files) {
        if (file === originalJpg || file === transparentPng || 
            file.includes('-optimized.') || 
            (!file.endsWith('.jpg') && !file.endsWith('.png'))) {
          continue;
        }
        
        if (file.endsWith('.jpg')) {
          await optimizeJPG(file);
        } else if (file.endsWith('.png')) {
          await optimizePNG(file);
        }
      }
    } else {
      console.error('Required image files not found in the comparison directory!');
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization process
optimizeAllImages();