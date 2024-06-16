const chalk = require("chalk");
const { meaning, colors, STATUS } = require("./exec_status");
const main = async ({ operators, op, wd, args }) => {
  try {
    const status = await operators[op](wd, args);
    console.log(chalk[colors[status]](`Operation is done ${meaning[status]}`));
    if (status === 1) process.exit(1);
  } catch (e) {
    console.log(
      chalk.red(
        "Operator not found\n  use 'cohl shelp' to get available operators"
      )
    );
    process.exit(1);
  }
  process.exit(0);
};
module.exports = { main };
