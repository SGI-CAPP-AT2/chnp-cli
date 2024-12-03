const process = require("process");
const operators = require("../session/operators.js");
const { main } = require("../helpers/mainExecution.js");
const path = require("path");
const op = process.argv[2],
  args = process.argv.reduce((p, c, i) => (i > 2 ? [...p, c] : p), []),
  wd = path.join(__dirname, "test_assets");
console.log(wd);
main({ operators, op, wd, args });
