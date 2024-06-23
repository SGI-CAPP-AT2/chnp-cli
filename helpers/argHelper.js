const replaceWithArgs = (command, argJson) => {
  for (const varKey of Object.keys(argJson)) {
    command = command.replaceAll(varKey, argJson[varKey]);
  }
  return command;
};
const getArgsJson = (args) => {
  const argJson = {};
  for (const i in args) {
    argJson["$" + (parseInt(i) + 1)] = args[i];
  }
  return argJson;
};
const getCommandNArgs = (c) => {
  const [command, ...args] = c.split(" ");
  return { command, args };
};
const getFileNameWithoutExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex <= 0) {
    return filename;
  }
  return filename.substring(0, lastDotIndex);
};
const getFileExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex <= 0) {
    return "";
  }
  return filename.substring(lastDotIndex, filename.length - 1);
};
module.exports = {
  replaceWithArgs,
  getArgsJson,
  getCommandNArgs,
  getFileNameWithoutExtension,
  getFileExtension,
};
