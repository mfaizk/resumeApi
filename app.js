const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("I am at root");
});

module.exports = app;
