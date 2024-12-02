const fs = require("fs");
const path = require("path");
const { SESSION_FILE_NAME } = require("../GLOBALS");
const checkForObject = (__path, execute) => {
  if (fs.existsSync(path.join(__path, SESSION_FILE_NAME))) return execute();
  return console.log("Session Object Not Found");
};
module.exports = { checkForObject };
