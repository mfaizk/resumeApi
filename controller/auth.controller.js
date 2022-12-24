const BigPromise = require("../services/big_promise");
const GlobalResponse = require("../services/global_response");
const USER = require("../models/user.model");
const signup = BigPromise(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return GlobalResponse(res, "Insufficient data", false, 401, []);
  }
  const user = await USER.findOne({ email });
  if (user) return GlobalResponse(res, "Email already exist", false, 401, []);
  const data = await USER.create({
    email: email,
    password: password,
  });
  data.password = undefined;
  return GlobalResponse(res, "User account created", true, 201, data);
});

const signin = BigPromise(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return GlobalResponse(res, "Insufficient data", false, 401, []);
  }
  const user = await USER.findOne({ email }).select("password");
  if (!user) {
    return GlobalResponse(res, "user doesn't exist", false, 401, []);
  }
  if (!(await user.comparePassword(password))) {
    return GlobalResponse(res, "email or passsword is invalid", false, 401, []);
  }

  const token = await user.generateJWTToken();
  res.cookie("token", token, { httpOnly: true });
  return GlobalResponse(res, "Logged in successfully", true, 201, {
    token: token,
  });
});

module.exports = { signin, signup };
