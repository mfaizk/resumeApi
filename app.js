const express = require("express");
const app = express();
const auth_router = require("./router/auth.route");

app.use(express.json());
// app.use(urlencoded({}));
app.get("/", (_req, res) => {
  res.send("I am at testing root");
});
app.use(auth_router);

module.exports = app;
