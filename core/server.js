const path = require("path");
const ASSETS_PATH = path.join(__dirname, "/assets");
const express = require("express");

require("dotenv").config();
const app = express();
const startOperationServer = ({ onStart, onDone, routes, port }) => {
  for (const { html, addr } of routes) {
    app.get("/" + addr, (req, res) => {
      res.send(html);
    });
  }
  app.listen(port, () => onStart("http://localhost:" + port));
  app.use(express.static(ASSETS_PATH));
  app.get("/__done", (req, res) => {
    res.send(
      "<html><head></head><body>Please Close this tab/window, if not closed automatically<script>open(location, '_self').close();</script></body>"
    );
    onDone(req.query);
  });
};
module.exports = { startOperationServer };
