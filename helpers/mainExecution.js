const chalk = require("chalk");
const { meaning, colors, STATUS } = require("./exec_status");
const restatus = (status) => {
  console.log(chalk[colors[status]](`Operation is ${meaning[status]}`));
  if (status === STATUS.UNSUCCESSFULL) process.exit(1);
  process.exit(0);
};
const main = async ({ operators, op, wd, args }) => {
  try {
    const status = await operators[op](wd, args, restatus);
    console.log(chalk[colors[status]](`Operation is ${meaning[status]}`));
    if (status === 1) process.exit(1);
    if (status !== STATUS.PENDING) process.exit(0);
  } catch (e) {
    console.log(
      chalk.red(
        "Operator not found\n  use 'cohl shelp' to get available operators"
      )
    );
    process.exit(1);
  }
};
module.exports = { main };
