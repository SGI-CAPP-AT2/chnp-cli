const { STATUS } = require("../helpers/exec_status");
const fs = require("fs");
const open = require("open");
const { generateHtmlPage } = require("../core/html");
const chalk = require("chalk");
const pathmod = require("path");
const { startOperationServer } = require("../core/server");
const { PORT, THEMES_JSON } = require("../GLOBALS");
const { executeIfObject } = require("../helpers/objectHandler");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });

const shelp = async () => {
  await open("http://github.com/SGI-CAPP-AT2/chnp-cli/");
  console.log(`Trying to open help page 
    If not opened automatically, click following link for help
    https://github.com/SGI-CAPP-AT2/chnp-cli/blob/master/help/commands.md`);
  return STATUS.SUCESSFULL;
};

const savepage = async (path) => {
  const execute = async (sessionObject) => {
    const { title, codes, theme, font } = sessionObject;
    const fileAddr = pathmod.join(
      path,
      "CHNP~" + title.replaceAll(" ", "_") + ".html"
    );
    fs.writeFileSync(
      fileAddr,
      generateHtmlPage(title, codes, theme, font, true)
    );
    console.log(chalk.green("File Saved As: " + fileAddr));
    console.log(chalk.yellow("* This web page will require internet to style"));
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};
const theme = (path) => {
  const execute = (sessionObject, saveState) => {
    const themes = THEMES_JSON;
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
    saveState();
    return STATUS.SUCESSFULL;
  };
  return executeIfObject(path, execute);
};
const font = (__path) => {
  const execute = (sessionObject, saveState) => {
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
    saveState();
    return STATUS.SUCESSFULL;
  };
  return executeIfObject(__path, execute);
};

const print = async (__path, args, restatus) => {
  const execute = async (sessionObject) => {
    const { title, codes, theme, font } = sessionObject;
    const routes = [
      {
        html: generateHtmlPage(title, codes, theme, font, false),
        addr: "print",
      },
      {
        html: fs
          .readFileSync(path.join(__dirname, "assets", "preview.html"))
          .toString()
          .replace("%PREVIEW_URL%", "__prev"),
        addr: "",
      },
      {
        html: generateHtmlPage(title, codes, theme, font, false, true),
        addr: "__prev",
      },
    ];
    startOperationServer({
      onStart: async (serv) => {
        await open(serv);
        console.log(
          chalk.yellowBright(
            "If browser is not opened automatically, please refer following url"
          )
        );
        console.log("Webpage is being served at \n  " + serv + "/");
      },
      onDone: ({ time, printed }) => {
        if (printed === "true") {
          console.log(
            chalk.green("Printed Successfully on " + new Date(parseInt(time)))
          );
          restatus(STATUS.SUCESSFULL);
        } else
          restatus(STATUS[console.log(chalk.red("Operation may be canceled"))]);
      },
      addr: "print",
      routes,
      port: PORT,
    });
    return STATUS.PENDING;
  };
  return await executeIfObject(__path, execute);
};

module.exports = { shelp, savepage, theme, font, print };
