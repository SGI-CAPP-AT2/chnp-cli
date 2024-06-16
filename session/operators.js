const { STATUS } = require("./exec_status.js");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const util = require("util");
const {
  replaceWithArgs,
  getArgsJson,
  getCommandNArgs,
} = require("../helpers/argHelper.js");
const { executeCommand } = require("../helpers/executeCommand.js");
const path = require("path");

const create = async (path, args) => {
  if (args.length !== 1)
    return STATUS[
      console.log(`Invalid Args\n  Expected 1 argument \n  args: title`)
    ];
  if (fs.existsSync("____chnpsession_cohls"))
    return STATUS[
      console.log(
        `session already created \n  at ${path} \n  use 'erase' operator to delete session`
      )
    ];
  const sessionObject = {};
  sessionObject.path = path;
  sessionObject.version = process.env.version;
  sessionObject.date = Date.now();
  sessionObject.title = args[0] ? args[0] : path;
  sessionObject.codes = [];
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return config(path);
};

const erase = async (path, args) => {
  if (args.length !== 0)
    return STATUS[
      console.log(`Invalid Args\n  Expected 0 argument\n  No Args`)
    ];
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  fs.unlinkSync(path + "/____chnpsession_cohls");
  return STATUS.SUCESSFULL;
};

const config = async (path) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
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
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  sessionObject.filenameWhileAdding = filenameWhileAdding;
  sessionObject.commandsBatch = commandsBatch;
  sessionObject.watermark = prompt("Enter watermark for your codes: ");
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};

const add = async (path, args) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  const { ocmode, errors, filenameWhileAdding, watermark } = sessionObject;
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
  };
  sessionObject.codes.push(codeObject);
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};

const pop = async (path) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  const { codes } = sessionObject;
  if (codes.length > 0) codes.pop();
  else return STATUS[console.log(`No Codes Added`)];
  sessionObject.codes = codes;
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};

const retitle = async (path, args) => {
  if (args.length !== 1)
    return STATUS[
      console.log(
        `Invalid Args\n  Expected 1 argument \n  args: address of code (* or number)`
      )
    ];
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
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
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};

module.exports = { create, erase, config, add, pop, retitle };
