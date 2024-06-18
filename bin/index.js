#!/usr/bin/env node
const process = require("process");
const operators = require("./operators");
const { main } = require("../helpers/mainExecution.js");
const op = process.argv[2],
  args = process.argv.reduce((p, c, i) => (i > 2 ? [...p, c] : p), []),
  wd = process.cwd();
console.log(operators);
main({ operators, op, wd, args });
