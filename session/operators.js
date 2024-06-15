const { STATUS } = require("./exec_status.js");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });

const create = (path, args) => {
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
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};

const erase = (path, args) => {
  if (args.length !== 0)
    return STATUS[
      console.log(`Invalid Args\n  Expected 0 argument\n  No Args`)
    ];
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  fs.unlinkSync(path + "/____chnpsession_cohls");
  return STATUS.SUCESSFULL;
};

const config = (path, args) => {
  if (!fs.existsSync("____chnpsession_cohls"))
    return STATUS[console.log(`No Session Detected`)];
  const commandsBatch = [];
  let currentCommand = "none",
    i = 1;
  console.log("Enter commands to run program while adding: ");
  while (currentCommand !== "") {
    currentCommand = prompt(i + ". > ");
    commandsBatch.push(currentCommand);
    i++;
  }
  const sessionObject = JSON.parse(
    fs.readFileSync(path + "/____chnpsession_cohls")
  );
  sessionObject.commandsBatch = commandsBatch;
  fs.writeFileSync(
    path + "/____chnpsession_cohls",
    JSON.stringify(sessionObject)
  );
  return STATUS.SUCESSFULL;
};

module.exports = { create, erase, config };
