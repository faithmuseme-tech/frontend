const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');

const svg = fs.readFileSync('./public/logo.svg');

async function generate() {
  // Generate PNGs
  await sharp(svg).resize(192, 192).png().toFile('./public/logo192.png');
  await sharp(svg).resize(512, 512).png().toFile('./public/logo512.png');

  // Generate favicon.ico (32x32 + 16x16)
  const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
  const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
  const ico = await pngToIco([png32, png16]);
  fs.writeFileSync('./public/favicon.ico', ico);

  console.log('All icons generated.');
}

generate();
