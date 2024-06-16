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
module.exports = { replaceWithArgs, getArgsJson, getCommandNArgs };
