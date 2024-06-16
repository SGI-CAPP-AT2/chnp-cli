const { spawn } = require("child_process");

const executeCommand = (command, args) => {
  return new Promise((res, rej) => {
    console.log("Running command: ", command, args.join(" "));
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "inherit"],
    });
    let output = "";
    child.on("error", (err) => {
      rej(err);
    });
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      output += chunk;
      process.stdout.write(chunk);
    });
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      output += chunk;
      child.stdin.write(chunk);
    });
    process.stdin.on("end", () => {
      child.stdin.end();
    });
    child.on("exit", (code) => {
      res({ code, output });
    });
  });
};

module.exports = { executeCommand };
