/**
 * Test for checking assets in core/assets folder
 * To add a test use test_assets folder having a static html+css+js file
 */
const { startOperationServer } = require("../core/server");
const { TEST_PORT } = require("../GLOBALS");

const startServerForCheckingAssets = () => {
  const onStart = (url) => {
    console.log("Server Started at " + url);
  };
  const onDone = (params) => {
    console.log(
      "Stopped server by `/__done` with params",
      JSON.stringify(params)
    );
  };
  const routes = [
    {
      html: "TESTING",
      addr: "/",
    },
  ];
  const test = true;
  const testAssets = __dirname + "/test_assets";
  startOperationServer({
    onStart,
    onDone,
    routes,
    port: TEST_PORT,
    test,
    testAssets,
  });
};
startServerForCheckingAssets();
