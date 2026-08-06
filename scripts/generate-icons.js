const sharp = require("sharp");
const path = require("path");

const svg = path.join(__dirname, "../public/logo.svg");

const sizes = [64, 192, 512];
const names = { 64: "favicon-64.png", 192: "logo192.png", 512: "logo512.png" };

sizes.forEach((size) => {
  sharp(svg).resize(size, size).png().toFile(path.join(__dirname, `../public/${names[size]}`)
  ).then(() => console.log(`${names[size]} done`)).catch(console.error);
});
