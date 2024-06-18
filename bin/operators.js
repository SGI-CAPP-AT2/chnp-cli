const { STATUS } = require("../helpers/exec_status");
const open = require("open");
const { executeCommand } = require("../helpers/executeCommand");
const shelp = async () => {
  console.log(`Trying to open help page 
    If not opened automatically, click following link for help
    https://github.com/SGI-CAPP-AT2/chnp-cli/blob/master/help/commands.md`);
  await open(
    "https://github.com/SGI-CAPP-AT2/chnp-cli/blob/master/help/commands.md"
  );
  return STATUS.SUCESSFULL;
};

module.exports = { shelp };
