const { STATUS } = require("./exec_status.js");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const util = require("util");
const { replaceWithArgs, getArgsJson } = require("../helpers/argHelper.js");
const exec = util.promisify(require("child_process").exec);

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
  for (let command of batchOfCommands) {
    if (command != "") {
      try {
        const { stdout, stderr } = await exec(
          replaceWithArgs(command, argJson)
        );
        let co = stdout ? stdout : "" + "\n" + errors && stderr ? stderr : "";
        if (ocmode) output += "\n" + co;
        else output = co;
      } catch (e) {
        return STATUS[
          console.log(
            `Unable to execute command\n  executing ${command}\n  with args = ${JSON.stringify(
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

module.exports = { create, erase, config, add, pop };
