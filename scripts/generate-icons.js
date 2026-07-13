const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('./public/logo.svg');

async function generate() {
  await sharp(svg).resize(192, 192).png().toFile('./public/logo192.png');
  await sharp(svg).resize(512, 512).png().toFile('./public/logo512.png');
  await sharp(svg).resize(32, 32).png().toFile('./public/favicon.png');
  // Copy favicon.png over favicon.ico — browsers accept PNG favicons
  fs.copyFileSync('./public/favicon.png', './public/favicon.ico');
  console.log('All icons generated.');
}

generate();
