const auth_router = require("express").Router();
const { signup, signin } = require("../controller/auth.controller");

auth_router.post("/signup", signup);
auth_router.get("/signin", signin);

module.exports = auth_router;
