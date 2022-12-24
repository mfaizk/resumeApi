const auth_router = require("express").Router();
const {
  signup,
  signin,
  auth_checker,
} = require("../controller/auth.controller");

auth_router.post("/signup", signup);
auth_router.get("/signin", signin);
auth_router.get("/home", auth_checker, (req, res) => {
  res.send(req.user);
});
module.exports = auth_router;
