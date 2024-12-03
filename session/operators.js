const { STATUS } = require("../helpers/exec_status.js");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const {
  replaceWithArgs,
  getArgsJson,
  getCommandNArgs,
  getFileNameWithoutExtension,
  getFileExtension,
} = require("../helpers/argHelper.js");
const { executeCommand } = require("../helpers/executeCommand.js");
const { VERSION } = require("../GLOBALS.js");
const { executeIfObject } = require("../helpers/objectHandler.js");

/**
 * create: This command is used to initialize the session of cohls
 * @param {string} path path to current working directory
 * @param {Array} args arguements which are going to be replaced with vars
 * @returns Number determining wheather it's successful or not
 */

const create = async (path, args) => {
  const execute = async (sessionObject, saveState) => {
    sessionObject.path = path;
    sessionObject.version = VERSION;
    sessionObject.date = Date.now();
    sessionObject.title = args[0] ? args[0] : sessionObject.date;
    sessionObject.codes = [];
    sessionObject.theme = {
      name: "classic",
      className: "def",
    };
    sessionObject.font = {
      title: "MonoSpace",
      className: "default-fonts",
      css: "monospace",
    };
    saveState();
    return config(path);
  };
  return await executeIfObject(path, execute, true);
};

/**
 * erase: this operator is used to erase the session details
 * @param {string} path path to current working directory
 * @param {Array} args arguements which are going to be replaced with vars
 * @returns Number determining wheather it's successful or not
 */

const erase = async (path, args) => {
  const execute = async (object, saveState, pathToObject) => {
    if (args.length !== 0)
      return STATUS[
        console.log(`Invalid Args\n  Expected 0 argument\n  No Args`)
      ];
    fs.unlinkSync(pathToObject);
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};

const config = async (path) => {
  const execute = async (sessionObject, saveState) => {
    const commandsBatch = [];
    let currentCommand = "none",
      i = 1;
    const filenameWhileAdding = prompt("Enter filename while adding: ");
    console.log("Enter commands to run program while adding: ");
    while (currentCommand !== "") {
      currentCommand = prompt(i + ". > ");
      commandsBatch.push(currentCommand);
      i++;
    }
    sessionObject.filenameWhileAdding = filenameWhileAdding;
    sessionObject.commandsBatch = commandsBatch;
    sessionObject.watermark = prompt("Enter watermark for your codes: ");
    saveState();
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};

const add = async (path, args) => {
  const execute = async (object, saveState) => {
    process.chdir(path);
    const sessionObject = object;
    const { ocmode, filenameWhileAdding, watermark } = sessionObject;
    const batchOfCommands = sessionObject.commandsBatch;
    const argJson = getArgsJson(args);
    const filename = replaceWithArgs(filenameWhileAdding, argJson);
    let output = "";
    for (let commandString of batchOfCommands) {
      if (commandString != "") {
        try {
          const { command, args } = getCommandNArgs(
            replaceWithArgs(commandString, argJson)
          );
          const { output: stdout } = await executeCommand(command, args);
          let co = stdout;
          if (ocmode) output += "\n" + co;
          else output = co;
        } catch (e) {
          console.log(e);
          return STATUS[
            console.log(
              `Unable to execute command\n  executing ${commandString}\n  with args = ${JSON.stringify(
                argJson
              )}`
            )
          ];
        }
      }
    }
    let code;
    try {
      code = fs.readFileSync(path + "/" + filename).toString();
    } catch (e) {
      return STATUS[
        console.log(`Unable to read file\n  reading ${path + "/" + filename}`)
      ];
    }
    const codeObject = {
      title: filename,
      filename,
      output,
      rtf: "",
      watermark,
      rtfBool: false,
      code,
      time: Date.now(),
    };
    sessionObject.codes.push(codeObject);
    // fs.writeFileSync(
    //   path + "/____chnpsession_cohls",
    //   JSON.stringify(sessionObject)
    // );
    // setObject(sessionObject);
    saveState();
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};

const pop = async (path) => {
  const execute = (sessionObject, saveState) => {
    const { codes } = sessionObject;
    if (codes.length > 0) codes.pop();
    else return STATUS[console.log(`No Codes Added`)];
    sessionObject.codes = codes;
    saveState();
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};

const retitle = async (path, args) => {
  const execute = (sessionObject, saveState) => {
    if (args.length !== 1)
      return STATUS[
        console.log(
          `Invalid Args\n  Expected 1 argument \n  args: address of code (* or number)`
        )
      ];
    const { codes } = sessionObject;
    const n = args[0];
    if (n === "*") {
      for (const i in codes) {
        const { title, filename } = codes[i];
        const newTitle = prompt(
          "Rename title of " + title + " having file " + filename + " to: "
        );
        if (newTitle != "") codes[i].title = newTitle;
      }
    } else {
      const i = parseInt(n);
      const { title, filename } = codes[i - 1];
      const newTitle = prompt(
        "Rename title of " + title + " having file " + filename + " to: "
      );
      try {
        codes[i - 1].title = newTitle;
      } catch (e) {
        return STATUS[console.log("Invalid Arguement")];
      }
    }
    sessionObject.codes = codes;
    saveState();
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};

const addpb = (path) => {
  const execute = (sessionObject, saveState) => {
    const { codes } = sessionObject;
    const last = { __cns: { pb: true }, ...codes[codes.length - 1] };
    codes.pop();
    codes.push(last);
    sessionObject.codes = codes;
    saveState();
    return STATUS.SUCESSFULL;
  };
  return executeIfObject(path, execute);
};

const batch = async (path, [match$1with, ...args]) => {
  const execute = async (sessionObject) => {
    const filenameExtensionShouldBe = getFileExtension(
      sessionObject.filenameWhileAdding
    );
    const fileNames = fs.readdirSync(path);
    const $1WithExt = match$1with === "-ext";
    for (const fileName of fileNames) {
      if (getFileExtension(fileName) !== filenameExtensionShouldBe) continue;
      const $1 = $1WithExt ? fileName : getFileNameWithoutExtension(fileName);
      const retStatus = await add(path, [$1, ...args]);
      if (STATUS.UNSUCCESSFULL === retStatus)
        return STATUS[console.log("Unable to add " + $1)];
    }
    return STATUS.SUCESSFULL;
  };
  return await executeIfObject(path, execute);
};

module.exports = { create, erase, config, add, pop, retitle, addpb, batch };
