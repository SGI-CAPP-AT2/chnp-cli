const { print } = require("../bin/operators");
const { restatus } = require("../helpers/mainExecution");
const path = require("path");
const startServerToPrintCodes = () => {
  console.log("Session should be at " + __dirname + "/test_assets/");
  print(path.join(__dirname, "test_assets"), undefined, restatus);
};
startServerToPrintCodes();
