const fs   = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "../public/sw.js");
let sw = fs.readFileSync(swPath, "utf8");
sw = sw.replace("__BUILD_TIME__", Date.now());
fs.writeFileSync(swPath, sw);
console.log("sw.js cache version stamped.");
