const chalk = require("chalk");
const { meaning, colors, STATUS } = require("./exec_status");
const restatus = (status) => {
  console.log(chalk[colors[status]](`Operation is ${meaning[status]}`));
  if (status === STATUS.UNSUCCESSFULL) process.exit(1);
  process.exit(0);
};
const main = async ({ operators, op, wd, args }) => {
  if (!operators[op]) {
    console.log(chalk.red("Operator not found !"));
    return process.exit(1);
  }
  try {
    const status = await operators[op](wd, args, restatus);
    console.log(chalk[colors[status]](`Operation is ${meaning[status]}`));
    if (status === 1) process.exit(1);
    if (status !== STATUS.PENDING) process.exit(0);
  } catch (e) {
    console.log(
      chalk.red("Unexpected Error: "),
      "\n ERROR: \n",
      e,
      chalk.yellow(
        "\n PLEASE REPORT ERROR at: \n https://github.com/SGI-CAPP-AT2/chnp-cli//"
      )
    );
    process.exit(1);
  }
};
module.exports = { main, restatus };
