const express = require("express");
const app = express();
const auth_router = require("./router/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);
// app.use(urlencoded({}));
app.get("/", (_req, res) => {
  res.send("I am at testing root");
});
app.use(auth_router);

module.exports = app;
