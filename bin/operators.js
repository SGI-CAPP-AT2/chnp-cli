const { STATUS } = require("../helpers/exec_status");
const fs = require("fs");
const open = require("open");
const { generateHtmlPage } = require("../core/html");
const chalk = require("chalk");
const pathmod = require("path");
const prompt = require("prompt-sync")({ sigint: true });

const shelp = async () => {
  console.log(`Trying to open help page 
    If not opened automatically, click following link for help
    https://github.com/SGI-CAPP-AT2/chnp-cli/blob/master/help/commands.md`);
  await open(
    "https://github.com/SGI-CAPP-AT2/chnp-cli/blob/master/help/commands.md"
  );
  return STATUS.SUCESSFULL;
};
const savepage = async (path) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  const { title, codes } = sessionObject;
  const fileAddr = pathmod.join(
    path,
    "CHNP~" + title.replaceAll(" ", "_") + ".html"
  );
  fs.writeFileSync(
    fileAddr,
    generateHtmlPage(
      title,
      codes,
      sessionObject.theme,
      sessionObject.font,
      true
    )
  );
  console.log(chalk.green("File Saved As: " + fileAddr));
  console.log(chalk.yellow("* This web page will require internet to style"));
  return STATUS.SUCESSFULL;
};
const theme = (path) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  const themes = require("./../core/assets/themse.json");
  let i = 0;
  console.log("Choose any one theme: ");
  console.log("ID  THEME");
  for (let { name } of themes) {
    console.log(++i + "   " + name);
  }
  const selectedTheme = prompt("Enter Id: ");
  if (selectedTheme > themes.length || selectedTheme < 1) {
    console.log("INVALID ID");
    return STATUS.UNSUCCESSFULL;
  }
  sessionObject.theme = themes[selectedTheme - 1];
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};
const font = (path) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  const fonts = require("./../core/assets/fonts.json");
  let i = 0;
  console.log("Choose any one FONT: ");
  console.log("ID  FONT");
  for (let { title } of fonts) {
    console.log(++i + "   " + title);
  }
  const selectedTheme = prompt("Enter Id: ");
  if (selectedTheme > fonts.length || selectedTheme < 1) {
    console.log("INVALID ID");
    return STATUS.UNSUCCESSFULL;
  }
  sessionObject.font = fonts[selectedTheme - 1];
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};
module.exports = { shelp, savepage, theme, font };
