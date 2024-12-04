const { STATUS } = require("../helpers/exec_status");
const fs = require("fs");
const open = require("open");
const { generateHtmlPage } = require("../core/html");
const chalk = require("chalk");
const pathmod = require("path");
const { startOperationServer } = require("../core/server");
const { PORT } = require("../GLOBALS");
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

module.exports = { shelp, savepage, print };
