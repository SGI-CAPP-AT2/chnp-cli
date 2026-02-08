const fs = require("fs");
const path = require("path");
const { SESSION_FILE_NAME } = require("../GLOBALS");
const { STATUS } = require("./exec_status");
const executeIfObject = async (__path, execute, create = false) => {
  const pathOfObject = path.join(__path, SESSION_FILE_NAME);
  if (create) {
    if (fs.existsSync(pathOfObject))
      return STATUS[
        console.log(
          `session already created \n  at ${path} \n  use 'erase' operator to delete session`
        )
      ];
  }
  if (fs.existsSync(pathOfObject) || create) {
    const stringOfObject = create ? "{}" : fs.readFileSync(pathOfObject);
    const object = JSON.parse(stringOfObject);
    const saveState = () => {
      fs.writeFileSync(pathOfObject, JSON.stringify(object));
    };
    return await execute(object, saveState, pathOfObject);
  }
  return console.log("Session Object Not Found");
};
module.exports = { executeIfObject };
