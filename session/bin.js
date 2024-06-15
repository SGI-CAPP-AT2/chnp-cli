#!/usr/bin/env node
const process = require("process");
const operators = require("./operators");
const chalk = require("chalk");
const { meaning, colors } = require("./exec_status.js");
const op = process.argv[2],
  args = process.argv.reduce((p, c, i) => (i > 2 ? [...p, c] : p), []),
  wd = process.cwd();
try {
  const status = operators[op](wd, args);
  console.log(chalk[colors[status]](`Operation is done ${meaning[status]}`));
} catch (e) {
  console.log(
    chalk.red(
      "Operator not found\n  use 'cohl shelp' to get available operators"
    )
  );
}
