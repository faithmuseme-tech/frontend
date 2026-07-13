const sharp = require('sharp');
const fs = require('fs');

const svg = fs.readFileSync('./public/logo.svg');

Promise.all([
  sharp(svg).resize(192, 192).png().toFile('./public/logo192.png'),
  sharp(svg).resize(512, 512).png().toFile('./public/logo512.png'),
]).then(() => console.log('Icons generated.'));
