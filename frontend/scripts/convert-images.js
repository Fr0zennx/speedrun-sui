import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

const imagesToConvert = [
    'battle-level-up.png',
    'character-card-id.png',
    'nft-phoenix.png',
    'sui-car.png',
    'sui-gallery.png'
];

async function convertImages() {
    console.log('🖼️ Converting PNG images to WebP...\n');

    for (const imageName of imagesToConvert) {
        const inputPath = path.join(publicDir, imageName);
        const baseName = path.basename(imageName, '.png');
        const outputPath = path.join(publicDir, `${baseName}.webp`);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️ Skipping ${imageName} - file not found`);
            continue;
        }

        try {
            const inputStats = fs.statSync(inputPath);
            const inputSizeKB = (inputStats.size / 1024).toFixed(2);

            await sharp(inputPath)
                .webp({ quality: 80 })
                .resize(800, 450, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSizeKB = (outputStats.size / 1024).toFixed(2);
            const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

            console.log(`✅ ${imageName}`);
            console.log(`   ${inputSizeKB} KB → ${outputSizeKB} KB (${savings}% smaller)`);
        } catch (error) {
            console.error(`❌ Error converting ${imageName}:`, error.message);
        }
    }

    console.log('\n🎉 Conversion complete!');
}

convertImages();
