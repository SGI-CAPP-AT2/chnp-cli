const { default: hljs } = require("highlight.js");
const sanitize = require("sanitize-html");

const generateHtmlPage = (title, arrayOfCodes, theme, font, online = true) => {
  const stringOfAllCodes = arrayOfCodes.reduce(
    (p, c) => p + __codeFragment(c),
    ""
  );
  const baseString = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>%TITLE%</title><link rel="stylesheet" href="%CHNP.URL__1%" /><link rel="stylesheet" href="%CHNP.URL__2%" /><link rel="stylesheet" href="%CHNP.URL__3%" /><link rel="stylesheet" href="%CHNP.URL__4%" /><link rel="stylesheet" href="%CHNP.URL__5%" /><link rel="stylesheet" href="%CHNP.URL__6%" /><link rel="stylesheet" href="%CHNP.URL__7%" /></head><body class="print %THEME% %FONT%"><style>.outputBlock,.list{width: calc(100vw - 30px);}</style><div class="list" style="margin: auto;">%stringOfAllCodes%</body></html>`;
  let newString = baseString;
  if (online) {
    const stringVars = require("./assets/linksToAssets.json");
    for (const vari of Object.keys(stringVars)) {
      newString = newString.replace(vari, stringVars[vari]);
    }
  }
  newString = newString.replace("%TITLE%", title);
  newString = newString.replace("%THEME%", theme.className);
  newString = newString.replace("%FONT%", font.className);
  newString = newString.replace("%stringOfAllCodes%", stringOfAllCodes);

  return newString;
};

const __codeFragment = (cq) =>
  `<h3>${
    cq.title
  }</h3><div class="outputBlock" style="margin-top:10px"><p class="filenames"><span class="filename">${
    cq.filename
  }</span></p><p class="input">${__hl(
    cq.code,
    cq.filename
  )}</p><p class="op-header">Output</p><p class="output">${
    cq.output
  }</p><p class="wm" align="right"><span>${
    cq.watermark
  }</span></p></div><br>${__date(new Date(cq.time))}${__pb(cq.__cns)}`;
const __date = (dateObj) => `
<div class="dt" align="left"><span class="date-wm"><img src="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/fonts/imgs/time.svg" alt="Date WaterMark"><strong>${dateObj}</strong> <small>(${dateObj.getTime()})</small></span></div>
`;
const __hl = (code, filename = "") => {
  const highlight = () => {
    try {
      const language = filename.split(".").pop();
      const highlightedCode = hljs.highlight(code, { language }).value;
      return highlightedCode;
    } catch (error) {
      return sanitize(code);
    }
  };
  let htmlBlock = "",
    htmlLine,
    tempBlock;
  tempBlock = highlight();
  const arrayOfAll = tempBlock.split("\n");
  size = (arrayOfAll.length + "").length;
  for (const i in arrayOfAll) {
    str =
      "<span class='ln'>" + padLeadingZeros(parseInt(i) + 1, size) + "</span>";
    htmlLine = str + arrayOfAll[i];
    htmlBlock += htmlLine;
  }
  return htmlBlock;
};
const __pb = (cns) =>
  cns ? (cns.pb ? "<page-break>Page Break</page-break>" : "") : "";
const padLeadingZeros = (num, size) => {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};
module.exports = { generateHtmlPage };
