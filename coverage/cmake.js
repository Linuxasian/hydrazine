let code = "";

const fs = require("fs");
const classes = ["from-{color}-500", "to-{color}-300", "border-{color}"];
const colors = ["shamrock", "cinna", "royal", "picton", "emerald", "amethyst"];

classes.forEach((element) => {
  colors.forEach((color) => {
    code += ` ${element.replace("{color}", color)} `;
  });
});

fs.writeFileSync(
  "../../public/classes.html",
  `<div class="${code}"></div>`,
  "utf-8"
);