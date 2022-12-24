const auth_router = require("express").Router();
const {
  signup,
  signin,
  forgetPassword,
  resetPassword,
} = require("../controller/auth.controller");
const auth_checker = require("../controller/auth.middleware");

auth_router.post("/signup", signup);
auth_router.get("/signin", signin);
auth_router.get("/forget", forgetPassword);
auth_router.get("/resetpass/:id", resetPassword);
auth_router.get("/home", auth_checker, (req, res) => {
  res.send(req.user);
});
module.exports = auth_router;
