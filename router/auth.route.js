const auth_router = require("express").Router();
const {
  signup,
  signin,
  forgetPassword,
  resetPassword,
} = require("../controller/auth.controller");
const auth_checker = require("../controller/auth.middleware");

auth_router.post("/api/signup", signup);
auth_router.post("/api/signin", signin);
auth_router.get("/api/auth/forget", forgetPassword);
auth_router.get("/api/auth/resetpass/:id", resetPassword);
auth_router.get("/api/home", auth_checker, (req, res) => {
  res.send(req.user);
});
module.exports = auth_router;
