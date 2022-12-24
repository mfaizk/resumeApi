const { urlencoded } = require("express");
const express = require("express");
const app = express();
const router = require("./router/auth.route");

app.use(express.json());
// app.use(urlencoded({}));
app.get("/", (req, res) => {
  res.send("I am at testing root");
});
app.use(router);

module.exports = app;
